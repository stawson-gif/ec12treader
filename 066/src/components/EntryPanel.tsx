import { createContext, useContext, type ReactNode } from "react";
import {
  DIAG_ROWS,
  EDUCATION,
  EMPLOYMENT,
  type FieldSpec,
  type FormState,
  MARITAL,
  type OpRow,
  type Option,
  type DeptRow,
  PAYMENT,
  REFERRAL,
  SECTIONS,
  emptyDept,
  emptyOp,
} from "../data/model";
import { ICD10, parseIcd } from "../data/icd";
import { MONTHS } from "../data/model";
import { isoOf, splitIso, todayIso } from "../utils/auto";

type Ctx = { s: FormState; set: (id: string, v: string) => void; setRow: (kind: "departments" | "operations", i: number, key: string, v: string) => void };
const C = createContext<Ctx>({ s: {} as FormState, set: () => {}, setRow: () => {} });
const useC = () => useContext(C);

const inp =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const lbl = "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500";

function Card({ title, icon, children, extra }: { title: string; icon: string; children: ReactNode; extra?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <span aria-hidden>{icon}</span>
          {title}
        </h3>
        {extra}
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <span className={lbl}>{label}</span>
      {children}
      {hint && <p className="mt-1 text-[11px] leading-snug text-slate-400">{hint}</p>}
    </div>
  );
}

function TextInput({ id, label, ph, hint, big }: { id: string; label: string; ph?: string; hint?: string; big?: boolean }) {
  const { s, set } = useC();
  return (
    <Field label={label} hint={hint}>
      <textarea
        className={inp + (big ? " min-h-[64px] resize-y" : " min-h-[38px] resize-none")}
        rows={big ? 2 : 1}
        value={s[id] ?? ""}
        placeholder={ph}
        onChange={(e) => set(id, e.target.value)}
      />
    </Field>
  );
}

function CodePicker({ id, label, legend, options, otherId }: { id: string; label: string; legend: string; options: Option[]; otherId?: string }) {
  const { s, set } = useC();
  const v = s[id] ?? "";
  return (
    <div>
      <span className={lbl}>{label}</span>
      <p className="mb-1.5 text-[11px] leading-snug text-slate-400">{legend}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.code}
            type="button"
            onClick={() => set(id, v === o.code ? "" : o.code)}
            className={
              "rounded-full border px-2.5 py-1 text-xs font-medium transition " +
              (v === o.code
                ? "border-indigo-600 bg-indigo-600 text-white shadow"
                : "border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600")
            }
            title={o.label}
          >
            <b className="mr-1">{o.code}</b>
            {o.label.length > 34 ? o.label.slice(0, 32) + "…" : o.label}
          </button>
        ))}
      </div>
      {otherId && (
        <input className={inp + " mt-2"} placeholder="указать (расшифровка)" value={s[otherId] ?? ""} onChange={(e) => set(otherId, e.target.value)} />
      )}
    </div>
  );
}

const DATE_MAP: Record<string, { d: string; m: string; y: string; h?: string; mi?: string }> = {
  birth: { d: "bd", m: "bm", y: "by" },
  omsIssue: { d: "omsDay", m: "omsMonth", y: "omsYear" },
  admission: { d: "admDay", m: "admMonth", y: "admYear", h: "admHour", mi: "admMin" },
  discharge: { d: "disDay", m: "disMonth", y: "disYear", h: "disHour", mi: "disMin" },
  death: { d: "deathDay", m: "deathMonth", y: "deathYear", h: "deathHour", mi: "deathMin" },
  sickDate: { d: "sickDay", m: "sickMonth", y: "sickYear" },
  sickDupDate: { d: "sickDupDay", m: "sickDupMonth", y: "sickDupYear" },
  releaseFrom: { d: "relFromDay", m: "relFromMonth", y: "relFromYear" },
  releaseTo: { d: "relToDay", m: "relToMonth", y: "relToYear" },
  ext1From: { d: "ext1FromDay", m: "ext1FromMonth", y: "ext1FromYear" },
  ext1To: { d: "ext1ToDay", m: "ext1ToMonth", y: "ext1ToYear" },
  ext2From: { d: "ext2FromDay", m: "ext2FromMonth", y: "ext2FromYear" },
  ext2To: { d: "ext2ToDay", m: "ext2ToMonth", y: "ext2ToYear" },
  resume: { d: "resumeDay", m: "resumeMonth", y: "resumeYear" },
  otherOrg: { d: "otherOrgDay", m: "otherOrgMonth", y: "otherOrgYear" },
};

