export type ZoneIcon = "book" | "bug" | "sprout" | "settings" | "flask" | "users" | "leaf";

export interface LearningZone {
  id: string;
  number: number;
  title: string;
  englishTitle: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  estimatedMinutes: number;
  icon: ZoneIcon;
  color: string;
  learningOutcomes: string[];
  modelPosition: {
    /** Relative position within the GLB bounding box (-0.5 to 0.5). Must be calibrated visually. */
    x: number;
    /** Relative position within the GLB bounding box (-0.5 to 0.5). Must be calibrated visually. */
    z: number;
    /** Height offset from the model bounding-box center, as a fraction of model height. */
    height: number;
  };
}

export const LEARNING_ZONES: LearningZone[] = [
  {
    id: "origin",
    number: 1,
    title: "กำเนิดครั่ง",
    englishTitle: "The Origin of Lac",
    shortTitle: "เรื่องราวครั่ง",
    subtitle: "ทำความรู้จักครั่งและเรซินธรรมชาติ",
    description:
      "เริ่มต้นสำรวจว่าครั่งคืออะไร รู้จักแมลงครั่ง ความเป็นมา ความหลากหลาย และความสำคัญของครั่งในวิถีชีวิต",
    estimatedMinutes: 5,
    icon: "book",
    color: "#16845B",
    learningOutcomes: [
      "อธิบายได้ว่าครั่งคืออะไรและเกิดขึ้นได้อย่างไร",
      "เข้าใจความสำคัญของครั่งในฐานะทรัพยากรธรรมชาติ",
      "เชื่อมโยงเรื่องราวของครั่งกับชุมชน",
    ],
    modelPosition: { x: -0.12, z: 0.2, height: -0.06 },
  },
  {
    id: "life-cycle",
    number: 2,
    title: "วงจรชีวิตครั่ง",
    englishTitle: "The Lac Life Cycle",
    shortTitle: "วงจรชีวิต",
    subtitle: "เรียนรู้ชีววิทยาของแมลงครั่ง",
    description:
      "ติดตามวงจรชีวิตของแมลงครั่งและทำความเข้าใจการเจริญเติบโต ตั้งแต่ระยะเริ่มต้นจนถึงการสร้างครั่ง",
    estimatedMinutes: 6,
    icon: "bug",
    color: "#7250A8",
    learningOutcomes: [
      "รู้จักระยะสำคัญในวงจรชีวิตของแมลงครั่ง",
      "เข้าใจความสัมพันธ์ระหว่างการเจริญเติบโตกับการสร้างครั่ง",
      "เห็นความสำคัญของการดูแลสภาพแวดล้อม",
    ],
    modelPosition: { x: -0.31, z: 0.04, height: -0.08 },
  },
  {
    id: "ecology",
    number: 3,
    title: "พืชอาศัยและนิเวศวิทยา",
    englishTitle: "Host Plants & Ecology",
    shortTitle: "นิเวศวิทยา",
    subtitle: "สำรวจความสัมพันธ์ของครั่งกับธรรมชาติ",
    description:
      "เรียนรู้ความสัมพันธ์ระหว่างแมลงครั่ง ต้นพิงอาศัย และสภาพแวดล้อม รวมถึงบทบาทของระบบนิเวศต่อการเติบโต",
    estimatedMinutes: 7,
    icon: "sprout",
    color: "#25856C",
    learningOutcomes: [
      "ระบุความสำคัญของพืชอาศัยต่อครั่ง",
      "เข้าใจความเชื่อมโยงระหว่างสิ่งมีชีวิตกับระบบนิเวศ",
      "ตระหนักถึงการใช้ทรัพยากรอย่างเหมาะสม",
    ],
    modelPosition: { x: -0.28, z: -0.25, height: -0.08 },
  },
  {
    id: "cultivation",
    number: 4,
    title: "การเพาะเลี้ยงและการจัดการ",
    englishTitle: "Cultivation & Management",
    shortTitle: "การเพาะเลี้ยง",
    subtitle: "จากความรู้พื้นฐานสู่การปฏิบัติ",
    description:
      "ทำความเข้าใจแนวคิดการเพาะเลี้ยงครั่ง การเลือกพืชอาศัย การดูแล และการจัดการตามช่วงเวลาที่เหมาะสม",
    estimatedMinutes: 8,
    icon: "settings",
    color: "#2478B8",
    learningOutcomes: [
      "เข้าใจขั้นตอนพื้นฐานของการเพาะเลี้ยงครั่ง",
      "เห็นความสำคัญของการดูแลและการจัดการอย่างเหมาะสม",
      "เชื่อมโยงองค์ความรู้กับการปฏิบัติในพื้นที่",
    ],
    modelPosition: { x: 0.12, z: -0.27, height: -0.08 },
  },
  {
    id: "innovation",
    number: 5,
    title: "ครั่งสู่นวัตกรรมการผลิต",
    englishTitle: "From Lac to Innovation",
    shortTitle: "ผลิตภัณฑ์",
    subtitle: "สำรวจการแปรรูปและการใช้ประโยชน์",
    description:
      "สำรวจเส้นทางจากครั่งดิบไปสู่การแปรรูป วัสดุ และผลิตภัณฑ์ พร้อมมองเห็นโอกาสในการต่อยอดองค์ความรู้",
    estimatedMinutes: 6,
    icon: "flask",
    color: "#B96A18",
    learningOutcomes: [
      "รู้จักแนวทางการแปรรูปและใช้ประโยชน์จากครั่ง",
      "เชื่อมโยงทรัพยากรธรรมชาติกับนวัตกรรม",
      "เห็นคุณค่าของการเพิ่มมูลค่าทรัพยากรท้องถิ่น",
    ],
    modelPosition: { x: 0.3, z: -0.02, height: -0.08 },
  },
  {
    id: "community",
    number: 6,
    title: "ชุมชนและความยั่งยืน",
    englishTitle: "Community & Sustainability",
    shortTitle: "ชุมชนและความยั่งยืน",
    subtitle: "ต่อยอดองค์ความรู้สู่ชุมชน",
    description:
      "สรุปความเชื่อมโยงระหว่างการเรียนรู้ การใช้ประโยชน์จากครั่ง และโอกาสในการสนับสนุนการพัฒนาชุมชนอย่างยั่งยืน",
    estimatedMinutes: 5,
    icon: "users",
    color: "#0D7774",
    learningOutcomes: [
      "เข้าใจบทบาทของชุมชนในการดูแลและต่อยอดองค์ความรู้",
      "มองเห็นแนวทางการใช้ทรัพยากรอย่างรับผิดชอบ",
      "นำข้อคิดไปต่อยอดการเรียนรู้ในอนาคต",
    ],
    modelPosition: { x: 0.28, z: 0.22, height: -0.06 },
  },
];
