import { employees, typeMeta } from "./data.js?v=6";

export const Badge = (text, tone = "neutral") => `<span class="badge badge--${tone}">${text}</span>`;
export const Button = (text, variant = "secondary", attrs = "") => `<button class="button button--${variant}" ${attrs}>${text}</button>`;

export function Sidebar() {
  return `<aside class="sidebar">
    <div class="brand"><span class="brand__mark">Б</span><span class="brand__name">Бизнес-банк</span></div>
    <div class="company"><span class="avatar avatar--company">СК</span><div><strong>СтройКомплект</strong><span>ООО ··· 4902</span></div><span class="chevron">⌄</span></div>
    <nav>
      <p class="nav-label">Управление</p>
      <button class="nav-item"><span>□</span><b>Доступы</b></button>
      <button class="nav-item is-active"><span>◷</span><b>Действия сотрудников</b></button>
      <button class="nav-item"><span>⌘</span><b>Интеграции и API</b></button>
      <button class="nav-item"><span>＋</span><b>Подключить 1С</b></button>
    </nav>
    <div class="sidebar__bottom"><div class="security-note"><span>✓</span><p><strong>Безопасность</strong><small>Доступы проверены 2 дня назад</small></p></div><button class="nav-item"><span>?</span><b>Помощь</b></button></div>
  </aside>`;
}

export function Metrics() {
  const employeesWithRisks = employees.filter(employee => employee.risks > 0);
  const totalRisks = employeesWithRisks.reduce((total, employee) => total + employee.risks, 0);
  if (!totalRisks) return "";
  return `<section class="risk-overview">
    <span class="risk-overview__icon">!</span>
    <div class="risk-overview__body"><div><span>Подозрительные операции</span><strong>${totalRisks}</strong></div><p>Проверьте отклонения и при необходимости ограничьте доступ сотрудника.</p></div>
    <div class="risk-overview__people">${employeesWithRisks.map(employee => `<button data-risk-employee="${employee.id}"><span class="avatar">${employee.initials}</span><span><strong>${employee.name}</strong><small>${employee.risks} ${employee.risks === 1 ? "операция" : "операции"}</small></span><b>›</b></button>`).join("")}</div>
  </section>`;
}

export function EmployeesList(selectedId, query = "") {
  const normalized = query.trim().toLowerCase();
  const visible = employees.filter(employee => `${employee.name} ${employee.role}`.toLowerCase().includes(normalized));
  return `<section class="section employees-section">
    <div class="section-head employee-list-head"><div><h2>Сотрудники</h2><p>Выберите сотрудника, чтобы посмотреть историю</p></div>
      <div class="employee-tools"><label class="search-field search-field--employees"><span>⌕</span><input id="employee-search" value="${query}" placeholder="Найти сотрудника"></label><span class="counter">${visible.length} с доступом</span></div>
    </div>
    <div class="employee-table">
      <div class="employee-table__head"><span>Сотрудник</span><span>Доступ</span><span>Последняя активность</span><span>Действия</span><span>Риски</span><span></span></div>
      <div class="employees">${visible.length ? visible.map(employee => EmployeeCard(employee, selectedId)).join("") : `<div class="employees-empty">Сотрудники не найдены</div>`}</div>
    </div>
  </section>`;
}

export function EmployeeCard(employee, selectedId) {
  return `<button class="employee-card ${employee.id === selectedId ? "is-selected" : ""} ${employee.risks ? "has-risk" : ""}" data-employee="${employee.id}">
    <div class="employee-card__person"><span class="avatar">${employee.initials}</span><div class="employee-main"><strong>${employee.name}</strong><span>${employee.role}</span></div></div>
    <span class="employee-access">${employee.sign ? "С правом подписи" : "Без права подписи"}</span>
    <span class="employee-last">${employee.last}</span>
    <strong class="employee-count">${employee.actions}</strong>
    <span class="employee-risk">${employee.risks ? Badge(`${employee.risks} риска`, "warning") : `<span class="no-risk">Нет</span>`}</span>
    <span class="employee-open">›</span>
  </button>`;
}

