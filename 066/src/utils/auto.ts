import { MONTHS, type FormState, emptyDept, emptyOp } from "../data/model";



/** «14» + «марта» + «1978» → Date | null */
export function toDate(d?: string, m?: string, y?: string): Date | null {
  const day = parseInt((d || "").replace(/\D/g, ""), 10);
  const year = parseInt((y || "").replace(/\D/g, ""), 10);
  if (!day || !year) return null;
  const mm = (MONTHS.findIndex((x) => x.toLowerCase().startsWith((m || "").toLowerCase().slice(0, 3))) + 1);
  const month = m && /^\d+$/.test(m.trim()) ? parseInt(m, 10) : mm;
  if (!month || month < 1 || month > 12) return null;
  return new Date(year, month - 1, day);
}

/** ISO-строка из частей даты */
export function isoOf(d?: string, m?: string, y?: string): string {
  const dt = toDate(d, m, y);
  if (!dt) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

/** Разбор ISO-даты в части */
export function splitIso(iso: string): { d: string; m: string; y: string } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return null;
  return { d: String(parseInt(m[3], 10)), m: MONTHS[parseInt(m[2], 10) - 1] || "", y: m[1] };
}

export function daysBetween(a: Date | null, b: Date | null): string {
  if (!a || !b) return "";
  const ms = b.getTime() - a.getTime();
  if (Number.isNaN(ms) || ms < 0) return "";
  return String(Math.max(1, Math.round(ms / 86400000)));
}

/** Автоматическое заполнение производных граф */
export function enrich(s: FormState): FormState {
  const base = normalizeRows(s);
  const next: FormState = { ...base, departments: [...base.departments], operations: [...base.operations] };

  // Общее количество дней: поступление → выписка (или смерть)
  const start = toDate(s.admDay, s.admMonth, s.admYear);
  const end =
    toDate(s.disDay, s.disMonth, s.disYear) || toDate(s.deathDay, s.deathMonth, s.deathYear);
  if (!next.totalDays) next.totalDays = daysBetween(start, end);

  // Дни по каждому отделению
  next.departments = next.departments.map((r) =>
    r.days ? r : { ...r, days: daysBetween(toDate(...parseShort(r.admit)), toDate(...parseShort(r.discharge))) }
  );
  return next;
}

/** «03.02.2026 12:20» | «03.02.2026» | ISO → [d, m, y] */
function parseShort(v: string): [string, string, string] {
  const t = (v || "").trim();
  let m = /^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})/.exec(t);
  if (m) return [String(parseInt(m[1], 10)), MONTHS[parseInt(m[2], 10) - 1] || "", m[3].length === 2 ? "20" + m[3] : m[3]];
  m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t);
  if (m) return [String(parseInt(m[3], 10)), MONTHS[parseInt(m[2], 10) - 1] || "", m[1]];
  return ["", "", ""];
}

/** Гарантирует наличие пустых строк в таблицах (как в бумажном бланке) */
export function normalizeRows(s: FormState): FormState {
  const departments = [...s.departments];
  while (departments.length < 2) departments.push(emptyDept());
  const operations = [...s.operations];
  while (operations.length < 1) operations.push(emptyOp());
  return { ...s, departments, operations };
}

export const todayIso = () => new Date().toISOString().slice(0, 10);
