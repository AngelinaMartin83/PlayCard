export type Locale = "zh" | "en";

export type AlternateLink = {
  hreflang: Locale | "x-default";
  path: string;
};

type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

type SeoContent = {
  title: string;
  description: string;
};

type SectionContent = {
  heading: string;
  body: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

type HomeContent = {
  seo: SeoContent;
  hero: HeroContent;
};

type GamePageContent = {
  seo: SeoContent;
  hero: HeroContent;
  features: SectionContent;
  howToPlay: SectionContent;
  faqHeading: string;
  faq: FaqItem[];
  embedTitle: string;
  gameLabel: string;
};

type LocaleContent = {
  htmlLang: string;
  switchLabel: string;
  home: HomeContent;
  solitaire: GamePageContent;
};

export const locales: Locale[] = ["zh", "en"];

export const localeLabels: Record<Locale, string> = {
  zh: "中文",
  en: "English"
};

export const siteName = "Play Card";

export const localeContent: Record<Locale, LocaleContent> = {
  zh: {
    htmlLang: "zh-CN",
    switchLabel: "语言",
    home: {
      seo: {
        title: "Play Card | 多语言纸牌游戏站点骨架",
        description:
          "基于 Astro 的纸牌网页游戏骨架，包含中英文路由、SEO 页面壳和独立游戏嵌入。"
      },
      hero: {
        eyebrow: "Astro 游戏站骨架",
        title: "把单页纸牌游戏升级成可上线的网站",
        description:
          "这一版先把站点壳子、多语言路径和 SEO 内容搭起来，同时复用原始游戏逻辑，适合继续扩展更多游戏和落地页。",
        primaryCta: "进入中文游戏页",
        secondaryCta: "Open English Version"
      }
    },
    solitaire: {
      seo: {
        title: "Klondike 纸牌在线玩 | Play Card",
        description:
          "在线游玩 Klondike 纸牌。第一版 Astro 站点骨架已支持中文路由、SEO 内容区和独立游戏嵌入。"
      },
      hero: {
        eyebrow: "在线纸牌游戏",
        title: "Klondike 纸牌",
        description:
          "当前版本保留了你的原始游戏逻辑，并把它嵌入到 Astro 页面中。这样既能继续快速迭代玩法，又能开始做多语言和搜索流量。",
        primaryCta: "开始游玩",
        secondaryCta: "查看玩法说明"
      },
      features: {
        heading: "这一版已经具备的站点能力",
        body: [
          "独立的中文和英文路由，可以继续扩展更多语言版本。",
          "页面正文和 FAQ 直接输出在 HTML 中，更适合被搜索引擎索引。",
          "游戏作为单独静态模块嵌入，后续可以逐步从 iframe 迁移到更深的组件化集成。"
        ]
      },
      howToPlay: {
        heading: "如何继续演进",
        body: [
          "下一步可以把游戏内文字彻底抽到语言包里，避免中英文版本混杂。",
          "随后补充攻略页、FAQ 变体页和内链结构，逐步接近 2048.gg 这类内容型游戏站。",
          "当页面结构稳定后，再接入统计、站点地图和搜索提交。"
        ]
      },
      faqHeading: "常见问题",
      faq: [
        {
          question: "为什么第一版先保留原始游戏文件？",
          answer:
            "这样能最快完成站点化改造。游戏逻辑先保持稳定，把时间留给多语言、SEO 和信息架构。"
        },
        {
          question: "后面可以不使用 iframe 吗？",
          answer:
            "可以。等路由、文案和布局稳定以后，可以再把现有脚本拆成真正的 Astro 组件或前端模块。"
        }
      ],
      embedTitle: "Klondike 纸牌游戏",
      gameLabel: "纸牌游戏区域"
    }
  },
  en: {
    htmlLang: "en",
    switchLabel: "Language",
    home: {
      seo: {
        title: "Play Card | Multilingual card game starter",
        description:
          "An Astro starter for browser card games with localized routes, SEO-ready content, and an embedded game module."
      },
      hero: {
        eyebrow: "Astro game site starter",
        title: "Turn a single-page card game into a launch-ready website",
        description:
          "This first pass adds the site shell, multilingual routing, and SEO content while preserving the original gameplay code for fast iteration.",
        primaryCta: "Open the English game page",
        secondaryCta: "查看中文版本"
      }
    },
    solitaire: {
      seo: {
        title: "Play Klondike Solitaire Online | Play Card",
        description:
          "Play Klondike Solitaire online. This Astro starter already includes localized routes, crawlable content, and an isolated game embed."
      },
      hero: {
        eyebrow: "Online solitaire",
        title: "Klondike Solitaire",
        description:
          "The original game logic is still intact, but it now lives inside an Astro page that is ready for localization, SEO, and future landing pages.",
        primaryCta: "Play now",
        secondaryCta: "Read the setup notes"
      },
      features: {
        heading: "What this first site shell already gives you",
        body: [
          "Separate Chinese and English routes, with room to expand into more locales.",
          "Crawlable body content and FAQs rendered as HTML instead of relying on a game canvas alone.",
          "The game is embedded as an isolated static module, which keeps launch speed high while the site structure evolves."
        ]
      },
      howToPlay: {
        heading: "How to evolve this foundation",
        body: [
          "Move every runtime string into language dictionaries so the game UI matches the page language perfectly.",
          "Add guide pages, FAQ variations, and internal links to build a content-driven game site similar to 2048.gg.",
          "Once the structure settles, connect analytics, sitemap submission, and performance tuning."
        ]
      },
      faqHeading: "FAQ",
      faq: [
        {
          question: "Why keep the original game file in the first version?",
          answer:
            "It keeps gameplay stable and lets us spend the first round of effort on the website shell, SEO, and localization structure."
        },
        {
          question: "Can the iframe be removed later?",
          answer:
            "Yes. Once the content model and routes are stable, the current script can be migrated into a deeper component-based integration."
        }
      ],
      embedTitle: "Klondike Solitaire game",
      gameLabel: "Solitaire game area"
    }
  }
};

export function normalizeLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "zh";
}

export function buildAlternates(pathBuilder: (locale: Locale) => string): AlternateLink[] {
  const links = locales.map((locale) => ({
    hreflang: locale,
    path: pathBuilder(locale)
  }));

  return [
    ...links,
    {
      hreflang: "x-default",
      path: pathBuilder("en")
    }
  ];
}
