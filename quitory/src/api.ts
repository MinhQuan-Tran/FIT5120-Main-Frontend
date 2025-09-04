import useAuthStore from '@/stores/authStore';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiResource = 'auth/login' | 'auth/currentUser' | 'goals/today';
type QueryParams = Record<string, string | number | boolean>;

interface RequestOptions {
  method: HttpMethod;
  body?: unknown;
  queryParams?: QueryParams;
}

function buildUrl(resource: ApiResource, queryParams?: QueryParams): string {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const baseUrl = `${apiBaseUrl}/${resource}`;
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
  // const token = await authStore.fetchToken();

  const url = buildUrl(resource, options.queryParams);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`,
    deviceId: authStore.deviceID || '',
  };

  console.log(`[API Request] ${options.method} ${url}`, headers);

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

const api = {
  user: {
    async login(data: { deviceid: string; name: string; avatar?: string }) {
      return createRequest('auth/login', { method: 'POST', body: data });
    },

    async fetch() {
      return createRequest('auth/currentUser', { method: 'GET' });
    },

    // async update(data: Partial<Omit<User, 'id'>>) {
    //   return createRequest('me', { method: 'PUT', body: data });
    // },
  },

  goal: {
    async today() {
      return createRequest('goals/today', { method: 'GET' });
    },
  },
};

export default api;
