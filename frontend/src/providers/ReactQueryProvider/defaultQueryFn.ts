import api from '@/lib/axios';

type QueryParams = Record<string, string>;

const normalizeQueryParams = (value: unknown): QueryParams | undefined => {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    if (value.length === 0) return undefined;
    const first = value[0];
    if (first && typeof first === 'object' && !Array.isArray(first)) {
      return first as QueryParams;
    }
    return undefined;
  }

  if (typeof value === 'object') {
    return value as QueryParams;
  }

  return undefined;
};

const ensureLeadingSlash = (path: string) =>
  path.startsWith('/') ? path : `/${path}`;

const buildUrl = (apiPath: string, params?: QueryParams) => {
  const basePath = ensureLeadingSlash(apiPath);

  if (!params || Object.keys(params).length === 0) {
    return basePath;
  }

  const searchParams = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(params)) {
    if (rawValue === undefined || rawValue === null) continue;
    searchParams.append(key, String(rawValue));
  }

  const qs = searchParams.toString();
  return qs ? `${basePath}?${qs}` : basePath;
};

export const defaultQueryFn = async <TData = unknown>({
  queryKey,
  signal,
  pageParam,
}: {
  queryKey: readonly unknown[];
  signal: AbortSignal;
  pageParam?: unknown;
}): Promise<TData> => {
  const [apiPath, queryParams] = queryKey;

  if (typeof apiPath !== 'string' || apiPath.length === 0) {
    throw new Error(
      'defaultQueryFn expects queryKey to be [apiPath: string, queryParams?: Record<string, string>]',
    );
  }

  const normalizedParams = {
    ...normalizeQueryParams(queryParams),
    ...(pageParam !== undefined ? { page: String(pageParam) } : {}),
  };

  const url = buildUrl(apiPath, normalizedParams);
  const response = await api.get<TData>(url, { signal });

  return response.data;
};
