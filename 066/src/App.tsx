import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import EntryPanel from "./components/EntryPanel";
import ErrorBoundary from "./components/ErrorBoundary";
import { Sheet1, Sheet2 } from "./components/PrintForm";
import { readRaw, writeRaw } from "./utils/storage";
import { FIELD_IDS, demoState, emptyState, type FormState } from "./data/model";
import { enrich, normalizeRows } from "./utils/auto";
import { downloadStandalone, exportDoc, exportHtml, exportJson, parseJson, printNow } from "./utils/exporters";
import { formCss } from "./printCss";

const LS_KEY = "form066y.v1";

function load(): FormState | null {
  const raw = readRaw(LS_KEY);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    return p?.data ?? p;
  } catch {
    return null;
  }
}

/** Лист А4 с масштабированием под ширину панели */
function Scaled({ children, cls }: { children: ReactNode; cls?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(1120);
  const [w, setW] = useState(794);
  const s = Math.min(1, (w - 8) / 794);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setH(el.offsetHeight || 1120);
    if (host.current) setW(host.current.offsetWidth || 794);
    const ro = new ResizeObserver(() => {
      if (ref.current) setH(ref.current.offsetHeight || 1120);
      if (host.current) setW(host.current.offsetWidth || 794);
    });
    if (ref.current) ro.observe(ref.current);
    if (host.current) ro.observe(host.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={host} className={"w-full " + (cls ?? "")}>
      <div className="sheet-wrap relative mx-auto" style={{ width: 794 * s, height: h * s }}>
        <div
          ref={ref}
          className="print-scale absolute left-0 top-0 origin-top-left shadow-[0_10px_36px_rgba(15,23,42,0.18)]"
          style={{ width: 794, transform: `scale(${s})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [s, setS] = useState<FormState>(() => normalizeRows(load() ?? emptyState()));
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [page, setPage] = useState<1 | 2>(1);
  const [toast, setToast] = useState("");
  const [scan, setScan] = useState("");
  const [scanOpen, setScanOpen] = useState(true);

  useEffect(() => {
    writeRaw(LS_KEY, JSON.stringify({ form: "066/y", data: s }));
  }, [s]);

  // приложение запустилось — убираем загрузочную заглушку из index.html
  useEffect(() => {
    const ready = (window as unknown as { __form066Ready?: () => void }).__form066Ready;
    if (typeof ready === "function") ready();
  }, []);

  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(""), 2200);
  };

  const set = (id: string, v: string) => setS((p) => enrich(normalizeRows({ ...p, [id]: v })));

  const setRow = (kind: "departments" | "operations", i: number, key: string, v: string) =>
    setS((p) => {
      const arr: Record<string, string>[] = [...(p[kind] ?? [])];
      while (arr.length <= i) arr.push(kind === "departments" ? {} : {});
      arr[i] = { ...arr[i], [key]: v };
      return enrich(normalizeRows({ ...p, [kind]: arr }));
    });

  const filled = FIELD_IDS.filter((id) => String(s[id] ?? "").trim()).length;
  const pct = Math.round((filled / FIELD_IDS.length) * 100);

  const doImport = (file: File) => {
    const fr = new FileReader();
    fr.onload = () => {
      const data = parseJson(String(fr.result));
      if (data) {
        setS(normalizeRows(data));
        flash("Данные загружены из файла");
      } else flash("Не удалось прочитать файл");
    };
    fr.readAsText(file);
  };

  const copyDiagnosis = () => {
    const map: Record<string, string> = {
      clinMain: "preMain",
      clinMainIcd: "preMainIcd",
      clinComp: "preComp",
      clinCompIcd: "preCompIcd",
      clinExt: "preExt",
      clinExtIcd: "preExtIcd",
      clinConc: "preConc",
      clinConcIcd: "preConcIcd",
      clinExtra: "preExtra",
    };
    setS((p) => {
      const next = { ...p };
      Object.entries(map).forEach(([to, from]) => {
        if (!next[to] && next[from]) next[to] = next[from];
      });
      return next;
    });
    flash("Предварительный диагноз перенесён в клинический");
  };

  const btn =
    "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition disabled:opacity-40";

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white">
      <style dangerouslySetInnerHTML={{ __html: formCss }} />

      {/* ── Верхняя панель ── */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg text-white shadow-md">
              🏥
            </div>
            <div>
              <h1 className="text-base leading-tight font-bold">Учётная форма № 066/у</h1>
              <p className="text-[11px] text-slate-500">
                Статистическая карта выбывшего из стационара · приказ МЗ РФ от 05.08.2022 № 530н
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <div className="h-2 w-36 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-semibold text-slate-500">заполнено {pct}%</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button className={`${btn} bg-slate-900 text-white hover:bg-slate-700`} onClick={printNow} title="Печать или сохранение в PDF">
              🖨️ Печать / PDF
            </button>
            <button className={`${btn} border border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-600`} onClick={() => { exportHtml(s); flash("HTML-файл бланка сохранён"); }}>
              ⬇️ HTML
            </button>
            <button className={`${btn} border border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-600`} onClick={() => { exportDoc(s); flash("Документ Word сохранён"); }}>
              📄 Word
            </button>
            <button className={`${btn} border border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-600`} onClick={() => exportJson(s)}>
              💾 JSON
            </button>
            <button
              className={`${btn} border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
              title="Сохранить всё приложение одним HTML-файлом — работает без интернета"
              onClick={async () => {
                const ok = await downloadStandalone();
                flash(ok ? "Офлайн-копия приложения сохранена" : "Не удалось сохранить копию");
              }}
            >
              📦 Офлайн-копия
            </button>
            <label className={`${btn} cursor-pointer border border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-600`}>
              📂 Открыть
              <input type="file" accept=".json,application/json" className="hidden" onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
            </label>
            <button className={`${btn} border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100`} onClick={() => { setS(demoState()); flash("Заполнено демонстрационными данными"); }}>
              ✨ Пример
            </button>
            <button
              className={`${btn} border border-rose-200 bg-white text-rose-600 hover:bg-rose-50`}
              onClick={() => {
                if (confirm("Очистить все поля карты?")) {
                  setS(emptyState());
                  flash("Карта очищена");
                }
              }}
            >
              ✕ Очистить
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1700px] gap-1 px-4 pb-2 xl:hidden">
          {(["form", "preview"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === t ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              {t === "form" ? "Ввод данных" : "Бланк 066/у"}
            </button>
          ))}
        </div>
      </header>

      {/* ── Рабочая область ── */}
      <main className="mx-auto grid max-w-[1700px] grid-cols-1 gap-5 p-4 xl:grid-cols-[minmax(430px,1fr)_minmax(0,1.05fr)]">
        <div className={`no-print ${tab === "form" ? "" : "hidden xl:block"}`}>
          <div className="mb-3 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <button className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100" onClick={copyDiagnosis}>
              ⇄ Перенести предварительный диагноз в клинический
            </button>
            <button className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100" onClick={() => { setS((p) => enrich({ ...p, totalDays: "" })); flash("Количество дней пересчитано"); }}>
              ∑ Пересчитать дни госпитализации
            </button>
            <label className="cursor-pointer rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
              📷 Скан-образец бланка
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const fr = new FileReader();
                  fr.onload = () => {
                    setScan(String(fr.result));
                    setScanOpen(true);
                  };
                  fr.readAsDataURL(f);
                }}
              />
            </label>
            {scan && (
              <button className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100" onClick={() => setScanOpen((v) => !v)}>
                {scanOpen ? "▲ скрыть образец" : "▼ показать образец"}
              </button>
            )}
            <span className="ml-auto self-center text-[11px] text-slate-400">автосохранение включено</span>
          </div>

          {scan && scanOpen && (
            <div className="no-print mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Образец бумажной формы — переносите данные в графы слева</span>
                <button className="text-xs text-slate-400 hover:text-rose-500" onClick={() => setScan("")}>
                  убрать
                </button>
              </div>
              <div className="max-h-[420px] overflow-auto rounded-xl bg-slate-100 p-2">
                <img src={scan} alt="Образец формы 066/у" className="mx-auto h-auto w-full max-w-[720px] rounded-lg shadow" />
              </div>
            </div>
          )}

          <EntryPanel s={s} set={set} setRow={setRow} />
        </div>

        <div className={`${tab === "preview" ? "" : "hidden xl:block"}`}>
          <div className="no-print mb-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Предпросмотр:</span>
            {([1, 2] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${page === p ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {p === 1 ? "Лист 1 — поступление и диагнозы" : "Лист 2 — отделения, исход, подписи"}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-slate-400">при печати выводятся оба листа</span>
          </div>

          <div className="print-root rounded-3xl bg-slate-200/70 p-3">
            {page === 1 ? (
              <>
                <Scaled>
                  <div className="frm">
                    <Sheet1 d={s} />
                  </div>
                </Scaled>
                {/* лист 2: скрыт на экране, попадает в печать */}
                <div className="screen-hidden print-break">
                  <div className="frm">
                    <Sheet2 d={s} />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* лист 1: скрыт на экране, идёт в печать первым */}
                <div className="screen-hidden">
                  <div className="frm">
                    <Sheet1 d={s} />
                  </div>
                </div>
                <Scaled cls="print-break">
                  <div className="frm">
                    <Sheet2 d={s} />
                  </div>
                </Scaled>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="no-print mx-auto max-w-[1700px] space-y-1 px-4 pb-8 text-[11px] leading-relaxed text-slate-400">
        <p>
          «Печать / PDF» — точная копия бланка на двух листах А4 · «HTML» — вёрстка бланка · «Word» — редактируемый
          документ · «JSON» — перенос данных между компьютерами · «📦 Офлайн-копия» — всё приложение одним файлом,
          работает без интернета.
        </p>
        <p>
          Данные хранятся только в этом браузере и никуда не отправляются. Чтобы разместить приложение на своём сайте,
          достаточно загрузить файл <code className="rounded bg-slate-200 px-1">dist/index.html</code> на любой
          статический хостинг — см. файл <code className="rounded bg-slate-200 px-1">ХОСТИНГ.md</code> в проекте.
        </p>
      </footer>

      {toast && (
        <div className="no-print fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl">{toast}</div>
      )}
    </div>
    </ErrorBoundary>
  );
}


