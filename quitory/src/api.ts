import useAuthStore from '@/stores/authStore';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type QueryParams = Record<string, string | number | boolean>;

interface RequestOptions {
  method: HttpMethod;
  body?: unknown;
  queryParams?: QueryParams;
}

function buildUrl(resource: string, queryParams?: QueryParams): string {
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

async function createRequest(resource: string, options: RequestOptions) {
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

const api = {
  user: {
    async login() {
      return createRequest('auth/login', { method: 'POST' });
    },

    async fetch() {
      return createRequest('auth/currentUser', { method: 'GET' });
    },

    async setup(data: { name: string }) {
      return createRequest('auth/setup', { method: 'POST', body: data });
    },
  },

  sessions: {
    async createCravingLog(data: {
      startTime: Date;
      duration: number;
      triggers: string[];
      activities: {
        effective: string[];
        ineffective: string[];
      };
    }) {
      return createRequest('sessions/craving', {
        method: 'POST',
        body: data,
      });
    },
  },

  distraction: {
    actions: {
      async random() {
        return createRequest('distraction/actions/random', { method: 'GET' });
      },
    },
  },

  insights: {
    sessions: {
      async pattern(types: string[]) {
        return createRequest('insights/sessions/pattern', {
          method: 'GET',
          queryParams: { types: types.join(',') },
        });
      },
    },

    dangerTime: {
      async next() {
        return createRequest('insights/danger-time/next', { method: 'GET' });
      },
    },

    trackers: {
      async fetch() {
        return createRequest('insights/trackers', { method: 'GET' });
      },
    },
  },
};

export default api;
