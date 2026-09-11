import {
  B,
  BASE_PT,
  CW,
  F,
  Gap,
  Grid,
  Line,
  Rule,
  T,
  X,
  code,
  estMm,
  type Seg,
} from "../components/formKit";
import type { CSSProperties } from "react";
import type { FormState } from "../data/model";

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/** «____» ____________ 20____ г. */
function dateSegs(d?: string, m?: string, y?: string, compact = false): Seg[] {
  const mm = m && /^\d+$/.test(m.trim()) ? MONTHS[Math.max(0, Math.min(11, parseInt(m, 10) - 1))] : m || "";
  const wd = compact ? 7 : 9;
  const wm = compact ? 21 : 28;
  return [T("«"), B(wd, d), T("»"), B(wm, mm), T("20"), B(wd, y), T(" г.")];
}

function timeSegs(h?: string, min?: string): Seg[] {
  return [T("время: "), B(11, h), T(" час."), B(11, min), T(" мин.")];
}

/* ═══════════════════ ЛИСТ 1 ═══════════════════ */

export function Sheet1({ d }: { d: FormState }) {
  const v = (k: string) => (d as Record<string, string>)[k] ?? "";

  return (
    <div className="sheet">
      <div className="hdr">
        <div>Приложение № 11</div>
        <div>к приказу Министерства здравоохранения</div>
        <div>Российской Федерации</div>
        <div>от «05» августа 2022 г. № 530 н.</div>
      </div>

      <div className="top">
        <div className="l">
          <div className="tx">Наименование и адрес медицинской организации</div>
          <div className="tx">(фамилия, имя, отчество (при наличии) индивидуального</div>
          <div className="tx">
            предпринимателя и адрес осуществления медицинской деятельности)
          </div>
          <div className="tx">ОГРН (ОГРНИП)</div>
          <Line cw={CW * 0.57} segs={[F(v("orgName"), 20)]} h={4.4} />
          <Line cw={CW * 0.57} segs={[F(v("orgOgrn"), 20)]} h={4.4} />
        </div>
        <div className="r">
          <Line cw={CW * 0.43} segs={[T("Код формы по ОКУД "), F(v("okud"), 12)]} h={3.9} />
          <div className="tx">Медицинская документация</div>
          <div className="tx">Учётная форма № 066/у</div>
          <Gap h={2.5} />
          <div className="tx">Утверждена приказом Министерства</div>
          <div className="tx">здравоохранения Российской Федерации</div>
          <div className="tx">от «05» августа 2022 г. № 530 н.</div>
        </div>
      </div>

      <div className="title">
        <div>СТАТИСТИЧЕСКАЯ КАРТА</div>
        <div>ВЫБЫВШЕГО ИЗ МЕДИЦИНСКОЙ ОРГАНИЗАЦИИ,</div>
        <div>ОКАЗЫВАЮЩЕЙ МЕДИЦИНСКУЮ ПОМОЩЬ В СТАЦИОНАРНЫХ УСЛОВИЯХ,</div>
        <div>
          В УСЛОВИЯХ ДНЕВНОГО СТАЦИОНАРА №{" "}
          <span className="und">{v("cardNo") || "\u00A0"}</span>
        </div>
      </div>

      <Line segs={[T("Фамилия, имя, отчество (при наличии) пациента "), F(v("patientName"), 30)]} h={3.9} />
      <Line segs={[T("Дата рождения: "), ...dateSegs(v("bd"), v("bm"), v("by"))]} h={3.9} />
      <Line
        segs={[
          T("Пол: "),
          code("мужской", "1", v("sex")),
          T(", "),
          code("женский", "2", v("sex")),
          T("."),
        ]}
        h={3.9}
      />
      <Line segs={[T("Гражданство: "), F(v("citizenship"), 20)]} h={3.9} />

      <Line
        segs={[
          T("Регистрация по месту жительства: субъект Российской Федерации "),
          B(44, v("regSubj")),
          T(" район "),
          F(v("regDistrict"), 18),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("город "), B(19, v("regCity")),
          T(" населённый пункт "), B(19, v("regSettlement")),
          T(" улица "), B(22, v("regStreet")),
          T(" дом "), B(9, v("regHouse")),
          T(" строение/корпус "), B(10, v("regBuilding")),
          T(" квартира "), F(v("regFlat"), 9),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("Регистрация по месту пребывания: субъект Российской Федерации "),
          B(43, v("staySubj")),
          T(" район "),
          F(v("stayDistrict"), 18),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("город "), B(19, v("stayCity")),
          T(" населённый пункт "), B(19, v("staySettlement")),
          T(" улица "), B(22, v("stayStreet")),
          T(" дом "), B(9, v("stayHouse")),
          T(" строение/корпус "), B(10, v("stayBuilding")),
          T(" квартира "), F(v("stayFlat"), 9),
        ]}
        h={3.9}
      />
      <Line
        segs={[T("Местность: "), code("городская", "1", v("locality")), T(", "), code("сельская", "2", v("locality")), T(".")]}
        h={3.9}
      />
      <Line
        segs={[
          T("Семейное положение: "),
          code("состоит в зарегистрированном браке", "1", v("marital")),
          T(", "),
          code("не состоит в зарегистрированном браке", "2", v("marital")),
          T(", "),
          code("неизвестно", "3", v("marital")),
          T("."),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("Общее образование: "),
          code("1 – дошкольное образование", "1", v("education")),
          T("; "),
          code("2 – начальное общее образование", "2", v("education")),
          T("; "),
          code("3 – основное общее образование", "3", v("education")),
          T("; "),
          code("4 – среднее", "4", v("education")),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          code("общее образование; профессиональное образование", "4", v("education")),
          T("; "),
          code("5 – среднее профессиональное образование", "5", v("education")),
          T("; "),
          code("6 – высшее образование", "6", v("education")),
          T(";"),
        ]}
        h={3.9}
      />
      <Line segs={[code("неизвестно", "7", v("education")), T(".")]} h={3.9} />
      <Line
        segs={[
          T("Занятость: "),
          code("работает", "1", v("employment")),
          T(", "),
          code("проходит военную и приравненную к ней службу", "2", v("employment")),
          T(", "),
          code("пенсионер", "3", v("employment")),
          T(", "),
          code("обучающийся", "4", v("employment")),
          T(", "),
          code("не работает", "5", v("employment")),
          T(","),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          code("прочее", "6", v("employment")),
          T(" – 6 "),
          B(16, v("employmentOther")),
          T(". Для детей: "),
          code("дошкольник, организован", "7", v("employment")),
          T(", "),
          code("дошкольник, не организован", "8", v("employment")),
          T(", "),
          code("школьник", "9", v("employment")),
          T("; социальное"),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("положение: "),
          code("ребёнок-сирота", "10", v("employment")),
          T(" – 10, "),
          code("без попечения родителей", "11", v("employment")),
          T(" – 11, "),
          code("проживающий в организации для детей-сирот", "12", v("employment")),
          T(" – 12."),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("Место работы, место учёбы, наименование дошкольного образовательного учреждения, наименования организации для детей-"),
        ]}
        h={3.9}
      />
      <Line segs={[T("сирот: "), F(v("workPlace"), 30)]} h={3.9} />
      <Line segs={[T("Должность (для работающего): "), F(v("position"), 30)]} h={3.9} />
      <Line segs={[F("", 30)]} h={3.9} />
      <Line segs={[T("Группа инвалидности: "), F(v("disability"), 30)]} h={3.9} />
      <Line
        segs={[
          T("Лицо, подвергшееся радиационному облучению: "),
          code("да", "1", v("radiation")),
          T(" – 1, "),
          code("нет", "2", v("radiation")),
          T(" – 2."),
        ]}
        h={3.9}
      />
      <Line segs={[T("Полис обязательного медицинского страхования: "), F(v("omsNumber"), 30)]} h={3.9} />
      <Line segs={[T("дата выдачи полиса обязательного медицинского страхования: "), ...dateSegs(v("omsDay"), v("omsMonth"), v("omsYear"))]} h={3.9} />
      <Line
        segs={[
          T("данные о страховой медицинской организации, выбранной застрахованным лицом или определённой застрахованному лицу:"),
        ]}
        h={3.9}
      />
      <Line segs={[F(v("insuranceOrg"), 30)]} h={3.9} />
      <Line segs={[T("СНИЛС: "), F(v("snils"), 30)]} h={3.9} />
      <Line
        segs={[T("Дата и время поступления: "), ...dateSegs(v("admDay"), v("admMonth"), v("admYear")), T(" "), ...timeSegs(v("admHour"), v("admMin"))]}
        h={3.9}
      />
      <Line segs={[T("Поступил через "), B(14, v("hoursAfterStart")), T(" часов после начала заболевания, получения травмы, отравления.")]} h={3.9} />
      <Line
        segs={[
          T("Направлен в стационар (дневной стационар): "),
          code("поликлиникой", "1", v("referral")),
          T(" – 1, "),
          code("выездной бригадой скорой медицинской помощи", "2", v("referral")),
          T(" – 2,"),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          code("полицией", "3", v("referral")),
          T(" – 3, "),
          code("обратился самостоятельно", "4", v("referral")),
          T(" – 4, "),
          code("другое", "5", v("referral")),
          T(" – 5 (указать) "),
          B(22, v("referralOther")),
          X(),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("Поступил в стационар (дневной стационар) для оказания медицинской помощи в текущем году: по поводу основного заболевания,"),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("указанного в диагнозе при поступлении: "),
          code("первично", "1", v("admissionType")),
          T(" – 1, "),
          code("повторно", "2", v("admissionType")),
          T(" – 2."),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("Форма оказания медицинской помощи: "),
          code("плановая", "1", v("careForm")),
          T(" – 1, "),
          code("экстренная", "2", v("careForm")),
          T(" – 2."),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("Факт употребления алкоголя и иных психоактивных веществ, установлении наличия или отсутствия признаков состояния"),
        ]}
        h={3.9}
      />
      <Line segs={[T("опьянения при поступлении пациента в медицинскую организацию: "), F(v("alcohol"), 30)]} h={3.9} />
      <Line
        segs={[
          T("Основной вид оплаты: "),
          code("обязательное медицинское страхование", "1", v("payment")),
          T(" – 1, "),
          code("средства бюджета (всех уровней)", "2", v("payment")),
          T(" – 2, "),
          code("платные медицинские", "3", v("payment")),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("услуги – 3, в том числе добровольное медицинское страхование – 4, "),
          code("другое", "5", v("payment")),
          T(" – 5 "),
          B(26, v("paymentOther")),
          X(),
        ]}
        h={3.9}
      />

      <Rule />

      <Line segs={[T("Диагноз при направлении:")]} h={3.9} />
      <Line segs={[F(v("refDiag"), 40), T(" код по МКБ "), B(26, v("refDiagIcd"))]} h={3.9} />
      <Line segs={[T("Предварительный диагноз (диагноз при поступлении):")]} h={3.9} />
      <Line segs={[T("Основное заболевание "), F(v("preMain"), 30), T(" код по МКБ "), B(26, v("preMainIcd"))]} h={3.9} />
      <Line segs={[T("Осложнения основного заболевания "), F(v("preComp"), 26), T(" код по МКБ "), B(26, v("preCompIcd"))]} h={3.9} />
      <Line segs={[T("Внешняя причина при травмах, отравлениях "), F(v("preExt"), 24), T(" код по МКБ "), B(26, v("preExtIcd"))]} h={3.9} />
      <Line segs={[T("Сопутствующие заболевания "), F(v("preConc"), 30), T(" код по МКБ "), B(26, v("preConcIcd"))]} h={3.9} />
      <Line segs={[T("Дополнительные сведения о заболевании "), F(v("preExtra"), 30), X()]} h={3.9} />
    </div>
  );
}

