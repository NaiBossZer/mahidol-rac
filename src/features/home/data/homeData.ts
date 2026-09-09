export const HERO_SLIDES = [
  {
    id: 1,
    image: "/Banner 1.jpg",
    badge: "MAHIDOL LAC LEARNING CENTER",
    title: "ห้องเรียนรู้ครั่งครบวงจร",
    subtitle: "เรียนรู้เรื่องครั่งผ่านพื้นที่จัดแสดงและองค์ความรู้ของศูนย์ลำปาง",
    buttonText: "สำรวจศูนย์เรียนรู้ 3D",
    buttonLink: "#media-section",
  },
  {
    id: 2,
    image: "/Banner 2.jpg",
    badge: "ZONE 01 // THE ORIGIN",
    title: "กำเนิดครั่ง",
    subtitle: "รู้จักต้นกำเนิด ประวัติศาสตร์ และความหลากหลายของแมลงครั่ง",
    buttonText: "ศึกษาเรื่องกำเนิดครั่ง",
    buttonLink: "#cards-section",
  },
  {
    id: 3,
    image: "/Banner 3.jpg",
    badge: "ZONE 02 // LIFE CYCLE",
    title: "มหัศจรรย์วงจรชีวิต",
    subtitle: "สำรวจวงจรชีวิตและชีววิทยาของแมลงครั่ง",
    buttonText: "ชมวงจรชีวิตแมลงครั่ง",
    buttonLink: "#cards-section",
  },
  {
    id: 4,
    image: "/Banner 4.jpg",
    badge: "ZONE 03 // THE HABITATS",
    title: "พืชอาศัยและนิเวศวิทยา",
    subtitle: "เรียนรู้ความสัมพันธ์ระหว่างครั่ง ต้นพิงอาศัย และระบบนิเวศ",
    buttonText: "ดูข้อมูลพืชอาศัย",
    buttonLink: "#cards-section",
  },
  {
    id: 5,
    image: "/Banner 5.jpg",
    badge: "ZONE 04 // CULTIVATION",
    title: "การเพาะเลี้ยงและการจัดการ",
    subtitle: "เรียนรู้ฤดูกาล เทคนิคการเพาะเลี้ยง และการจัดการครั่ง",
    buttonText: "ดูคู่มือการเพาะเลี้ยง",
    buttonLink: "#cards-section",
  },
  {
    id: 6,
    image: "/Banner 6.jpg",
    badge: "ZONE 05 // PRODUCT INNOVATION",
    title: "ครั่งสู่นวัตกรรมการผลิต",
    subtitle: "จากครั่งดิบสู่การแปรรูป ผลิตภัณฑ์ และนวัตกรรม",
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
