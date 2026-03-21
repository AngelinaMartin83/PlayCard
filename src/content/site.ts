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

export const siteName = "PlayCard";

export const localeContent: Record<Locale, LocaleContent> = {
  zh: {
    htmlLang: "zh-CN",
    switchLabel: "语言",
    home: {
      seo: {
        title: "PlayCard | 免费在线纸牌游戏",
        description:
          "免费在线游玩经典纸牌游戏，打开网页即可开始，支持中英文切换与移动端浏览。"
      },
      hero: {
        eyebrow: "在线纸牌游戏",
        title: "免费在线玩经典纸牌",
        description:
          "打开网页即可开始，无需下载。支持桌面与移动设备，随时来一局经典 Klondike 纸牌。",
        primaryCta: "立即开始",
        secondaryCta: "View English Version"
      }
    },
    solitaire: {
      seo: {
        title: "免费在线玩经典 Klondike 纸牌 | PlayCard",
        description:
          "无需下载，打开即可在线游玩经典 Klondike 纸牌。支持撤销、提示、自动收牌、抽 1 或抽 3，以及中英文切换。"
      },
      hero: {
        eyebrow: "在线纸牌游戏",
        title: "Klondike 纸牌",
        description:
          "在浏览器中直接游玩经典 Klondike 纸牌。界面简洁、节奏流畅，适合随时开始一局。",
        primaryCta: "开始游玩",
        secondaryCta: "查看玩法说明"
      },
      features: {
        heading: "为什么在这里玩",
        body: [
          "打开网页就能开始，无需下载，也不需要注册账号。",
          "支持撤销、提示、自动收牌，以及抽 1 / 抽 3 两种玩法切换。",
          "同时适配桌面和手机浏览器，适合碎片时间快速来一局。"
        ]
      },
      howToPlay: {
        heading: "Klondike 玩法说明",
        body: [
          "目标是将所有纸牌按花色从 A 到 K 依次移动到四个基础堆中。",
          "桌面列中的牌需要按照红黑交替、点数递减的顺序进行移动和整理。",
          "当一列被清空后，只能将 K 或以 K 开头的牌组移动到空列。"
        ]
      },
      faqHeading: "常见问题",
      faq: [
        {
          question: "需要下载或注册吗？",
          answer:
            "不需要。这个版本可以直接在浏览器中打开游玩，无需安装应用，也不需要注册账号。"
        },
        {
          question: "手机上可以玩吗？",
          answer:
            "可以。页面已经针对移动端做了基础适配，你可以在手机浏览器中直接开始游戏。"
        },
        {
          question: "可以撤销操作吗？",
          answer:
            "可以。顶部工具栏提供撤销按钮，适合在走错牌或想重新尝试路线时快速回退。"
        },
        {
          question: "抽 1 和抽 3 有什么区别？",
          answer:
            "抽 1 每次从牌堆翻开 1 张牌，节奏更轻松；抽 3 每次翻开 3 张牌，更接近不少经典纸牌规则。你可以按自己的习惯切换。"
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
        title: "PlayCard | Free Online Solitaire Game",
        description:
          "Play classic solitaire online for free. Start instantly in your browser with English and Chinese support."
      },
      hero: {
        eyebrow: "Online card game",
        title: "Play classic solitaire online for free",
        description:
          "No download, no sign-up, just open the page and start a new game. Built for quick sessions on desktop and mobile.",
        primaryCta: "Play Now",
        secondaryCta: "查看中文版本"
      }
    },
    solitaire: {
      seo: {
        title: "Play Klondike Solitaire Online Free | PlayCard",
        description:
          "Play classic Klondike Solitaire online for free. No download required, with undo, hints, auto finish, draw 1 or draw 3, and mobile support."
      },
      hero: {
        eyebrow: "Online solitaire",
        title: "Klondike Solitaire",
        description:
          "Enjoy a clean, fast version of classic Klondike Solitaire directly in your browser. Start a new game anytime and play at your own pace.",
        primaryCta: "Play now",
        secondaryCta: "Read the rules"
      },
      features: {
        heading: "Why play here",
        body: [
          "Start instantly in your browser with no download and no account required.",
          "Use undo, hints, auto finish, and switch between draw 1 and draw 3 modes.",
          "Play comfortably on desktop or mobile whenever you want a quick card game break."
        ]
      },
      howToPlay: {
        heading: "How to play Klondike Solitaire",
        body: [
          "Build the four foundation piles by suit from Ace through King.",
          "Move cards in the tableau in descending order while alternating red and black colors.",
          "Empty columns can only be filled with a King or a sequence that begins with a King."
        ]
      },
      faqHeading: "FAQ",
      faq: [
        {
          question: "Do I need to download anything?",
          answer:
            "No. The game runs directly in your browser, so you can start playing right away without installing anything."
        },
        {
          question: "Does it work on mobile?",
          answer:
            "Yes. The layout is adjusted for smaller screens so you can play on mobile browsers as well as desktop."
        },
        {
          question: "Can I undo moves?",
          answer:
            "Yes. Use the Undo button in the toolbar to step back if you want to try a different move."
        },
        {
          question: "What is the difference between draw 1 and draw 3?",
          answer:
            "Draw 1 reveals one card from the stock at a time and is usually easier. Draw 3 reveals three cards at a time and feels closer to many traditional solitaire setups."
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
