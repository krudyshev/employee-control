import { employees, events, loginHistory } from "./data.js?v=5";
import { Sidebar, Metrics, EmployeesList, EmployeeSummary, FiltersPanel, ActionFeed, TimeActivityTab, LoginGeographyTab, EventDetailsDrawer, ConfirmDialog, Button } from "./components.js?v=5";

const app = document.querySelector("#app");
const state = { employeeId: "anna", tab: "feed", period: "Сегодня", type: "Все типы", onlyRisks: false, eventQuery: "", employeeQuery: "", filtersOpen: false, drawerId: null, confirmRestrict: false, toast: "" };

function filteredEvents() {
  const query = state.eventQuery.trim().toLowerCase();
  return events.filter(event =>
    event.employeeId === state.employeeId &&
    (state.type === "Все типы" || event.type === state.type) &&
    (!state.onlyRisks || event.suspicious) &&
    (state.period !== "Сегодня" || event.date === "Сегодня") &&
    (state.period !== "Вчера" || event.date === "Вчера") &&
    (!query || `${event.title} ${event.description} ${event.type} ${event.result}`.toLowerCase().includes(query))
  );
}

function render(options = {}) {
  const employee = employees.find(item => item.id === state.employeeId);
  const visibleEvents = filteredEvents();
  const employeeLogins = loginHistory[state.employeeId] || [];
  const drawerEvent = events.find(item => item.id === state.drawerId);
  app.innerHTML = `<div class="layout">${Sidebar()}<button class="sidebar-backdrop" id="sidebar-backdrop" aria-label="Закрыть меню"></button><main>
    <button class="mobile-menu" id="mobile-menu">☰</button>
    <div class="content">
      <section class="hero"><h1>Действия сотрудников</h1></section>
      ${Metrics()}${EmployeesList(state.employeeId, state.employeeQuery)}
      <div class="workspace-label"><span>Рабочая область сотрудника</span><i></i></div>
      <section class="employee-workspace">
        ${EmployeeSummary(employee, visibleEvents, state.period)}
        <section class="history-section" id="history"><div class="history-head"><div><h2>История действий</h2><p>${employee.name} · ${state.tab === "geography" ? `${employeeLogins.length} входа` : `${visibleEvents.length} событий · ${state.period.toLowerCase()}`}</p></div>${Button("Скачать журнал", "secondary", 'id="download-log"')}</div>
          <div class="tabs"><button class="${state.tab === "feed" ? "is-active" : ""}" data-tab="feed">Лента действий</button><button class="${state.tab === "time" ? "is-active" : ""}" data-tab="time">Активность по времени</button><button class="${state.tab === "geography" ? "is-active" : ""}" data-tab="geography">IP и география${employeeLogins.some(login => login.suspicious) ? `<b>!</b>` : ""}</button></div>
          ${state.tab === "geography" ? LoginGeographyTab(employeeLogins) : `${FiltersPanel(state)}${state.tab === "feed" ? ActionFeed(visibleEvents) : TimeActivityTab(visibleEvents, state.period)}`}
        </section>
      </section>
    </div>
  </main></div>${EventDetailsDrawer(drawerEvent, employee)}${state.confirmRestrict ? ConfirmDialog(employee) : ""}${state.toast ? `<div class="toast"><span>✓</span>${state.toast}</div>` : ""}`;
  bind();
  if (options.scrollSelected) document.querySelector(".employee-card.is-selected")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  if (options.focusEmployeeSearch) { const input = document.querySelector("#employee-search"); input?.focus(); input?.setSelectionRange(input.value.length, input.value.length); }
  if (options.focusEventSearch) { const input = document.querySelector("#event-search"); input?.focus(); input?.setSelectionRange(input.value.length, input.value.length); }
}

function showToast(message) {
  state.toast = message;
  render();
  setTimeout(() => { state.toast = ""; render(); }, 2200);
}

function resetFilters() {
  Object.assign(state, { period: "Сегодня", type: "Все типы", onlyRisks: false, eventQuery: "" });
  render();
}

