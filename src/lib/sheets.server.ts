const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

export const SPREADSHEET_ID = "1s12EnpAjUB2Xq_QHDzlUXbYt9kIZ-Rl7ayxIbiR2HNg";

export type RawSheet = {
  spreadsheetTitle: string;
  sheetTitle: string;
  headers: string[];
  rows: string[][];
  fetchedAt: string;
};

function keys() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error(
      "ยังไม่ได้เชื่อมต่อ Google Sheets Connector (ไม่พบคีย์การเชื่อมต่อในระบบ)",
    );
  }
  return { lovableKey, connectionKey };
}

async function gatewayGet(path: string, attempt = 0): Promise<unknown> {
  const { lovableKey, connectionKey } = keys();
  let res: Response;
  try {
    res = await fetch(`${GATEWAY}${path}`, {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connectionKey,
      },
    });
  } catch (err) {
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
      return gatewayGet(path, attempt + 1);
    }
    throw new Error(
      `เชื่อมต่อบริการ Google Sheets ไม่ได้ชั่วคราว โปรดกด "ลองเชื่อมต่ออีกครั้ง" (${String(err)})`,
    );
  }

  if (!res.ok) {
    const body = await res.text();
    console.error(`Google Sheets gateway failed [${res.status}]: ${body}`);
    // 429/5xx are transient upstream failures — retry with backoff.
    if ((res.status === 429 || res.status >= 500) && attempt < 2) {
      await new Promise((r) => setTimeout(r, 700 * 2 ** attempt));
      return gatewayGet(path, attempt + 1);
    }
    if (res.status === 403 || res.status === 404) {
      throw new Error(
        `ไม่สามารถเข้าถึงไฟล์ Google Sheets ได้ (HTTP ${res.status}) — โปรดแชร์ไฟล์ให้บัญชี Google ที่เชื่อมต่อไว้ (สิทธิ์ Viewer) หรือตั้งค่าเป็น "ทุกคนที่มีลิงก์"`,
      );
    }
    if (res.status === 429 || res.status >= 500) {
      throw new Error(
        `บริการ Google Sheets ไม่พร้อมใช้งานชั่วคราว (HTTP ${res.status}) โปรดลองอีกครั้งในอีกสักครู่`,
      );
    }
    throw new Error(`Google Sheets API error [${res.status}]: ${body}`);
  }
  return res.json();
}


export async function fetchSheet(sheetName?: string): Promise<RawSheet> {
  const meta = (await gatewayGet(
    `/spreadsheets/${SPREADSHEET_ID}?fields=properties.title,sheets.properties(title,index,gridProperties)`,
  )) as {
    properties?: { title?: string };
    sheets?: { properties?: { title?: string; index?: number } }[];
  };

  const sheetTitles = (meta.sheets ?? [])
    .map((s) => s.properties?.title)
    .filter((t): t is string => Boolean(t));
  const target = sheetName && sheetTitles.includes(sheetName) ? sheetName : sheetTitles[0];
  if (!target) throw new Error("ไม่พบชีตข้อมูลในไฟล์ Google Sheets");

  const range = `'${target.replace(/'/g, "''")}'!A1:ZZ20000`;
  const values = (await gatewayGet(
    `/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueRenderOption=FORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`,
  )) as { values?: string[][] };

  const grid = values.values ?? [];
  const rawHeaders = (grid[0] ?? []).map((h) => String(h ?? "").trim());
  const width = rawHeaders.length;
  const headers = rawHeaders.map((h, i) => (h.length ? h : `คอลัมน์ ${i + 1}`));
  const rows = grid
    .slice(1)
    .map((r) => Array.from({ length: width }, (_, i) => String(r?.[i] ?? "").trim()))
    .filter((r) => r.some((c) => c.length > 0));

  return {
    spreadsheetTitle: meta.properties?.title ?? "Google Sheets",
    sheetTitle: target,
    headers,
    rows,
    fetchedAt: new Date().toISOString(),
  };
}
