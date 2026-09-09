export const HERO_SLIDES = [
  {
    id: 1,
    image: "/Banner 1.jpg",
    badge: "MAHIDOL LAC LEARNING CENTER",
    title: "ห้องเรียนรู้ครั่งครบวงจร",
    subtitle:
      "งานพันธกิจเพื่อสังคม คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล อ.สบปราบ จ.ลำปาง",
    buttonText: "สำรวจศูนย์เรียนรู้ 3D",
    buttonLink: "#media-section",
  },
  {
    id: 2,
    image: "/Banner 2.jpg",
    badge: "ZONE 01 // THE ORIGIN",
    title: "กำเนิดครั่ง (The Origin)",
    subtitle:
      "ประวัติศาสตร์ ภูมิปัญญาดั้งเดิม อนุกรมวิธาน และถิ่นกำเนิดแมลงครั่งในเอเชียใต้และตะวันออกเฉียงใต้",
    buttonText: "ศึกษาเรื่องกำเนิดครั่ง",
    buttonLink: "#cards-section",
  },
  {
    id: 3,
    image: "/Banner 3.jpg",
    badge: "ZONE 02 // LIFE CYCLE",
    title: "มหัศจรรย์วงจรชีวิต (The Life Cycle)",
    subtitle:
      "เรียนรู้ชีววิทยา วงจรชีวิต ตัวอ่อน การขับชันยาง และสรีรวิทยาของแมลงครั่งอย่างครอบคลุม",
    buttonText: "ชมวงจรชีวิตแมลงครั่ง",
    buttonLink: "#cards-section",
  },
  {
    id: 4,
    image: "/Banner 4.jpg",
    badge: "ZONE 03 // THE HABITATS",
    title: "พืชอาศัยและนิเวศวิทยา (The Habitats)",
    subtitle:
      "พืชอาศัยที่เหมาะแก่การเพาะเลี้ยง เช่น ต้นจามจุรี (ก้ามปู) ต้นปลัก สีเสียด พร้อมการกักเก็บคาร์บอน",
    buttonText: "ดูข้อมูลพืชอาศัย",
    buttonLink: "#cards-section",
  },
  {
    id: 5,
    image: "/Banner 5.jpg",
    badge: "ZONE 04 // CULTIVATION",
    title: "การเพาะเลี้ยงและการจัดการ",
    subtitle:
      "รอบปฏิทินฤดูกาล (ฤดูร้อน/ฤดูฝน) เทคนิคการคัดแม่พันธุ์ การคุมศัตรูครั่ง และการเก็บเกี่ยวอย่างมีประสิทธิภาพ",
    buttonText: "ดูคู่มือการเพาะเลี้ยง",
    buttonLink: "#cards-section",
  },
  {
    id: 6,
    image: "/Banner 6.jpg",
    badge: "ZONE 05 // PRODUCT INNOVATION",
    title: "ครั่ง สู่ นวัตกรรมการผลิต",
    subtitle:
      "การแปรรูปครั่งดิบสู่ครั่งเมล็ด เชลแลกเกรดอุตสาหกรรม สีย้อมผ้าธรรมชาติ และสารเคลือบผิวระดับสูง",
    buttonText: "ชมนวัตกรรมแปรรูปครั่ง",
    buttonLink: "#cards-section",
  },
] as const;

export const LAC_STATS = {
  production: {
    label: "ศูนย์กลางการผลิตใหญ่สุด",
    location: "อ.งาว (บ้านบ่อสี่เหลี่ยม)",
    value: "300,000",
    unit: "กก./ปี",
  },
  efficiency: { label: "ประสิทธิภาพสูงสุด", location: "อ.สบปราบ", value: "อันดับ 1" },
  host: { label: "พืชอาศัยยอดนิยม", location: "ต้นจามจุรี (ก้ามปู)", value: "TOP 1" },
} as const;

export const LAC_RANKINGS = {
  farmers: ["🥇 อันดับ 1: อ.วังเหนือ", "🥈 อันดับ 2: อ.แจ้ห่ม", "🥉 อันดับ 3: อ.เมืองปาน"],
  efficiency: ["🥇 อันดับ 1: อ.สบปราบ", "🥈 อันดับ 2: อ.เสริมงาม", "🥉 อันดับ 3: อ.ห้างฉัตร"],
} as const;