function DateInput({ id, label, withTime }: { id: string; label: string; withTime?: boolean }) {
  const { s, set } = useC();
  const map = DATE_MAP[id];
  if (!map) return null;
  const applyIso = (iso: string) => {
    const p = splitIso(iso);
    if (!p) return;
    set(map.d, p.d);
    set(map.m, p.m);
    set(map.y, p.y);
  };
  const iso = isoOf(s[map.d], s[map.m], s[map.y]);
  const mini = "rounded-lg border border-slate-300 px-2 py-1.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
  return (
    <Field label={label}>
      <div className="flex flex-wrap items-center gap-1.5">
        <input className={mini + " w-16"} placeholder="день" value={s[map.d] ?? ""} onChange={(e) => set(map.d, e.target.value)} />
        <select className={mini + " w-32"} value={s[map.m] ?? ""} onChange={(e) => set(map.m, e.target.value)}>
          <option value="">месяц</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input className={mini + " w-20"} placeholder="год" value={s[map.y] ?? ""} onChange={(e) => set(map.y, e.target.value)} />
        {withTime && (
          <>
            <input className={mini + " w-16"} placeholder="час" value={s[map.h!] ?? ""} onChange={(e) => set(map.h!, e.target.value)} />
            <input className={mini + " w-16"} placeholder="мин" value={s[map.mi!] ?? ""} onChange={(e) => set(map.mi!, e.target.value)} />
          </>
        )}
        <input type="date" className={mini + " w-36"} value={iso} onChange={(e) => applyIso(e.target.value)} />
        <button type="button" className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-600 hover:border-indigo-400 hover:text-indigo-600" onClick={() => applyIso(todayIso())}>
          сегодня
        </button>
      </div>
    </Field>
  );
}

function renderSpec(f: FieldSpec) {
  switch (f.kind) {
    case "text":
      return <TextInput key={f.id} id={f.id} label={f.label} ph={f.ph} big={f.big} />;
    case "code":
      return (
        <CodePicker
          key={f.id}
          id={f.id}
          label={f.label}
          legend={f.legend}
          options={f.options}
          otherId={f.other}
        />
      );
    case "date":
      return <DateInput key={f.id} id={f.id} label={f.label} withTime={f.withTime} />;
    case "dateOnly":
      return <DateInput key={f.id} id={f.id} label={f.label} />;
  }
}

/* ——— адреса ——— */

const ADDR: { key: string; label: string }[] = [
  { key: "Subj", label: "Субъект Российской Федерации" },
  { key: "District", label: "Район" },
  { key: "City", label: "Город" },
  { key: "Settlement", label: "Населённый пункт" },
  { key: "Street", label: "Улица" },
  { key: "House", label: "Дом" },
  { key: "Building", label: "Строение / корпус" },
  { key: "Flat", label: "Квартира" },
];

