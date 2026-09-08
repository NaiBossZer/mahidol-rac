import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Dices,
  Award,
  Star,
  BookOpen,
  Volume2,
  VolumeX,
  Flame,
  Check,
  ChevronRight,
  Tv,
  Layers,
  Zap,
  Info,
  RotateCcw,
  TreeDeciduous,
  FlaskConical,
  Package,
  Pill,
  MapPin,
  Palette,
  Clock,
  ShieldCheck,
  Building2,
  Bug,
  Leaf,
  Layers as LayersIcon,
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface BingoTile {
  id: string;
  keyword: string;
  category: "biology" | "chemistry" | "product" | "locality";
  iconName: string;
  shortDesc: string;
  fact: string;
  isMarked: boolean;
  isHighlighted: boolean;
  inWinningLine: boolean;
}

export interface QuestionCard {
  id: string;
  targetKeywordId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface WinningLine {
  type: "row" | "col" | "diag";
  index: number;
  indices: number[];
  label: string;
}

export interface LeaderboardEntry {
  id: string;
  teamName: string;
  score: number;
  lines: number;
  accuracy: number;
  timeSpent: string;
  date: string;
}

// ============================================================================
// Sound FX Generator via Web Audio API (Zero External Files Needed)
// ============================================================================
const playChime = (type: "correct" | "wrong" | "bingo" | "click" | "draw") => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "draw") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "correct") {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } else if (type === "wrong") {
      const now = ctx.currentTime;
      [280, 210].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.1, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.2);
      });
    } else if (type === "bingo") {
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.4);
        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.4);
      });
    }
  } catch {
    // AudioContext blocked or not supported
  }
};

