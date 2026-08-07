const SVG_NS = "http://www.w3.org/2000/svg";

export function percent(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

export function points(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(digits)}`;
}

function node(tag, attributes = {}, text = null) {
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

  invert(position) {
    const span = this.to - this.from || 1;
    return this.min + ((position - this.from) / span) * (this.max - this.min);
  }
}

function niceTicks(min, max, count) {
  const raw = (max - min) / Math.max(count, 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const candidates = [1, 2, 2.5, 5, 10].map((factor) => factor * magnitude);
  const step = candidates.find((candidate) => candidate >= raw) ?? magnitude * 10;
  const first = Math.ceil(min / step) * step;
  const ticks = [];
  for (let tick = first; tick <= max + step / 1000; tick += step) {
    ticks.push(Number(tick.toFixed(10)));
  }
  return ticks;
}

export function domainOf(values, { zoom, pad = 0.12, fallback = [0, 1] }) {
  const usable = values.filter((value) => Number.isFinite(value));
  if (usable.length === 0) return fallback;
  if (!zoom) return fallback;
  const min = Math.min(...usable);
  const max = Math.max(...usable);
  const span = max - min || Math.max(Math.abs(max), 0.02);
  return [min - span * pad, max + span * pad];
}

class Crosshair {
  constructor(layer, plot) {
    this.layer = layer;
    this.plot = plot;
  }

  clear() {
    this.layer.replaceChildren();
  }

  project(x, y, xText, yText) {
    const { left, right, top, bottom } = this.plot;
    this.layer.appendChild(
      node("line", { class: "crosshair", x1: left, y1: y, x2: x, y2: y }),
    );
    this.layer.appendChild(
      node("line", { class: "crosshair", x1: x, y1: y, x2: x, y2: bottom }),
    );
    this.chip(x, bottom + 13, xText, "middle");
    this.chip(left - 6, y, yText, "end");
    this.layer.appendChild(
      node("circle", { cx: x, cy: y, r: 3.5, class: "crosshair-chip" }),
    );
    void right;
    void top;
  }

  chip(x, y, text, anchor) {
    const width = text.length * 6.1 + 8;
    const originX = anchor === "end" ? x - width : x - width / 2;
    this.layer.appendChild(
      node("rect", {
        x: originX,
        y: y - 8,
        width,
        height: 15,
        rx: 1,
        class: "crosshair-chip",
      }),
    );
    this.layer.appendChild(
      node("text", {
        x: originX + width / 2,
        y: y + 3,
        "text-anchor": "middle",
        class: "crosshair-chip-text",
      }, text),
    );
  }
}

function frame(container, width, height) {
  container.replaceChildren();
  const svg = node("svg", {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
  });
  container.appendChild(svg);
  return svg;
}

function emptyState(container, message) {
  container.replaceChildren();
  const paragraph = document.createElement("p");
  paragraph.className = "status";
  paragraph.textContent = message;
  container.appendChild(paragraph);
}

export function pairedChart(container, series, options) {
  if (series.length === 0) return emptyState(container, "No series selected.");
  const rowHeight = 26;
  const labelX = 26;
  const gutter = labelX + Math.max(...series.map((item) => item.label.length)) * 6.35 + 18;
  const plot = {
    left: gutter,
    right: 210,
    top: 26,
    rowHeight,
  };
  const width = Math.max(860, plot.left + 460 + plot.right);
  const height = plot.top + series.length * rowHeight + 44;
  plot.bottom = plot.top + series.length * rowHeight;
  const svg = frame(container, width, height);

  const values = series.flatMap((item) => [item.stock, item.treatment]);
  const [min, max] = domainOf(values, { zoom: options.zoom });
  const scale = new Scale(min, max, plot.left, width - plot.right);

  for (const tick of niceTicks(min, max, 6)) {
    const x = scale.at(tick);
    svg.appendChild(node("line", { class: "grid-line", x1: x, y1: plot.top, x2: x, y2: plot.bottom }));
    svg.appendChild(
      node("text", { x, y: plot.bottom + 15, "text-anchor": "middle", class: "axis-label" }, percent(tick, 0)),
    );
  }
  svg.appendChild(node("line", { class: "axis-line", x1: plot.left, y1: plot.bottom, x2: width - plot.right, y2: plot.bottom }));
  svg.appendChild(
    node("text", { x: plot.left, y: plot.bottom + 32, class: "axis-title" }, `${options.metricLabel} →`),
  );

  const crosshairLayer = node("g", { class: "crosshair-layer" });
  const crosshair = new Crosshair(crosshairLayer, { ...plot, right: width - plot.right });

  series.forEach((item, index) => {
    const y = plot.top + index * rowHeight + rowHeight / 2;
    const band = node("rect", {
      class: "row-band",
      x: 0,
      y: y - rowHeight / 2,
      width,
      height: rowHeight,
    });
    svg.appendChild(band);
    svg.appendChild(node("text", { x: 4, y: y + 4, class: "series-index" }, String(index + 1)));
    svg.appendChild(node("text", { x: labelX, y: y + 4, class: "series-label" }, item.label));

    const hasPair = Number.isFinite(item.stock) && Number.isFinite(item.treatment);
    if (hasPair) {
      svg.appendChild(
        node("line", {
          class: "connector",
          x1: scale.at(item.stock),
          y1: y,
          x2: scale.at(item.treatment),
          y2: y,
        }),
      );
    }
    if (Number.isFinite(item.stock)) {
      svg.appendChild(node("circle", { cx: scale.at(item.stock), cy: y, r: 5, class: "mark-stock" }));
    }
    if (Number.isFinite(item.treatment)) {
      svg.appendChild(node("circle", { cx: scale.at(item.treatment), cy: y, r: 5, class: "mark-treatment" }));
    }
    const delta = hasPair ? item.treatment - item.stock : null;
    svg.appendChild(
      node(
        "text",
        { x: width - plot.right + 12, y: y + 4, class: "value-label" },
        hasPair ? `${percent(item.stock)} → ${percent(item.treatment)}  ${points(delta)}pp` : "no paired score",
      ),
    );

    const hit = node("rect", { class: "hit", x: 0, y: y - rowHeight / 2, width, height: rowHeight });
    hit.addEventListener("pointerenter", () => {
      band.classList.add("active");
      crosshair.clear();
      if (Number.isFinite(item.stock)) crosshair.project(scale.at(item.stock), y, percent(item.stock), `#${index + 1} stock`);
      if (Number.isFinite(item.treatment)) crosshair.project(scale.at(item.treatment), y, percent(item.treatment), `#${index + 1} symnav`);
    });
    hit.addEventListener("pointerleave", () => {
      band.classList.remove("active");
      crosshair.clear();
    });
    svg.appendChild(hit);
  });

  svg.appendChild(crosshairLayer);
}

