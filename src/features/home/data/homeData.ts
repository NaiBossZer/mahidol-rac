export const HERO_SLIDES = [
  {
    id: 1,
    image: "/Banner 1.jpg",
    badgeKey: "hero.slide1.badge",
    titleKey: "hero.slide1.title",
    subtitleKey: "hero.slide1.subtitle",
    buttonTextKey: "hero.slide1.buttonText",
    buttonLink: "#media-section",
  },
  {
    id: 2,
    image: "/Banner 2.jpg",
    badgeKey: "hero.slide2.badge",
    titleKey: "hero.slide2.title",
    subtitleKey: "hero.slide2.subtitle",
    buttonTextKey: "hero.slide2.buttonText",
    buttonLink: "#learning-journey",
  },
  {
    id: 3,
    image: "/Banner 3.jpg",
    badgeKey: "hero.slide3.badge",
    titleKey: "hero.slide3.title",
    subtitleKey: "hero.slide3.subtitle",
    buttonTextKey: "hero.slide3.buttonText",
    buttonLink: "#life-cycle",
  },
  {
    id: 4,
    image: "/Banner 4.jpg",
    badgeKey: "hero.slide4.badge",
    titleKey: "hero.slide4.title",
    subtitleKey: "hero.slide4.subtitle",
    buttonTextKey: "hero.slide4.buttonText",
    buttonLink: "#learning-journey",
  },
  {
    id: 5,
    image: "/Banner 5.jpg",
    badgeKey: "hero.slide5.badge",
    titleKey: "hero.slide5.title",
    subtitleKey: "hero.slide5.subtitle",
    buttonTextKey: "hero.slide5.buttonText",
    buttonLink: "#learning-journey",
  },
  {
    id: 6,
    image: "/Banner 6.jpg",
    badgeKey: "hero.slide6.badge",
    titleKey: "hero.slide6.title",
    subtitleKey: "hero.slide6.subtitle",
    buttonTextKey: "hero.slide6.buttonText",
    buttonLink: "#lac-product",
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
