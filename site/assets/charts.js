const SVG_NS = "http://www.w3.org/2000/svg";

export function percent(value, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

export function points(value, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${(value * 100).toFixed(digits)}`;
}

export function money(value) {
  if (!Number.isFinite(value)) return "—";
  return value >= 1 ? `$${value.toFixed(2)}` : `$${value.toFixed(3)}`;
}

export function node(tag, attributes = {}, text = null) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value === null || value === undefined) continue;
    element.setAttribute(name, String(value));
  }
  if (text !== null) element.textContent = text;
  return element;
}

class Scale {
  constructor(min, max, from, to) {
    this.min = min;
    this.max = max;
    this.from = from;
    this.to = to;
  }

  at(value) {
    const span = this.max - this.min || 1;
    return this.from + ((value - this.min) / span) * (this.to - this.from);
  }
}

function niceTicks(min, max, count) {
  const raw = (max - min) / Math.max(count, 1);
  if (!Number.isFinite(raw) || raw <= 0) return [min];
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((f) => f * magnitude).find((c) => c >= raw) ?? magnitude * 10;
  const ticks = [];
  for (let tick = Math.ceil(min / step) * step; tick <= max + step / 1000; tick += step) {
    ticks.push(Number(tick.toFixed(10)));
  }
  return ticks;
}

export function domainOf(values, { zoom, pad = 0.1, fallback = [0, 1] }) {
  const usable = values.filter(Number.isFinite);
  if (usable.length === 0) return fallback;
  if (!zoom) return fallback;
  const min = Math.min(...usable);
  const max = Math.max(...usable);
  const span = max - min || Math.max(Math.abs(max), 0.02);
  return [min - span * pad, max + span * pad];
}

class Crosshair {
  constructor(layer, plot, format) {
    this.layer = layer;
    this.plot = plot;
    this.format = format;
  }

  clear() {
    this.layer.replaceChildren();
  }

  project(x, y, xText, yText) {
    const { left, bottom } = this.plot;
    this.layer.appendChild(node("line", { class: "crosshair", x1: left, y1: y, x2: x, y2: y }));
    this.layer.appendChild(node("line", { class: "crosshair", x1: x, y1: y, x2: x, y2: bottom }));
    this.chip(x, bottom + 15, xText, "middle");
    this.chip(left - 7, y, yText, "end");
  }

  chip(x, y, text, anchor) {
    const width = text.length * 6.2 + 10;
    const originX = anchor === "end" ? x - width : x - width / 2;
    this.layer.appendChild(
      node("rect", { x: originX, y: y - 8, width, height: 16, rx: 2, class: "crosshair-chip" }),
    );
    this.layer.appendChild(
      node(
        "text",
        { x: originX + width / 2, y: y + 4, "text-anchor": "middle", class: "crosshair-chip-text" },
        text,
      ),
    );
  }
}

function frame(container, width, height) {
  container.replaceChildren();
  const svg = node("svg", { width, height, viewBox: `0 0 ${width} ${height}`, role: "img" });
  container.appendChild(svg);
  return svg;
}

function emptyState(container, message) {
  container.replaceChildren();
  const paragraph = document.createElement("p");
  paragraph.className = "empty";
  paragraph.textContent = message;
  container.appendChild(paragraph);
}

const LABEL_CHAR_WIDTH = 5.4;
const LABEL_HEIGHT = 12;

class LabelPlacer {
  constructor(padding = 2) {
    this.placed = [];
    this.padding = padding;
  }

  /** Drop a label whose box would overlap one already drawn. */
  accepts(x, y, text) {
    const width = text.length * LABEL_CHAR_WIDTH;
    const box = {
      left: x - width / 2 - this.padding,
      right: x + width / 2 + this.padding,
      top: y - LABEL_HEIGHT,
      bottom: y + this.padding,
    };
    const clear = this.placed.every(
      (other) =>
        box.right < other.left ||
        box.left > other.right ||
        box.bottom < other.top ||
        box.top > other.bottom,
    );
    if (clear) this.placed.push(box);
    return clear;
  }
}


/** Lifts a whole group forward on hover and fades everything else. */
class GroupHighlight {
  constructor(svg) {
    this.svg = svg;
  }

  focus(key) {
    if (!key) return;
    this.svg.classList.add("has-focus");
    for (const element of this.svg.querySelectorAll("[data-group]")) {
      element.classList.toggle("in-focus", element.getAttribute("data-group") === key);
    }
  }

  clear() {
    this.svg.classList.remove("has-focus");
    for (const element of this.svg.querySelectorAll(".in-focus")) {
      element.classList.remove("in-focus");
    }
  }
}


function marker(svg, x, y, color, condition, radius = 6) {
  if (condition === "stock") {
    return svg.appendChild(
      node("circle", { cx: x, cy: y, r: radius, fill: "var(--surface)", stroke: color, "stroke-width": 2.2 }),
    );
  }
  return svg.appendChild(node("circle", { cx: x, cy: y, r: radius, fill: color }));
}

/** Cost against performance, cheapest on the right. */
export function frontierChart(container, rows, options) {
  const usable = rows.filter((row) => Number.isFinite(row.cost) && Number.isFinite(row.score));
  if (!usable.length) return emptyState(container, "No series reports both cost and score.");

  const plot = { left: 66, right: 30, top: 22 };
  const size = { width: 620, height: 380 };
  const width = plot.left + size.width + plot.right;
  const height = plot.top + size.height + 60;
  plot.bottom = plot.top + size.height;
  const svg = frame(container, width, height);

  const [costMin, costMax] = domainOf(usable.map((r) => r.cost), { zoom: options.zoom, fallback: [0, 1] });
  const [scoreMin, scoreMax] = domainOf(usable.map((r) => r.score), { zoom: options.zoom });
  const x = new Scale(costMin, costMax, plot.left + size.width, plot.left);
  const y = new Scale(scoreMin, scoreMax, plot.bottom, plot.top);

  for (const tick of niceTicks(costMin, costMax, 5)) {
    svg.appendChild(node("line", { class: "grid-line", x1: x.at(tick), y1: plot.top, x2: x.at(tick), y2: plot.bottom }));
    svg.appendChild(
      node("text", { x: x.at(tick), y: plot.bottom + 16, "text-anchor": "middle", class: "axis-label" }, money(tick)),
    );
  }
  for (const tick of niceTicks(scoreMin, scoreMax, 5)) {
    svg.appendChild(node("line", { class: "grid-line", x1: plot.left, y1: y.at(tick), x2: plot.left + size.width, y2: y.at(tick) }));
    svg.appendChild(
      node("text", { x: plot.left - 10, y: y.at(tick) + 4, "text-anchor": "end", class: "axis-label" }, percent(tick, 0)),
    );
  }

  svg.appendChild(node("line", { class: "axis-line", x1: plot.left, y1: plot.bottom, x2: plot.left + size.width, y2: plot.bottom }));
  svg.appendChild(node("line", { class: "axis-line", x1: plot.left, y1: plot.top, x2: plot.left, y2: plot.bottom }));
  svg.appendChild(node("text", { x: plot.left, y: plot.bottom + 40, class: "axis-title" }, "← more expensive"));
  svg.appendChild(
    node("text", { x: plot.left + size.width, y: plot.bottom + 40, "text-anchor": "end", class: "axis-title" }, "cheaper per task →"),
  );
  svg.appendChild(
    node("text", {
      x: 14,
      y: plot.top + size.height / 2,
      class: "axis-title",
      transform: `rotate(-90 14 ${plot.top + size.height / 2})`,
      "text-anchor": "middle",
    }, `${options.metricLabel} →`),
  );

  const grouping =
    GROUPINGS.find((item) => item.id === options.grouping) ?? GROUPINGS[0];
  const groups = familyGroups(usable, grouping);
  const groupOf = new Map();
  for (const [key, members] of groups) {
    for (const member of members) groupOf.set(member, key);
    if (members.length < 2) continue;
    const ordered = [...members].sort((left, right) => right.cost - left.cost);
    svg.appendChild(
      node("polyline", {
        class: "family-link",
        "data-group": key,
        stroke: ordered[0].color,
        points: ordered.map((row) => `${x.at(row.cost)},${y.at(row.score)}`).join(" "),
      }),
    );
  }

  const crosshairLayer = node("g", { class: "crosshair-layer" });
  const crosshair = new Crosshair(crosshairLayer, { left: plot.left, bottom: plot.bottom });

  const labels = new LabelPlacer();
  const highlight = new GroupHighlight(svg);
  for (const row of usable) {
    const cx = x.at(row.cost);
    const cy = y.at(row.score);
    const key = groupOf.get(row);
    const dot = marker(svg, cx, cy, row.color, row.condition);
    if (key) dot.setAttribute("data-group", key);
    if (labels.accepts(cx, cy - 12, row.pointLabel)) {
      const text = node("text", { x: cx, y: cy - 12, "text-anchor": "middle", class: "point-label" }, row.pointLabel);
      if (key) text.setAttribute("data-group", key);
      svg.appendChild(text);
    }
    const hit = node("circle", { class: "hit", cx, cy, r: 14 });
    hit.addEventListener("pointerenter", () => {
      crosshair.clear();
      crosshair.project(cx, cy, money(row.cost), percent(row.score));
      highlight.focus(key);
    });
    hit.addEventListener("pointerleave", () => {
      crosshair.clear();
      highlight.clear();
    });
    svg.appendChild(hit);
  }
  svg.appendChild(crosshairLayer);
}

export const GROUPINGS = [
  {
    id: "versions",
    label: "across versions",
    hint: "one line per model and arm, spanning symnav versions",
    key: (row) => `${row.model}::${row.benchmark}::${row.condition}`,
  },
  {
    id: "arms",
    label: "stock ↔ symnav",
    hint: "one line per symnav version, joining its two arms",
    key: (row) => `${row.model}::${row.benchmark}::${row.version}`,
  },
  { id: "off", label: "no links", hint: "points only", key: null },
];

/** Never keyed across benchmarks — their scores are not comparable. */
function familyGroups(rows, grouping) {
  if (!grouping || !grouping.key) return new Map();
  const groups = new Map();
  for (const row of rows) {
    const key = grouping.key(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return groups;
}

/** Stock to symnav shift, one row per series. */
export function upliftChart(container, rows, options) {
  const usable = rows.filter((row) => Number.isFinite(row.stock) && Number.isFinite(row.treatment));
  if (!usable.length) return emptyState(container, "No series has both arms scored.");
  const ordered = [...usable].sort((a, b) => b.uplift - a.uplift);

  const rowHeight = 30;
  const plot = { left: 250, right: 130, top: 20 };
  const width = 760;
  const height = plot.top + ordered.length * rowHeight + 46;
  plot.bottom = plot.top + ordered.length * rowHeight;
  const svg = frame(container, width, height);

  const [min, max] = domainOf(ordered.flatMap((r) => [r.stock, r.treatment]), { zoom: options.zoom });
  const scale = new Scale(min, max, plot.left, width - plot.right);

  for (const tick of niceTicks(min, max, 6)) {
    svg.appendChild(node("line", { class: "grid-line", x1: scale.at(tick), y1: plot.top, x2: scale.at(tick), y2: plot.bottom }));
    svg.appendChild(
      node("text", { x: scale.at(tick), y: plot.bottom + 16, "text-anchor": "middle", class: "axis-label" }, percent(tick, 0)),
    );
  }
  svg.appendChild(node("line", { class: "axis-line", x1: plot.left, y1: plot.bottom, x2: width - plot.right, y2: plot.bottom }));
  svg.appendChild(node("text", { x: plot.left, y: plot.bottom + 38, class: "axis-title" }, `${options.metricLabel} →`));

  const crosshairLayer = node("g", { class: "crosshair-layer" });
  const crosshair = new Crosshair(crosshairLayer, { left: plot.left, bottom: plot.bottom });

  ordered.forEach((row, position) => {
    const y = plot.top + position * rowHeight + rowHeight / 2;
    const band = node("rect", { class: "row-band", x: 0, y: y - rowHeight / 2, width, height: rowHeight });
    svg.appendChild(band);
    svg.appendChild(node("text", { x: 8, y: y + 4, class: "series-index" }, String(row.index)));
    svg.appendChild(node("text", { x: 26, y: y + 4, class: "series-label" }, row.shortLabel));
    svg.appendChild(
      node("line", {
        x1: scale.at(row.stock),
        y1: y,
        x2: scale.at(row.treatment),
        y2: y,
        stroke: row.color,
        "stroke-width": 2,
        opacity: 0.55,
      }),
    );
    marker(svg, scale.at(row.stock), y, row.color, "stock", 5.5);
    marker(svg, scale.at(row.treatment), y, row.color, "symnav", 5.5);
    svg.appendChild(
      node(
        "text",
        { x: width - plot.right + 12, y: y + 4, class: row.uplift >= 0 ? "value-label gain" : "value-label loss" },
        `${points(row.uplift)} pp`,
      ),
    );
    const hit = node("rect", { class: "hit", x: 0, y: y - rowHeight / 2, width, height: rowHeight });
    hit.addEventListener("pointerenter", () => {
      band.classList.add("active");
      crosshair.clear();
      crosshair.project(scale.at(row.stock), y, percent(row.stock), `#${row.index} stock`);
      crosshair.project(scale.at(row.treatment), y, percent(row.treatment), `#${row.index} symnav`);
    });
    hit.addEventListener("pointerleave", () => {
      band.classList.remove("active");
      crosshair.clear();
    });
    svg.appendChild(hit);
  });
  svg.appendChild(crosshairLayer);
}