export function scatterChart(container, series, options) {
  const usable = series.filter((item) => Number.isFinite(item.stock) && Number.isFinite(item.treatment));
  if (usable.length === 0) return emptyState(container, "No paired scores in the selection.");
  const plot = { left: 62, right: 26, top: 20, bottom: 0 };
  const size = 340;
  const width = plot.left + size + plot.right;
  const height = plot.top + size + 52;
  plot.bottom = plot.top + size;
  const svg = frame(container, width, height);

  const values = usable.flatMap((item) => [item.stock, item.treatment]);
  const [min, max] = domainOf(values, { zoom: options.zoom });
  const x = new Scale(min, max, plot.left, plot.left + size);
  const y = new Scale(min, max, plot.bottom, plot.top);

  for (const tick of niceTicks(min, max, 5)) {
    svg.appendChild(node("line", { class: "grid-line", x1: x.at(tick), y1: plot.top, x2: x.at(tick), y2: plot.bottom }));
    svg.appendChild(node("line", { class: "grid-line", x1: plot.left, y1: y.at(tick), x2: plot.left + size, y2: y.at(tick) }));
    svg.appendChild(node("text", { x: x.at(tick), y: plot.bottom + 15, "text-anchor": "middle", class: "axis-label" }, percent(tick, 0)));
    svg.appendChild(node("text", { x: plot.left - 8, y: y.at(tick) + 3, "text-anchor": "end", class: "axis-label" }, percent(tick, 0)));
  }

  svg.appendChild(node("line", { class: "identity-line", x1: x.at(min), y1: y.at(min), x2: x.at(max), y2: y.at(max) }));
  svg.appendChild(node("line", { class: "axis-line", x1: plot.left, y1: plot.bottom, x2: plot.left + size, y2: plot.bottom }));
  svg.appendChild(node("line", { class: "axis-line", x1: plot.left, y1: plot.top, x2: plot.left, y2: plot.bottom }));
  svg.appendChild(node("text", { x: plot.left, y: plot.bottom + 34, class: "axis-title" }, `stock ${options.metricLabel} →`));
  svg.appendChild(
    node("text", {
      x: 12,
      y: plot.top + size / 2,
      class: "axis-title",
      transform: `rotate(-90 12 ${plot.top + size / 2})`,
      "text-anchor": "middle",
    }, `symnav ${options.metricLabel} →`),
  );

  const crosshairLayer = node("g", { class: "crosshair-layer" });
  const crosshair = new Crosshair(crosshairLayer, { left: plot.left, right: plot.left + size, top: plot.top, bottom: plot.bottom });

  usable.forEach((item) => {
    const cx = x.at(item.stock);
    const cy = y.at(item.treatment);
    const mark = node("circle", { cx, cy, r: 6, class: item.treatment >= item.stock ? "mark-treatment" : "mark-stock" });
    svg.appendChild(mark);
    svg.appendChild(node("text", { x: cx, y: cy - 9, "text-anchor": "middle", class: "series-index" }, String(item.index)));
    const hit = node("circle", { class: "hit", cx, cy, r: 13 });
    hit.addEventListener("pointerenter", () => {
      crosshair.clear();
      crosshair.project(cx, cy, percent(item.stock), percent(item.treatment));
    });
    hit.addEventListener("pointerleave", () => crosshair.clear());
    svg.appendChild(hit);
  });

  svg.appendChild(crosshairLayer);
}

