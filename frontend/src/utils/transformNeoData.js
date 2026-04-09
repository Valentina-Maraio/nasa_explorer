const DIAMETER_BINS = [
  { label: '0–50m', min: 0, max: 50 },
  { label: '50–100m', min: 50, max: 100 },
  { label: '100–200m', min: 100, max: 200 },
  { label: '200–500m', min: 200, max: 500 },
  { label: '500m+', min: 500, max: Infinity },
];

export function buildDailyVolumeSeries(rangeData) {
  return rangeData.map(({ date, objects }) => {
    const hazardous = objects.filter((o) => o.isPotentiallyHazardous).length;
    const total = objects.length;
    return {
      date: date.slice(5),
      total,
      hazardous,
      hazardousRatio: total > 0 ? Math.round((hazardous / total) * 100) : 0,
    };
  });
}

export function buildDiameterDistribution(rangeData) {
  const counts = DIAMETER_BINS.map((bin) => ({
    bin: bin.label,
    hazardous: 0,
    safe: 0,
  }));

  rangeData.forEach(({ objects }) => {
    objects.forEach((o) => {
      const diameter = o.estimatedDiameterMaxMeters || 0;
      const index = DIAMETER_BINS.findIndex(
        (bin) => diameter >= bin.min && diameter < bin.max,
      );
      if (index === -1) return;
      if (o.isPotentiallyHazardous) {
        counts[index].hazardous += 1;
      } else {
        counts[index].safe += 1;
      }
    });
  });

  return counts;
}

export function buildScatterSeries(rangeData) {
  const hazardous = [];
  const safe = [];

  rangeData.forEach(({ objects }) => {
    objects.forEach((o) => {
      const point = {
        x: Math.round(o.relativeVelocityKilometersPerSecond * 10) / 10,
        y: Math.round(o.missDistanceKilometers / 1000),
        name: o.name,
      };
      if (o.isPotentiallyHazardous) {
        hazardous.push(point);
      } else {
        safe.push(point);
      }
    });
  });

  return { hazardous, safe };
}

export function buildRiskSeries(rangeData) {
  return rangeData.map(({ date, objects }) => {
    if (objects.length === 0) {
      return { date: date.slice(5), risk: 0 };
    }

    const hazardousRatio =
      objects.filter((o) => o.isPotentiallyHazardous).length / objects.length;

    const avgVelocity =
      objects.reduce((s, o) => s + o.relativeVelocityKilometersPerSecond, 0) /
      objects.length;

    const avgMissDistKm =
      objects.reduce((s, o) => s + o.missDistanceKilometers, 0) / objects.length;

    const velocityNorm = Math.min(avgVelocity / 30, 1);
    const proximityNorm = Math.max(0, 1 - avgMissDistKm / 8_000_000);
    const risk = Math.round(
      (hazardousRatio * 0.5 + velocityNorm * 0.3 + proximityNorm * 0.2) * 100,
    );

    return { date: date.slice(5), risk: Math.min(risk, 100) };
  });
}