/** Benchmark by model grid, one cell per arm. */
export function benchmarkGrid(container, rows, options) {
  if (!rows.length) return emptyState(container, "No series selected.");
  const benchmarks = [...new Set(rows.map((r) => r.benchmark))].sort();
  const models = [...new Set(rows.map((r) => r.model))].sort();
  const cell = { width: 112, height: 56 };
  const plot = { left: 150, top: 46 };
  const width = plot.left + benchmarks.length * cell.width + 16;
  const height = plot.top + models.length * cell.height + 20;
  const svg = frame(container, width, height);

  benchmarks.forEach((benchmark, column) => {
    const x = plot.left + column * cell.width + cell.width / 2;
    svg.appendChild(node("rect", { x: x - 40, y: 12, width: 80, height: 3, fill: options.benchmarkColor(benchmark) }));
    svg.appendChild(node("text", { x, y: 34, "text-anchor": "middle", class: "axis-title" }, benchmark));
  });

  models.forEach((model, row) => {
    const y = plot.top + row * cell.height;
    svg.appendChild(node("rect", { x: 8, y: y + cell.height / 2 - 6, width: 3, height: 12, fill: options.modelColor(model) }));
    svg.appendChild(node("text", { x: 18, y: y + cell.height / 2 + 4, class: "series-label" }, model));
    benchmarks.forEach((benchmark, column) => {
      const x = plot.left + column * cell.width;
      const match = rows.filter((r) => r.model === model && r.benchmark === benchmark);
      svg.appendChild(node("rect", { x: x + 4, y: y + 4, width: cell.width - 8, height: cell.height - 8, class: "grid-cell" }));
      if (!match.length) {
        svg.appendChild(
          node("text", { x: x + cell.width / 2, y: y + cell.height / 2 + 4, "text-anchor": "middle", class: "axis-label" }, "—"),
        );
        return;
      }
      const stock = mean(match.map((r) => r.stock));
      const treatment = mean(match.map((r) => r.treatment));
      svg.appendChild(
        node("text", { x: x + 14, y: y + cell.height / 2 - 1, class: "cell-value" }, percent(stock, 1)),
      );
      svg.appendChild(
        node("text", { x: x + 14, y: y + cell.height / 2 + 15, class: "cell-value strong", fill: options.benchmarkColor(benchmark) }, percent(treatment, 1)),
      );
      const delta = treatment - stock;
      svg.appendChild(
        node(
          "text",
          { x: x + cell.width - 14, y: y + cell.height / 2 + 7, "text-anchor": "end", class: delta >= 0 ? "value-label gain" : "value-label loss" },
          `${points(delta)}`,
        ),
      );
    });
  });
}

