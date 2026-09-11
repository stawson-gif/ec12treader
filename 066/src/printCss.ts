// Единый CSS бланка: используется в предпросмотре, при печати и при экспорте в HTML/DOCX.
// Вёрстка детерминированная: каждая строка — таблица фиксированной ширины 100%,
// поэтому контент физически не может выйти за пределы листа А4.
export const formCss = `
.frm { font-family: "Times New Roman", "Liberation Serif", Times, serif; color: #000; }

.frm .sheet {
  position: relative;
  box-sizing: border-box;
  width: 210mm;
  height: 296mm;
  padding: 7mm 13mm 4mm 13mm;
  background: #fff;
  font-size: 8.2pt;
  line-height: 1.15;
  overflow: hidden;
}
.frm .sheet + .sheet { page-break-before: always; break-before: page; }

/* ── строка бланка ── */
.frm table.ln {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: inherit;
}
.frm table.ln td {
  padding: 0;
  border: none;
  vertical-align: bottom;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
}
.frm table.ln td.b {
  border-bottom: 0.3mm solid #000;
  text-align: center;
}
.frm .sel { font-weight: 700; text-decoration: underline; }

.frm .rule { border-top: 0.5mm solid #000; }

/* ── шапка листа ── */
.frm .hdr { margin-left: 41%; width: 59%; text-align: center; }
.frm .hdr > div { height: 3.9mm; line-height: 3.9mm; }

.frm .top { display: flex; margin-top: 3mm; }
.frm .top .l { width: 57%; }
.frm .top .r { width: 43%; }
.frm .top .tx { height: 3.6mm; line-height: 3.6mm; }
.frm .top .bl { height: 4.4mm; border-bottom: 0.3mm solid #000; }
.frm .und {
  display: inline-block;
  min-width: 26mm;
  border-bottom: 0.3mm solid #000;
  text-align: center;
  height: 3.6mm;
  line-height: 3.6mm;
  overflow: hidden;
  vertical-align: bottom;
}

.frm .title { text-align: center; font-weight: 700; margin: 2.6mm 0 2.2mm; }
.frm .title > div { height: 3.9mm; line-height: 3.9mm; }

/* ── таблицы бланка ── */
.frm table.grid {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 6.9pt;
  line-height: 1.08;
}
.frm table.grid th, .frm table.grid td {
  border: 0.35mm solid #000;
  padding: 0.4mm 0.6mm;
  vertical-align: middle;
  text-align: center;
  overflow: hidden;
}
.frm table.grid th { font-weight: 700; white-space: pre-line; }
.frm table.grid td { text-align: left; white-space: normal; }
.frm table.grid td.c { text-align: center; }
.frm table.grid tr.nums th { border-top: 0.7mm solid #000; }
.frm .cap { height: 3.7mm; line-height: 3.7mm; margin-top: 1mm; }

.frm .sig-name { height: 4.6mm; line-height: 4.6mm; }
`;