function AddressBlock({ base, title }: { base: string; title: string }) {
  const { s, set } = useC();
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <p className="mb-2 text-xs font-bold text-slate-700">{title}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ADDR.map((a) => (
          <div key={a.key}>
            <span className={lbl}>{a.label}</span>
            <input className={inp} value={s[base + a.key] ?? ""} onChange={(e) => set(base + a.key, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ——— диагностические блоки ——— */

function IcdInput({ nameKey, icdKey }: { nameKey: string; icdKey: string }) {
  const { s, set } = useC();
  return (
    <>
      <input
        className={inp}
        list="icd10"
        placeholder="код по МКБ"
        value={s[icdKey] ?? ""}
        onChange={(e) => {
          const t = e.target.value;
          const sep = t.match(/^(.+?)\s+[—–-]\s+(.+)$/);
          if (sep) {
            set(icdKey, sep[1].toUpperCase());
            set(nameKey, sep[2]);
            return;
          }
          set(icdKey, t.toUpperCase());
          const found = ICD10.find(([c]) => c.toUpperCase() === t.toUpperCase());
          if (found && !s[nameKey]) set(nameKey, found[1]);
        }}
      />
    </>
  );
}

function DiagGroup({ base, title }: { base: string; title: string }) {
  const { s, set } = useC();
  return (
    <Card title={title} icon="📋">
      <div className="space-y-2">
        {DIAG_ROWS.map((r) => {
          const nk = base + r.prefix;
          const ik = nk + "Icd";
          return (
            <div key={r.prefix} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_180px]">
              <div>
                <span className={lbl}>{r.label}</span>
                <input
                  className={inp}
                  list={r.prefix === "Extra" ? undefined : "icd10"}
                  value={s[nk] ?? ""}
                  placeholder={r.label}
                  onChange={(e) => {
                    set(nk, e.target.value);
                    if (r.prefix !== "Extra") {
                      const p = parseIcd(e.target.value);
                      if (p.code && !s[ik]) set(ik, p.code);
                    }
                  }}
                />
              </div>
              {r.prefix !== "Extra" && (
                <div>
                  <span className={lbl}>Код по МКБ</span>
                  <IcdInput nameKey={nk} icdKey={ik} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ——— таблицы ——— */

function Departments() {
  const { s, setRow } = useC();
  const rows = s.departments as DeptRow[];
  const upd = (i: number, k: keyof DeptRow, v: string) => setRow("departments", i, k, v);
  return (
    <Card title="Движение пациента по отделениям" icon="🛏️">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-x-1 text-xs">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wide text-slate-500">
              <th className="w-8">№</th>
              <th>Наименование отделения</th>
              <th>Профиль коек</th>
              <th>Ф. И. О. лечащего врача</th>
              <th>Дата поступления</th>
              <th>Дата и время выписки, смерти</th>
              <th>Основное заболевание</th>
              <th>Код МКБ</th>
              <th className="w-16">Дней</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="pt-1 text-center text-slate-400">{i + 1}</td>
                {(["name", "profile", "doctor", "admit", "discharge", "disease", "icd", "days"] as (keyof DeptRow)[]).map((k) => (
                  <td key={k} className="py-0.5">
                    <input className={inp} value={r[k] ?? ""} onChange={(e) => upd(i, k, e.target.value)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
        onClick={() => setRow("departments", rows.length, "name", "")}
      >
        ＋ добавить отделение
      </button>
    </Card>
  );
}

function Operations() {
  const { s, setRow } = useC();
  const rows = s.operations as OpRow[];
  const upd = (i: number, k: keyof OpRow, v: string) => setRow("operations", i, k, v);
  const boxes: { k: keyof OpRow; l: string }[] = [
    { k: "endo", l: "эндоскопическое" },
    { k: "laser", l: "лазерное" },
    { k: "cryo", l: "криогенное" },
    { k: "xray", l: "рентгеновское" },
  ];
  return (
    <Card title="Сведения об оперативных вмешательствах (операциях)" icon="🔪">
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Вмешательство № {i + 1}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {([
                ["datetime", "Дата, время"],
                ["surgeon", "Оперирующий врач"],
                ["deptCode", "Код отделения"],
                ["nomen", "Код по номенклатуре услуг"],
              ] as [keyof OpRow, string][]).map(([k, l]) => (
                <div key={k}>
                  <span className={lbl}>{l}</span>
                  <input className={inp} value={r[k] ?? ""} onChange={(e) => upd(i, k, e.target.value)} />
                </div>
              ))}
              <div className="col-span-2">
                <span className={lbl}>Наименование оперативного вмешательства</span>
                <input className={inp} value={r.name ?? ""} onChange={(e) => upd(i, "name", e.target.value)} />
              </div>
              <div className="col-span-2">
                <span className={lbl}>Осложнение операции</span>
                <input className={inp} value={r.complication ?? ""} onChange={(e) => upd(i, "complication", e.target.value)} />
              </div>
              <div>
                <span className={lbl}>Код МКБ осложнения</span>
                <input className={inp} list="icd10" value={r.compIcd ?? ""} onChange={(e) => upd(i, "compIcd", e.target.value)} />
              </div>
              <div>
                <span className={lbl}>Вид анестезиологического пособия</span>
                <input className={inp} value={r.anesthesia ?? ""} onChange={(e) => upd(i, "anesthesia", e.target.value)} />
              </div>
              <div className="col-span-2 md:col-span-4">
                <span className={lbl}>Использование медицинских изделий (оборудования)</span>
                <div className="flex flex-wrap gap-1.5">
                  {boxes.map((b) => (
                    <button
                      key={b.k}
                      type="button"
                      onClick={() => upd(i, b.k, r[b.k] ? "" : "1")}
                      className={
                        "rounded-full border px-2.5 py-1 text-xs font-medium transition " +
                        (r[b.k] ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white text-slate-600 hover:border-indigo-400")
                      }
                    >
                      {b.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
        onClick={() => setRow("operations", rows.length, "name", "")}
      >
        ＋ добавить вмешательство
      </button>
    </Card>
  );
}

/* ——— специальная секция «адреса» ——— */
function AddressSection() {
  const { s, set } = useC();
  const copy = () => {
    ADDR.forEach((a) => set("stay" + a.key, s["reg" + a.key] ?? ""));
  };
  return (
    <Card
      title="Регистрация: жительство и пребывание"
      icon="📍"
      extra={
        <button type="button" onClick={copy} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">
          ⧉ копировать жительство → пребывание
        </button>
      }
    >
      <AddressBlock base="reg" title="Регистрация по месту жительства" />
      <AddressBlock base="stay" title="Регистрация по месту пребывания" />
    </Card>
  );
}

/* ——— главный компонент ——— */

export default function EntryPanel({ s, set, setRow }: { s: FormState; set: (id: string, v: string) => void; setRow: (kind: "departments" | "operations", i: number, key: string, v: string) => void }) {
  const ctx: Ctx = { s, set, setRow };
  return (
    <C.Provider value={ctx}>
      <div className="space-y-4">
        {SECTIONS.map((sec) => {
          if (sec.id === "address") return <AddressSection key={sec.id} />;
          if (sec.id === "diagnosis-pre")
            return (
              <div key={sec.id} className="space-y-4">
                <Card title="Диагноз при направлении" icon="🩺">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_180px]">
                    <div>
                      <span className={lbl}>Диагноз при направлении</span>
                      <input className={inp} list="icd10" value={s.refDiag ?? ""} onChange={(e) => { set("refDiag", e.target.value); const p = parseIcd(e.target.value); if (p.code && !s.refDiagIcd) set("refDiagIcd", p.code); }} />
                    </div>
                    <div>
                      <span className={lbl}>Код по МКБ</span>
                      <IcdInput nameKey="refDiag" icdKey="refDiagIcd" />
                    </div>
                  </div>
                </Card>
                <DiagGroup base="pre" title="Предварительный диагноз (диагноз при поступлении)" />
              </div>
            );
          if (sec.id === "movement") return <Departments key={sec.id} />;
          if (sec.id === "operations") return <Operations key={sec.id} />;
          if (sec.id === "diagnosis-clin") return <DiagGroup key={sec.id} base="clin" title="Диагноз клинический, установленный в стационаре, дневном стационаре" />;
          if (sec.id === "diagnosis-path") return <DiagGroup key={sec.id} base="path" title="Патологоанатомический диагноз" />;
          return (
            <Card key={sec.id} title={sec.title} icon={sec.icon}>
              {sec.fields.map(renderSpec)}
            </Card>
          );
        })}
      </div>
      <datalist id="icd10">
        {ICD10.map(([c, n]) => (
          <option key={c} value={`${c} — ${n}`} />
        ))}
      </datalist>
    </C.Provider>
  );
}

export { EDUCATION, EMPLOYMENT, MARITAL, PAYMENT, REFERRAL, emptyDept, emptyOp };
