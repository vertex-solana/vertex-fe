import { useRef, useCallback, useState } from 'react';

interface ApiRequest {
  key: string;
  promise: Promise<any>;
  timestamp: number;
}

interface ApiCache {
  [key: string]: {
    data: any;
    timestamp: number;
    ttl: number; // Time to live in ms
  };
}

interface ApiManagerOptions {
  ttl?: number; // Cache time to live
  forceRefresh?: boolean;
  deduplicate?: boolean;
}

const useApiManager = () => {
  const pendingRequests = useRef<Map<string, ApiRequest>>(new Map());
  const cache = useRef<ApiCache>({});
  const [isLoading, setIsLoading] = useState(false);

  const makeRequest = useCallback(async <T>(
    key: string,
    requestFn: () => Promise<T>,
    options: ApiManagerOptions = {}
  ): Promise<T> => {
    const { ttl = 30000, forceRefresh = false, deduplicate = true } = options;
    
    // Check cache first
    if (!forceRefresh && cache.current[key]) {
      const cached = cache.current[key];
      if (Date.now() - cached.timestamp < cached.ttl) {
        console.log(`🚀 API Cache HIT: ${key}`);
        return cached.data;
      }
    }

    // Check for pending request
    if (deduplicate && pendingRequests.current.has(key)) {
      console.log(`🔄 API Deduplication: ${key}`);
      return pendingRequests.current.get(key)!.promise;
    }

    // Make new request
    console.log(`📡 API Request: ${key}`);
    setIsLoading(true);
    
    const request: ApiRequest = {
      key,
      promise: requestFn(),
      timestamp: Date.now()
    };

    if (deduplicate) {
      pendingRequests.current.set(key, request);
    }

    try {
      const result = await request.promise;
      
      // Cache the result
      cache.current[key] = {
        data: result,
        timestamp: Date.now(),
        ttl
      };

      console.log(`✅ API Success: ${key}`);
      return result;
    } catch (error) {
      console.error(`❌ API Error: ${key}`, error);
      throw error;
    } finally {
      if (deduplicate) {
        pendingRequests.current.delete(key);
      }
      setIsLoading(false);
    }
  }, []);

  const invalidateCache = useCallback((key?: string) => {
    if (key) {
      console.log(`🗑️ Cache invalidated: ${key}`);
      delete cache.current[key];
    } else {
      console.log(`🗑️ All cache cleared`);
      cache.current = {};
    }
  }, []);

  const clearPendingRequests = useCallback(() => {
    console.log(`🛑 Pending requests cleared`);
    pendingRequests.current.clear();
  }, []);

  const getCacheStats = useCallback(() => {
    const cacheKeys = Object.keys(cache.current);
    const pendingKeys = Array.from(pendingRequests.current.keys());
    
    return {
      cacheSize: cacheKeys.length,
      pendingRequests: pendingKeys.length,
      cacheKeys,
      pendingKeys
    };
  }, []);

  return {
    makeRequest,
    invalidateCache,
    clearPendingRequests,
    getCacheStats,
    isLoading
  };
};

export default useApiManager;
