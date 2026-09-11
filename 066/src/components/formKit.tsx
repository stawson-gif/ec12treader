import type { CSSProperties } from "react";

/** Ширина рабочей области листа А4 (210 мм минус поля) в миллиметрах */
export const CW = 184;
export const BASE_PT = 8.2;

/* ─────────── оценка ширины текста в Times New Roman ─────────── */

const NARROW = "ijltf!|'`";
const WIDE_UP = "ЖМШЩЫЮФДQM";
const WIDE_LOW = "жшщыюфм";
const PUNCT = "-–:;«»()/";

function charEm(ch: string): number {
  if (ch === " ") return 0.25;
  if (ch === "." || ch === ",") return 0.25;
  if (ch === "—" || ch === "–") return 0.55;
  if (PUNCT.includes(ch)) return 0.34;
  if (/\d/.test(ch)) return 0.5;
  if (NARROW.includes(ch)) return 0.3;
  if (WIDE_UP.includes(ch)) return 0.84;
  if (WIDE_LOW.includes(ch)) return 0.72;
  if (/[A-ZQWX]/.test(ch)) return 0.72;
  if (/[A-ZА-ЯЁ]/.test(ch)) return 0.68;
  if (/[mwьъд]/.test(ch)) return 0.5;
  return 0.49;
}

/** Приблизительная ширина строки в мм при заданном кегле */
export function estMm(text: string, pt = BASE_PT): number {
  let sum = 0;
  for (const ch of String(text ?? "")) sum += charEm(ch);
  return sum * pt * 0.352778;
}

/* ─────────── сегменты строки ─────────── */

export type Seg =
  | { kind: "t"; text: string; sel?: boolean }
  | { kind: "b"; w: number; v?: string }
  | { kind: "f"; min?: number; v?: string }
  | { kind: "x" };

/** статичный текст (можно пометить как выбранный — будет жирным с подчёркиванием) */
export const T = (text: string, sel = false): Seg => ({ kind: "t", text, sel });
/** пропечатанная линия фиксированной ширины (мм) */
export const B = (w: number, v?: string): Seg => ({ kind: "b", w, v });
/** пропечатанная линия, занимающая всё оставшееся место */
export const F = (v?: string, min = 8): Seg => ({ kind: "f", min, v });
/** пустой заполнитель без линии */
export const X = (): Seg => ({ kind: "x" });

/** Подбор кегля, чтобы значение поместилось в ячейку фиксированной ширины */
function fitStyle(v: string | undefined, cellW: number, basePt: number): CSSProperties {
  if (!v) return {};
  const need = estMm(v, basePt) + 1.4;
  if (need <= cellW) return {};
  const pt = Math.max(4.2, basePt * (cellW / need));
  return { fontSize: `${Math.round(pt * 10) / 10}pt` };
}

export type LineProps = {
  segs: Seg[];
  /** высота строки в мм */
  h?: number;
  /** ширина контейнера в мм (для строк внутри колонок) */
  cw?: number;
  cls?: string;
  style?: CSSProperties;
  dbg?: string;
};

/**
 * Строка бланка. Реализована таблицей с fixed-раскладкой и шириной колонок
 * в процентах, поэтому суммарная ширина всегда равна ширине листа —
 * содержимое не может выйти за пределы страницы.
 */