export function upliftChart(container, series, options) {
  const usable = series.filter((item) => Number.isFinite(item.uplift));
  if (usable.length === 0) return emptyState(container, "No uplift reported for the selection.");
  const rowHeight = 24;
  const plot = { left: 44, right: 96, top: 18 };
  const width = 560;
  const height = plot.top + usable.length * rowHeight + 40;
  plot.bottom = plot.top + usable.length * rowHeight;
  const svg = frame(container, width, height);

  const bounds = usable.flatMap((item) => [item.uplift, item.lower ?? item.uplift, item.upper ?? item.uplift, 0]);
  const [min, max] = domainOf(bounds, { zoom: options.zoom, pad: 0.16, fallback: [-0.3, 0.3] });
  const scale = new Scale(min, max, plot.left, width - plot.right);

  for (const tick of niceTicks(min, max, 5)) {
    svg.appendChild(node("line", { class: "grid-line", x1: scale.at(tick), y1: plot.top, x2: scale.at(tick), y2: plot.bottom }));
    svg.appendChild(node("text", { x: scale.at(tick), y: plot.bottom + 15, "text-anchor": "middle", class: "axis-label" }, (tick * 100).toFixed(0)));
  }
  const zeroX = scale.at(0);
  svg.appendChild(node("line", { class: "zero-line", x1: zeroX, y1: plot.top, x2: zeroX, y2: plot.bottom }));
  svg.appendChild(node("text", { x: plot.left, y: plot.bottom + 32, class: "axis-title" }, "percentage points →"));

  const crosshairLayer = node("g", { class: "crosshair-layer" });
  const crosshair = new Crosshair(crosshairLayer, { left: plot.left, right: width - plot.right, top: plot.top, bottom: plot.bottom });

  usable.forEach((item, row) => {
    const y = plot.top + row * rowHeight + rowHeight / 2;
    const barX = Math.min(zeroX, scale.at(item.uplift));
    const barWidth = Math.abs(scale.at(item.uplift) - zeroX);
    svg.appendChild(node("text", { x: 6, y: y + 4, class: "series-index" }, String(item.index)));
    svg.appendChild(
      node("rect", {
        x: barX,
        y: y - 7,
        width: Math.max(barWidth, 1),
        height: 14,
        class: item.uplift >= 0 ? "bar-positive" : "bar-negative",
      }),
    );
    if (Number.isFinite(item.lower) && Number.isFinite(item.upper)) {
      svg.appendChild(node("line", { class: "whisker", x1: scale.at(item.lower), y1: y, x2: scale.at(item.upper), y2: y }));
      svg.appendChild(node("line", { class: "whisker", x1: scale.at(item.lower), y1: y - 5, x2: scale.at(item.lower), y2: y + 5 }));
      svg.appendChild(node("line", { class: "whisker", x1: scale.at(item.upper), y1: y - 5, x2: scale.at(item.upper), y2: y + 5 }));
    }
    svg.appendChild(
      node("text", { x: width - plot.right + 8, y: y + 4, class: "value-label" }, `${points(item.uplift)}pp`),
    );
    const hit = node("rect", { class: "hit", x: 0, y: y - rowHeight / 2, width, height: rowHeight });
    hit.addEventListener("pointerenter", () => {
      crosshair.clear();
      crosshair.project(scale.at(item.uplift), y, `${points(item.uplift)}pp`, `#${item.index}`);
    });
    hit.addEventListener("pointerleave", () => crosshair.clear());
    svg.appendChild(hit);
  });

  svg.appendChild(crosshairLayer);
}
