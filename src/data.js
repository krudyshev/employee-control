export const employees = [
  { id: "anna", initials: "АП", name: "Анна Петрова", role: "Бухгалтер", sign: false, rights: ["Платежи", "Выписки", "Контрагенты"], limit: "до 100 000 ₽", last: "сегодня, 18:42", actions: 13, risks: 1 },
  { id: "dmitry", initials: "ДК", name: "Дмитрий Козлов", role: "Финансовый директор", sign: true, rights: ["Платежи", "Аналитика", "Документы", "Выписки"], limit: "без лимита", last: "вчера, 22:14", actions: 8, risks: 2 },
  { id: "elena", initials: "ЕС", name: "Елена Сидорова", role: "Помощник", sign: false, rights: ["Выписки", "Контрагенты"], limit: "нет", last: "3 июня, 11:32", actions: 4, risks: 0 },
  { id: "alexey", initials: "АН", name: "Алексей Новиков", role: "Бухгалтер", sign: false, rights: ["Документы", "Выписки"], limit: "до 50 000 ₽", last: "сегодня, 15:08", actions: 9, risks: 0 }
];

const common = [
  ["Просмотр истории операций", "Период: текущий месяц", "Просмотры", "17:25", "Успешно"],
  ["Просмотр баланса по счетам", "3 счета", "Просмотры", "16:24", "Успешно"],
  ["Формирование декларации", "Декларация по УСН", "Документы", "16:17", "Успешно"],
  ["Экспорт выписки", "PDF · основной счёт", "Экспорт", "16:07", "Успешно"],
  ["Просмотр контрагентов", "ООО «Ромашка»", "Просмотры", "16:00", "Успешно"],
  ["Изменение шаблона платежа", "Аренда офиса", "Настройки", "15:41", "Успешно"],
  ["Скачивание документа", "Акт сверки", "Документы", "14:55", "Успешно"],
  ["Просмотр выписки", "Период: 1–31 мая", "Просмотры", "13:28", "Успешно"],
  ["Создание платежа", "ООО «Вектор» · 42 500 ₽", "Платежи", "12:16", "На проверке"],
  ["Вход в интернет-банк", "Chrome · Windows", "Входы", "09:04", "Успешно"]
];

const risks = [
  ["Вход с нового устройства", "Chrome, Windows · Москва", "Входы", "22:14", "Требует внимания", "Новое устройство и необычное время активности"],
  ["Экспорт выписки вне обычного времени", "PDF · 5 счетов", "Экспорт", "23:48", "Требует внимания", "Действие выполнено вне обычного времени активности"],
  ["Операция отклонена: превышен лимит", "Платёж 250 000 ₽ · доступный лимит 100 000 ₽", "Платежи", "18:42", "Отклонено", "Сумма операции превышает установленный лимит на 150 000 ₽"]
];

const devices = ["Chrome · Windows 11", "Safari · macOS", "Chrome · Windows 11", "Edge · Windows 10"];
export const events = employees.flatMap((employee, employeeIndex) => {
  const rows = [...common.slice(employeeIndex, 10), ...common.slice(0, employeeIndex)];
  if (employee.id === "dmitry") rows.splice(1, 0, ...risks.slice(0, 2));
  if (employee.id === "anna") rows.splice(1, 0, risks[2]);
  return rows.map((row, index) => ({
    id: `${employee.id}-${index}`,
    employeeId: employee.id,
    title: row[0],
    description: row[1],
    type: row[2],
    time: row[3],
    result: row[4],
    riskReason: row[5] || "",
    suspicious: Boolean(row[5]),
    date: index < 5 ? "Сегодня" : "Вчера",
    device: devices[employeeIndex],
    browser: devices[employeeIndex].split(" · ")[0],
    city: employee.id === "dmitry" ? "Москва" : "Екатеринбург",
    ip: `192.168.${employeeIndex + 1}.${44 + index}`,
    section: row[2],
    account: row[2] === "Платежи" || row[2] === "Экспорт" ? "Основной ·· 4281" : "Не связан"
  }));
});

export const typeMeta = {
  "Просмотры": { icon: "◉", tone: "brand" },
  "Документы": { icon: "▤", tone: "neutral" },
  "Платежи": { icon: "₽", tone: "warning" },
  "Экспорт": { icon: "↓", tone: "brand" },
  "Входы": { icon: "↗", tone: "success" },
  "Настройки": { icon: "⌘", tone: "neutral" }
};