function clip(text, limit) {
  return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`;
}


function mean(values) {
  const usable = values.filter(Number.isFinite);
  if (!usable.length) return Number.NaN;
  return usable.reduce((total, value) => total + value, 0) / usable.length;
}

/** Adoption against the uplift it produced. */
export function adoptionChart(container, rows, options) {
  const usable = rows.filter((row) => Number.isFinite(row.adoption) && Number.isFinite(row.uplift));
  if (!usable.length) return emptyState(container, "No series reports adoption.");
  const plot = { left: 62, right: 26, top: 20 };
  const size = { width: 330, height: 260 };
  const width = plot.left + size.width + plot.right;
  const height = plot.top + size.height + 54;
  plot.bottom = plot.top + size.height;
  const svg = frame(container, width, height);

  const [adoptionMin, adoptionMax] = domainOf(usable.map((r) => r.adoption), { zoom: options.zoom, fallback: [0, 1] });
  const [upliftMin, upliftMax] = domainOf(usable.flatMap((r) => [r.uplift, 0]), { zoom: options.zoom, fallback: [-0.3, 0.3] });
  const x = new Scale(adoptionMin, adoptionMax, plot.left, plot.left + size.width);
  const y = new Scale(upliftMin, upliftMax, plot.bottom, plot.top);

  for (const tick of niceTicks(adoptionMin, adoptionMax, 4)) {
    svg.appendChild(node("line", { class: "grid-line", x1: x.at(tick), y1: plot.top, x2: x.at(tick), y2: plot.bottom }));
    svg.appendChild(node("text", { x: x.at(tick), y: plot.bottom + 16, "text-anchor": "middle", class: "axis-label" }, percent(tick, 0)));
  }
  for (const tick of niceTicks(upliftMin, upliftMax, 4)) {
    svg.appendChild(node("line", { class: "grid-line", x1: plot.left, y1: y.at(tick), x2: plot.left + size.width, y2: y.at(tick) }));
    svg.appendChild(node("text", { x: plot.left - 10, y: y.at(tick) + 4, "text-anchor": "end", class: "axis-label" }, (tick * 100).toFixed(0)));
  }
  if (upliftMin < 0 && upliftMax > 0) {
    svg.appendChild(node("line", { class: "zero-line", x1: plot.left, y1: y.at(0), x2: plot.left + size.width, y2: y.at(0) }));
  }
  svg.appendChild(node("line", { class: "axis-line", x1: plot.left, y1: plot.bottom, x2: plot.left + size.width, y2: plot.bottom }));
  svg.appendChild(node("line", { class: "axis-line", x1: plot.left, y1: plot.top, x2: plot.left, y2: plot.bottom }));
  svg.appendChild(node("text", { x: plot.left, y: plot.bottom + 38, class: "axis-title" }, "symnav adoption →"));
  svg.appendChild(
    node("text", {
      x: 14,
      y: plot.top + size.height / 2,
      class: "axis-title",
      transform: `rotate(-90 14 ${plot.top + size.height / 2})`,
      "text-anchor": "middle",
    }, "uplift pp →"),
  );

  const crosshairLayer = node("g", { class: "crosshair-layer" });
  const crosshair = new Crosshair(crosshairLayer, { left: plot.left, bottom: plot.bottom });
  const labels = new LabelPlacer();
  for (const row of usable) {
    const cx = x.at(row.adoption);
    const cy = y.at(row.uplift);
    marker(svg, cx, cy, row.color, "symnav", 5.5);
    if (labels.accepts(cx, cy - 11, row.pointLabel)) {
      svg.appendChild(
        node("text", { x: cx, y: cy - 11, "text-anchor": "middle", class: "point-label" }, row.pointLabel),
      );
    }
    const hit = node("circle", { class: "hit", cx, cy, r: 13 });
    hit.addEventListener("pointerenter", () => {
      crosshair.clear();
      crosshair.project(cx, cy, percent(row.adoption, 0), `${points(row.uplift)} pp`);
    });
    hit.addEventListener("pointerleave", () => crosshair.clear());
    svg.appendChild(hit);
  }
  svg.appendChild(crosshairLayer);
}

/** How much of each series actually scored. */
export function coverageChart(container, rows) {
  if (!rows.length) return emptyState(container, "No series selected.");
  const ordered = [...rows].sort((a, b) => b.coverageRatio - a.coverageRatio);
  const rowHeight = 22;
  const plot = { left: 196, right: 96, top: 14 };
  const width = 560;
  const height = plot.top + ordered.length * rowHeight + 34;
  plot.bottom = plot.top + ordered.length * rowHeight;
  const svg = frame(container, width, height);
  const track = width - plot.right - plot.left;

  for (const tick of [0, 0.25, 0.5, 0.75, 1]) {
    const x = plot.left + tick * track;
    svg.appendChild(node("line", { class: "grid-line", x1: x, y1: plot.top, x2: x, y2: plot.bottom }));
    svg.appendChild(node("text", { x, y: plot.bottom + 16, "text-anchor": "middle", class: "axis-label" }, percent(tick, 0)));
  }
  svg.appendChild(node("line", { class: "axis-line", x1: plot.left, y1: plot.bottom, x2: plot.left + track, y2: plot.bottom }));

  ordered.forEach((row, position) => {
    const y = plot.top + position * rowHeight + rowHeight / 2;
    svg.appendChild(node("text", { x: 8, y: y + 4, class: "series-index" }, String(row.index)));
    svg.appendChild(node("text", { x: 26, y: y + 4, class: "series-label" }, clip(row.shortLabel, 28)));
    svg.appendChild(node("rect", { x: plot.left, y: y - 6, width: track, height: 12, class: "track" }));
    svg.appendChild(
      node("rect", { x: plot.left, y: y - 6, width: Math.max(track * row.coverageRatio, 1), height: 12, fill: row.color, opacity: 0.85 }),
    );
    svg.appendChild(
      node("text", { x: plot.left + track + 10, y: y + 4, class: "value-label" }, `${row.scored}/${row.planned}`),
    );
  });
}
