import type { CSSProperties } from "react";

/** Ширина рабочей области листа А4 (210 мм минус поля) в миллиметрах */
export const CW = 184;
export const BASE_PT = 8.2;

/* ─────────── оценка ширины текста в Times New Roman ─────────── */

const NARROW = "ijltf!|.,'`";
const WIDE_UP = "ЖМШЩЫЮФДЬЪQMW";
const WIDE_LOW = "мжшщыюфдьъ";

function charEm(ch: string): number {
  if (ch === " ") return 0.25;
  if (ch === "." || ch === ",") return 0.25;
  if ("-–—:;«»()".includes(ch)) return 0.36;
  if (/\d/.test(ch)) return 0.5;
  if (NARROW.includes(ch)) return 0.3;
  if (WIDE_UP.includes(ch)) return 0.82;
  if (/[A-ZА-ЯЁ]/.test(ch)) return 0.7;
  if (WIDE_LOW.includes(ch)) return 0.74;
  return 0.5;
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
  const list: Seg[] = segs.some((s) => s.kind === "f" || s.kind === "x") ? segs : [...segs, X()];

  const widths = list.map((s) =>
    s.kind === "t" ? estMm(s.text) + 0.7 : s.kind === "b" ? s.w : s.kind === "f" ? s.min ?? 8 : 1
  );

  const flexIdx = list.findIndex((s) => s.kind === "f");
  if (flexIdx >= 0) {
    const rest = widths.reduce((a, b) => a + b, 0) - widths[flexIdx];
    widths[flexIdx] = Math.max(widths[flexIdx], cw - rest);
  }

  const natural = widths.reduce((a, b) => a + b, 0);
  // если содержимое не влезает — строка целиком печатается чуть меньшим кеглем,
  // пропорции сохраняются, выход за пределы листа исключён
  const scale = natural > cw ? Math.max(0.72, cw / natural) : 1;
  const pt = Math.round(BASE_PT * scale * 100) / 100;
  const cells = widths.map((w) => (w / natural) * cw);

  if (natural > cw + 1) {
    console.warn(
      `[066/у] строка сжата до ${Math.round(scale * 100)}%:`,
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

/** Легенда с выбором кода: текст становится жирным у выбранного значения */
export const code = (label: string, codeValue: string | undefined, val: string | undefined): Seg =>
  T(`${label} – ${codeValue}`, val === codeValue);

/** Таблица бланка (движение по отделениям, операции) */
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
  const total = cols.reduce((a, b) => a + b, 0);
  const pct = cols.map((w) => (w / total) * 100);
  return (
    <table className="grid">
      <colgroup>
        {pct.map((p, i) => (
          <col key={i} style={{ width: `${p}%` }} />
        ))}
      </colgroup>
      <thead>
        {head.map((r, ri) => (
          <tr key={ri}>
            {r.map((cell, ci) => {
              const o = typeof cell === "string" ? { t: cell } : cell;
              return (
                <th key={ci} rowSpan={o.r} colSpan={o.c}>
                  {o.t}
                </th>
              );
            })}
          </tr>
        ))}
        {head2?.map((r, ri) => (
          <tr key={"h2" + ri}>
            {r.map((c, ci) => (
              <th key={ci}>{c}</th>
            ))}
          </tr>
        ))}
        {nums && (
          <tr className="nums">
            {nums.map((n, i) => (
              <th key={i}>{n}</th>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} style={{ height: `${rowH}mm` }}>
            {r.map((c, ci) => (
              <td key={ci} className={ci === 0 ? "c" : undefined}>
                {c || ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
