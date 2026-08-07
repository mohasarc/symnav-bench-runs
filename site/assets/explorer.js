import { pairedChart, scatterChart, upliftChart, percent, points } from "./charts.js";
import {
  FACETS,
  METRICS,
  applySelection,
  defaultSelection,
  facetValues,
  label,
  metricValue,
  plottable,
  seriesOf,
} from "./series.js";

const API_INDEX = "./api/index.json";
const API_STUDY = (id) => `./api/studies/${id}.json`;

class FacetMenu {
  constructor(facet, values, selection, onChange) {
    this.facet = facet;
    this.values = values;
    this.selection = selection;
    this.onChange = onChange;
    this.element = document.createElement("div");
    this.element.className = "facet";
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.className = "facet-button";
    this.button.setAttribute("aria-expanded", "false");
    this.menu = document.createElement("div");
    this.menu.className = "facet-menu";
    this.menu.hidden = true;
    this.element.append(this.button, this.menu);
    this.button.addEventListener("click", () => this.toggle());
    this.render();
  }

  toggle() {
    const open = this.menu.hidden;
    for (const other of document.querySelectorAll(".facet-menu")) other.hidden = true;
    for (const other of document.querySelectorAll(".facet-button")) {
      other.setAttribute("aria-expanded", "false");
    }
    this.menu.hidden = !open;
    this.button.setAttribute("aria-expanded", String(open));
  }

  render() {
    const chosen = this.selection.get(this.facet.id);
    const summary =
      chosen.size === this.values.length
        ? "all"
        : chosen.size === 0
          ? "none"
          : chosen.size === 1
            ? [...chosen][0]
            : `${chosen.size} of ${this.values.length}`;
    this.button.replaceChildren();
    const name = document.createElement("span");
    name.className = "facet-name";
    name.textContent = this.facet.name;
    const value = document.createElement("span");
    value.className = "facet-value";
    value.textContent = summary;
    this.button.append(name, value);

    this.menu.replaceChildren();
    const actions = document.createElement("div");
    actions.className = "facet-menu-actions";
    actions.append(
      this.action("All", () => this.values.forEach((item) => chosen.add(item.value))),
      this.action("None", () => chosen.clear()),
    );
    this.menu.append(actions);
    for (const item of this.values) {
      const option = document.createElement("label");
      option.className = "facet-option";
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = chosen.has(item.value);
      box.addEventListener("change", () => {
        if (box.checked) chosen.add(item.value);
        else chosen.delete(item.value);
        this.onChange();
      });
      const text = document.createElement("span");
      text.textContent = String(item.value);
      const count = document.createElement("span");
      count.className = "facet-count";
      count.textContent = String(item.count);
      option.append(box, text, count);
      this.menu.append(option);
    }
  }

  action(text, mutate) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ghost-button";
    button.textContent = text;
    button.addEventListener("click", () => {
      mutate();
      this.onChange();
    });
    return button;
  }
}

class Explorer {
  constructor(index) {
    this.index = index;
    this.series = seriesOf(index);
    this.selection = defaultSelection(this.series);
    this.metric = METRICS[0].id;
    this.zoom = true;
    this.activeKey = null;
    this.facetMenus = [];
  }

