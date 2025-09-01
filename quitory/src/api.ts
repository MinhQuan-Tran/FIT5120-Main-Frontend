import { useAuthStore } from '@/stores/authStore';
import type User from '@/types/user';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiResource = 'me';
type QueryParams = Record<string, string | number | boolean>;

interface RequestOptions {
  method: HttpMethod;
  body?: unknown;
  queryParams?: QueryParams;
}

function buildUrl(resource: ApiResource, queryParams?: QueryParams): string {
  const baseUrl = `/api/${resource}`;
  if (!queryParams) return baseUrl;

  const searchParams = new URLSearchParams();
  for (const key in queryParams) {
    const value = queryParams[key];
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  return `${baseUrl}?${searchParams.toString()}`;
}

async function createRequest(resource: ApiResource, options: RequestOptions) {
  const authStore = useAuthStore();
  const token = await authStore.fetchToken();

  const url = buildUrl(resource, options.queryParams);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await fetch(url, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `API ${options.method} ${url} failed: ${res.status} ${res.statusText} - ${errorText}`,
      );
    }

    const contentType = res.headers.get('Content-Type');
    return contentType?.includes('application/json') ? await res.json() : null;
  } catch (err) {
    console.error(`[API Error] ${options.method} ${url}`, err);
    throw err;
  }
}

export const api = {
  user: {
    async fetch() {
      return createRequest('me', { method: 'GET' });
    },

    async update(data: Partial<Omit<User, 'id'>>) {
      return createRequest('me', { method: 'PUT', body: data });
    },
  },
};