export function Line({ segs, h = 3.8, cw = CW, cls = "", style }: LineProps) {
  const list: Seg[] = [...segs];
  // гарантируем ячейку, которая примет свободное место
  if (!list.some((s) => s.kind === "f" || s.kind === "x")) list.push(X());

  const PAD = 0.3;
  let widths = list.map((s) =>
    s.kind === "t" ? estMm(s.text) + PAD : s.kind === "b" ? s.w : s.kind === "f" ? Math.max(6, s.min ?? 8) : 0.6
  );

  // «резиновая» ячейка: гибкая линия (f) либо хвостовой отступ (x)
  const flexIdx = list.findIndex((s) => s.kind === "f");
  const spaceIdx = flexIdx >= 0 ? flexIdx : list.findIndex((s) => s.kind === "x");

  let sum = widths.reduce((a, b) => a + b, 0);
  if (spaceIdx >= 0) {
    // свободное место отдаём ей целиком — фиксированные графы сохраняют
    // заданную ширину в миллиметрах и никогда не «плывут»
    const slack = cw - (sum - widths[spaceIdx]);
    widths[spaceIdx] = Math.max(widths[spaceIdx], slack);
    sum = widths.reduce((a, b) => a + b, 0);
  }

  // если строка всё же не влезает — печатаем её чуть меньшим кеглем
  let pt = BASE_PT;
  if (sum > cw + 0.2) {
    const k = Math.max(0.8, cw / sum);
    widths = widths.map((w) => w * k);
    pt = Math.round(BASE_PT * k * 100) / 100;
  }
  const cells = widths;

  if (sum > cw + 1) {
    console.warn(
      `[066/у] строка сжата до ${Math.round((pt / BASE_PT) * 100)}%:`,
      list.map((s) => (s.kind === "t" ? s.text : s.kind)).join("|")
    );
  }

  return (
    <table className={"ln " + cls} style={{ ...style, fontSize: `${pt}pt` }}>
      <colgroup>
        {cells.map((w, i) => (
          <col key={i} style={{ width: `${(w / cw) * 100}%` }} />
        ))}
      </colgroup>
      <tbody>
        <tr>
          {list.map((s, i) => {
            const base: CSSProperties = { height: `var(--lh, ${h}mm)`, lineHeight: `var(--lh, ${h}mm)` };
            if (s.kind === "t") {
              return (
                <td key={i} className={"tx" + (s.sel ? " sel" : "")} style={base}>
                  {s.text}
                </td>
              );
            }
            if (s.kind === "x") {
              return <td key={i} className="sp" style={base} />;
            }
            return (
              <td key={i} className="b" style={{ ...base, ...fitStyle(s.v, cells[i], pt) }}>
                {s.v && String(s.v).trim() ? s.v : "\u00A0"}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
}

/** Разделительная горизонтальная линия (как в бумажной форме) */
export const Rule = ({ h = 1.4 }: { h?: number }) => <div className="rule" style={{ height: `${h}mm` }} />;

/** Промежуток фиксированной высоты в мм */
export const Gap = ({ h = 2 }: { h?: number }) => <div style={{ height: `${h}mm` }} />;

/** Легенда с выбором кода: текст становится жирным у выбранного значения.
 *  Формат «название – 1» (как в большинстве граф бланка) */
export const code = (label: string, codeValue: string | undefined, val: string | undefined): Seg =>
  T(`${label} – ${codeValue}`, val === codeValue);

/** Формат «1 – название» (графа «Общее образование») */
export const codeN = (codeValue: string | undefined, label: string, val: string | undefined): Seg =>
  T(`${codeValue} – ${label}`, val === codeValue);

/** Формат «название – N» без добавления кода (код уже входит в label) */
export const codeRaw = (label: string, codeValue: string | undefined, val: string | undefined): Seg =>
  T(label, val === codeValue);

/** Таблица бланка (движение по отделениям, операции).
 *  Ширина задаётся инлайн на КАЖДОЙ ячейке — это работает при любой
 *  раскладке браузера и при печати, а не только при table-layout: fixed. */
export function Grid({
  cols,
  head,
  head2,
  nums,
  rows,
  rowH = 6,
}: {
  cols: number[];
  head: (string | { t: string; r?: number; c?: number })[][];
  head2?: string[][];
  nums?: string[];
  rows: string[][];
  rowH?: number;
}) {
  // Ширины заданы в миллиметрах и в сумме равны рабочей ширине листа (184 мм).
  // Абсолютные единицы не округляются браузером, поэтому колонки не «плывут».
  const total = cols.reduce((a, b) => a + b, 0);

  /** ширина в мм, начиная с колонки start и занимая span колонок */
  const wOf = (start: number, span = 1): string => {
    let s = 0;
    for (let k = start; k < start + span; k++) s += cols[k] ?? 0;
    return `${Math.round(s * 100) / 100}mm`;
  };

  // Полноценная раскладка заголовка: колонки распределяются с учётом
  // rowSpan/colSpan, как это делает браузер. Если ячейка объединена по
  // вертикали, в следующей строке её колонка пропускается.
  const allRows: { t: string; r?: number; c?: number }[][] = [
    ...head.map((r) => r.map((c) => (typeof c === "string" ? { t: c } : c))),
    ...(head2 ?? []).map((r) => r.map((t) => ({ t }))),
  ];

  const occupied = new Map<number, number>(); // колонка → сколько строк ещё занято
  const rowsSpec = allRows.map((r) => {
    let cursor = 0;
    const cells = r.map((o, i) => {
      const span = o.c ?? 1;
      while ((occupied.get(cursor) ?? 0) > 0) cursor++;
      const start = cursor;
      for (let k = start; k < start + span; k++) occupied.set(k, o.r ?? 1);
      cursor = start + span;
      return { ...o, start, span, key: i };
    });
    for (const [k, v] of Array.from(occupied.entries())) {
      if (v - 1 <= 0) occupied.delete(k);
      else occupied.set(k, v - 1);
    }
    return cells;
  });

  // Таблица имеет точную ширину рабочей области листа. Ширины указаны и в
  // colgroup, и на ячейках — одинаково, поэтому любой движок (экран, печать,
  // Word) разрешает их одинаково.
  const tableStyle: CSSProperties = { width: `${total}mm`, maxWidth: "100%", tableLayout: "fixed" };

  return (
    <table className="grid" style={tableStyle}>
      <colgroup>
        {cols.map((w, i) => (
          <col key={i} style={{ width: `${w}mm` }} />
        ))}
      </colgroup>
      <thead>
        {rowsSpec.map((row, ri) => (
          <tr key={ri}>
            {row.map((o) => (
              <th key={o.key} rowSpan={o.r} colSpan={o.c} style={{ width: wOf(o.start, o.span) }}>
                {o.t}
              </th>
            ))}
          </tr>
        ))}
        {nums && (
          <tr className="nums">
            {nums.map((n, i) => (
              <th key={i} style={{ width: wOf(i, 1) }}>
                {n}
              </th>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} style={{ height: `${rowH}mm` }}>
            {r.map((c, ci) => (
              <td key={ci} className={ci === 0 ? "c" : undefined} style={{ width: wOf(ci, 1) }}>
                {c || ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
