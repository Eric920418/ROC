type JsonRecord = Record<string, unknown>;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const homePageDefaults = {
  hero: {
    title: "",
    subtitle: "",
    image: "",
    ctaText: "",
    ctaLink: "",
  },
  sections: [] as Array<{
    id: string;
    type: string;
    content: JsonRecord;
  }>,
};

const logoDefaults = {
  main: "",
  favicon: "",
  footer: "",
};

const colorDefaults = {
  primary: "",
  secondary: "",
  accent: "",
  background: "",
  text: "",
};

export const blockDefaults = {
  homePage: () => clone(homePageDefaults),
  logo: () => clone(logoDefaults),
  color: () => clone(colorDefaults),
} as const;

export type BlockKey = keyof typeof blockDefaults;

export const getDefaultPayload = (key: BlockKey) => blockDefaults[key]();
