type CacheState<T> = {
  value: T | null;
  fetchedAt: number;
  inFlight: Promise<T> | null;
};

const cacheStore = new Map<string, CacheState<unknown>>();

function getState<T>(key: string): CacheState<T> {
  const existing = cacheStore.get(key) as CacheState<T> | undefined;
  if (existing) return existing;
  const initial: CacheState<T> = {
    value: null,
    fetchedAt: 0,
    inFlight: null,
  };
  cacheStore.set(key, initial as CacheState<unknown>);
  return initial;
}

export type CachedResult<T> = {
  data: T;
  generatedAt: string;
  sourceStatus: "live" | "fallback";
};

type CacheOptions = {
  ttlMs: number;
  staleMs: number;
};

export async function getCachedOrRefresh<T>(
  key: string,
  load: () => Promise<T>,
  options: CacheOptions
): Promise<CachedResult<T>> {
  const state = getState<T>(key);
  const now = Date.now();
  const ageMs = now - state.fetchedAt;

  if (state.value !== null && ageMs <= options.ttlMs) {
    return {
      data: state.value,
      generatedAt: new Date(state.fetchedAt).toISOString(),
      sourceStatus: "live",
    };
  }

  if (state.value !== null && ageMs <= options.staleMs) {
    if (!state.inFlight) {
      state.inFlight = load()
        .then((fresh) => {
          state.value = fresh;
          state.fetchedAt = Date.now();
          return fresh;
        })
        .finally(() => {
          state.inFlight = null;
        });
    }
    return {
      data: state.value,
      generatedAt: new Date(state.fetchedAt).toISOString(),
      sourceStatus: "live",
    };
  }

  if (!state.inFlight) {
    state.inFlight = load()
      .then((fresh) => {
        state.value = fresh;
        state.fetchedAt = Date.now();
        return fresh;
      })
      .finally(() => {
        state.inFlight = null;
      });
  }

  try {
    const fresh = await state.inFlight;
    return {
      data: fresh,
      generatedAt: new Date(state.fetchedAt).toISOString(),
      sourceStatus: "live",
    };
  } catch {
    if (state.value !== null) {
      return {
        data: state.value,
        generatedAt: new Date(state.fetchedAt).toISOString(),
        sourceStatus: "fallback",
      };
    }
    throw new Error("Cache refresh failed with no previous value");
  }
}