/* ═══════════════════ ЛИСТ 2 ═══════════════════ */

const DEPT_COLS = [8, 26, 17, 25, 17, 20, 26, 14, 31];

const OP_COLS = [14, 24, 12, 24, 16, 20, 12, 16, 11, 11, 11, 13];

export function Sheet2({ d }: { d: FormState }) {
  const v = (k: string) => (d as Record<string, string>)[k] ?? "";
  const dept = d.departments ?? [];
  const ops = d.operations ?? [];

  const deptRows = [0, 1, 2].map(
    (i) =>
      [
        String(i + 1),
        dept[i]?.name ?? "",
        dept[i]?.profile ?? "",
        dept[i]?.doctor ?? "",
        dept[i]?.admit ?? "",
        dept[i]?.discharge ?? "",
        dept[i]?.disease ?? "",
        dept[i]?.icd ?? "",
        dept[i]?.days ?? "",
      ] as string[]
  );

  const opRows = [0, 1].map(
    (i) =>
      [
        ops[i]?.datetime ?? "",
        ops[i]?.surgeon ?? "",
        ops[i]?.deptCode ?? "",
        ops[i]?.name ?? "",
        ops[i]?.nomen ?? "",
        ops[i]?.complication ?? "",
        ops[i]?.compIcd ?? "",
        ops[i]?.anesthesia ?? "",
        ops[i]?.endo ?? "",
        ops[i]?.laser ?? "",
        ops[i]?.cryo ?? "",
        ops[i]?.xray ?? "",
      ] as string[]
  );

  return (
    <div className="sheet" style={{ "--lh": "4.15mm" } as CSSProperties}>
      <div className="cap">Движение пациента по отделениям:</div>
      <Grid
        cols={DEPT_COLS}
        head={[
          [
            "№\nп/п",
            "Наименование отделения",
            "Профиль коек",
            "Фамилия, имя, отчество (при наличии) лечащего врача",
            "Дата поступ-ления",
            "Дата и время выписки, смерти",
            "Основное заболевание",
            "Код по МКБ",
            "Количество дней нахождения в медицинской организации",
          ],
        ]}
        nums={["1", "2", "3", "4", "5", "6", "7", "8", "9"]}
        rows={deptRows}
        rowH={6.5}
      />

      <div className="cap">Сведения об оперативных вмешательствах (операциях):</div>
      <Grid
        cols={OP_COLS}
        head={[
          [
            { t: "Дата,\nвремя", r: 2 },
            { t: "Фамилия, имя, отчество (при наличии) оперирующего врача", r: 2 },
            { t: "Код отделения", r: 2 },
            { t: "Наименование оперативного вмешательства (операции)", c: 2 },
            { t: "Осложнение оперативного вмешательства (операции)", c: 2 },
            { t: "Вид анестезио-логического пособия", r: 2 },
            { t: "Использование медицинских изделий (оборудования)", c: 4 },
          ],
          [
            "наимено-вание",
            "код согласно номенклатуре медицинских услуг",
            "наимено-вание",
            "код по МКБ",
            "эндоско-пическое",
            "лазерное",
            "крио-генное",
            "рентге-новское",
          ],
        ]}
        nums={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
        rows={opRows}
        rowH={9}
      />

      <Gap h={1.5} />
      <Line segs={[T("Группа крови "), B(20, v("bloodGroup")), T(" резус-принадлежность "), B(22, v("rhesus")), T(" антиген К I системы Kell "), F(v("kell"), 14)]} h={3.9} />
      <Line segs={[T("иные сведения групповой принадлежности крови (при наличии) "), F(v("bloodOther"), 30)]} h={3.9} />
      <Line
        segs={[
          T("Обследование: на ВИЧ: "),
          code("да", "1", v("testHiv")),
          T(" – 1; "),
          code("нет", "2", v("testHiv")),
          T(" – 2; на сифилис: "),
          code("да", "3", v("testSyph")),
          T(" – 3; "),
          code("нет", "4", v("testSyph")),
          T(" – 4; на гепатиты В, С: "),
          code("да", "5", v("testHep")),
          T(" – 5; "),
          code("нет", "6", v("testHep")),
          T(" – 6."),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("Исход госпитализации: "),
          code("выписан", "1", v("outcome")),
          T(" – 1, в том числе в дневной стационар "),
          T("– 2", v("outcome") === "2"),
          T(", в стационар – 3."),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("Наименование медицинской организации (фамилия, имя, отчество (при наличии) индивидуального предпринимателя,"),
        ]}
        h={3.9}
      />
      <Line segs={[T("осуществляющего медицинскую деятельность), куда переведён пациент")]} h={3.9} />
      <Line segs={[F(v("transferredTo"), 30)]} h={3.9} />
      <Line
        segs={[
          T("Результат госпитализации: "),
          code("выздоровление", "1", v("result")),
          T(" – 1, "),
          code("улучшение", "2", v("result")),
          T(" – 2, "),
          code("без перемен", "3", v("result")),
          T(" – 3, "),
          code("ухудшение", "4", v("result")),
          T(" – 4, "),
          code("умер", "5", v("result")),
          T(" – 5."),
        ]}
        h={3.9}
      />
      <Line segs={[T("Выписан дата: "), ...dateSegs(v("disDay"), v("disMonth"), v("disYear")), T(" "), ...timeSegs(v("disHour"), v("disMin"))]} h={3.9} />
      <Line
        segs={[
          T("Умер в "),
          B(38, v("deathDept")),
          T(" отделении: "),
          ...dateSegs(v("deathDay"), v("deathMonth"), v("deathYear")),
          T(" "),
          ...timeSegs(v("deathHour"), v("deathMin")),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("Умерла беременная: 1 "),
          T("– до 22 недель беременности", v("pregnantDeath") === "1"),
          T(", 2 "),
          T("– после 22 недель беременности", v("pregnantDeath") === "2"),
          T("."),
        ]}
        h={3.9}
      />
      <Line segs={[T("Количество дней нахождения в медицинской организации "), F(v("totalDays"), 24), X()]} h={3.9} />

      <Gap h={1.5} />
      <Line segs={[T("Оформлен листок нетрудоспособности: № "), B(36, v("sickNo")), T(" от "), ...dateSegs(v("sickDay"), v("sickMonth"), v("sickYear"), true)]} h={3.9} />
      <Line segs={[T("(дубликат листка нетрудоспособности № "), B(32, v("sickDupNo")), T(" от "), ...dateSegs(v("sickDupDay"), v("sickDupMonth"), v("sickDupYear"), true), T(")")]} h={3.9} />
      <Line segs={[T("освобождение от работы с "), ...dateSegs(v("relFromDay"), v("relFromMonth"), v("relFromYear"), true), T(" по "), ...dateSegs(v("relToDay"), v("relToMonth"), v("relToYear"), true)]} h={3.9} />
      <Line segs={[T("продление листка нетрудоспособности:")]} h={3.9} />
      <Line
        segs={[
          T("№ "), B(24, v("ext1No")),
          T(" освобождение от работы с "), ...dateSegs(v("ext1FromDay"), v("ext1FromMonth"), v("ext1FromYear"), true),
          T(" по "), ...dateSegs(v("ext1ToDay"), v("ext1ToMonth"), v("ext1ToYear"), true),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("№ "), B(24, v("ext2No")),
          T(" освобождение от работы с "), ...dateSegs(v("ext2FromDay"), v("ext2FromMonth"), v("ext2FromYear"), true),
          T(" по "), ...dateSegs(v("ext2ToDay"), v("ext2ToMonth"), v("ext2ToYear"), true),
        ]}
        h={3.9}
      />
      <Line segs={[T("приступить к работе с "), ...dateSegs(v("resumeDay"), v("resumeMonth"), v("resumeYear"), true)]} h={3.9} />
      <Line
        segs={[
          T("явка в другую медицинскую организацию (другое структурное подразделение медицинской организации) "),
          ...dateSegs(v("otherOrgDay"), v("otherOrgMonth"), v("otherOrgYear"), true),
        ]}
        h={3.9}
      />
      <Line
        segs={[
          T("оформлен листок нетрудоспособности по уходу за больным членом семьи (фамилия, имя, отчество (при наличии): "),
          F(v("careName"), 16),
        ]}
        h={3.9}
      />
      <Line segs={[F("", 30)]} h={3.9} />

      <Gap h={1.5} />
      <Line segs={[T("Диагноз клинический, установленный в стационаре, дневном стационаре:")]} h={3.9} />
      <Line segs={[T("Основное заболевание "), F(v("clinMain"), 32), T(" код по МКБ "), B(26, v("clinMainIcd"))]} h={3.9} />
      <Line segs={[T("Осложнения основного заболевания "), F(v("clinComp"), 28), T(" код по МКБ "), B(26, v("clinCompIcd"))]} h={3.9} />
      <Line segs={[T("Внешняя причина при травмах, отравлениях "), F(v("clinExt"), 26), T(" код по МКБ "), B(26, v("clinExtIcd"))]} h={3.9} />
      <Line segs={[T("Сопутствующие заболевания "), F(v("clinConc"), 32), T(" код по МКБ "), B(26, v("clinConcIcd"))]} h={3.9} />
      <Line segs={[T("Дополнительные сведения о заболевании "), F(v("clinExtra"), 32), X()]} h={3.9} />

      <Gap h={1.5} />
      <Line segs={[T("Патологоанатомический диагноз:")]} h={3.9} />
      <Line segs={[T("Основное заболевание "), F(v("pathMain"), 32), T(" код по МКБ "), B(26, v("pathMainIcd"))]} h={3.9} />
      <Line segs={[T("Осложнения основного заболевания "), F(v("pathComp"), 28), T(" код по МКБ "), B(26, v("pathCompIcd"))]} h={3.9} />
      <Line segs={[T("Внешняя причина при травмах, отравлениях "), F(v("pathExt"), 26), T(" код по МКБ "), B(26, v("pathExtIcd"))]} h={3.9} />
      <Line segs={[T("Сопутствующие заболевания "), F(v("pathConc"), 32), T(" код по МКБ "), B(26, v("pathConcIcd"))]} h={3.9} />
      <Line segs={[T("Дополнительные сведения о заболевании "), F(v("pathExtra"), 32), X()]} h={3.9} />

      <Gap h={2} />
      <Line segs={[T("Фамилия, имя, отчество (при наличии) и должность лечащего врача")]} h={4} />
      <Line segs={[F(v("doctorName"), 24), T(" подпись "), B(24, ""), X()]} h={4} />
      <Line segs={[T("Фамилия, имя, отчество (при наличии) заведующего отделением")]} h={4} />
      <Line segs={[F(v("headName"), 24), T(" подпись "), B(24, ""), X()]} h={4} />
    </div>
  );
}

export default function PrintForm({ d }: { d: FormState }) {
  return (
    <div className="frm">
      <Sheet1 d={d} />
      <Sheet2 d={d} />
    </div>
  );
}

export { MONTHS, BASE_PT, CW, estMm };
