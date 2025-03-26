import NodeCache from "node-cache";

import config from "../../config/env.ts";

type Key = string | number;

class LocalCache {
  private static _instance: LocalCache;

  private cache: NodeCache;

  private constructor(ttlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  public static getInstance(): LocalCache {
    if (LocalCache._instance == undefined) {
      LocalCache._instance = new LocalCache(config.LOCAL_CACHE_TTL);
    }
    return LocalCache._instance;
  }

  public get<T>(key: Key): T | undefined {
    return this.cache.get<T>(key);
  }

  public set<T>(key: Key, value: T): void {
    this.cache.set(key, value);
  }
}

export default LocalCache.getInstance();