function bind() {
  document.querySelectorAll("[data-employee]").forEach(button => button.addEventListener("click", () => { state.employeeId = button.dataset.employee; state.drawerId = null; render({ scrollSelected: true }); }));
  document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => { state.tab = button.dataset.tab; render(); }));
  document.querySelectorAll("[data-period]").forEach(button => button.addEventListener("click", () => { state.period = button.dataset.period; render(); }));
  document.querySelectorAll("[data-event]").forEach(button => button.addEventListener("click", () => { state.drawerId = button.dataset.event; render(); }));
  document.querySelectorAll("[data-toast]").forEach(button => button.addEventListener("click", () => showToast(button.dataset.toast)));
  document.querySelector("#employee-search")?.addEventListener("input", event => { state.employeeQuery = event.target.value; render({ focusEmployeeSearch: true }); });
  document.querySelector("#event-search")?.addEventListener("input", event => { state.eventQuery = event.target.value; render({ focusEventSearch: true }); });
  document.querySelector("#type-filter")?.addEventListener("change", event => { state.type = event.target.value; render(); });
  document.querySelector("#risk-filter")?.addEventListener("change", event => { state.onlyRisks = event.target.checked; render(); });
  document.querySelector("#filter-toggle")?.addEventListener("click", () => { state.filtersOpen = !state.filtersOpen; render(); });
  document.querySelectorAll("[data-risk-employee]").forEach(button => button.addEventListener("click", () => { state.employeeId = button.dataset.riskEmployee; state.onlyRisks = true; state.period = "Неделя"; state.filtersOpen = true; render({ scrollSelected: true }); document.querySelector("#history")?.scrollIntoView({ behavior: "smooth" }); }));
  document.querySelector("#reset-filters")?.addEventListener("click", resetFilters);
  document.querySelector("#empty-reset")?.addEventListener("click", resetFilters);
  document.querySelector("#drawer-close")?.addEventListener("click", () => { state.drawerId = null; render(); });
  document.querySelector("#drawer-close-bottom")?.addEventListener("click", () => { state.drawerId = null; render(); });
  document.querySelector("#drawer-backdrop")?.addEventListener("click", () => { state.drawerId = null; render(); });
  document.querySelector("#request-restrict")?.addEventListener("click", () => { state.confirmRestrict = true; render(); });
  document.querySelector("#confirm-cancel")?.addEventListener("click", () => { state.confirmRestrict = false; render(); });
  document.querySelector("#confirm-backdrop")?.addEventListener("click", () => { state.confirmRestrict = false; render(); });
  document.querySelector("#confirm-restrict")?.addEventListener("click", () => { state.confirmRestrict = false; state.drawerId = null; showToast("Доступ сотрудника ограничен"); });
  document.querySelector("#mobile-menu")?.addEventListener("click", () => {
    document.querySelector(".sidebar")?.classList.toggle("is-open");
    document.querySelector(".sidebar-backdrop")?.classList.toggle("is-open");
  });
  document.querySelector("#sidebar-backdrop")?.addEventListener("click", closeMobileMenu);
  document.querySelector("main")?.addEventListener("click", event => {
    if (!event.target.closest("#mobile-menu")) closeMobileMenu();
  });
  document.onkeydown = handleEscape;
  document.querySelector("#download-log")?.addEventListener("click", () => {
    const rows = filteredEvents().map(event => `${event.date};${event.time};${event.title};${event.type};${event.result}`).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([`Дата;Время;Событие;Тип;Результат\n${rows}`], { type: "text/csv;charset=utf-8" }));
    link.download = `journal-${state.employeeId}.csv`;
    link.click();
    showToast("Журнал подготовлен и скачан");
  });
}

function closeMobileMenu() {
  document.querySelector(".sidebar")?.classList.remove("is-open");
  document.querySelector(".sidebar-backdrop")?.classList.remove("is-open");
}

function handleEscape(event) {
  if (event.key === "Escape") closeMobileMenu();
}

render();