// ============================================================================
// 16 Core Keywords Database for Sobprab Lac Learning Center (4x4 Matrix)
// ============================================================================
const BINGO_KEYWORDS_POOL: Omit<BingoTile, "isMarked" | "isHighlighted" | "inWinningLine">[] = [
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

// ============================================================================
// Comprehensive Question Deck Linked to Keywords
// ============================================================================
const QUESTION_DECK: QuestionCard[] = [
  {
    id: "q_jamjuree",
    targetKeywordId: "jamjuree",
    question: "พืชอาศัยชนิดใดที่เกษตรกรนิยมเพาะเลี้ยงครั่งมากที่สุดเนื่องจากโตเร็วและให้ผลผลิตชันสูง?",
    options: ["ต้นยางพารา", "ต้นจามจุรี (ก้ามปู)", "ต้นสักทอง", "ต้นยูคาลิปตัส"],
    correctIndex: 1,
    explanation: "ถูกต้อง! ต้นจามจุรี (ก้ามปู) เป็นพืชตระกูลถั่วที่โตเร็ว กิ่งโปร่ง น้ำเลี้ยงสมบูรณ์ เหมาะกับการเจริญเติบโตของแมลงครั่งที่สุด",
    hint: "เป็นไม้ยืนต้นทรงพุ่มกว้าง มักปลูกให้ร่มเงา มีชื่อเรียกอีกอย่างว่า ต้นฉำฉา หรือ ต้นก้ามปู",
  },
  {
    id: "q_sticklac",
    targetKeywordId: "sticklac",
    question: "ผลผลิตครั่งในสภาพดิบที่ตัดเก็บเกี่ยวติดมาพร้อมกับกิ่งไม้ มีชื่อเรียกทางการค้าว่าอะไร?",
    options: ["Sticklac (ครั่งกิ่ง)", "Seedlac (ครั่งเม็ด)", "Shellac (เชลแล็ก)", "Button Lac (ครั่งกระดุม)"],
    correctIndex: 0,
    explanation: "ยอดเยี่ยม! 'Sticklac' หรือ ครั่งกิ่ง คือผลผลิตชั้นต้นที่ตัดกิ่งไม้ติดรังครั่งลงมา ก่อนนำไปกะเทาะและแปรรูป",
    hint: "คำศัพท์ภาษาอังกฤษขึ้นต้นด้วย 'Stick' ที่แปลว่าท่อนไม้หรือกิ่งไม้",
  },
  {
    id: "q_alum",
    targetKeywordId: "alum",
    question: "หากต้องการย้อมผ้าด้วยสีครั่งให้ได้เฉดสีชมพูแดงสว่างสดใส ควรใช้สารช่วยติดสี (Mordant) ชนิดใด?",
    options: ["โคลนหมักธรรมชาติ", "น้ำสนิมเหล็ก", "สารส้ม (Alum)", "ขี้เถ้ากาบมะพร้าว"],
    correctIndex: 2,
    explanation: "เก่งมาก! สารส้มมีประจุ Al³⁺ ช่วยขับเม็ดสี Laccaic Acid ให้เกิดความสว่างสดใส ไม่หม่นหมอง",
    hint: "เป็นสารผลึกสีขาวใสที่คนไทยคุ้นเคยในการแกว่งน้ำให้ใสหรือดับกลิ่นกาย",
  },
  {
    id: "q_ph35",
    targetKeywordId: "ph35",
    question: "สารละลายสีครั่ง (Laccaic Acid) จะสะท้อนเฉดสีชมพูสด (Crimson Pink) โดดเด่นที่สุดในสภาวะความเป็นกรด-ด่างระดับใด?",
    options: ["pH 3.0 - 3.5 (กรด)", "pH 7.0 (กลาง)", "pH 9.5 (ด่าง)", "pH 12.0 (ด่างแก่)"],
    correctIndex: 0,
    explanation: "ถูกต้องตรงจุด! โครงสร้างของ Laccaic Acid จะเปลี่ยนสีตาม pH โดยในกรด pH 3.0 - 3.5 จะให้สีชมพูสดและทึบลงเมื่อเป็นกลาง/ด่าง",
    hint: "เป็นสภาวะที่มีความเป็น 'กรดชัดเจน' มีค่า pH ต่ำกว่า 4",
  },
  {
    id: "q_shellac",
    targetKeywordId: "shellac",
    question: "เรซินธรรมชาติที่ได้จากการหลอมกรองครั่งเม็ดจนเป็นแผ่นบางสีทอง ใช้ในงานขัดเงาไม้ มีชื่อเรียกว่าอะไร?",
    options: ["แล็กเกอร์สังเคราะห์", "เชลแล็ก (Shellac)", "วานิชยูรีเทน", "อีพ็อกซี่ใส"],
    correctIndex: 1,
    explanation: "แม่นยำมาก! 'เชลแล็ก' คือเรซินชีวภาพธรรมชาติ 100% ปลอดภัย ป้องกันความชื้น และยึดเกาะพื้นผิวไม้ได้อย่างยอดเยี่ยม",
    hint: "คำศัพท์ขึ้นต้นด้วยคำว่า 'Shell' รวมกับคำว่า 'Lac'",
  },
  {
    id: "q_pharma",
    targetKeywordId: "pharma-capsule",
    question: "ในวงการเภสัชกรรมและอาหาร นำเชลแล็กบริสุทธิ์ (Food & Pharma Grade) มาใช้ประโยชน์หลักในข้อใด?",
    options: ["ผสมเป็นยาฆ่าเชื้อแผลสด", "เคลือบเม็ดยาและผิวผลไม้", "ใช้แทนน้ำตาลเทียม", "ทำเป็นหลอดฉีดยา"],
    correctIndex: 1,
    explanation: "ยอดเยี่ยม! เชลแล็กเกรดบริสุทธิ์ใช้เคลือบผลไม้ป้องกันการสูญเสียน้ำ และเคลือบเม็ดยาเพื่อชะลอการแตกตัวไปจนถึงลำไส้",
    hint: "เกี่ยวข้องกับการเคลือบพื้นผิวเพื่อป้องกันความชื้นและการละลาย",
  },
  {
    id: "q_sobprab",
    targetKeywordId: "sobprab",
    question: "อำเภอใดในจังหวัดลำปาง ที่มีสถิติประสิทธิภาพผลผลิตครั่งต่อกิโลกรัมแม่พันธุ์สูงเป็นอันดับ 1?",
    options: ["อำเภอเมืองลำปาง", "อำเภอเกาะคา", "อำเภอสบปราบ", "อำเภอแจ้ห่ม"],
    correctIndex: 2,
    explanation: "ถูกต้องที่สุด! อ.สบปราบ เป็นพื้นที่ยุทธศาสตร์สำคัญที่มีภูมิอากาศและสายพันธุ์เหมาะสม ทำให้ได้ผลผลิตเฉลี่ยสูงสุด",
    hint: "ชื่ออำเภอนี้เป็นชื่อเดียวกับศูนย์การเรียนรู้แห่งนี้!",
  },
  {
    id: "q_seedlac",
    targetKeywordId: "seedlac",
    question: "เมื่อนำครั่งกิ่ง (Sticklac) มาบดและล้างน้ำเพื่อแยกสารสีแดงออก จะได้ผลิตภัณฑ์เม็ดเล็กสีเหลืองทองที่เรียกว่าอะไร?",
    options: ["Seedlac (ครั่งเม็ด)", "Lac Dye Powder", "Sticklac Meal", "Wax Lac"],
    correctIndex: 0,
    explanation: "ถูกต้อง! Seedlac คือครั่งเม็ดที่ล้างสิ่งสกปรกและสีน้ำออกแล้ว เป็นวัตถุดิบตั้งต้นสำคัญในการนำไปสกัดเป็นเชลแล็กต่อไป",
    hint: "มีลักษณะเป็นเม็ดคล้ายเมล็ดพืช จึงใช้คำว่า 'Seed'",
  },
  {
    id: "q_iron",
    targetKeywordId: "iron-mordant",
    question: "ในการย้อมผ้าแบบโบราณ หากต้องการเปลี่ยนสีครั่งจากโทนแดงสดให้เป็น 'สีแดงเข้มอมม่วงหม่น' ควรใช้อะไรเป็นสารช่วยติดสี?",
    options: ["น้ำตาลทรายแดง", "น้ำสนิมเหล็ก (Fe³⁺)", "น้ำกะทิมะพร้าว", "น้ำส้มสายชู"],
    correctIndex: 1,
    explanation: "ถูกต้อง! ไอออนเหล็ก Fe³⁺ จะทำปฏิกิริยากับโมเลกุลสี ดึงการดูดกลืนแสงให้เข้มขึ้นจนกลายเป็นสีแดงอมม่วงทึบโบราณ",
    hint: "เกิดจากปฏิกิริยาของโลหะเหล็กกับน้ำและอากาศ",
  },
  {
    id: "q_sai",
    targetKeywordId: "sai-season",
    question: "การเพาะเลี้ยง 'ครั่งฤดูสาย' มีช่วงระยะเวลาการปล่อยแม่พันธุ์และเก็บเกี่ยวตรงกับช่วงเดือนใด?",
    options: ["พ.ค. - พ.ย. (รอบฝน)", "พ.ย. - มิ.ย. (รอบแล้ง/ร้อน)", "ม.ค. - เม.ย. (รอบสั้น)", "ส.ค. - ธ.ค. (รอบปลายปี)"],
    correctIndex: 1,
    explanation: "ถูกต้อง! ครั่งฤดูสายจะเริ่มปล่อยพันธุ์ช่วง พ.ย.-ธ.ค. และเก็บเกี่ยว พ.ค.-มิ.ย. แมลงเจริญเติบโตในสภาพอากาศแห้ง ได้เนื้อชันคุณภาพดี",
    hint: "เป็นรอบที่ครอบคลุมฤดูหนาวข้ามไปจนถึงต้นฤดูฝน (ระยะยาว 7-8 เดือน)",
  },
  {
    id: "q_parasite",
    targetKeywordId: "parasite-wasp",
    question: "ศัตรูสำคัญตามธรรมชาติของแมลงครั่งที่มักเจาะไข่เข้าไปกินตัวอ่อนในรังชัน คือแมลงชนิดใด?",
    options: ["แตนเบียน", "ผึ้งหลวง", "ด้วงกว่าง", "ตั๊กแตนตำข้าว"],
    correctIndex: 0,
    explanation: "ถูกต้อง! แตนเบียนและผีเสื้อหนอนเจาะครั่งเป็นศัตรูร้ายแรง เกษตรกรจึงต้องหมั่นตัดแต่งกิ่งและใช้การควบคุมทางชีววิธี",
    hint: "แมลงขนาดเล็กในกลุ่ม Hymenoptera ที่อาศัยเบียนกินสิ่งมีชีวิตอื่น",
  },
  {
    id: "q_lacwax",
    targetKeywordId: "lac-wax",
    question: "ไขธรรมชาติ (Wax) ที่ได้เป็นผลพลอยได้จากการสกัดครั่ง มีจุดเด่นด้านใดที่นำไปใช้ในอุตสาหกรรมเครื่องสำอาง?",
    options: ["ละลายน้ำได้ทันที", "มีจุดหลอมเหลวสูงและช่วยเพิ่มความเงางาม", "มีรสชาติหวานหอม", "ช่วยให้เกิดฟองสบู่"],
    correctIndex: 1,
    explanation: "เยี่ยมมาก! Lac Wax มีจุดหลอมเหลวสูง (ประมาณ 72-84°C) แข็งตัวดี ให้ความเงางาม จึงนิยมผสมในลิปสติกและยาขัดเงารถยนต์",
    hint: "เป็นไขที่มีความแข็งและจุดหลอมเหลวสูงเป็นพิเศษ",
  },
  {
    id: "q_mahidol",
    targetKeywordId: "mahidol-lampang",
    question: "หน่วยงานใดที่เข้ามาดำเนินโครงการพันธกิจเพื่อสังคม ยกระดับห่วงโซ่คุณค่าครั่งสบปราบอย่างยั่งยืน?",
    options: ["คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล", "สถาบันการบินพลเรือน", "กรมเจ้าท่า", "การรถไฟแห่งประเทศไทย"],
    correctIndex: 0,
    explanation: "ถูกต้องสมบูรณ์! คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล (วิทยาเขตนครลำปาง) เป็นแกนนำขับเคลื่อนศูนย์เรียนรู้นี้",
    hint: "มหาวิทยาลัยที่มีสีน้ำเงินเป็นสีประจำมหาวิทยาลัย และก่อตั้งศูนย์การเรียนรู้นี้",
  },
  {
    id: "q_kerria",
    targetKeywordId: "kerria-lacca",
    question: "ชื่อทางวิทยาศาสตร์ของแมลงครั่งที่นิยมเพาะเลี้ยงในประเทศไทยคือชื่อใด?",
    options: ["Apis mellifera", "Kerria lacca", "Bombyx mori", "Aedes aegypti"],
    correctIndex: 1,
    explanation: "ถูกต้อง! Kerria lacca (Kerr) คือชื่อวิทยาศาสตร์ของแมลงครั่ง ส่วน Bombyx mori คือหนอนไหม และ Apis mellifera คือผึ้งพันธุ์",
    hint: "ชื่อสกุลและสปีชีส์มีคำที่พ้องกับคำว่า 'Lac'",
  },
  {
    id: "q_bcg",
    targetKeywordId: "bcg-model",
    question: "การพัฒนาครั่งสบปราบแบบ Zero Waste ใช้ประโยชน์ทั้งสีย้อม เชลแล็ก และปุ๋ยบำรุงดิน สอดคล้องกับแนวคิดการพัฒนาใด?",
    options: ["โมเดลเศรษฐกิจ BCG", "ทฤษฎีอุปสงค์อุปทานเดี่ยว", "เศรษฐกิจคริปโตเคอร์เรนซี", "การเกษตรเชิงเดี่ยวเข้มข้น"],
    correctIndex: 0,
    explanation: "ยอดเยี่ยมมาก! โมเดล BCG (Bio-Circular-Green) ช่วยเพิ่มมูลค่าผลผลิตชีวภาพ หมุนเวียนของเสียกลับมาสร้างประโยชน์ และเป็นมิตรกับสิ่งแวดล้อม",
    hint: "ย่อมาจาก Bio - Circular - Green Economy",
  },
  {
    id: "q_dye",
    targetKeywordId: "natural-dye",
    question: "ข้อใดคือข้อได้เปรียบที่สำคัญที่สุดของสีย้อมผ้าธรรมชาติจากครั่งเมื่อเปรียบเทียบกับสีสังเคราะห์เคมี?",
    options: [
      "ปลอดภัย ไร้สารก่อมะเร็ง ย่อยสลายได้ตามธรรมชาติ",
      "มีราคาถูกกว่าสีเคมีสังเคราะห์เสมอ",
      "ย้อมได้เฉพาะผ้าใยแก้วสังเคราะห์เท่านั้น",
      "ไม่สามารถละลายในน้ำได้เลย",
    ],
    correctIndex: 0,
    explanation: "ถูกต้อง! สีครั่งเป็นสารธรรมชาติที่มีประวัติการใช้มานับพันปี ปลอดภัยต่อทั้งผู้ผลิต ผู้สวมใส่ และไม่ปล่อยสารตกค้างอันตรายสู่ระบบนิเวศ",
    hint: "เป็นมิตรต่อสิ่งแวดล้อมและสุขภาพของผู้สวมใส่",
  },
];

// Helper to get category style
const getCategoryStyle = (category: BingoTile["category"]) => {
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

// Render Lucide Icon by name dynamically
const renderTileIcon = (name: string, className = "w-5 h-5") => {
  switch (name) {
    case "TreeDeciduous":
      return <TreeDeciduous className={className} />;
    case "Package":
      return <Package className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "FlaskConical":
      return <FlaskConical className={className} />;
    case "Pill":
      return <Pill className={className} />;
    case "MapPin":
      return <MapPin className={className} />;
    case "LayersIcon":
      return <LayersIcon className={className} />;
    case "Clock":
      return <Clock className={className} />;
    case "Bug":
      return <Bug className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    case "Leaf":
      return <Leaf className={className} />;
    case "Palette":
      return <Palette className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

// ============================================================================
// Internal Confetti Canvas Component (Zero External Packages Required)
// ============================================================================
const BingoConfetti: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const colors = ["#801818", "#F5B800", "#16A34A", "#E84393", "#002D62", "#F97316", "#A855F7"];
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * -height * 0.5,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 3 + 2.5,
      vx: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8,
    }));

    const startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = Date.now() - startTime;

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      });

      if (elapsed < 6500) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

