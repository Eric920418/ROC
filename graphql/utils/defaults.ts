type JsonRecord = Record<string, unknown>;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

// Section1 - 主視覺區
const section1Defaults = {
  titleLeft: "Contemporary",
  titleRight: "Design",
  tagline: "當代設計",
  leftImage: "/Mask group.png",
  rightTopText: "we create the onysica presence your identity deserves.",
  rightTopTagline: "我的風格，由我來定義",
  rightImage: "/Mask group2.png",
  bottomTitle: "做出120%的作品非常不容易",
  bottomDescription: "剝除多餘的裝飾\n創造永不退流行的設計空間",
};

// Marquee - 品牌輪播
const marqueeDefaults = {
  logoImage: "/R.coLogo.png",
  slogan: "THIS IS MY MOTTO",
  suffixImages: [
    { src: "/coEdge-blue.png", alt: "Edge", offsetX: -120, offsetY: 2 },
    { src: "/connect-blue.png", alt: "nnect", offsetX: -108, offsetY: 2 },
    { src: "/compose-blue.png", alt: "mpose", offsetX: -100, offsetY: 0 },
    { src: "/cohort-blue.png", alt: "hort", offsetX: -124, offsetY: 0 },
    { src: "/collective-blue.png", alt: "llective", offsetX: -100, offsetY: 0 },
  ],
};

// Section7 - 立足台灣
const section7Defaults = {
  title: "立足台灣\n放眼全球",
  description: "從台北到台中，我們在台灣深耕多年，為在地客戶打造獨一無二的當代設計空間。\n\n同時，我們的服務觸角延伸至海外，將台灣的設計美學帶向國際舞台，讓世界看見東方當代設計的獨特魅力。",
  regions: [
    { name: "台北", type: "rectangle" },
    { name: "台中", type: "circle" },
    { name: "海外", type: "rectangle" },
  ],
  images: [
    { src: "/Mask group4.png", position: "left" },
    { src: "/Mask group.png", position: "rightTop" },
    { src: "/Mask group2.png", position: "rightBottom" },
  ],
};

// Section2 - 團隊成員
const section2Defaults = {
  title: "團隊成員",
  subtitle: "Team Members",
  members: [
    {
      id: 1,
      name: "李珈儀 Vivian",
      role: "合夥人 / 行銷總監",
      yearsExperience: "18+",
      avatar: "/IMG_9001.jpg",
      description: "執行專案：HBO Max、MEDIX ProClot、INSPO、AZUCAR、瀚寓酒店、娘家益生菌等",
      experience: [
        "塑造全球品牌形象，讓創意與客戶需求緊密結合",
        "透過市場洞察與批判思考，驅動品牌系統化成長",
        "跨領域合作",
        "管理數位內容策略與績效追蹤，優化行銷成效",
      ],
      contact: {
        email: "chen@archspace.tw",
        phone: "+886 2 2345 6789",
        linkedin: "chen-yisen",
      },
    },
  ],
};

// Section3 - 空間探索
const section3Defaults = {
  navTitle: "空間探索",
  navSubtitle: "SPACE EXPLORATION",
  projects: [
    {
      id: "01",
      title: "設計客廳",
      subtitle: "當代生活的核心空間",
      description: "當代客廳的骨架。設計師的重點。是一種日常的構築藝術。每一個角落都是精心規劃，每一道光線都經過計算。",
      image: "/Mask group.png",
    },
    {
      id: "02",
      title: "當代設計書房",
      subtitle: "思考與創作的聖地",
      description: "極簡的線條，柔和的光，重拾不必多，只要剛好。在留白中思考，在寧靜裡前進。一張桌，一把椅，一盞光，足以築起整個世界的地基。",
      image: "/Mask group2.png",
    },
  ],
};

// Section4 - 客戶見證
const section4Defaults = {
  label: "CLIENT TESTIMONIALS",
  ctaText: "查看更多客戶回饋",
  ctaLink: "#",
  testimonials: [
    {
      title: "我的咖啡廳，風格由我來定義！",
      description: "咖啡不止要好喝，更要脫穎而出...",
      image: "/Mask group4.png",
    },
  ],
};

// Section6 - FAQ
const section6Defaults = {
  title: "QA",
  leftDescription: "線條簡潔、比例純粹\n當代住宅不唯噩於形\n而讓空間自己說話\n\n少一分裝飾，多一分真實",
  faqs: [
    {
      question: "你怎麼定義「當代設計」？",
      answer: "對我來說，當代設計不是一種風格，而是一種態度。\n它關注當下的生活方式、材質的真實性與環境的回應。",
    },
  ],
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

// About 頁面
const aboutDefaults = {
  // Section 1 - Who is R.collective?
  whoIsTitle: "Who is \n R.collective?",
  whoIsDescription: "R.collective 是一個專注於創新與品質的專業團隊。我們相信透過獨特的設計理念與專業技術，能夠為客戶創造出超越期待的價值。我們的使命是將藝術與功能完美結合，打造出既美觀又實用的解決方案。",
  // Section 2 - Main Image + About Us
  featuredImage: "",
  headOffice: "Taiwan/Taipei",
  foundedYear: "2024",
  instagramLink: "#",
  facebookLink: "#",
  // Section 3 - The Visionary
  founderImage: "",
  foundedDate: "2024/01",
  visionTitle: "Our Vision",
  visionDescription1: "我們致力於打造一個開放、創新的平台，讓每一位使用者都能在這裡找到屬於自己的價值。透過專業的技術團隊和對品質的堅持，我們持續為客戶提供最優質的服務。",
  visionDescription2: "R.collective 不僅是一個品牌，更是一種理念的體現。我們相信，真正的成功來自於對細節的關注和對卓越的追求。每一個專案，都是我們展現專業實力的機會。",
  // Section 4 - Quote
  quote: "我們相信，每一個細節都值得被重視。品質不是偶然，而是對卓越的持續追求。這就是 R.collective 的核心價值。",
  quoteAuthor: "R.COLLECTIVE",
  // Section 5 - Gallery
  galleryImages: [
    { src: "", alt: "Gallery Image 1" },
    { src: "", alt: "Gallery Image 2" },
    { src: "", alt: "Gallery Image 3" },
  ],
};

// Contact 頁面
const contactDefaults = {
  // 主標題區
  mainTitle: "Contact\nUs",
  backgroundTitle: "Connect",
  description: "我們相信溝通的力量。每一次連結都是創造非凡作品的第一步。聯繫我們，讓我們一起開始創造真正卓越的事物。",
  // 聯絡資訊
  email: "contact@rcollective.com",
  phone: "+886 2 1234 5678",
  // 工作室資訊
  studioName: "Our Studio",
  studioAddress: "台北市信義區\n某某路 123 號 5 樓",
  // 表單設定
  submitButtonText: "Send Message",
  successMessage: "訊息已成功送出！",
  errorMessage: "發送失敗，請稍後再試。",
};

export const blockDefaults = {
  section1: () => clone(section1Defaults),
  marquee: () => clone(marqueeDefaults),
  section7: () => clone(section7Defaults),
  section2: () => clone(section2Defaults),
  section3: () => clone(section3Defaults),
  section4: () => clone(section4Defaults),
  section6: () => clone(section6Defaults),
  logo: () => clone(logoDefaults),
  color: () => clone(colorDefaults),
  about: () => clone(aboutDefaults),
  contact: () => clone(contactDefaults),
} as const;

export type BlockKey = keyof typeof blockDefaults;

export const getDefaultPayload = (key: BlockKey) => blockDefaults[key]();
