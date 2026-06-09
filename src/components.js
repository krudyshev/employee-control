import { employees, typeMeta } from "./data.js";

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
  return `<section class="metrics">
    <article class="metric"><span class="metric__icon brand">4</span><div><span>Сотрудников с доступом</span><strong>4</strong><small>Все доступы активны</small></div></article>
    <article class="metric"><span class="metric__icon success">✓</span><div><span>Активны сегодня</span><strong>2</strong><small>Последнее действие 17:25</small></div></article>
    <button class="metric metric--action" id="show-security-events"><span class="metric__icon warning">!</span><div><span>Требуют внимания</span><strong>2</strong><small>Показать события Дмитрия →</small></div></button>
  </section>`;
}

export function EmployeesList(selectedId, query = "") {
  const normalized = query.trim().toLowerCase();
  const visible = employees.filter(employee => `${employee.name} ${employee.role}`.toLowerCase().includes(normalized));
  return `<section class="section employees-section">
    <div class="section-head employee-list-head"><div><h2>Сотрудники</h2><p>Выберите сотрудника, чтобы посмотреть историю</p></div>
      <div class="employee-tools"><label class="search-field search-field--employees"><span>⌕</span><input id="employee-search" value="${query}" placeholder="Найти сотрудника"></label><span class="counter">${visible.length} с доступом</span><button class="mini-button" data-scroll-employees="-1" aria-label="Назад">‹</button><button class="mini-button" data-scroll-employees="1" aria-label="Вперёд">›</button></div>
    </div>
    <div class="employees">${visible.length ? visible.map(employee => EmployeeCard(employee, selectedId)).join("") : `<div class="employees-empty">Сотрудники не найдены</div>`}</div>
  </section>`;
}

export function EmployeeCard(employee, selectedId) {
  return `<button class="employee-card ${employee.id === selectedId ? "is-selected" : ""} ${employee.risks ? "has-risk" : ""}" data-employee="${employee.id}">
    <div class="employee-card__top"><span class="avatar">${employee.initials}</span><div class="employee-main"><strong>${employee.name}</strong><span>${employee.role}</span></div>${employee.risks ? Badge(`${employee.risks} риска`, "warning") : `<span class="ok-dot">✓</span>`}</div>
    <div class="employee-card__meta"><span>${employee.sign ? "С правом подписи" : "Без права подписи"}</span><span>Активность: ${employee.last}</span></div>
    <div class="employee-card__stats"><span><b>${employee.actions}</b> действий</span><span class="${employee.risks ? "risk-text" : ""}"><b>${employee.risks}</b> рисков</span></div>
  </button>`;
}

export function EmployeeSummary(employee, visibleEvents, period) {
  const risks = visibleEvents.filter(event => event.suspicious).length;
  return `<section class="employee-summary">
    <div class="employee-profile"><span class="avatar avatar--large">${employee.initials}</span><div><div class="eyebrow">Выбранный сотрудник</div><h2>${employee.name}</h2><p>${employee.role} · ${employee.sign ? "с правом подписи" : "без права подписи"}</p></div></div>
    <div class="summary-info"><div><span>Доступы</span><strong>${employee.rights.join(", ")}</strong></div><div><span>Лимит операций</span><strong>${employee.limit}</strong></div><div><span>${period}</span><strong>${visibleEvents.length} действий · ${risks} рисков</strong></div></div>
    <div class="quick-actions">${Button("Изменить права", "secondary", 'data-toast="Открыта настройка прав доступа"')}${Button("Управлять доступом", "primary", 'data-toast="Открыто управление доступом"')}</div>
  </section>`;
}

export function FiltersPanel(state) {
  const types = ["Все типы", "Просмотры", "Документы", "Платежи", "Экспорт", "Входы", "Настройки"];
  const activeCount = Number(state.type !== "Все типы") + Number(state.onlyRisks) + Number(state.period !== "Сегодня") + Number(Boolean(state.eventQuery));
  return `<section class="filters-shell">
    <div class="filters-mobile-head"><button class="filter-toggle" id="filter-toggle">Фильтры ${activeCount ? `<b>${activeCount}</b>` : ""}<span>${state.filtersOpen ? "⌃" : "⌄"}</span></button></div>
    <div class="filters ${state.filtersOpen ? "is-open" : ""}">
      <div class="periods">${["Сегодня", "Вчера", "Неделя", "Месяц"].map(period => `<button class="${state.period === period ? "is-active" : ""}" data-period="${period}">${period}</button>`).join("")}</div>
      <label class="select-wrap"><span>Тип события</span><select id="type-filter">${types.map(type => `<option ${state.type === type ? "selected" : ""}>${type}</option>`).join("")}</select></label>
      <label class="search-field search-field--events"><span>⌕</span><input id="event-search" value="${state.eventQuery}" placeholder="Поиск по действиям"></label>
      <label class="switch-wrap"><input type="checkbox" id="risk-filter" ${state.onlyRisks ? "checked" : ""}><span class="switch"></span><b>Только подозрительные</b></label>
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

export function TimeActivityTab(events) {
  const suspicious = events.filter(event => event.suspicious).length;
  const slots = [
    { label: "09:00–12:00", value: 5, color: "brand" }, { label: "12:00–15:00", value: 3, color: "brand" },
    { label: "15:00–18:00", value: 8, color: "brand" }, { label: "После 18:00", value: suspicious || 2, color: "warning" }
  ];
  return `<section class="activity-card"><div class="section-head"><div><h2>Активность по времени</h2><p>Распределение действий за выбранный период</p></div>${Badge(suspicious ? "Есть отклонения" : "Обычный ритм", suspicious ? "warning" : "success")}</div>
    <div class="chart">${slots.map(slot => `<div class="bar-row"><span>${slot.label}</span><div class="bar-track"><i class="bar bar--${slot.color}" style="width:${slot.value * 10}%"></i></div><strong>${slot.value}</strong></div>`).join("")}</div>
    <div class="activity-insight"><span>i</span><div><strong>Основная активность — с 15:00 до 18:00</strong><p>За пределами обычного времени найдено ${suspicious} событий, которые стоит проверить.</p></div></div>
  </section>`;
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