// ============================================================================
// Character Popup: พี่ M-Guide (Host & Quiz Master)
// ============================================================================
interface MGuidePopupProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuestionCard | null;
  onAnswer: (optionIndex: number) => void;
  selectedOption: number | null;
  isAnswerChecked: boolean;
  isCorrect: boolean | null;
  onNextQuestion: () => void;
  emotion: "idle" | "happy" | "thinking" | "excited" | "concerned";
  soundEnabled: boolean;
}

const MGuidePopupOverlay: React.FC<MGuidePopupProps> = ({
  isOpen,
  onClose,
  question,
  onAnswer,
  selectedOption,
  isAnswerChecked,
  isCorrect,
  onNextQuestion,
  emotion,
  soundEnabled,
}) => {
  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white border-2 border-[#801818]/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with M-Guide Banner */}
        <div className="bg-gradient-to-r from-[#002D62] via-[#801818] to-[#600C0C] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3">
            {/* Animated Character Avatar */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 border-2 border-white/30 flex items-center justify-center p-1 overflow-hidden shadow-inner">
              <img
                src={`/assets/characters/prof-mahidol/${emotion === "excited" ? "excited" : emotion === "happy" ? "happy" : emotion === "thinking" ? "thinking" : emotion === "concerned" ? "concerned" : "idle"}.svg`}
                alt="พี่ M-Guide"
                className="w-full h-full object-contain transform transition-transform hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector(".mascot-fallback")) {
                    const fallback = document.createElement("div");
                    fallback.className = "mascot-fallback text-2xl font-bold flex items-center justify-center";
                    fallback.innerText = emotion === "happy" || emotion === "excited" ? "🎓✨" : "🤔📚";
                    parent.appendChild(fallback);
                  }
                }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#F5B800] text-[#002D62] text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  BINGO HOST
                </span>
                <span className="text-xs text-white/80 font-mono">การ์ดคำถาม #{question.id}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                พี่ M-Guide (ผู้ช่วยศูนย์เรียนรู้ครั่ง)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Host Dialogue Speech Bubble */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 flex gap-3 items-start">
            <div className="w-7 h-7 rounded-xl bg-[#801818] text-white shrink-0 flex items-center justify-center text-xs font-bold">
              M
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#801818]">คำทักทายจากพิธีกร:</p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {!isAnswerChecked
                  ? "น้องๆ ตอบคำถามข้อนี้ให้ถูกต้อง เพื่อปลดล็อกช่องบิงโกบนกระดานกันเลยครับ!"
                  : isCorrect
                  ? "🎉 เก่งมากครับ! คำตอบถูกต้อง ช่องบิงโกที่เกี่ยวข้องจะถูกมาร์กบนกระดานให้ทันที!"
                  : "💡 ยังไม่ถูกต้องนะครับ แต่ไม่ต้องกังวล พี่ M-Guide มีคำอธิบายให้ลองทบทวนดูได้เลยครับ"}
              </p>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <HelpCircle className="w-4 h-4 text-[#002D62]" />
              <span>คำถามชิงช่องบิงโก</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              {question.question}
            </h4>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = "bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700";

              if (isAnswerChecked) {
                if (idx === question.correctIndex) {
                  btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-2 ring-emerald-300";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-rose-50 border-rose-400 text-rose-800 line-through ring-2 ring-rose-200";
                } else {
                  btnStyle = "bg-slate-50/50 border-slate-200 text-slate-400 opacity-60";
                }
              } else if (isSelected) {
                btnStyle = "bg-[#801818]/10 border-[#801818] text-[#801818] font-semibold ring-2 ring-[#801818]/20";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerChecked}
                  onClick={() => {
                    if (soundEnabled) playChime("click");
                    onAnswer(idx);
                  }}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between text-sm sm:text-base cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200">
                      {["ก", "ข", "ค", "ง"][idx]}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswerChecked && idx === question.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerChecked && isSelected && !isCorrect && (
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Hint Box (When answered) */}
          {isAnswerChecked && (
            <div
              className={`p-4 rounded-2xl border ${
                isCorrect
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                  : "bg-amber-50/70 border-amber-200 text-amber-900"
              } space-y-1.5`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                <Info className="w-4 h-4" />
                <span>คำอธิบายความรู้ครั่ง:</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ตอบถูกรับ 100 คะแนน + ปลดล็อกช่อง</span>
          </div>

          <div className="flex gap-2">
            {isAnswerChecked ? (
              <button
                onClick={onNextQuestion}
                className="bg-[#801818] hover:bg-[#600C0C] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>จับการ์ดถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer"
              >
                ไว้ตอบทีหลัง
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main Interactive Component: LacBingoGame
// ============================================================================
export const LacBingoGame: React.FC = () => {
  // State 1: Board tiles (16 items for 4x4 matrix)
  const [boardTiles, setBoardTiles] = useState<BingoTile[]>(() => {
    return [...BINGO_KEYWORDS_POOL]
      .sort(() => Math.random() - 0.5)
      .map((item) => ({
        ...item,
        isMarked: false,
        isHighlighted: false,
        inWinningLine: false,
      }));
  });

  // State 2: Game Flow & Host
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hostMode, setHostMode] = useState<"player" | "screen">("player");
  const [activeQuestion, setActiveQuestion] = useState<QuestionCard | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hostEmotion, setHostEmotion] = useState<"idle" | "happy" | "thinking" | "excited" | "concerned">("idle");

  // State 3: Scoring & Winning lines
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [completedLines, setCompletedLines] = useState<WinningLine[]>([]);
  const [showBingoBanner, setShowBingoBanner] = useState<boolean>(false);
  const [isFullBingo, setIsFullBingo] = useState<boolean>(false);

  // State 4: Selected Tile for Inspection Modal / Mini hint
  const [inspectTile, setInspectTile] = useState<BingoTile | null>(null);

  // State 5: Team Name & Local Leaderboard
  const [teamName, setTeamName] = useState<string>("ทีมนักวิจัยน้อย สบปราบ");
  const [isSavedToLeaderboard, setIsSavedToLeaderboard] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: "1",
      teamName: "ทีมนิเวศครั่งมหิดล",
      score: 1850,
      lines: 4,
      accuracy: 100,
      timeSpent: "3:45",
      date: "วันนี้",
    },
    {
      id: "2",
      teamName: "กลุ่มวิสาหกิจครั่งสบปราบ",
      score: 1400,
      lines: 3,
      accuracy: 92,
      timeSpent: "4:12",
      date: "วันนี้",
    },
    {
      id: "3",
      teamName: "ชมรมสีย้อมธรรมชาติลำปาง",
      score: 1100,
      lines: 2,
      accuracy: 85,
      timeSpent: "5:00",
      date: "เมื่อวาน",
    },
  ]);

  // Timer simulation
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ==========================================================================
  // Check Winning Bingo Lines (Rows, Cols, Diagonals in 4x4 Matrix)
  // ==========================================================================
  const checkBingoLines = useCallback((currentTiles: BingoTile[]) => {
    const lines: WinningLine[] = [];

    // 4 Horizontal Rows
    for (let r = 0; r < 4; r++) {
      const indices = [r * 4, r * 4 + 1, r * 4 + 2, r * 4 + 3];
      if (indices.every((i) => currentTiles[i].isMarked)) {
        lines.push({
          type: "row",
          index: r + 1,
          indices,
          label: `แนวนอนแถวที่ ${r + 1}`,
        });
      }
    }

    // 4 Vertical Columns
    for (let c = 0; c < 4; c++) {
      const indices = [c, c + 4, c + 8, c + 12];
      if (indices.every((i) => currentTiles[i].isMarked)) {
        lines.push({
          type: "col",
          index: c + 1,
          indices,
          label: `แนวตั้งแถวที่ ${c + 1}`,
        });
      }
    }

    // 2 Diagonals
    const diag1 = [0, 5, 10, 15]; // Top-left to Bottom-right
    if (diag1.every((i) => currentTiles[i].isMarked)) {
      lines.push({
        type: "diag",
        index: 1,
        indices: diag1,
        label: "แนวทแยง (ซ้ายบน ↘ ขวาล่าง)",
      });
    }

    const diag2 = [3, 6, 9, 12]; // Top-right to Bottom-left
    if (diag2.every((i) => currentTiles[i].isMarked)) {
      lines.push({
        type: "diag",
        index: 2,
        indices: diag2,
        label: "แนวทแยง (ขวาบน ↙ ซ้ายล่าง)",
      });
    }

    return lines;
  }, []);

  // Monitor newly formed winning lines
  const previousLineCountRef = useRef<number>(0);

  useEffect(() => {
    const lines = checkBingoLines(boardTiles);
    setCompletedLines(lines);

    // Update inWinningLine flag on tiles
    const winningIndices = new Set<number>();
    lines.forEach((l) => l.indices.forEach((idx) => winningIndices.add(idx)));

    setBoardTiles((prev) =>
      prev.map((tile, idx) => ({
        ...tile,
        inWinningLine: winningIndices.has(idx),
      }))
    );

    // Detect if a NEW line was completed
    if (lines.length > previousLineCountRef.current) {
      const newLineCount = lines.length - previousLineCountRef.current;
      setScore((s) => s + newLineCount * 500); // 500 bonus points per line
      setShowBingoBanner(true);
      setHostEmotion("excited");

      if (soundEnabled) {
        playChime("bingo");
      }

      // If full 16 tiles marked
      if (boardTiles.every((t) => t.isMarked)) {
        setIsFullBingo(true);
        setScore((s) => s + 2000); // Grand blackout bonus
      }

      const timeout = setTimeout(() => {
        setShowBingoBanner(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }

    previousLineCountRef.current = lines.length;
  }, [boardTiles, checkBingoLines, soundEnabled]);

  // ==========================================================================
  // Action Handlers
  // ==========================================================================

  // 1. Draw Random Question from Host (พี่ M-Guide)
  const handleDrawQuestion = () => {
    if (soundEnabled) playChime("draw");

    const unmarkedKeywords = new Set(boardTiles.filter((t) => !t.isMarked).map((t) => t.id));
    let availableQuestions = QUESTION_DECK.filter((q) => unmarkedKeywords.has(q.targetKeywordId));

    if (availableQuestions.length === 0) {
      availableQuestions = QUESTION_DECK;
    }

    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setActiveQuestion(randomQuestion);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setHostEmotion("thinking");
    setIsPopupOpen(true);
  };

  // 2. Click specific tile on board to challenge its question
  const handleTileClick = (tile: BingoTile) => {
    if (soundEnabled) playChime("click");

    if (tile.isMarked) {
      setInspectTile(tile);
      return;
    }

    const matchedQuestion = QUESTION_DECK.find((q) => q.targetKeywordId === tile.id);
    if (matchedQuestion) {
      setActiveQuestion(matchedQuestion);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsCorrect(null);
      setHostEmotion("thinking");
      setIsPopupOpen(true);
    } else {
      setInspectTile(tile);
    }
  };

  // 3. Submit Answer to Host
  const handleAnswerSubmit = (optionIndex: number) => {
    if (!activeQuestion || isAnswerChecked) return;

    setSelectedOption(optionIndex);
    setIsAnswerChecked(true);
    setQuestionsAnswered((n) => n + 1);

    const isAnsCorrect = optionIndex === activeQuestion.correctIndex;
    setIsCorrect(isAnsCorrect);

    if (isAnsCorrect) {
      setCorrectAnswers((n) => n + 1);
      setStreak((s) => s + 1);
      const bonusStreak = (streak + 1) * 20;
      setScore((s) => s + 100 + bonusStreak);
      setHostEmotion("happy");
      if (soundEnabled) playChime("correct");

      // Mark the target tile on the board and illuminate it
      setBoardTiles((prev) =>
        prev.map((tile) => {
          if (tile.id === activeQuestion.targetKeywordId) {
            return {
              ...tile,
              isMarked: true,
              isHighlighted: true,
            };
          }
          return tile;
        })
      );

      setTimeout(() => {
        setBoardTiles((prev) =>
          prev.map((tile) => (tile.id === activeQuestion.targetKeywordId ? { ...tile, isHighlighted: false } : tile))
        );
      }, 2500);
    } else {
      setStreak(0);
      setHostEmotion("concerned");
      if (soundEnabled) playChime("wrong");
    }
  };

  // 4. Reset & Reshuffle Board
  const handleReshuffleBoard = () => {
    if (soundEnabled) playChime("click");
    const confirm = window.confirm("ต้องการสุ่มคำศัพท์ใหม่และเริ่มกระดานใหม่ใช่หรือไม่?");
    if (!confirm) return;

    const newTiles = [...BINGO_KEYWORDS_POOL]
      .sort(() => Math.random() - 0.5)
      .map((item) => ({
        ...item,
        isMarked: false,
        isHighlighted: false,
        inWinningLine: false,
      }));

    setBoardTiles(newTiles);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setCompletedLines([]);
    setShowBingoBanner(false);
    setIsFullBingo(false);
    setIsSavedToLeaderboard(false);
    setSecondsElapsed(0);
    previousLineCountRef.current = 0;
    setHostEmotion("idle");
  };

  // 5. Save Score to Leaderboard
  const handleSaveScore = () => {
    if (isSavedToLeaderboard) return;
    const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 100;
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      teamName: teamName.trim() || "ทีมนิรนาม",
      score,
      lines: completedLines.length,
      accuracy,
      timeSpent: formatTimer(secondsElapsed),
      date: "วันนี้",
    };

    setLeaderboard((prev) => [newEntry, ...prev].sort((a, b) => b.score - a.score));
    setIsSavedToLeaderboard(true);
    if (soundEnabled) playChime("correct");
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 py-6 font-['Mitr',sans-serif] text-slate-800">
      {/* Visual Confetti for Win */}
      <BingoConfetti active={showBingoBanner || isFullBingo} />

      {/* ==================================================================== */}
      {/* 1. Header & Host Dashboard Bar */}
      {/* ==================================================================== */}
      <header className="bg-white border-2 border-[#801818]/20 rounded-3xl p-4 sm:p-6 shadow-md mb-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Title & Brand */}
          <div className="flex items-center gap-3.5 text-center lg:text-left">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#801818] to-[#002D62] text-white flex items-center justify-center shadow-lg shadow-[#801818]/20 shrink-0">
              <Dices className="w-7 h-7 sm:w-8 sm:h-8 text-[#F5B800] animate-bounce" />
            </div>
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="bg-[#801818]/10 text-[#801818] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#801818]/20">
                  4x4 BINGO SYSTEM
                </span>
                <span className="text-xs text-slate-500 font-medium">ห้องเรียนรู้ครั่งสบปราบ</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                เกมบิงโกวิทยาศาสตร์ครั่งสบปราบ
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                พิชิตคำถามจาก พี่ M-Guide • ปลดล็อก 16 คีย์เวิร์ด • บิงโก 4 ช่องแถวตรงหรือทแยง
              </p>
            </div>
          </div>

          {/* Action Bar (View Switcher, Reshuffle, Audio) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Host Screen / Player View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setHostMode("player")}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  hostMode === "player" ? "bg-[#801818] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>มุมมองกระดาน</span>
              </button>
              <button
                onClick={() => setHostMode("screen")}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  hostMode === "screen" ? "bg-[#002D62] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>หน้าจอใหญ่ (Host Screen)</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-amber-50 text-amber-700 border-amber-300"
                  : "bg-slate-100 text-slate-400 border-slate-200"
              }`}
              title={soundEnabled ? "ปิดเสียงเอฟเฟกต์" : "เปิดเสียงเอฟเฟกต์"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reshuffle Button */}
            <button
              onClick={handleReshuffleBoard}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>สุ่มกระดานใหม่</span>
            </button>

            {/* Primary Action: Draw Question */}
            <button
              onClick={handleDrawQuestion}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#801818] to-[#A02020] hover:from-[#600C0C] hover:to-[#801818] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Dices className="w-4 h-4 text-[#F5B800]" />
              <span>สุ่มจับการ์ดคำถาม (พี่ M-Guide)</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">คะแนนรวม</p>
              <p className="text-lg sm:text-xl font-bold text-[#801818]">{score.toLocaleString()} แต้ม</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">คำถามตอบถูก</p>
              <p className="text-lg sm:text-xl font-bold text-slate-800">
                {correctAnswers} / {questionsAnswered}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">จำนวนแถวบิงโก</p>
              <p className="text-lg sm:text-xl font-bold text-rose-600">
                {completedLines.length} / 10 แถว
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">เวลาที่เล่น</p>
              <p className="text-lg sm:text-xl font-bold text-[#002D62]">{formatTimer(secondsElapsed)} นาที</p>
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. BINGO BANNER EFFECT (When Line Completed) */}
      {/* ==================================================================== */}
      {showBingoBanner && (
        <div className="mb-6 bg-gradient-to-r from-[#F5B800] via-[#801818] to-[#002D62] p-1 rounded-3xl shadow-xl animate-bounce">
          <div className="bg-white rounded-[22px] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Trophy className="w-7 h-7 animate-spin" />
              </div>
              <div>
                <span className="bg-[#801818] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  BINGO WINNER!
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  🎉 ยินดีด้วย! สำเร็จสายบิงโก {completedLines[completedLines.length - 1]?.label || ""}
                </h3>
                <p className="text-xs text-slate-600">
                  รับคะแนนโบนัส +500 แต้ม! สะสมสายบิงโกให้ครบทั้งกระดานเพื่อพิชิตคะแนนสูงสุด
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBingoBanner(false)}
              className="bg-[#801818] hover:bg-[#600C0C] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              เล่นต่อเลย!
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. MAIN GAME CONTENT (HOST DISPLAY SCREEN vs PLAYER BOARD) */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: 4x4 Bingo Board Canvas (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Board Container Card */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            {/* Header info of the board */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#801818] animate-ping" />
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  ตารางบิงโก 4x4 (คลิกช่องเพื่อดูความรู้หรือตอบคำถาม)
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>มาร์กแล้ว {boardTiles.filter((t) => t.isMarked).length}/16 ช่อง</span>
              </div>
            </div>

            {/* 4x4 Bingo Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
              {boardTiles.map((tile, idx) => {
                const categoryStyle = getCategoryStyle(tile.category);
                const isRecentlyHighlighted = tile.isHighlighted;
                const isInLine = tile.inWinningLine;

                return (
                  <button
                    key={tile.id}
                    onClick={() => handleTileClick(tile)}
                    className={`relative text-left p-3 sm:p-3.5 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between min-h-[110px] sm:min-h-[125px] cursor-pointer group select-none ${
                      tile.isMarked
                        ? isInLine
                          ? "bg-gradient-to-br from-amber-50 to-rose-50 border-amber-400 shadow-md ring-2 ring-amber-300 transform scale-[1.02]"
                          : "bg-emerald-50/80 border-emerald-400 text-slate-800 shadow-sm"
                        : "bg-white border-slate-200 hover:border-[#801818]/40 hover:bg-slate-50/60 shadow-xs"
                    } ${isRecentlyHighlighted ? "ring-4 ring-[#F5B800] animate-pulse" : ""}`}
                  >
                    {/* Top Row: Category Tag & Icon */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryStyle.bg}`}
                      >
                        {categoryStyle.label}
                      </span>

                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          tile.isMarked ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {tile.isMarked ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          renderTileIcon(tile.iconName, "w-3.5 h-3.5")
                        )}
                      </div>
                    </div>

                    {/* Middle: Keyword Title */}
                    <div className="my-1.5">
                      <h3
                        className={`text-xs sm:text-sm font-bold leading-tight ${
                          tile.isMarked ? "text-slate-900" : "text-slate-800 group-hover:text-[#801818]"
                        }`}
                      >
                        {tile.keyword}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                        {tile.shortDesc}
                      </p>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 w-full">
                      <span className="font-mono">#{idx + 1}</span>
                      <span className="text-[9px] font-semibold text-slate-500">
                        {tile.isMarked ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> ปลดล็อก
                          </span>
                        ) : (
                          <span className="group-hover:text-[#801818] transition-colors">คลิกทาย ›</span>
                        )}
                      </span>
                    </div>

                    {/* Winning Glow Overlay */}
                    {isInLine && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F5B800] rounded-full border border-white flex items-center justify-center text-[8px] font-black text-slate-900 shadow">
                        ★
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Board Legend */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> ชีววิทยา
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> เคมีสีย้อม
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> แปรรูป
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> ชุมชนสบปราบ
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                *สร้างสายบิงโกได้ทั้งแนวนอน แนวตั้ง และแนวทแยง (รวม 10 แบบ)
              </span>
            </div>
          </div>

          {/* Winning Lines Checklist */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800">สายบิงโกที่ทำสำเร็จ ({completedLines.length}/10)</h3>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                โบนัสสายละ +500 แต้ม
              </span>
            </div>

            {completedLines.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl text-center">
                ยังไม่มีสายบิงโกต่อเนื่อง ตอบคำถามเพื่อมาร์กช่องให้ครบ 4 ช่องในแนวเดียวกัน!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {completedLines.map((line, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{line.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Host Mascot & Classroom Dashboard (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Host M-Guide Stage Card */}
          <div className="bg-gradient-to-br from-[#002D62] via-[#0A2E4D] to-[#801818] rounded-3xl p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  BINGO HOST ON STAGE
                </span>
              </div>
              <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                สดจากสบปราบ
              </span>
            </div>

            {/* Mascot Visual Display */}
            <div className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-sm relative">
              <div className="w-32 h-36 relative flex items-center justify-center">
                <img
                  src={`/assets/characters/prof-mahidol/${hostEmotion}.svg`}
                  alt="พี่ M-Guide"
                  className="w-full h-full object-contain filter drop-shadow-md transform transition-all duration-300 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const p = e.currentTarget.parentElement;
                    if (p && !p.querySelector(".host-fallback")) {
                      const div = document.createElement("div");
                      div.className = "host-fallback text-5xl flex items-center justify-center";
                      div.innerText = "👨‍🏫🌾";
                      p.appendChild(div);
                    }
                  }}
                />
              </div>

              <div className="text-center mt-2">
                <h4 className="font-bold text-sm text-white">พี่ M-Guide (อาจารย์มหิดล)</h4>
                <p className="text-[11px] text-amber-200">พิธีกรห้องเรียนรู้ครั่งสบปราบ</p>
              </div>
            </div>

            {/* Host Live Message */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3 text-xs leading-relaxed text-slate-200">
              <span className="font-bold text-amber-300">💬 พี่ M-Guide กล่าว: </span>
              {completedLines.length > 0
                ? `เก่งมากครับ! ปลดล็อกบิงโกไปแล้ว ${completedLines.length} สาย สู้ต่อเพื่อสะสมคะแนนสูงสุด!`
                : streak > 1
                ? `ตอบถูกต่อเนื่อง ${streak} ข้อแล้ว! ลุยต่อเลย ช่องบิงโกใกล้เต็มแล้วครับ`
                : "กดปุ่ม 'สุ่มจับการ์ดคำถาม' เพื่อตอบคำถามและปลดล็อกช่องบนกระดานให้ครบ 4 ช่องต่อกัน!"}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleDrawQuestion}
              className="w-full bg-[#F5B800] hover:bg-amber-400 text-[#002D62] font-bold py-3 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Dices className="w-4 h-4" />
              <span>จับการ์ดคำถามรอบถัดไป</span>
            </button>
          </div>

          {/* Leaderboard Card & Score Submission */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#801818]" />
                <h3 className="font-bold text-slate-900 text-sm">ตารางคะแนน (Leaderboard)</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                ประจำวันนี้
              </span>
            </div>

            {/* Input Team Name & Save Button */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <label className="text-[11px] font-semibold text-slate-600 block">
                บันทึกคะแนนในนามกลุ่ม / ทีม:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="กรอกชื่อทีมของคุณ..."
                  disabled={isSavedToLeaderboard}
                  className="grow bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#801818]"
                />
                <button
                  onClick={handleSaveScore}
                  disabled={isSavedToLeaderboard || score === 0}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    isSavedToLeaderboard
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-default"
                      : "bg-[#801818] hover:bg-[#600C0C] text-white"
                  }`}
                >
                  {isSavedToLeaderboard ? "บันทึกแล้ว" : "บันทึก"}
                </button>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                    idx === 0
                      ? "bg-amber-50/70 border-amber-200 text-amber-900 font-semibold"
                      : "bg-slate-50 border-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        idx === 0
                          ? "bg-amber-400 text-amber-950"
                          : idx === 1
                          ? "bg-slate-300 text-slate-800"
                          : idx === 2
                          ? "bg-amber-700 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[130px]">{entry.teamName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">{entry.lines} แถว</span>
                    <span className="font-bold text-[#801818] font-mono">{entry.score} pt</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 text-center">
              *คะแนนคำนวณจากความเร็ว ความแม่นยำ และแถวบิงโก
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. TILE INSPECTION MODAL (When clicking a marked or learning tile) */}
      {/* ==================================================================== */}
      {inspectTile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setInspectTile(null)}
        >
          <div
            className="bg-white border-2 border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#801818]/10 text-[#801818] flex items-center justify-center">
                  {renderTileIcon(inspectTile.iconName, "w-4 h-4")}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{inspectTile.keyword}</h3>
                  <span className="text-[10px] text-slate-400">{getCategoryStyle(inspectTile.category).label}</span>
                </div>
              </div>
              <button
                onClick={() => setInspectTile(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#801818] uppercase tracking-wider">💡 ความรู้ประจำช่อง:</p>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                {inspectTile.fact}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                สถานะ:{" "}
                <span className={inspectTile.isMarked ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                  {inspectTile.isMarked ? "✓ ปลดล็อกเรียบร้อย" : "ยังไม่ได้ปลดล็อก"}
                </span>
              </span>
              <button
                onClick={() => setInspectTile(null)}
                className="bg-[#801818] hover:bg-[#600C0C] text-white px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                รับทราบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. POPUP OVERLAY: พี่ M-Guide Host Quiz System */}
      {/* ==================================================================== */}
      <MGuidePopupOverlay
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        question={activeQuestion}
        onAnswer={handleAnswerSubmit}
        selectedOption={selectedOption}
        isAnswerChecked={isAnswerChecked}
        isCorrect={isCorrect}
        onNextQuestion={() => {
          handleDrawQuestion();
        }}
        emotion={hostEmotion}
        soundEnabled={soundEnabled}
      />
    </div>
  );
};

export default LacBingoGame;