  mount() {
    this.renderHeadline();
    this.renderFacets();
    this.renderMetricSwitch();
    document.getElementById("zoom-toggle").addEventListener("change", (event) => {
      this.zoom = event.target.checked;
      this.renderViews();
    });
    document.getElementById("reset-filters").addEventListener("click", () => {
      this.selection = defaultSelection(this.series);
      this.renderFacets();
      this.renderViews();
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest(".facet")) return;
      for (const menu of document.querySelectorAll(".facet-menu")) menu.hidden = true;
      for (const button of document.querySelectorAll(".facet-button")) {
        button.setAttribute("aria-expanded", "false");
      }
    });
    this.renderViews();
  }

  renderHeadline() {
    const studies = this.index.studies;
    const valid = studies.filter((study) => study.validity === "valid");
    const stats = [
      ["studies", String(studies.length)],
      ["analysable", String(valid.length)],
      ["benchmarks", String(new Set(studies.map((study) => study.benchmark)).size)],
      ["symnav versions", String(this.index.symnav_versions.length)],
    ];
    const list = document.getElementById("headline-stats");
    list.replaceChildren();
    for (const [term, value] of stats) {
      const group = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = term;
      const dd = document.createElement("dd");
      dd.textContent = value;
      group.append(dt, dd);
      list.append(group);
    }
  }

  renderFacets() {
    const row = document.getElementById("filter-row");
    row.replaceChildren();
    this.facetMenus = FACETS.map((facet) => {
      const menu = new FacetMenu(
        facet,
        facetValues(this.series, facet),
        this.selection,
        () => {
          for (const item of this.facetMenus) item.render();
          this.renderViews();
        },
      );
      row.append(menu.element);
      return menu;
    });
  }

  renderMetricSwitch() {
    const group = document.getElementById("metric-switch");
    group.replaceChildren();
    for (const metric of METRICS) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = metric.label;
      button.setAttribute("aria-pressed", String(metric.id === this.metric));
      button.addEventListener("click", () => {
        this.metric = metric.id;
        this.renderMetricSwitch();
        this.renderViews();
      });
      group.append(button);
    }
  }

  selected() {
    return applySelection(this.series, this.selection).sort((left, right) => {
      const delta = metricValue(right, "symnav", this.metric) - metricValue(left, "symnav", this.metric);
      return Number.isFinite(delta) && delta !== 0 ? delta : left.key.localeCompare(right.key);
    });
  }

  metricLabel() {
    return METRICS.find((metric) => metric.id === this.metric).label;
  }

  renderViews() {
    const selected = this.selected();
    const rows = plottable(selected, this.metric);
    const options = { zoom: this.zoom, metricLabel: this.metricLabel() };
    document.getElementById("selection-count").textContent =
      `${selected.length} of ${this.series.length} series`;
    pairedChart(document.getElementById("chart-paired"), rows, options);
    scatterChart(document.getElementById("chart-scatter"), rows, options);
    upliftChart(document.getElementById("chart-uplift"), rows, options);
    this.renderTable(selected, rows);
  }

  renderTable(selected, rows) {
    const table = document.getElementById("series-table");
    table.replaceChildren();
    const head = document.createElement("thead");
    head.innerHTML =
      "<tr><th>#</th><th class='text'>Study</th><th class='text'>Model</th><th class='text'>Benchmark</th>" +
      "<th class='text'>Symnav</th><th>Reps</th><th>Stock</th><th>Symnav</th><th>Uplift pp</th>" +
      "<th>W/T/L</th><th>Adoption</th><th>Coverage</th><th>Cost</th><th class='text'>Validity</th></tr>";
    table.append(head);
    const body = document.createElement("tbody");
    selected.forEach((series, position) => {
      const row = rows[position];
      const stock = series.arms.get("stock");
      const symnav = series.arms.get("symnav");
      const comparison = series.comparison ?? {};
      const scored = (stock?.scored_slots ?? 0) + (symnav?.scored_slots ?? 0);
      const planned = (stock?.planned_slots ?? 0) + (symnav?.planned_slots ?? 0);
      const cost = (stock?.cost ?? 0) + (symnav?.cost ?? 0);
      const tr = document.createElement("tr");
      if (series.key === this.activeKey) tr.classList.add("selected");
      tr.innerHTML =
        `<td class='numeric'>${row.index}</td>` +
        `<td class='text'>${series.studyId}</td>` +
        `<td class='text'>${series.model} · ${series.effort}</td>` +
        `<td class='text'>${series.benchmark}</td>` +
        `<td class='text'>${series.symnavVersion ? `v${series.symnavVersion}` : "—"}</td>` +
        `<td class='numeric'>${series.repetitions ?? "—"}</td>` +
        `<td class='numeric'>${percent(row.stock)}</td>` +
        `<td class='numeric'>${percent(row.treatment)}</td>` +
        `<td class='numeric'>${points(row.uplift)}</td>` +
        `<td class='numeric'>${comparison.wins ?? "—"}/${comparison.ties ?? "—"}/${comparison.losses ?? "—"}</td>` +
        `<td class='numeric'>${percent(symnav?.adoption_rate, 0)}</td>` +
        `<td class='numeric'>${scored}/${planned}</td>` +
        `<td class='numeric'>$${cost.toFixed(2)}</td>` +
        `<td class='text'><span class='chip ${series.validity}'>${series.validity}</span></td>`;
      tr.addEventListener("click", () => this.openDetail(series));
      body.append(tr);
    });
    table.append(body);
  }

  async openDetail(series) {
    this.activeKey = series.key;
    const panel = document.getElementById("detail-panel");
    const body = document.getElementById("detail-body");
    const subtitle = document.getElementById("detail-subtitle");
    panel.hidden = false;
    subtitle.textContent = `${label(series)} — loading task rows…`;
    body.replaceChildren();
    this.renderViews();
    try {
      const analysis = await (await fetch(API_STUDY(series.studyId))).json();
      this.renderDetail(series, analysis);
    } catch (error) {
      subtitle.textContent = `${label(series)} — could not load task detail (${error.message})`;
    }
  }

  renderDetail(series, analysis) {
    const subtitle = document.getElementById("detail-subtitle");
    const body = document.getElementById("detail-body");
    const byTask = new Map();
    for (const task of analysis.tasks ?? []) {
      if (!byTask.has(task.task)) byTask.set(task.task, {});
      byTask.get(task.task)[task.condition] = task;
    }
    subtitle.textContent =
      `${label(series)} — ${byTask.size} tasks · ` +
      `${analysis.coverage.scored_slots}/${analysis.coverage.planned_slots} slots scored` +
      (series.note ? ` · ${series.note}` : "");
    const grid = document.createElement("div");
    grid.className = "detail-grid";
    for (const [task, conditions] of [...byTask].sort()) {
      const item = document.createElement("div");
      item.className = "detail-task";
      const name = document.createElement("span");
      name.className = "task-name";
      name.textContent = task;
      name.title = task;
      item.append(name);
      for (const condition of ["stock", "symnav"]) {
        const cell = document.createElement("span");
        const score = conditions[condition]?.metrics?.performance_score;
        cell.className = `cell ${this.cellClass(score)}`;
        cell.textContent = typeof score === "number" ? `${Math.round(score * 100)}` : "·";
        cell.title = `${condition}: ${percent(score, 0)}`;
        item.append(cell);
      }
      grid.append(item);
    }
    body.replaceChildren(grid);
    const link = document.createElement("p");
    link.className = "status";
    link.innerHTML = `<a href="./studies/${series.studyId}/">Open the full ${series.studyId} dashboard →</a>`;
    body.append(link);
  }

  cellClass(score) {
    if (typeof score !== "number") return "hit-missing";
    if (score >= 1) return "hit-full";
    if (score <= 0) return "hit-none";
    return "hit-partial";
  }
}

async function start() {
  const status = document.getElementById("status");
  try {
    const response = await fetch(API_INDEX);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const index = await response.json();
    new Explorer(index).mount();
    status.textContent = `Loaded ${index.studies.length} studies from ${API_INDEX}.`;
  } catch (error) {
    status.textContent = `Could not load ${API_INDEX}: ${error.message}`;
  }
}

start();
