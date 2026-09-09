import { BingoTile } from "@/types/bingo";

export const BINGO_KEYWORDS_POOL: Omit<BingoTile, "isMarked" | "isHighlighted">[] = [
  {
    id: "jamjuree",
    keyword: "ต้นจามจุรี (ก้ามปู)",
    category: "biology",
    iconName: "TreeDeciduous",
    shortDesc: "พืชอาศัยหลักโตเร็ว",
    fact: "เป็นพืชอาศัยที่เกษตรกรนิยมปลูกมากที่สุด ให้ผลผลิตครั่งสูงและโตไวในสภาพอากาศภาคเหนือ",
  },
  {
    id: "sticklac",
    keyword: "ครั่งกิ่ง (Sticklac)",
    category: "product",
    iconName: "Package",
    shortDesc: "ผลผลิตครั่งดิบแรกเริ่ม",
    fact: "ครั่งดิบที่เก็บเกี่ยวพร้อมกิ่งไม้จากต้น มีทั้งเนื้อรังชัน ตัวแมลง และสิ่งเจือปนธรรมชาติ",
  },
  {
    id: "alum",
    keyword: "สารส้ม (Alum)",
    category: "chemistry",
    iconName: "Sparkles",
    shortDesc: "มอร์ดอนต์สีสว่างสดใส",
    fact: "ไอออน Al³⁺ ทำหน้าที่ตรึงสี Laccaic Acid ให้ติดทนบนเส้นใยและขับสีชมพูแดงให้สดสว่าง",
  },
  {
    id: "ph35",
    keyword: "pH 3.5 (Laccaic)",
    category: "chemistry",
    iconName: "FlaskConical",
    shortDesc: "สภาวะกรดสีชมพูสด",
    fact: "ในสภาวะกรดเข้มข้น pH 3.0-3.5 โครงสร้าง Laccaic Acid A/B จะสะท้อนแสงเป็นเฉดชมพูสด (Crimson Pink)",
  },
  {
    id: "shellac",
    keyword: "เชลแล็ก (Shellac)",
    category: "product",
    iconName: "Sparkles",
    shortDesc: "เรซินธรรมชาติเคลือบเงา",
    fact: "แปรรูปจาก Seedlac ใช้ในงานช่างไม้ เคลือบแผ่นเสียง และอุตสาหกรรมเคลือบระดับสากล",
  },
  {
    id: "pharma-capsule",
    keyword: "แคปซูลยา & ผลไม้",
    category: "product",
    iconName: "Pill",
    shortDesc: "Food/Pharma Grade",
    fact: "เชลแล็กบริสุทธิ์เกรดอาหารใช้เคลือบผลไม้ลดการคายน้ำ และเคลือบเม็ดยาเพื่อควบคุมการละลายในลำไส้",
  },
  {
    id: "sobprab",
    keyword: "อำเภอสบปราบ",
    category: "locality",
    iconName: "MapPin",
    shortDesc: "ศูนย์รวมประสิทธิภาพ No.1",
    fact: "อ.สบปราบ จ.ลำปาง เป็นแหล่งเพาะเลี้ยงที่มีประสิทธิภาพผลผลิตต่อกิโลกรัมพันธุ์สูงที่สุดในจังหวัด",
  },
  {
    id: "seedlac",
    keyword: "ครั่งเม็ด (Seedlac)",
    category: "product",
    iconName: "LayersIcon",
    shortDesc: "ครั่งบดล้างแยกสีแล้ว",
    fact: "ได้จากการนำครั่งกิ่งมาบดและล้างด้วยน้ำเพื่อแยกสีย้อมออก เหลือเกล็ดเรซินสีเหลืองทองอมส้ม",
  },
  {
    id: "iron-mordant",
    keyword: "น้ำสนิมเหล็ก (Fe³⁺)",
    category: "chemistry",
    iconName: "FlaskConical",
    shortDesc: "มอร์ดอนต์สีทึบโบราณ",
    fact: "สารช่วยติดสีกลุ่มเหล็กจะทำปฏิกิริยากับกรดครั่ง เปลี่ยนเฉดสีให้เข้มขึ้นจนได้สีแดงอมม่วงทึบแบบโบราณ",
  },
  {
    id: "sai-season",
    keyword: "ครั่งฤดูสาย",
    category: "biology",
    iconName: "Clock",
    shortDesc: "รอบ พ.ย. - มิ.ย.",
    fact: "วงจรการเลี้ยงรอบยาวในฤดูแล้ง แมลงสะสมเนื้อชันได้หนาแน่น ความบริสุทธิ์สูงและศัตรูพืชน้อย",
  },
  {
    id: "parasite-wasp",
    keyword: "แตนเบียน (Pest)",
    category: "biology",
    iconName: "Bug",
    shortDesc: "ศัตรูธรรมชาติของครั่ง",
    fact: "แมลงแตนเบียนเจาะวางไข่ในรังครั่ง การควบคุมด้วยชีววิธีช่วยลดความเสียหายโดยไม่ต้องใช้สารเคมีพิษ",
  },
  {
    id: "lac-wax",
    keyword: "ขี้ผึ้งครั่ง (Lac Wax)",
    category: "product",
    iconName: "Sparkles",
    shortDesc: "ไขธรรมชาติขัดเงา",
    fact: "ไขธรรมชาติจุดหลอมเหลวสูงที่สกัดได้จากครั่ง นิยมใช้ในอุตสาหกรรมเครื่องสำอาง ลิปสติก และยาขัดเงา",
  },
  {
    id: "mahidol-lampang",
    keyword: "ม.มหิดล ลำปาง",
    category: "locality",
    iconName: "Building2",
    shortDesc: "งานพันธกิจเพื่อสังคม",
    fact: "คณะสิ่งแวดล้อมฯ ม.มหิดล ถ่ายทอดองค์ความรู้วิทยาศาสตร์ นวัตกรรม และยกระดับเศรษฐกิจชุมชนครั่งสบปราบ",
  },
  {
    id: "kerria-lacca",
    keyword: "แมลงครั่ง (Kerria)",
    category: "biology",
    iconName: "Bug",
    shortDesc: "แมลงมหัศจรรย์ผู้สร้างชัน",
    fact: "แมลงขนาดจิ๋ววงศ์ Kerriidae ตัวเมียจะเกาะดูดน้ำเลี้ยงพืชและขับเรซินออกมาห่อหุ้มตัวเพื่อปกป้องไข่",
  },
  {
    id: "bcg-model",
    keyword: "โมเดล BCG สบปราบ",
    category: "locality",
    iconName: "Leaf",
    shortDesc: "Bio-Circular-Green",
    fact: "ใช้ทรัพยากรครั่งคุ้มค่าทุกส่วน ทั้งสีย้อมธรรมชาติ เชลแล็ก ไขครั่ง และน้ำล้างที่นำไปเป็นปุ๋ยบำรุงดิน",
  },
  {
    id: "natural-dye",
    keyword: "สีย้อมธรรมชาติ",
    category: "chemistry",
    iconName: "Palette",
    shortDesc: "สีแดงปลอดภัยไร้พิษ",
    fact: "สีสกัดจากน้ำล้างครั่งเป็นสารกลุ่มแอนทราควิโนนที่ปลอดภัยต่อผู้สวมใส่และสิ่งแวดล้อม ได้รับความนิยมในสิ่งทอพรีเมียม",
  },
];

// Helper to get category style & badge label
export const getCategoryStyle = (category: BingoTile["category"]) => {
  switch (category) {
    case "biology":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        pill: "bg-emerald-500",
        label: "ชีววิทยา",
      };
    case "chemistry":
      return {
        bg: "bg-pink-50 text-pink-700 border-pink-200",
        pill: "bg-pink-500",
        label: "เคมีสีย้อม",
      };
    case "product":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        pill: "bg-amber-500",
        label: "แปรรูปผลิตภัณฑ์",
      };
    case "locality":
      return {
        bg: "bg-sky-50 text-sky-700 border-sky-200",
        pill: "bg-sky-500",
        label: "ชุมชนสบปราบ/BCG",
      };
  }
};
