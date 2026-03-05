export type LTTBPoint<T = unknown> = {
  x: number;
  y: number;
  payload: T;
};

// Largest-Triangle-Three-Buckets downsampling for large point sets.
export function lttbDownsample<T>(
  data: LTTBPoint<T>[],
  threshold: number
): LTTBPoint<T>[] {
  if (threshold <= 2 || data.length <= threshold) return data.slice();

  const sampled: LTTBPoint<T>[] = [];
  const bucketSize = (data.length - 2) / (threshold - 2);
  let a = 0;

  sampled.push(data[a]);

  for (let i = 0; i < threshold - 2; i += 1) {
    const rangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const rangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    const cappedRangeEnd = Math.min(rangeEnd, data.length);

    let avgX = 0;
    let avgY = 0;
    let avgRangeLength = cappedRangeEnd - rangeStart;
    if (avgRangeLength <= 0) avgRangeLength = 1;

    for (let j = rangeStart; j < cappedRangeEnd; j += 1) {
      avgX += data[j]?.x ?? data[data.length - 1].x;
      avgY += data[j]?.y ?? data[data.length - 1].y;
    }

    avgX /= avgRangeLength;
    avgY /= avgRangeLength;

    const rangeOffs = Math.floor(i * bucketSize) + 1;
    const rangeTo = Math.min(Math.floor((i + 1) * bucketSize) + 1, data.length - 1);

    const pointA = data[a];
    let maxArea = -1;
    let selectedIndex = rangeOffs;

    for (let j = rangeOffs; j < rangeTo; j += 1) {
      const area =
        Math.abs(
          (pointA.x - avgX) * (data[j].y - pointA.y) -
            (pointA.x - data[j].x) * (avgY - pointA.y)
        ) * 0.5;

      if (area > maxArea) {
        maxArea = area;
        selectedIndex = j;
      }
    }

    sampled.push(data[selectedIndex]);
    a = selectedIndex;
  }

  sampled.push(data[data.length - 1]);
  return sampled;
}
