const MODEL_HUES = [
  { hue: 222, saturation: 70 },
  { hue: 18, saturation: 74 },
  { hue: 268, saturation: 52 },
  { hue: 172, saturation: 66 },
  { hue: 338, saturation: 60 },
  { hue: 42, saturation: 76 },
];

const BENCHMARK_COLORS = {
  deepswe: "#2457d6",
  "swe-polybench": "#d9531e",
  "multi-swe-bench": "#0f8a7e",
};

const BENCHMARK_LIGHTNESS = [34, 48, 62];
const FALLBACK_LIGHTNESS = 48;
const FALLBACK = "#7a6f5d";

/**
 * Hue is the model, lightness is the benchmark — so one model reads as one
 * colour family while each benchmark stays separable inside it.
 */
export class Palette {
  constructor(series) {
    this.tones = new Map();
    [...new Set(series.map((item) => item.model))].sort().forEach((model, index) => {
      this.tones.set(model, MODEL_HUES[index % MODEL_HUES.length]);
    });
    this.benchmarks = new Map();
    [...new Set(series.map((item) => item.benchmark))].sort().forEach((benchmark, index) => {
      this.benchmarks.set(benchmark, BENCHMARK_LIGHTNESS[index % BENCHMARK_LIGHTNESS.length]);
    });
  }

  of(model, benchmark) {
    const tone = this.tones.get(model);
    if (!tone) return FALLBACK;
    const lightness = this.benchmarks.get(benchmark) ?? FALLBACK_LIGHTNESS;
    return `hsl(${tone.hue} ${tone.saturation}% ${lightness}%)`;
  }

  model(name) {
    const tone = this.tones.get(name);
    return tone ? `hsl(${tone.hue} ${tone.saturation}% ${FALLBACK_LIGHTNESS}%)` : FALLBACK;
  }

  modelEntries() {
    return [...this.tones.keys()].map((name) => [name, this.model(name)]);
  }

  benchmarkShades(model) {
    return [...this.benchmarks.keys()].map((benchmark) => [benchmark, this.of(model, benchmark)]);
  }

  static benchmark(name) {
    return BENCHMARK_COLORS[name] ?? FALLBACK;
  }

  static benchmarkEntries(names) {
    return [...names].sort().map((name) => [name, Palette.benchmark(name)]);
  }
}
