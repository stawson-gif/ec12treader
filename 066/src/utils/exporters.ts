import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PrintForm from "../components/PrintForm";
import { formCss } from "../printCss";
import type { FormState } from "../data/model";

export const FORM_TITLE = "Статистическая карта 066-у";

/** Сериализация бланка в HTML-разметку (тот же компонент, что и в предпросмотре) */
export function markupOf(d: FormState): string {
  const html = renderToStaticMarkup(createElement(PrintForm, { d }));
  // Word не понимает CSS-переменные — подставляем конкретные значения
  return html.replace(/var\(--lh,\s*([\d.]+mm)\)/g, "$1");
}

function safeName(d: FormState) {
  const fio = (d.patientName || "пациент").trim().replace(/\s+/g, "_");
  return `066у_${fio}`.replace(/[^\wа-яА-ЯёЁ\-_.]/g, "");
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob(["\ufeff", content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Автономный HTML: открывается в любом браузере, печатается в PDF ровно на 2 листах А4 */
export function exportHtml(d: FormState) {
  const doc = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${FORM_TITLE} — ${d.patientName || ""}</title>
<style>
@page { size: A4 portrait; margin: 0; }
html, body { margin:0; padding:0; background:#e9edf4; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
body { padding:14px 6px; }
.frm .sheet { margin:0 auto 12px; box-shadow:0 8px 28px rgba(15,23,42,.18); }
@media print { body { padding:0; background:#fff; } .frm .sheet { box-shadow:none; margin:0; } }
${formCss}
</style></head>
<body>${markupOf(d)}</body></html>`;
  download(`${safeName(d)}.html`, doc, "text/html");
}

/** Word (.doc): строки бланка уже свёрстаны таблицами, Word понимает их нативно */
export function exportDoc(d: FormState) {
  const css = `${formCss}
.frm { font-size: 8.6pt; }
.frm table.ln { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
.frm table.ln td { padding: 0; }
.frm table.grid { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
@page WordSection1 { size: 210mm 297mm; margin: 7mm 13mm 4mm 13mm; mso-page-orientation: portrait; }
div.WordSection1 { page: WordSection1; }
.frm .sheet { width: auto; height: auto; min-height: auto; padding: 0; overflow: visible; }
.frm .sheet + .sheet { page-break-before: always; }
`;
  const doc = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>${FORM_TITLE} — ${d.patientName || ""}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
<style>${css}</style></head>
<body><div class="WordSection1"><div class="frm">${markupOf(d)}</div></div></body></html>`;
  download(`${safeName(d)}.doc`, doc, "application/msword");
}

/**
 * Офлайн-копия приложения: сохраняет саму программу одним HTML-файлом.
 * Работает без интернета — достаточно открыть файл двойным щелчком.
 */
export async function downloadStandalone(): Promise<boolean> {
  let html = "";
  try {
    const res = await fetch(window.location.href, { cache: "no-store" });
    if (res.ok) {
      html = await res.text();
    }
  } catch {
    /* file:// — fetch недоступен, берём текущий DOM */
  }
  if (!html || !/<script/i.test(html)) {
    html = "<!doctype html>\n" + document.documentElement.outerHTML;
  }
  if (!html || html.length < 5000) return false;
  download("066у-приложение.html", html, "text/html");
  return true;
}

export function exportJson(d: FormState) {
  const payload = { form: "066/y", version: 2, savedAt: new Date().toISOString(), data: d };
  download(`${safeName(d)}.json`, JSON.stringify(payload, null, 2), "application/json");
}

export function parseJson(text: string): FormState | null {
  try {
    const p = JSON.parse(text);
    const data = p?.data ?? p;
    if (!data || typeof data !== "object") return null;
    return data as FormState;
  } catch {
    return null;
  }
}

/** Печать / сохранение в PDF средствами браузера */
export function printNow() {
  window.print();
}
