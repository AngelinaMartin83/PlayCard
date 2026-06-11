import { randomUUID } from "node:crypto";

const STORAGE_KEY_PREFIX = "solitaire:leaderboard";
const LIMIT = 10;
const MAX_NAME_LENGTH = 20;
const MAX_SECONDS = 24 * 60 * 60;

function getRedisConfig() {
  return {
    url: (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/$/, ""),
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  };
}

function sendJson(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.json(data);
}

function normalizeDrawCount(drawCount) {
  return Number(drawCount) === 3 ? 3 : 1;
}

function storageKey(drawCount) {
  return `${STORAGE_KEY_PREFIX}:draw-${normalizeDrawCount(drawCount)}`;
}

function normalizeName(name) {
  if (typeof name !== "string") {
    return "Player";
  }

  return name.trim().replace(/\s+/g, " ").slice(0, MAX_NAME_LENGTH) || "Player";
}

function normalizeEntry(entry) {
  const seconds = Number(entry && entry.seconds);
  if (!Number.isFinite(seconds) || seconds < 0 || seconds > MAX_SECONDS) {
    return null;
  }

  return {
    id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : randomUUID(),
    name: normalizeName(entry.name),
    seconds: Math.floor(seconds),
    drawCount: normalizeDrawCount(entry.drawCount),
    completedAt: typeof entry.completedAt === "string" ? entry.completedAt : new Date().toISOString()
  };
}

function normalizeEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .map(normalizeEntry)
    .filter(Boolean)
    .sort((a, b) => a.seconds - b.seconds)
    .slice(0, LIMIT);
}

function assertAdmin(req) {
  const expected = process.env.LEADERBOARD_ADMIN_TOKEN;
  if (!expected) {
    const error = new Error("Missing LEADERBOARD_ADMIN_TOKEN");
    error.statusCode = 500;
    throw error;
  }

  const authorization = req.headers.authorization || "";
  const bearer = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const token = bearer || req.headers["x-admin-token"];
  if (token !== expected) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
}

async function redisCommand(command) {
  const config = getRedisConfig();
  if (!config.url || !config.token) {
    throw new Error("Missing Redis REST environment variables");
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || "Redis command failed");
  }

  return data.result;
}

async function redisTransaction(commands) {
  const config = getRedisConfig();
  if (!config.url || !config.token) {
    throw new Error("Missing Redis REST environment variables");
  }

  const response = await fetch(`${config.url}/multi-exec`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commands)
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || "Redis transaction failed");
  }

  return data;
}

async function readRawEntries(drawCount) {
  const result = await redisCommand(["ZRANGE", storageKey(drawCount), 0, -1]);
  if (!Array.isArray(result)) {
    return [];
  }

  return result.map((member) => {
    try {
      return { member, entry: JSON.parse(member) };
    } catch (error) {
      return null;
    }
  }).filter(Boolean);
}

async function readEntries(drawCount) {
  return normalizeEntries((await readRawEntries(drawCount)).map((item) => item.entry));
}

async function replaceEntries(drawCount, entries) {
  const normalized = normalizeEntries(entries);
  const key = storageKey(drawCount);
  const commands = [["DEL", key]];

  normalized.forEach((entry) => {
    commands.push(["ZADD", key, entry.seconds, JSON.stringify(entry)]);
  });

  await redisTransaction(commands);
  return normalized;
}

async function upsertEntry(body) {
  const drawCount = normalizeDrawCount(body.drawCount);
  const entry = normalizeEntry({
    id: body.id,
    name: body.name,
    seconds: body.seconds,
    drawCount,
    completedAt: body.completedAt || new Date().toISOString()
  });

  if (!entry) {
    const error = new Error("Invalid completion time");
    error.statusCode = 400;
    throw error;
  }

  const existing = await readEntries(drawCount);
  const nextEntries = existing.filter((item) => item.id !== entry.id);
  nextEntries.push(entry);

  return replaceEntries(drawCount, nextEntries);
}

async function deleteEntry(drawCount, id) {
  if (!id || typeof id !== "string") {
    const error = new Error("Missing record id");
    error.statusCode = 400;
    throw error;
  }

  const existing = await readEntries(drawCount);
  return replaceEntries(drawCount, existing.filter((entry) => entry.id !== id));
}

async function clearEntries(drawCount) {
  await redisCommand(["DEL", storageKey(drawCount)]);
  return [];
}

export default async function handler(req, res) {
  try {
    assertAdmin(req);

    if (req.method === "GET") {
      const drawCount = normalizeDrawCount(req.query.drawCount);
      sendJson(res, 200, { drawCount, entries: await readEntries(drawCount) });
      return;
    }

    if (req.method === "POST" || req.method === "PUT") {
      const entries = await upsertEntry(req.body || {});
      sendJson(res, 200, { drawCount: normalizeDrawCount(req.body && req.body.drawCount), entries });
      return;
    }

    if (req.method === "DELETE") {
      const drawCount = normalizeDrawCount(req.query.drawCount);
      const entries = req.query.clear === "true"
        ? await clearEntries(drawCount)
        : await deleteEntry(drawCount, req.query.id);
      sendJson(res, 200, { drawCount, entries });
      return;
    }

    res.setHeader("Allow", "GET, POST, PUT, DELETE");
    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, error.statusCode || 500, {
      error: error.statusCode ? error.message : "Leaderboard admin request failed"
    });
  }
}
