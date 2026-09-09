export type LacSectionId = "knowledge" | "lampang" | "product" | "environment" | "community" | "games";

export type LacContentPage = {
  slug: string;
  title: string;
  section: LacSectionId;
  status: "planned" | "existing";
  source: "content-master" | "existing-feature" | "figma-reference";
};

export type LacNavSection = {
  id: LacSectionId;
  label: string;
  description: string;
  pages: LacContentPage[];
};

/** LAC Learning Center Information Architecture v1. */
export const LAC_INFORMATION_ARCHITECTURE: LacNavSection[] = [
  {
    id: "knowledge",
    label: "ความรู้เรื่องครั่ง",
    description: "พื้นฐาน วิทยาศาสตร์ ระบบนิเวศ และการเพาะเลี้ยงครั่ง",
    pages: [
      { slug: "knowledge", title: "ภาพรวมความรู้เรื่องครั่ง", section: "knowledge", status: "existing", source: "figma-reference" },
      { slug: "what-is-lac", title: "ครั่งคืออะไร", section: "knowledge", status: "planned", source: "content-master" },
      { slug: "origin", title: "ต้นกำเนิดครั่ง", section: "knowledge", status: "planned", source: "content-master" },
      { slug: "life-cycle", title: "วงจรชีวิตครั่ง", section: "knowledge", status: "existing", source: "existing-feature" },
      { slug: "habitat", title: "ระบบนิเวศ & ต้นพิงอาศัย", section: "knowledge", status: "planned", source: "content-master" },
      { slug: "host-plants", title: "ต้นไม้ที่ใช้เลี้ยงครั่ง", section: "knowledge", status: "planned", source: "content-master" },
      { slug: "pests", title: "ศัตรูครั่ง & การป้องกัน", section: "knowledge", status: "planned", source: "content-master" },
      { slug: "lac-farming", title: "การเพาะเลี้ยงครั่ง", section: "knowledge", status: "planned", source: "content-master" },
    ],
  },
  {
    id: "lampang",
    label: "ครั่งในลำปาง",
    description: "พื้นที่ ฤดูกาล การดูแล และทางเลือกของเกษตรกร",
    pages: [
      { slug: "lampang-lac", title: "ครั่งในจังหวัดลำปาง", section: "lampang", status: "existing", source: "existing-feature" },
      { slug: "seasons-care", title: "ฤดูกาล & การดูแล", section: "lampang", status: "planned", source: "content-master" },
      { slug: "farmers-choice", title: "ทางเลือกของเกษตรกร", section: "lampang", status: "planned", source: "content-master" },
    ],
  },
  {
    id: "product",
    label: "ครั่ง → ผลิตภัณฑ์",
    description: "การแปรรูป การใช้งาน และนวัตกรรมจากครั่ง",
    pages: [
      { slug: "lac-product", title: "จากครั่งดิบสู่ผลิตภัณฑ์", section: "product", status: "existing", source: "existing-feature" },
      { slug: "lac-around-us", title: "ครั่งอยู่รอบตัวเรา", section: "product", status: "planned", source: "content-master" },
      { slug: "product-innovation", title: "Product Innovation", section: "product", status: "planned", source: "content-master" },
    ],
  },
  {
    id: "environment",
    label: "สิ่งแวดล้อม",
    description: "Carbon Footprint วงจรชีวิต และแนวทางสู่ Net Zero",
    pages: [
      { slug: "carbon-footprint", title: "Carbon Footprint of Lac", section: "environment", status: "planned", source: "content-master" },
      { slug: "cfp-vs-cfo", title: "CFP vs CFO", section: "environment", status: "planned", source: "content-master" },
      { slug: "life-cycle-assessment", title: "Life Cycle of Lac Product", section: "environment", status: "planned", source: "content-master" },
      { slug: "cfp-assessment", title: "CFP Assessment", section: "environment", status: "planned", source: "content-master" },
      { slug: "cfp-net-zero", title: "CFP → Net Zero", section: "environment", status: "planned", source: "content-master" },
    ],
  },
  {
    id: "community",
    label: "ชุมชน & เครือข่าย",
    description: "ชุมชน การเรียนรู้ร่วมกัน และเครือข่ายที่เชื่อมโยงครั่งกับพื้นที่",
    pages: [
      { slug: "community", title: "ครั่งกับชุมชน", section: "community", status: "planned", source: "content-master" },
      { slug: "circular-economy", title: "Circular Economy", section: "community", status: "planned", source: "content-master" },
      { slug: "learning-network", title: "Learning Network", section: "community", status: "planned", source: "content-master" },
    ],
  },
  {
    id: "games",
    label: "Learning Games",
    description: "พื้นที่สำหรับเกมและกิจกรรมการเรียนรู้เชิงโต้ตอบ",
    pages: [
      { slug: "sobprab-lac-lab", title: "Sobprab Lac Lab", section: "games", status: "existing", source: "existing-feature" },
      { slug: "lac-bingo", title: "Lac Bingo", section: "games", status: "existing", source: "existing-feature" },
    ],
  },
];

export const LAC_UTILITY_ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  survey: "/survey",
  login: "/login",
  activityAdmin: "/admin/activity",
};

export const getLacPage = (slug: string) =>
  LAC_INFORMATION_ARCHITECTURE.flatMap((section) => section.pages).find((page) => page.slug === slug);