export function EmployeeSummary(employee, visibleEvents, period) {
  const risks = visibleEvents.filter(event => event.suspicious).length;
  return `<section class="employee-summary">
    <div class="employee-profile"><span class="avatar avatar--large">${employee.initials}</span><div><div class="eyebrow">Выбранный сотрудник</div><h2>${employee.name}</h2><p>${employee.role} · ${employee.sign ? "с правом подписи" : "без права подписи"}</p></div></div>
    <div class="summary-info"><div><span>Доступы к продуктам</span><strong>${employee.rights.join(", ")}</strong></div><div><span>Лимиты на операции</span><strong>${employee.limit}</strong></div><div><span>${period}</span><strong>${visibleEvents.length} действий · ${risks} рисков</strong></div></div>
    <div class="quick-actions">${Button("Изменить права", "secondary", 'data-toast="Открыта настройка прав доступа"')}${Button("Управлять доступом", "primary", 'data-toast="Открыто управление доступом"')}</div>
  </section>`;
}

export function FiltersPanel(state) {
  const types = ["Все типы", "Просмотры", "Документы", "Платежи", "Экспорт", "Входы", "Настройки"];
  const activeCount = Number(state.type !== "Все типы") + Number(state.onlyRisks) + Number(state.period !== "Сегодня") + Number(Boolean(state.eventQuery));
  const employeeRisks = employees.find(employee => employee.id === state.employeeId)?.risks || 0;
  return `<section class="filters-shell">
    <div class="filters-mobile-head"><button class="filter-toggle" id="filter-toggle">Фильтры ${activeCount ? `<b>${activeCount}</b>` : ""}<span>${state.filtersOpen ? "⌃" : "⌄"}</span></button></div>
    <div class="filters ${state.filtersOpen ? "is-open" : ""}">
      <label class="risk-filter ${state.onlyRisks ? "is-active" : ""}"><input type="checkbox" id="risk-filter" ${state.onlyRisks ? "checked" : ""}><span class="risk-filter__icon">!</span><span><b>Подозрительные действия</b><small>Быстрый фильтр</small></span><i>${state.onlyRisks ? "✓" : employeeRisks}</i></label>
      <div class="periods">${["Сегодня", "Вчера", "Неделя", "Месяц"].map(period => `<button class="${state.period === period ? "is-active" : ""}" data-period="${period}">${period}</button>`).join("")}</div>
      <label class="select-wrap"><span>Тип события</span><select id="type-filter">${types.map(type => `<option ${state.type === type ? "selected" : ""}>${type}</option>`).join("")}</select></label>
      <label class="search-field search-field--events"><span>⌕</span><input id="event-search" value="${state.eventQuery}" placeholder="Поиск по действиям"></label>
      ${activeCount ? `<button class="reset" id="reset-filters">Сбросить</button>` : ""}
    </div>
  </section>`;
}

export function ActionFeed(events) {
  if (!events.length) return EmptyState();
  const grouped = Object.groupBy ? Object.groupBy(events, event => event.date) : events.reduce((acc, event) => ((acc[event.date] ||= []).push(event), acc), {});
  return `<div class="feed">${Object.entries(grouped).map(([date, rows]) => `<div class="feed-group"><div class="feed-date"><span>${date}</span><i></i></div>${rows.map(ActionEventItem).join("")}</div>`).join("")}</div>`;
}

export function ActionEventItem(event) {
  const meta = typeMeta[event.type] || typeMeta["Просмотры"];
  return `<button class="event ${event.suspicious ? "is-suspicious" : ""}" data-event="${event.id}">
    <span class="event__icon event__icon--${meta.tone}">${meta.icon}</span>
    <div class="event__body"><div class="event__title">${event.title}${event.suspicious ? Badge("Необычная активность", "warning") : ""}</div><p>${event.description}</p><div class="event__meta">${Badge(event.type)}<span>${event.result}</span></div></div>
    <div class="event__time"><strong>${event.time}</strong><span>Подробнее ›</span></div>
  </button>`;
}

