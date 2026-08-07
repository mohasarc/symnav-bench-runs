export const METRICS = [
  { id: "performance_score", label: "score" },
  { id: "f2p", label: "fail-to-pass" },
  { id: "partial", label: "partial" },
];

export const FACETS = [
  { id: "benchmark", name: "Benchmark", of: (series) => [series.benchmark] },
  { id: "model", name: "Model", of: (series) => [series.model] },
  { id: "effort", name: "Effort", of: (series) => [series.effort] },
  { id: "agent", name: "Agent", of: (series) => [series.agent] },
  { id: "symnavVersion", name: "Symnav version", of: (series) => [series.symnavVersion ?? "unregistered"] },
  { id: "repetitions", name: "Repetitions", of: (series) => [String(series.repetitions ?? "?")] },
  { id: "validity", name: "Validity", of: (series) => [series.validity] },
  { id: "study", name: "Study", of: (series) => [series.studyId] },
];

const DEFAULT_EXCLUDED_VALIDITY = new Set([
  "invalidated",
  "partially-invalidated",
  "pipeline-only",
  "abandoned",
]);

export function seriesOf(index) {
  const rows = [];
  for (const study of index.studies) {
    const byConfiguration = new Map();
    for (const arm of study.arms) {
      const key = [arm.agent, arm.model, arm.effort, arm.agent_version].join(":");
      if (!byConfiguration.has(key)) byConfiguration.set(key, { arms: new Map(), sample: arm });
      byConfiguration.get(key).arms.set(arm.condition, arm);
    }
    const primary = study.comparisons.find((item) => item.primary) ?? study.comparisons[0];
    for (const [key, group] of byConfiguration) {
      const sample = group.sample;
      rows.push({
        key: `${study.id}::${key}`,
        studyId: study.id,
        benchmark: study.benchmark,
        validity: study.validity,
        note: study.note,
        repetitions: study.repetitions,
        coverage: study.coverage,
        symnavVersion: study.symnav?.version ?? null,
        symnavSha: study.symnav?.sha ?? null,
        agent: sample.agent,
        model: sample.model,
        effort: sample.effort,
        agentVersion: sample.agent_version,
        arms: group.arms,
        comparison: primary ?? null,
      });
    }
  }
  return rows;
}

export function label(series) {
  const version = series.symnavVersion ? `v${series.symnavVersion}` : "unversioned";
  return `${series.model} · ${series.effort} · ${series.benchmark} · ${version} · ${series.studyId}`;
}

export function metricValue(series, condition, metric) {
  const arm = series.arms.get(condition);
  const value = arm ? arm[metric] : null;
  return typeof value === "number" ? value : Number.NaN;
}

export function plottable(series, metric) {
  return series.map((item, position) => {
    const stock = metricValue(item, "stock", metric);
    const treatment = metricValue(item, "symnav", metric);
    const reported = item.comparison?.uplift;
    const uplift = typeof reported === "number"
      ? reported
      : Number.isFinite(stock) && Number.isFinite(treatment)
        ? treatment - stock
        : Number.NaN;
    return {
      index: position + 1,
      key: item.key,
      label: label(item),
      stock,
      treatment,
      uplift,
      lower: item.comparison?.lower_95 ?? null,
      upper: item.comparison?.upper_95 ?? null,
    };
  });
}

export function facetValues(series, facet) {
  const counts = new Map();
  for (const item of series) {
    for (const value of facet.of(item)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((left, right) => String(left[0]).localeCompare(String(right[0])))
    .map(([value, count]) => ({ value, count }));
}

export function defaultSelection(series) {
  const selection = new Map();
  for (const facet of FACETS) {
    const values = facetValues(series, facet).map((item) => item.value);
    selection.set(
      facet.id,
      facet.id === "validity"
        ? new Set(values.filter((value) => !DEFAULT_EXCLUDED_VALIDITY.has(value)))
        : new Set(values),
    );
  }
  return selection;
}

export function applySelection(series, selection) {
  return series.filter((item) =>
    FACETS.every((facet) => {
      const chosen = selection.get(facet.id);
      if (!chosen) return true;
      return facet.of(item).some((value) => chosen.has(value));
    }),
  );
}
