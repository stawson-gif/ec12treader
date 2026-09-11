export type Row = Record<string, string>;

export type DeptRow = {
  name: string;
  profile: string;
  doctor: string;
  admit: string;
  discharge: string;
  disease: string;
  icd: string;
  days: string;
};

export type OpRow = {
  datetime: string;
  surgeon: string;
  deptCode: string;
  name: string;
  nomen: string;
  complication: string;
  compIcd: string;
  anesthesia: string;
  endo: string;
  laser: string;
  cryo: string;
  xray: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormState = Record<string, any> & {
  departments: DeptRow[];
  operations: OpRow[];
};

export const emptyDept = (): DeptRow => ({
  name: "",
  profile: "",
  doctor: "",
  admit: "",
  discharge: "",
  disease: "",
  icd: "",
  days: "",
});

export const emptyOp = (): OpRow => ({
  datetime: "",
  surgeon: "",
  deptCode: "",
  name: "",
  nomen: "",
  complication: "",
  compIcd: "",
  anesthesia: "",
  endo: "",
  laser: "",
  cryo: "",
  xray: "",
});

export const emptyState = (): FormState => ({
  ...Object.fromEntries(FIELD_IDS.map((id) => [id, ""])),
  departments: [emptyDept(), emptyDept()],
  operations: [emptyOp()],
} as FormState);

// ——— Все скалярные поля формы ———
export const FIELD_IDS = [
  // Организация
  "orgName",
  "orgOgrn",
  "okud",
  "cardNo",
  // Пациент
  "patientName",
  "bd",
  "bm",
  "by",
  "sex",
  "citizenship",
  // Регистрация по месту жительства
  "regSubj",
  "regDistrict",
  "regCity",
  "regSettlement",
  "regStreet",
  "regHouse",
  "regBuilding",
  "regFlat",
  // Регистрация по месту пребывания
  "staySubj",
  "stayDistrict",
  "stayCity",
  "staySettlement",
  "stayStreet",
  "stayHouse",
  "stayBuilding",
  "stayFlat",
  // Социальный статус
  "locality",
  "marital",
  "education",
  "employment",
  "employmentOther",
  "workPlace",
  "position",
  "disability",
  "radiation",
  // Страхование
  "omsNumber",
  "omsDay",
  "omsMonth",
  "omsYear",
  "insuranceOrg",
  "snils",
  // Поступление
  "admDay",
  "admMonth",
  "admYear",
  "admHour",
  "admMin",
  "hoursAfterStart",
  "referral",
  "referralOther",
  "admissionType",
  "careForm",
  "alcohol",
  "payment",
  "paymentOther",
  // Диагноз при направлении
  "refDiag",
  "refDiagIcd",
  // Предварительный диагноз
  "preMain",
  "preMainIcd",
  "preComp",
  "preCompIcd",
  "preExt",
  "preExtIcd",
  "preConc",
  "preConcIcd",
  "preExtra",
  // Кровь и обследования
  "bloodGroup",
  "rhesus",
  "kell",
  "bloodOther",
  "testHiv",
  "testSyph",
  "testHep",
  // Исход госпитализации
  "outcome",
  "transferredTo",
  "result",
  "disDay",
  "disMonth",
  "disYear",
  "disHour",
  "disMin",
  "deathDept",
  "deathDay",
  "deathMonth",
  "deathYear",
  "deathHour",
  "deathMin",
  "pregnantDeath",
  "totalDays",
  // Листок нетрудоспособности
  "sickNo",
  "sickDay",
  "sickMonth",
  "sickYear",
  "sickDupNo",
  "sickDupDay",
  "sickDupMonth",
  "sickDupYear",
  "relFromDay",
  "relFromMonth",
  "relFromYear",
  "relToDay",
  "relToMonth",
  "relToYear",
  "ext1No",
  "ext1FromDay",
  "ext1FromMonth",
  "ext1FromYear",
  "ext1ToDay",
  "ext1ToMonth",
  "ext1ToYear",
  "ext2No",
  "ext2FromDay",
  "ext2FromMonth",
  "ext2FromYear",
  "ext2ToDay",
  "ext2ToMonth",
  "ext2ToYear",
  "resumeDay",
  "resumeMonth",
  "resumeYear",
  "otherOrgDay",
  "otherOrgMonth",
  "otherOrgYear",
  "careName",
  // Клинический диагноз
  "clinMain",
  "clinMainIcd",
  "clinComp",
  "clinCompIcd",
  "clinExt",
  "clinExtIcd",
  "clinConc",
  "clinConcIcd",
  "clinExtra",
  // Патологоанатомический диагноз
  "pathMain",
  "pathMainIcd",
  "pathComp",
  "pathCompIcd",
  "pathExt",
  "pathExtIcd",
  "pathConc",
  "pathConcIcd",
  "pathExtra",
  // Подписи
  "doctorPosition",
  "doctorName",
  "headName",
] as const;

// ——— Кодируемые графы (легенды из бланка) ———
export type Option = { code: string; label: string };

export const SEX: Option[] = [
  { code: "1", label: "мужской" },
  { code: "2", label: "женский" },
];

export const LOCALITY: Option[] = [
  { code: "1", label: "городская" },
  { code: "2", label: "сельская" },
];

export const MARITAL: Option[] = [
  { code: "1", label: "состоит в зарегистрированном браке" },
  { code: "2", label: "не состоит в зарегистрированном браке" },
  { code: "3", label: "неизвестно" },
];

export const EDUCATION: Option[] = [
  { code: "1", label: "дошкольное образование" },
  { code: "2", label: "начальное общее образование" },
  { code: "3", label: "основное общее образование" },
  { code: "4", label: "среднее общее образование" },
  { code: "5", label: "среднее профессиональное образование" },
  { code: "6", label: "высшее образование" },
  { code: "7", label: "неизвестно" },
];

export const EMPLOYMENT: Option[] = [
  { code: "1", label: "работает" },
  { code: "2", label: "проходит военную и приравненную к ней службу" },
  { code: "3", label: "пенсионер" },
  { code: "4", label: "обучающийся" },
  { code: "5", label: "не работает" },
  { code: "6", label: "прочее" },
  { code: "7", label: "дошкольник, организован" },
  { code: "8", label: "дошкольник, не организован" },
  { code: "9", label: "школьник" },
  { code: "10", label: "ребёнок-сирота" },
  { code: "11", label: "без попечения родителей" },
  { code: "12", label: "проживающий в организации для детей-сирот" },
];

export const RADIATION: Option[] = [
  { code: "1", label: "да" },
  { code: "2", label: "нет" },
];

export const REFERRAL: Option[] = [
  { code: "1", label: "поликлиникой" },
  { code: "2", label: "выездной бригадой скорой медицинской помощи" },
  { code: "3", label: "полицией" },
  { code: "4", label: "обратился самостоятельно" },
  { code: "5", label: "другое (указать)" },
];

export const PAYMENT: Option[] = [
  { code: "1", label: "обязательное медицинское страхование" },
  { code: "2", label: "средства бюджета (всех уровней)" },
  { code: "3", label: "платные медицинские услуги" },
  { code: "4", label: "в том числе добровольное медицинское страхование" },
  { code: "5", label: "другое" },
];

export const HIV: Option[] = [
  { code: "1", label: "да" },
  { code: "2", label: "нет" },
];
export const SYPH: Option[] = [
  { code: "3", label: "да" },
  { code: "4", label: "нет" },
];
export const HEP: Option[] = [
  { code: "5", label: "да" },
  { code: "6", label: "нет" },
];

export const OUTCOME: Option[] = [
  { code: "1", label: "выписан" },
  { code: "2", label: "в том числе в дневной стационар" },
  { code: "3", label: "в стационар" },
];

export const RESULT: Option[] = [
  { code: "1", label: "выздоровление" },
  { code: "2", label: "улучшение" },
  { code: "3", label: "без перемен" },
  { code: "4", label: "ухудшение" },
  { code: "5", label: "умер" },
];

export const PREGNANT_DEATH: Option[] = [
  { code: "1", label: "до 22 недель беременности" },
  { code: "2", label: "после 22 недель беременности" },
];

export const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

// Группы граф, отображаемые в панели ввода
export type FieldSpec =
  | { kind: "text"; id: string; label: string; ph?: string; icdFor?: string; big?: boolean }
  | { kind: "code"; id: string; label: string; legend: string; options: Option[]; other?: string }
  | { kind: "date"; id: string; label: string; withTime?: boolean }
  | { kind: "dateOnly"; id: string; label: string };

export type Section = {
  id: string;
  title: string;
  icon: string;
  fields: FieldSpec[];
};

export const SECTIONS: Section[] = [
  {
    id: "org",
    title: "Медицинская организация",
    icon: "🏥",
    fields: [
      { kind: "text", id: "orgName", label: "Наименование и адрес МО (ФИО ИП и адрес деятельности)", ph: "ГБУЗ «Городская больница № 1», г. Москва, ул. Ленина, д. 1" },
      { kind: "text", id: "orgOgrn", label: "ОГРН (ОГРНИП)", ph: "1027700132197" },
      { kind: "text", id: "okud", label: "Код формы по ОКУД", ph: "— (заполняется получателем)" },
      { kind: "text", id: "cardNo", label: "№ статистической карты", ph: "12584" },
    ],
  },
  {
    id: "patient",
    title: "Пациент",
    icon: "👤",
    fields: [
      { kind: "text", id: "patientName", label: "Фамилия, имя, отчество (при наличии) пациента", ph: "Иванов Иван Иванович" },
      { kind: "date", id: "birth", label: "Дата рождения" },
      { kind: "code", id: "sex", label: "Пол", legend: "Пол: мужской – 1, женский – 2.", options: SEX },
      { kind: "text", id: "citizenship", label: "Гражданство", ph: "Российская Федерация" },
    ],
  },
  {
    id: "address",
    title: "Регистрация: жительство и пребывание",
    icon: "📍",
    fields: [],
  },
  {
    id: "social",
    title: "Социальный статус",
    icon: "🎓",
    fields: [
      { kind: "code", id: "locality", label: "Местность", legend: "Местность: городская – 1, сельская – 2.", options: LOCALITY },
      { kind: "code", id: "marital", label: "Семейное положение", legend: "Семейное положение: состоит в зарегистрированном браке – 1, не состоит в зарегистрированном браке – 2, неизвестно – 3.", options: MARITAL },
      { kind: "code", id: "education", label: "Образование", legend: "Общее образование: 1 – дошкольное образование; 2 – начальное общее образование; 3 – основное общее образование; 4 – среднее общее образование; 5 – среднее профессиональное образование; 6 – высшее образование; неизвестно – 7.", options: EDUCATION },
      { kind: "code", id: "employment", label: "Занятость", legend: "Занятость: работает – 1, военная и приравненная к ней служба – 2, пенсионер – 3, обучающийся – 4, не работает – 5, прочее – 6. Для детей: дошкольник, организован – 7, дошкольник, не организован – 8, школьник – 9; социальное положение: ребёнок-сирота – 10, без попечения родителей – 11, проживающий в организации для детей-сирот – 12.", options: EMPLOYMENT, other: "employmentOther" },
      { kind: "text", id: "workPlace", label: "Место работы, место учёбы, наименование ДОУ / организации для детей-сирот" },
      { kind: "text", id: "position", label: "Должность (для работающего)" },
      { kind: "text", id: "disability", label: "Группа инвалидности" },
      { kind: "code", id: "radiation", label: "Лицо, подвергшееся радиационному облучению", legend: "Лицо, подвергшееся радиационному облучению: да – 1, нет – 2.", options: RADIATION },
    ],
  },
  {
    id: "insurance",
    title: "Страхование и СНИЛС",
    icon: "🪪",
    fields: [
      { kind: "text", id: "omsNumber", label: "Полис обязательного медицинского страхования", ph: "5503 0000 1234 5678" },
      { kind: "dateOnly", id: "omsIssue", label: "Дата выдачи полиса ОМС" },
      { kind: "text", id: "insuranceOrg", label: "Страховая медицинская организация" },
      { kind: "text", id: "snils", label: "СНИЛС", ph: "112-233-445 95" },
    ],
  },
  {
    id: "admission",
    title: "Поступление",
    icon: "🚑",
    fields: [
      { kind: "date", id: "admission", label: "Дата и время поступления", withTime: true },
      { kind: "text", id: "hoursAfterStart", label: "Поступил через ___ часов после начала заболевания, травмы, отравления" },
      { kind: "code", id: "referral", label: "Направлен в стационар (дневной стационар)", legend: "Направлен в стационар (дневной стационар): поликлиникой – 1, выездной бригадой скорой медицинской помощи – 2, полицией – 3, обратился самостоятельно – 4, другое – 5 (указать).", options: REFERRAL, other: "referralOther" },
      { kind: "code", id: "admissionType", label: "Поступил по поводу основного заболевания, указанного в диагнозе при поступлении", legend: "Поступил в стационар (дневной стационар) для оказания медицинской помощи в текущем году по поводу основного заболевания, указанного в диагнозе при поступлении: первично – 1, повторно – 2.", options: [{ code: "1", label: "первично" }, { code: "2", label: "повторно" }] },
      { kind: "code", id: "careForm", label: "Форма оказания медицинской помощи", legend: "Форма оказания медицинской помощи: плановая – 1, экстренная – 2.", options: [{ code: "1", label: "плановая" }, { code: "2", label: "экстренная" }] },
      { kind: "text", id: "alcohol", label: "Факт употребления алкоголя и иных психоактивных веществ, установлении наличия или отсутствия признаков состояния опьянения" },
      { kind: "code", id: "payment", label: "Основной вид оплаты", legend: "Основной вид оплаты: обязательное медицинское страхование – 1, средства бюджета (всех уровней) – 2, платные медицинские услуги – 3, в том числе добровольное медицинское страхование – 4, другое – 5.", options: PAYMENT, other: "paymentOther" },
    ],
  },
  {
    id: "diagnosis-pre",
    title: "Диагноз при направлении и предварительный диагноз",
    icon: "🩺",
    fields: [],
  },
  {
    id: "movement",
    title: "Движение пациента по отделениям",
    icon: "🛏️",
    fields: [],
  },
  {
    id: "operations",
    title: "Сведения об оперативных вмешательствах (операциях)",
    icon: "🔪",
    fields: [],
  },
  {
    id: "blood",
    title: "Кровь и обследование",
    icon: "🩸",
    fields: [
      { kind: "text", id: "bloodGroup", label: "Группа крови", ph: "II (A)" },
      { kind: "text", id: "rhesus", label: "Резус-принадлежность", ph: "положительная (Rh+)" },
      { kind: "text", id: "kell", label: "Антиген K системы Kell" },
      { kind: "text", id: "bloodOther", label: "Иные сведения групповой принадлежности крови (при наличии)" },
      { kind: "code", id: "testHiv", label: "Обследование на ВИЧ", legend: "Обследование: на ВИЧ: да – 1; нет – 2;", options: HIV },
      { kind: "code", id: "testSyph", label: "Обследование на сифилис", legend: "на сифилис: да – 3; нет – 4;", options: SYPH },
      { kind: "code", id: "testHep", label: "Обследование на гепатиты B, C", legend: "на гепатиты B, C: да – 5; нет – 6.", options: HEP },
    ],
  },
  {
    id: "outcome",
    title: "Исход госпитализации",
    icon: "🏁",
    fields: [
      { kind: "code", id: "outcome", label: "Исход госпитализации", legend: "Исход госпитализации: выписан – 1, в том числе в дневной стационар – 2, в стационар – 3.", options: OUTCOME },
      { kind: "text", id: "transferredTo", label: "Наименование МО, куда переведён пациент", big: true },
      { kind: "code", id: "result", label: "Результат госпитализации", legend: "Результат госпитализации: выздоровление – 1, улучшение – 2, без перемен – 3, ухудшение – 4, умер – 5.", options: RESULT },
      { kind: "date", id: "discharge", label: "Выписан: дата и время", withTime: true },
      { kind: "text", id: "deathDept", label: "Умер в ___ отделении" },
      { kind: "date", id: "death", label: "Дата и время смерти", withTime: true },
      { kind: "code", id: "pregnantDeath", label: "Умерла беременная", legend: "Умерла беременная: 1 – до 22 недель беременности, 2 – после 22 недель беременности.", options: PREGNANT_DEATH },
      { kind: "text", id: "totalDays", label: "Количество дней нахождения в медицинской организации", ph: "заполняется автоматически" },
    ],
  },
  {
    id: "sicklist",
    title: "Листок нетрудоспособности",
    icon: "📄",
    fields: [
      { kind: "text", id: "sickNo", label: "Оформлен листок нетрудоспособности №" },
      { kind: "dateOnly", id: "sickDate", label: "Дата выдачи листка" },
      { kind: "text", id: "sickDupNo", label: "Дубликат листка нетрудоспособности №" },
      { kind: "dateOnly", id: "sickDupDate", label: "Дата дубликата" },
      { kind: "dateOnly", id: "releaseFrom", label: "Освобождение от работы С" },
      { kind: "dateOnly", id: "releaseTo", label: "Освобождение от работы ПО" },
      { kind: "text", id: "ext1No", label: "Продление № 1 — листок №" },
      { kind: "dateOnly", id: "ext1From", label: "Продление № 1 — с" },
      { kind: "dateOnly", id: "ext1To", label: "Продление № 1 — по" },
      { kind: "text", id: "ext2No", label: "Продление № 2 — листок №" },
      { kind: "dateOnly", id: "ext2From", label: "Продление № 2 — с" },
      { kind: "dateOnly", id: "ext2To", label: "Продление № 2 — по" },
      { kind: "dateOnly", id: "resume", label: "Приступить к работе с" },
      { kind: "dateOnly", id: "otherOrg", label: "Явка в другую медицинскую организацию" },
      { kind: "text", id: "careName", label: "Листок по уходу за больным членом семьи (Ф. И. О.)", big: true },
    ],
  },
  {
    id: "diagnosis-clin",
    title: "Клинический диагноз",
    icon: "📋",
    fields: [],
  },
  {
    id: "diagnosis-path",
    title: "Патологоанатомический диагноз",
    icon: "🔬",
    fields: [],
  },
  {
    id: "signs",
    title: "Подписи",
    icon: "✍️",
    fields: [
      { kind: "text", id: "doctorPosition", label: "Должность лечащего врача", ph: "врач-терапевт" },
      { kind: "text", id: "doctorName", label: "Ф. И. О. лечащего врача", ph: "Петрова Анна Сергеевна" },
      { kind: "text", id: "headName", label: "Ф. И. О. заведующего отделением", ph: "Смирнов Олег Викторович" },
    ],
  },
];

// Строки диагностических блоков
export const DIAG_ROWS: { prefix: string; label: string }[] = [
  { prefix: "Main", label: "Основное заболевание" },
  { prefix: "Comp", label: "Осложнения основного заболевания" },
  { prefix: "Ext", label: "Внешняя причина при травмах, отравлениях" },
  { prefix: "Conc", label: "Сопутствующие заболевания" },
  { prefix: "Extra", label: "Дополнительные сведения о заболевании" },
];

// ——— Демо-заполнение ———
export function demoState(): FormState {
  const s = emptyState();
  Object.assign(s, {
    orgName: "ГБУЗ «Городская клиническая больница № 1», г. Москва, ул. Строителей, д. 14, к. 2",
    orgOgrn: "1027700132197",
    okud: "",
    cardNo: "12584",
    patientName: "Иванов Иван Иванович",
    bd: "14", bm: "марта", by: "1978",
    sex: "1",
    citizenship: "Российская Федерация",
    regSubj: "г. Москва", regDistrict: "Западный АО", regCity: "Москва",
    regSettlement: "", regStreet: "ул. Строителей", regHouse: "14", regBuilding: "2", regFlat: "57",
    staySubj: "г. Москва", stayDistrict: "", stayCity: "Москва",
    staySettlement: "", stayStreet: "ул. Строителей", stayHouse: "14", stayBuilding: "2", stayFlat: "57",
    locality: "1", marital: "1", education: "6", employment: "1",
    workPlace: "ООО «ТехноПром», г. Москва", position: "инженер-технолог",
    disability: "не установлена", radiation: "2",
    omsNumber: "5503 0000 1234 5678", omsDay: "12", omsMonth: "мая", omsYear: "2021",
    insuranceOrg: "АО «МАКС-М»", snils: "112-233-445 95",
    admDay: "03", admMonth: "февраля", admYear: "2026", admHour: "09", admMin: "40",
    hoursAfterStart: "18",
    referral: "1", admissionType: "2", careForm: "1",
    alcohol: "признаков состояния опьянения не выявлено",
    payment: "1",
    refDiag: "Хронический бронхит, обострение", refDiagIcd: "J42",
    preMain: "Хроническая обструктивная болезнь лёгких, обострение", preMainIcd: "J44.1",
    preComp: "", preCompIcd: "", preExt: "", preExtIcd: "",
    preConc: "Эссенциальная гипертензия", preConcIcd: "I10",
    bloodGroup: "II (A)", rhesus: "положительная (Rh+)", kell: "отрицательный",
    testHiv: "2", testSyph: "4", testHep: "6",
    outcome: "1", result: "2",
    disDay: "14", disMonth: "февраля", disYear: "2026", disHour: "12", disMin: "20",
    totalDays: "11",
    sickNo: "910 245 678 901", sickDay: "03", sickMonth: "февраля", sickYear: "2026",
    relFromDay: "03", relFromMonth: "февраля", relFromYear: "2026",
    relToDay: "14", relToMonth: "февраля", relToYear: "2026",
    resumeDay: "15", resumeMonth: "февраля", resumeYear: "2026",
    clinMain: "Хроническая обструктивная болезнь лёгких, обострение средней степени тяжести", clinMainIcd: "J44.1",
    clinConc: "Эссенциальная гипертензия I ст., риск 3", clinConcIcd: "I10",
    doctorPosition: "врач-пульмонолог", doctorName: "Петрова Анна Сергеевна",
    headName: "Смирнов Олег Викторович",
  });
  s.departments = [
    {
      name: "Пульмонологическое отделение", profile: "пульмонологические",
      doctor: "Петрова А. С.", admit: "03.02.2026", discharge: "14.02.2026 12:20",
      disease: "ХОБЛ, обострение", icd: "J44.1", days: "11",
    },
    { ...emptyDept() },
  ];
  s.operations = [
    {
      datetime: "05.02.2026 10:00", surgeon: "Орлов Д. Н.", deptCode: "17",
      name: "Фибробронхоскопия с бронхоальвеолярным лаважем", nomen: "A16.12.028",
      complication: "", compIcd: "", anesthesia: "местная", endo: "1", laser: "", cryo: "", xray: "",
    },
  ];
  return s;
}
