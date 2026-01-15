const cache = new Map<() => Promise<any>, { status: 'pending' | 'fulfilled' | 'rejected'; value?: any; error?: any }>();

export function useFetch<T>(fetcher: () => Promise<T>): { data: T } {
  const cached = cache.get(fetcher);

  if (cached) {
    if (cached.status === 'fulfilled') {
      return { data: cached.value as T };
    }
    if (cached.status === 'rejected') {
      throw cached.error;
    }
    if (cached.status === 'pending') {
      throw cached.value;
    }
  }

  const promise = fetcher()
    .then(data => {
      cache.set(fetcher, { status: 'fulfilled', value: data });
      return data;
    })
    .catch(error => {
      // 에러 내부에 _retry 메소드 추가
      // Boundary내부에서 _retry를 호출하여 cache를 삭제하고 재시도
      const errorWithRetry = error as any;
      errorWithRetry._retry = () => {
        cache.delete(fetcher);
      };

      cache.set(fetcher, { status: 'rejected', error: errorWithRetry });
      throw errorWithRetry;
    });

  cache.set(fetcher, { status: 'pending', value: promise });
  throw promise;
}
