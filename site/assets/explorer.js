import {
  adoptionChart,
  benchmarkGrid,
  coverageChart,
  frontierChart,
  money,
  percent,
  points,
  upliftChart,
} from "./charts.js";
import { Palette } from "./palette.js";
import {
  FACETS,
  METRICS,
  adoptionRate,
  applySelection,
  costPerTask,
  defaultSelection,
  facetValues,
  facetVisible,
  label,
  metricValue,
  seriesOf,
  studyTail,
  upliftOf,
} from "./series.js";

const API_INDEX = "./api/index.json";
const API_STUDY = (id) => `./api/studies/${id}.json`;

class Explorer {
  constructor(index) {
    this.index = index;
    this.series = seriesOf(index);
    this.palette = new Palette(this.series);
    this.selection = defaultSelection(this.series);
    this.muted = new Set();
    this.metric = METRICS[0].id;
    this.zoom = true;
  }

  mount() {
    this.renderStats();
    this.renderFacets();
    this.renderLegend();
    this.renderMetricSwitch();
    document.getElementById("zoom-toggle").addEventListener("change", (event) => {
      this.zoom = event.target.checked;
      this.renderCharts();
    });
    for (const button of document.querySelectorAll("[data-series-action]")) {
      button.addEventListener("click", () => {
        const visible = facetVisible(this.series, this.selection);
        if (button.dataset.seriesAction === "none") {
          for (const item of visible) this.muted.add(item.key);
        } else {
          for (const item of visible) this.muted.delete(item.key);
        }
        this.render();
      });
    }
    this.render();
  }

  render() {
    this.renderSeriesList();
    this.renderCharts();
  }

  renderStats() {
    const studies = this.index.studies;
    const stats = [
      ["studies", studies.length],
      ["benchmarks", new Set(studies.map((s) => s.benchmark)).size],
      ["models", this.palette.models.size],
      ["symnav versions", this.index.symnav_versions.length],
    ];
    const list = document.getElementById("headline-stats");
    list.replaceChildren();
    for (const [term, value] of stats) {
      const group = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = term;
      const dd = document.createElement("dd");
      dd.textContent = String(value);
      group.append(dt, dd);
      list.append(group);
    }
  }

