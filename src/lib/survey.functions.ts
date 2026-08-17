export async function fetchSheet() {
  // ดึง URL จาก Environment Variable ของ Vercel
  const sheetUrl = process.env.GOOGLE_SHEET_CSV_URL;

  if (!sheetUrl) {
    throw new Error("ยังไม่ได้ตั้งค่า GOOGLE_SHEET_CSV_URL ใน Vercel Environment Variables");
  }

  const response = await fetch(sheetUrl);
  if (!response.ok) {
    throw new Error("ไม่สามารถเชื่อมต่อ Google Sheets ได้ (ตรวจสอบลิงก์สิทธิ์การเข้าถึง)");
  }

  const csvText = await response.text();

  // แยกบรรทัดและกรองบรรทัดว่าง
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) {
    return {
      spreadsheetTitle: "แบบสอบถามความพึงพอใจ",
      sheetTitle: "Form Responses 1",
      headers: [],
      rows: [],
      fetchedAt: new Date().toISOString(),
    };
  }

  // ฟังก์ชันแยก Column สำหรับไฟล์ CSV (รองรับกรณีมีเครื่องหมาย , ในข้อความ)
  const parseRow = (text: string) => {
    return text.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((cell) => cell.replace(/^"|"$/g, "").trim());
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(parseRow);

  return {
    spreadsheetTitle: "แบบสอบถามความพึงพอใจ",
    sheetTitle: "Form Responses 1",
    headers,
    rows,
    fetchedAt: new Date().toISOString(),
  };
}