export function TimeActivityTab(events, period) {
  const suspicious = events.filter(event => event.suspicious).length;
  const activityByPeriod = {
    "Сегодня": [5, 3, 8, 2],
    "Вчера": [2, 6, 4, 3],
    "Неделя": [28, 37, 49, 9],
    "Месяц": [104, 146, 187, 31]
  };
  const compositionByPeriod = {
    "Сегодня": [["Выписки", 7, "brand"], ["Платежи", 5, "success"], ["Документы", 4, "warning"], ["Прочее", 2, "neutral"]],
    "Вчера": [["Выписки", 3, "brand"], ["Платежи", 7, "success"], ["Документы", 2, "warning"], ["Прочее", 3, "neutral"]],
    "Неделя": [["Выписки", 46, "brand"], ["Платежи", 31, "success"], ["Документы", 28, "warning"], ["Прочее", 18, "neutral"]],
    "Месяц": [["Выписки", 142, "brand"], ["Платежи", 96, "success"], ["Документы", 131, "warning"], ["Прочее", 99, "neutral"]]
  };
  const values = activityByPeriod[period] || activityByPeriod["Сегодня"];
  const composition = compositionByPeriod[period] || compositionByPeriod["Сегодня"];
  const compositionTotal = composition.reduce((total, item) => total + item[1], 0);
  let offset = 0;
  const segments = composition.map(item => {
    const start = offset;
    offset += item[1] / compositionTotal * 100;
    return `${DonutColor(item[2])} ${start.toFixed(1)}% ${offset.toFixed(1)}%`;
  }).join(", ");
  const max = Math.max(...values);
  const labels = ["09:00–12:00", "12:00–15:00", "15:00–18:00", "После 18:00"];
  const slots = labels.map((label, index) => ({ label, value: values[index], color: index === 3 ? "warning" : "brand", width: Math.max(8, Math.round(values[index] / max * 100)) }));
  const peak = slots.reduce((best, slot) => slot.value > best.value ? slot : best, slots[0]);
  return `<section class="activity-card"><div class="section-head"><div><h2>Активность сотрудника</h2><p>${period} · время и структура действий</p></div>${Badge(suspicious ? "Есть отклонения" : "Обычный ритм", suspicious ? "warning" : "success")}</div>
    <div class="activity-analytics">
      <div class="time-chart"><h3>По времени</h3><div class="chart" data-period-chart="${period}">${slots.map(slot => `<div class="bar-row"><span>${slot.label}</span><div class="bar-track"><i class="bar bar--${slot.color}" style="--bar-width:${slot.width}%"></i></div><strong>${slot.value}</strong></div>`).join("")}</div></div>
      <div class="composition-chart" data-period-composition="${period}"><div><h3>Чем занимался</h3><p>Распределение действий</p></div><div class="composition-chart__body"><div class="donut" style="--donut:${segments}"><span><strong>${compositionTotal}</strong><small>действий</small></span></div><div class="donut-legend">${composition.map(item => `<div><i class="donut-dot donut-dot--${item[2]}"></i><span>${item[0]}</span><strong>${item[1]}</strong><small>${Math.round(item[1] / compositionTotal * 100)}%</small></div>`).join("")}</div></div></div>
    </div>
    <div class="activity-insight"><span>i</span><div><strong>Пик активности: ${peak.label}</strong><p>За период «${period.toLowerCase()}» после 18:00 выполнено ${values[3]} действий. Подозрительных событий в текущем фильтре: ${suspicious}.</p></div></div>
  </section>`;
}

function DonutColor(tone) {
  return { brand: "var(--bg-brand)", success: "var(--bg-success)", warning: "var(--bg-warning)", neutral: "var(--bg-neutral-4)" }[tone];
}