  renderFacets() {
    const host = document.getElementById("facet-list");
    host.replaceChildren();
    for (const facet of FACETS) {
      const block = document.createElement("div");
      block.className = "facet";
      const name = document.createElement("p");
      name.className = "facet-name";
      name.textContent = facet.name;
      const values = document.createElement("div");
      values.className = "facet-values";
      for (const item of facetValues(this.series, facet)) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chip-toggle";
        button.textContent = String(item.value);
        const chosen = this.selection.get(facet.id);
        button.setAttribute("aria-pressed", String(chosen.has(item.value)));
        button.addEventListener("click", () => {
          if (chosen.has(item.value)) chosen.delete(item.value);
          else chosen.add(item.value);
          button.setAttribute("aria-pressed", String(chosen.has(item.value)));
          this.render();
        });
        values.append(button);
      }
      block.append(name, values);
      host.append(block);
    }
  }

  renderLegend() {
    const host = document.getElementById("legend");
    host.replaceChildren();
    host.append(
      this.legendGroup(
        "model",
        this.palette.modelEntries().map(([name, color]) => this.legendItem(name, color, "swatch")),
      ),
      this.legendGroup(
        "benchmark",
        Palette.benchmarkEntries(new Set(this.series.map((item) => item.benchmark))).map(
          ([name, color]) => this.legendItem(name, color, "swatch bar"),
        ),
      ),
      this.legendGroup("arm", [
        this.legendItem("stock", null, "swatch hollow"),
        this.legendItem("symnav", "var(--rule)", "swatch"),
      ]),
    );
  }

  legendGroup(title, items) {
    const group = document.createElement("div");
    group.className = "legend-group";
    const heading = document.createElement("p");
    heading.textContent = title;
    group.append(heading, ...items);
    return group;
  }

  legendItem(name, color, swatchClass) {
    const item = document.createElement("div");
    item.className = "legend-item";
    const swatch = document.createElement("span");
    swatch.className = swatchClass;
    if (color) swatch.style.background = color;
    const text = document.createElement("span");
    text.textContent = name;
    item.append(swatch, text);
    return item;
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
        this.renderCharts();
      });
      group.append(button);
    }
  }

  renderSeriesList() {
    const host = document.getElementById("series-list");
    host.replaceChildren();
    const visible = facetVisible(this.series, this.selection);
    const numbered = this.numbered();
    for (const item of visible) {
      const row = document.createElement("label");
      row.className = this.muted.has(item.key) ? "series-row off" : "series-row";
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = !this.muted.has(item.key);
      box.addEventListener("change", () => {
        if (box.checked) this.muted.delete(item.key);
        else this.muted.add(item.key);
        this.render();
      });
      const index = document.createElement("span");
      index.className = "idx";
      index.textContent = numbered.has(item.key) ? String(numbered.get(item.key)) : "";
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.background = this.palette.series(item.key);
      const name = document.createElement("span");
      name.className = "series-name";
      name.textContent = `${item.model} · ${item.benchmark} · ${studyTail(item)}`;
      name.title = item.studyId;
      row.append(box, index, swatch, name);
      host.append(row);
    }
  }

  selected() {
    return applySelection(this.series, this.selection, this.muted);
  }

  numbered() {
    const map = new Map();
    this.selected().forEach((item, position) => map.set(item.key, position + 1));
    return map;
  }

  metricLabel() {
    return METRICS.find((metric) => metric.id === this.metric).label;
  }

  rows() {
    return this.selected().map((item, position) => {
      const stockArm = item.arms.get("stock");
      const symnavArm = item.arms.get("symnav");
      const scored = (stockArm?.scored_slots ?? 0) + (symnavArm?.scored_slots ?? 0);
      const planned = (stockArm?.planned_slots ?? 0) + (symnavArm?.planned_slots ?? 0);
      return {
        index: position + 1,
        key: item.key,
        series: item,
        color: this.palette.series(item.key),
        benchmark: item.benchmark,
        model: item.model,
        shortLabel: `${item.model} · ${item.benchmark} · ${studyTail(item)}`,
        stock: metricValue(item, "stock", this.metric),
        treatment: metricValue(item, "symnav", this.metric),
        uplift: upliftOf(item, this.metric),
        adoption: adoptionRate(item),
        scored,
        planned,
        coverageRatio: planned ? scored / planned : 0,
      };
    });
  }

  armRows(rows) {
    const arms = [];
    for (const row of rows) {
      for (const condition of ["stock", "symnav"]) {
        arms.push({
          ...row,
          condition,
          score: metricValue(row.series, condition, this.metric),
          cost: costPerTask(row.series, condition),
        });
      }
    }
    return arms;
  }

  renderCharts() {
    const rows = this.rows();
    const options = {
      zoom: this.zoom,
      metricLabel: this.metricLabel(),
      modelColor: (name) => this.palette.model(name),
      benchmarkColor: (name) => Palette.benchmark(name),
    };
    document.getElementById("selection-count").textContent =
      `${rows.length} of ${this.series.length} series`;
    frontierChart(document.getElementById("chart-frontier"), this.armRows(rows), options);
    upliftChart(document.getElementById("chart-uplift"), rows, options);
    benchmarkGrid(document.getElementById("chart-grid"), rows, options);
    adoptionChart(document.getElementById("chart-adoption"), rows, options);
    coverageChart(document.getElementById("chart-coverage"), rows);
    this.renderTable(rows);
  }

  renderTable(rows) {
    const table = document.getElementById("series-table");
    table.replaceChildren();
    const head = document.createElement("thead");
    head.innerHTML =
      "<tr><th>#</th><th class='text'>Study</th><th class='text'>Model</th><th class='text'>Benchmark</th>" +
      "<th class='text'>Symnav</th><th>Reps</th><th>Stock</th><th>Symnav</th><th>Uplift pp</th>" +
      "<th>W/T/L</th><th>Adoption</th><th>$/task</th><th>Coverage</th><th class='text'>Validity</th></tr>";
    table.append(head);
    const body = document.createElement("tbody");
    for (const row of rows) {
      const item = row.series;
      const comparison = item.comparison ?? {};
      const tr = document.createElement("tr");
      const upliftClass = Number.isFinite(row.uplift) ? (row.uplift >= 0 ? "gain" : "loss") : "";
      tr.innerHTML =
        `<td class='num'>${row.index}</td>` +
        `<td class='text'><span class='dot' style='background:${row.color}'></span>${item.studyId}</td>` +
        `<td class='text'>${item.model} · ${item.effort}</td>` +
        `<td class='text'>${item.benchmark}</td>` +
        `<td class='text'>${item.symnavVersion ? `v${item.symnavVersion}` : "—"}</td>` +
        `<td class='num'>${item.repetitions ?? "—"}</td>` +
        `<td class='num'>${percent(row.stock)}</td>` +
        `<td class='num'>${percent(row.treatment)}</td>` +
        `<td class='num ${upliftClass}'>${points(row.uplift)}</td>` +
        `<td class='num'>${comparison.wins ?? "—"}/${comparison.ties ?? "—"}/${comparison.losses ?? "—"}</td>` +
        `<td class='num'>${percent(row.adoption, 0)}</td>` +
        `<td class='num'>${money(costPerTask(item, "symnav"))}</td>` +
        `<td class='num'>${row.scored}/${row.planned}</td>` +
        `<td class='text'><span class='tag ${item.validity}'>${item.validity}</span></td>`;
      tr.addEventListener("click", () => this.openDetail(item));
      body.append(tr);
    }
    table.append(body);
  }

  async openDetail(series) {
    const panel = document.getElementById("detail-panel");
    const subtitle = document.getElementById("detail-subtitle");
    panel.hidden = false;
    subtitle.textContent = `${label(series)} — loading…`;
    document.getElementById("detail-body").replaceChildren();
    try {
      const analysis = await (await fetch(API_STUDY(series.studyId))).json();
      this.renderDetail(series, analysis);
    } catch (error) {
      subtitle.textContent = `${label(series)} — could not load detail (${error.message})`;
    }
  }

  renderDetail(series, analysis) {
    const byTask = new Map();
    for (const task of analysis.tasks ?? []) {
      if (!byTask.has(task.task)) byTask.set(task.task, {});
      byTask.get(task.task)[task.condition] = task;
    }
    document.getElementById("detail-subtitle").textContent =
      `${series.studyId} — ${byTask.size} tasks · ` +
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
        const score = conditions[condition]?.metrics?.performance_score;
        const cell = document.createElement("span");
        cell.className = `cell ${this.cellClass(score)}`;
        cell.textContent = typeof score === "number" ? String(Math.round(score * 100)) : "·";
        cell.title = `${condition}: ${percent(score, 0)}`;
        item.append(cell);
      }
      grid.append(item);
    }
    const link = document.createElement("p");
    link.className = "status";
    link.innerHTML = `<a href="./studies/${series.studyId}/">Open the full ${series.studyId} dashboard →</a>`;
    document.getElementById("detail-body").replaceChildren(grid, link);
  }

  cellClass(score) {
    if (typeof score !== "number") return "missing";
    if (score >= 1) return "full";
    if (score <= 0) return "none";
    return "partial";
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
