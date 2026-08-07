const MODEL_HUES = [
  { hue: 222, saturation: 72 },
  { hue: 18, saturation: 76 },
  { hue: 268, saturation: 52 },
  { hue: 172, saturation: 70 },
  { hue: 338, saturation: 62 },
  { hue: 42, saturation: 78 },
];

const BENCHMARK_COLORS = {
  deepswe: "#2457d6",
  "swe-polybench": "#d9531e",
  "multi-swe-bench": "#0f8a7e",
};

const BASE_LIGHTNESS = 46;
const LIGHTNESS_SPREAD = 38;
const FALLBACK = "#7a6f5d";

/** Colour is the model; series inside a model separate by lightness. */
export class Palette {
  constructor(series) {
    this.models = new Map();
    const models = [...new Set(series.map((item) => item.model))].sort();
    models.forEach((model, index) => {
      this.models.set(model, MODEL_HUES[index % MODEL_HUES.length]);
    });
    this.byKey = new Map();
    for (const model of models) {
      const members = series
        .filter((item) => item.model === model)
        .sort((left, right) => left.key.localeCompare(right.key));
      members.forEach((item, position) => {
        this.byKey.set(item.key, this.shade(model, position, members.length));
      });
    }
  }

  shade(model, position, total) {
    const tone = this.models.get(model) ?? { hue: 32, saturation: 12 };
    const step = total <= 1 ? 0 : position / (total - 1) - 0.5;
    const lightness = BASE_LIGHTNESS + step * LIGHTNESS_SPREAD;
    const saturation = tone.saturation - Math.abs(step) * 26;
    return `hsl(${tone.hue} ${saturation}% ${lightness}%)`;
  }

  model(name) {
    const tone = this.models.get(name);
    return tone ? `hsl(${tone.hue} ${tone.saturation}% ${BASE_LIGHTNESS}%)` : FALLBACK;
  }

  series(key) {
    return this.byKey.get(key) ?? FALLBACK;
  }

  modelEntries() {
    return [...this.models.keys()].map((name) => [name, this.model(name)]);
  }

  static benchmark(name) {
    return BENCHMARK_COLORS[name] ?? FALLBACK;
  }

  static benchmarkEntries(names) {
    return [...names].sort().map((name) => [name, Palette.benchmark(name)]);
  }
}