export function LoginGeographyTab(logins) {
  const suspicious = logins.filter(login => login.suspicious).length;
  const countries = [...new Set(logins.map(login => login.country))];
  return `<section class="login-geography">
    <div class="login-geography__summary"><div><span class="login-geography__icon">◎</span><div><h2>География входов</h2><p>${countries.length} ${countries.length === 1 ? "страна" : "страны"} · ${logins.length} входа</p></div></div>${suspicious ? Badge("Резкая смена страны", "warning") : Badge("Обычная география", "success")}</div>
    ${suspicious ? `<div class="travel-alert"><span>!</span><div><strong>Невозможное перемещение</strong><p>Зафиксированы входы из разных стран с интервалом, недостаточным для реального перемещения.</p></div></div>` : ""}
    <div class="login-table"><div class="login-table__head"><span>Дата и время</span><span>IP-адрес</span><span>Город и страна</span><span>Устройство</span><span>Оценка</span></div>
      <div>${logins.map(LoginRow).join("")}</div>
    </div>
  </section>`;
}

function LoginRow(login) {
  return `<article class="login-row ${login.suspicious ? "is-suspicious" : ""}">
    <div><strong>${login.time}</strong><span>${login.date}</span></div>
    <code>${login.ip}</code>
    <div><strong>${login.city}</strong><span>${login.country}</span></div>
    <span>${login.device}</span>
    <div>${login.suspicious ? `${Badge("Подозрительный вход", "warning")}<small>${login.riskReason}</small>` : Badge("Без отклонений", "success")}</div>
  </article>`;
}

export function EmptyState() {
  return `<div class="empty"><span>⌕</span><h3>За выбранный период действий не найдено</h3><p>Попробуйте изменить запрос, период или сбросить фильтры</p>${Button("Сбросить фильтры", "secondary", 'id="empty-reset"')}</div>`;
}

export function EventDetailsDrawer(event, employee) {
  if (!event) return "";
  return `<div class="drawer-backdrop" id="drawer-backdrop"></div><aside class="drawer">
    <div class="drawer__head"><div><span class="eyebrow">Детали события</span><h2>${event.title}</h2></div><button class="icon-button" id="drawer-close">×</button></div>
    ${event.suspicious ? `<div class="risk-banner"><span>!</span><div><strong>Событие требует внимания</strong><p>${event.riskReason}</p></div></div>` : ""}
    <dl class="details"><div><dt>Сотрудник</dt><dd>${employee.name}</dd></div><div><dt>Дата и время</dt><dd>${event.date}, ${event.time}</dd></div><div><dt>Тип события</dt><dd>${event.type}</dd></div><div><dt>Результат</dt><dd>${event.result}</dd></div><div><dt>Устройство</dt><dd>${event.device}</dd></div><div><dt>Примерный город</dt><dd>${event.city}</dd></div><div><dt>IP-адрес</dt><dd>${event.ip}</dd></div><div><dt>Раздел банка</dt><dd>${event.section}</dd></div><div><dt>Связанный счёт</dt><dd>${event.account}</dd></div></dl>
    <div class="drawer__actions">${event.suspicious ? Button("Ограничить доступ", "danger", 'id="request-restrict"') : ""}${Button("Изменить права", "secondary", 'data-toast="Открыта настройка прав доступа"')}${Button("Закрыть", "ghost", 'id="drawer-close-bottom"')}</div>
  </aside>`;
}

export function ConfirmDialog(employee) {
  return `<div class="modal-backdrop" id="confirm-backdrop"></div><section class="confirm-dialog" role="dialog" aria-modal="true">
    <span class="confirm-dialog__icon">!</span><h2>Ограничить доступ?</h2><p>${employee.name} не сможет выполнять действия в интернет-банке. Доступ можно будет восстановить позже.</p>
    <div class="confirm-dialog__actions">${Button("Отмена", "secondary", 'id="confirm-cancel"')}${Button("Ограничить доступ", "danger", 'id="confirm-restrict"')}</div>
  </section>`;
}
