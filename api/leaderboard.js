import { randomUUID } from "node:crypto";

const STORAGE_KEY = "solitaire:leaderboard";
const LIMIT = 10;
const MAX_NAME_LENGTH = 20;
const MAX_SECONDS = 24 * 60 * 60;

function getRedisConfig() {
  return {
    url: (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/$/, ""),
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  };
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
    id: typeof entry.id === "string" ? entry.id : randomUUID(),
    name: normalizeName(entry.name),
    seconds: Math.floor(seconds),
    drawCount: entry.drawCount === 3 ? 3 : 1,
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

function sendJson(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.json(data);
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

async function readEntries() {
  const result = await redisCommand(["ZRANGE", STORAGE_KEY, 0, LIMIT - 1]);
  if (!Array.isArray(result)) {
    return [];
  }

  return normalizeEntries(result.map((value) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }));
}

async function addEntry(body) {
  const entry = normalizeEntry({
    name: body.name,
    seconds: body.seconds,
    drawCount: body.drawCount,
    completedAt: new Date().toISOString()
  });

  if (!entry) {
    const error = new Error("Invalid completion time");
    error.statusCode = 400;
    throw error;
  }

  await redisTransaction([
    ["ZADD", STORAGE_KEY, entry.seconds, JSON.stringify(entry)],
    ["ZREMRANGEBYRANK", STORAGE_KEY, LIMIT, -1]
  ]);

  return readEntries();
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      sendJson(res, 200, { entries: await readEntries() });
      return;
    }

    if (req.method === "POST") {
      sendJson(res, 200, { entries: await addEntry(req.body || {}) });
      return;
    }

    res.setHeader("Allow", "GET, POST");
    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, error.statusCode || 500, {
      error: error.statusCode ? error.message : "Leaderboard storage is not configured"
    });
  }
}
