/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/setupDebugOverlay.ts
// Ultra-capture overlay with "Minimize to bottom" pill (no external deps).

export type DebugOverlayOptions = {
  enabled?: boolean;
  maxLines?: number;
  captureConsole?: boolean;
  captureErrors?: boolean;
  captureFetch?: boolean;
  captureXHR?: boolean;
  captureResources?: boolean;
};

export function setupDebugOverlay(opts: DebugOverlayOptions = {}): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const {
    enabled = (import.meta as any)?.env?.DEV || localStorage.getItem('DEBUG_OVERLAY') === '1',
    maxLines = 500,
    captureConsole = true,
    captureErrors = true,
    captureFetch = true,
    captureXHR = true,
    captureResources = true,
  } = opts;

  if (!enabled) return;

  // ---------- UI ----------
  const wrap = document.createElement('div');
  wrap.id = 'debug-overlay';
  wrap.setAttribute('role', 'log');
  wrap.style.cssText = [
    'position:fixed',
    'left:8px',
    'right:8px',
    'bottom:8px',
    'max-height:50vh',
    'padding:8px',
    'background:rgba(0,0,0,.88)',
    'color:#e5e7eb',
    'font:12px/1.45 Consolas,ui-monospace,Menlo,monospace',
    'border:1px solid rgba(255,255,255,.2)',
    'border-radius:8px',
    'z-index:2147483647',
    'overflow:auto',
    'box-shadow:0 4px 16px rgba(0,0,0,.4)',
  ].join(';');

  const bar = document.createElement('div');
  bar.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:6px;';

  const title = document.createElement('strong');
  title.textContent = 'Debug Overlay';
  title.style.cssText = 'font-weight:700;color:#fff;';

  const btn = (txt: string) => {
    const b = document.createElement('button');
    b.textContent = txt;
    b.style.cssText = [
      'background:#374151',
      'color:#e5e7eb',
      'border:0',
      'padding:4px 8px',
      'border-radius:6px',
      'cursor:pointer',
      'font:12px/1 Consolas,ui-monospace,Menlo,monospace',
    ].join(';');
    return b;
  };

  const btnClear = btn('Clear');
  const btnCopy = btn('Copy');
  const btnMin = btn('Minimize'); // <— new
  bar.append(title, btnClear, btnCopy, btnMin);

  const body = document.createElement('div');
  body.style.cssText = 'white-space:pre-wrap; word-break:break-word;';
  wrap.append(bar, body);
  document.documentElement.appendChild(wrap);

  // Bottom pill shown when minimized
  const pill = document.createElement('button');
  pill.id = 'debug-overlay-pill';
  pill.textContent = 'Debug (0)';
  pill.style.cssText = [
    'position:fixed',
    'left:50%',
    'transform:translateX(-50%)',
    'bottom:8px',
    'z-index:2147483647',
    'display:none',
    'align-items:center',
    'gap:6px',
    'padding:6px 12px',
    'border-radius:9999px',
    'background:#111827',
    'color:#e5e7eb',
    'border:1px solid rgba(255,255,255,.25)',
    'box-shadow:0 4px 14px rgba(0,0,0,.4)',
    'font:12px/1 Consolas,ui-monospace,Menlo,monospace',
  ].join(';');
  document.documentElement.appendChild(pill);

  let minimized = false;
  function minimize() {
    minimized = true;
    wrap.style.display = 'none';
    pill.style.display = 'inline-flex';
  }
  function restore() {
    minimized = false;
    wrap.style.display = 'block';
    pill.style.display = 'none';
    // keep scrolled to bottom on restore
    wrap.scrollTop = wrap.scrollHeight;
  }
  btnMin.onclick = minimize;
  pill.onclick = restore;

  // ---------- storage/formatting ----------
  const lines: string[] = [];
  let indent = 0; // group depth
  const timers = new Map<string, number>();
  const counters = new Map<string, number>();
  let total = 0;
  let lastWasError = false;

  const now = () => new Date().toISOString().split('T')[1]!.replace('Z', '');
  const pad = () => '  '.repeat(Math.max(0, indent));
  const bumpPill = (isErr = false) => {
    total++;
    pill.textContent = `Debug (${total})`;
    if (isErr) {
      lastWasError = true;
      pill.style.borderColor = '#ef4444';
      pill.style.boxShadow = '0 4px 16px rgba(239,68,68,.45)';
      // revert after a moment
      setTimeout(() => {
        if (!lastWasError) return;
        pill.style.borderColor = 'rgba(255,255,255,.25)';
        pill.style.boxShadow = '0 4px 14px rgba(0,0,0,.4)';
        lastWasError = false;
      }, 1500);
    }
  };

  function pushLine(raw: string, markError = false) {
    const line = `[${now()}] ${pad()}${raw}`;
    lines.push(line);
    if (lines.length > maxLines) lines.splice(0, lines.length - maxLines);
    if (!minimized) {
      body.textContent = lines.join('\n');
      wrap.scrollTop = wrap.scrollHeight;
    }
    bumpPill(markError);
  }

  btnClear.onclick = () => {
    lines.length = 0;
    total = 0;
    body.textContent = '';
    pill.textContent = 'Debug (0)';
  };
  btnCopy.onclick = async () => {
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
    } catch {}
  };

  const safeStringify = (v: unknown, depth = 3, maxLen = 10000, seen = new WeakSet()): string => {
    try {
      if (v === null || typeof v !== 'object') return String(v);
      if (seen.has(v as object)) return '[Circular]';
      seen.add(v as object);
      if (Array.isArray(v)) {
        if (depth <= 0) return `[Array(${v.length})]`;
        return `[${v.map((x) => safeStringify(x, depth - 1, maxLen, seen)).join(', ')}]`;
      }
      if (depth <= 0) return '[Object]';
      const o = v as Record<string, unknown>;
      const entries = Object.keys(o)
        .slice(0, 100)
        .map((k) => `${k}: ${safeStringify(o[k], depth - 1, maxLen, seen)}`);
      let s = `{ ${entries.join(', ')} }`;
      if (s.length > maxLen) s = s.slice(0, maxLen) + '…';
      return s;
    } catch {
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    }
  };
  const fmtArgs = (a: any[]) =>
    (typeof a[0] === 'string'
      ? [String(a[0]), ...a.slice(1).map((v) => safeStringify(v))]
      : a.map((v) => safeStringify(v))
    ).join(' ');

  // ---------- console capture (ALL) ----------
  if (captureConsole) {
    const original: Partial<Record<keyof Console, any>> = {};
    const methods: (keyof Console)[] = [
      'log',
      'info',
      'warn',
      'error',
      'debug',
      'trace',
      'dir',
      'dirxml',
      'table',
      'assert',
      'time',
      'timeLog',
      'timeEnd',
      'group',
      'groupCollapsed',
      'groupEnd',
      'count',
      'countReset',
      'clear',
    ];
    for (const m of methods) (original[m] as any) = (console as any)[m]?.bind(console);
    const wrapMethod = (m: keyof Console, handler: (...a: any[]) => void) =>
      ((console as any)[m] = (...a: any[]) => {
        try {
          handler(...a);
        } catch {}
        try {
          original[m]?.(...a);
        } catch {}
      });

    wrapMethod('clear', () => {
      lines.length = 0;
      total = 0;
      body.textContent = '';
      pill.textContent = 'Debug (0)';
      pushLine('—— console cleared ——');
    });
    wrapMethod('group', (...a) => {
      pushLine(`GROUP ▶ ${fmtArgs(a)}`);
      indent++;
    });
    wrapMethod('groupCollapsed', (...a) => {
      pushLine(`GROUP ▶ (collapsed) ${fmtArgs(a)}`);
      indent++;
    });
    wrapMethod('groupEnd', () => {
      indent = Math.max(0, indent - 1);
      pushLine('GROUP ◀');
    });

    wrapMethod('time', (label = 'default') => {
      timers.set(String(label), performance.now());
      pushLine(`TIME ▶ ${label}`);
    });
    wrapMethod('timeLog', (label = 'default', ...a) => {
      const t0 = timers.get(String(label));
      const dt = t0 != null ? (performance.now() - t0).toFixed(2) : 'n/a';
      pushLine(`TIME ⏱ ${label}: +${dt}ms ${fmtArgs(a)}`);
    });
    wrapMethod('timeEnd', (label = 'default') => {
      const t0 = timers.get(String(label));
      const dt = t0 != null ? (performance.now() - t0).toFixed(2) : 'n/a';
      timers.delete(String(label));
      pushLine(`TIME ■ ${label}: ${dt}ms`);
    });

    wrapMethod('count', (label = 'default') => {
      const k = String(label);
      const n = (counters.get(k) ?? 0) + 1;
      counters.set(k, n);
      pushLine(`COUNT ${k}: ${n}`);
    });
    wrapMethod('countReset', (label = 'default') => {
      counters.set(String(label), 0);
      pushLine(`COUNT ${label}: reset`);
    });

    wrapMethod('assert', (cond: any, ...a: any[]) => {
      if (!cond) pushLine(`ASSERT FAILED ${fmtArgs(a) || '(no message)'}`, true);
    });

    wrapMethod('trace', (...a) => {
      const err = new Error(fmtArgs(a) || 'console.trace');
      const stack = (err.stack || '').split('\n').slice(1).join('\n');
      pushLine(`TRACE\n${stack}`);
    });
    wrapMethod('dir', (...a) => pushLine(`DIR ${fmtArgs(a)}`));
    wrapMethod('dirxml', (...a) => pushLine(`DIRXML ${fmtArgs(a)}`));
    wrapMethod('table', (data: any, columns?: string[]) => {
      try {
        const rows: any[] = Array.isArray(data)
          ? data
          : typeof data === 'object' && data
            ? Object.entries(data).map(([k, v]) => ({ key: k, value: v }))
            : [];
        const cols = columns?.length
          ? columns
          : [
              ...rows.reduce((s, r) => {
                Object.keys(r || {}).forEach((k) => s.add(k));
                return s;
              }, new Set<string>()),
            ];
        const header = `TABLE | ${cols.join(' | ')}`;
        const rendered = rows
          .map((r) => cols.map((c) => safeStringify((r as any)?.[c])).join(' | '))
          .join('\n');
        pushLine(`${header}\n${rendered || '(empty)'}`);
      } catch {
        pushLine(`TABLE (unrenderable) ${safeStringify(data)}`);
      }
    });

    (['log', 'info', 'warn', 'error', 'debug'] as const).forEach((level) =>
      wrapMethod(level, (...a) =>
        pushLine(`${level.toUpperCase()} ${fmtArgs(a)}`, level === 'error' || level === 'warn'),
      ),
    );
  }

  // ---------- runtime errors ----------
  if (captureErrors) {
    window.addEventListener('error', (ev) => {
      if (ev.target !== window) return;
      pushLine(`JS ERROR ${ev.message} @ ${ev.filename}:${ev.lineno}:${ev.colno}`, true);
      if (ev.error) pushLine(String(ev.error?.stack || ev.error));
    });
    window.addEventListener('unhandledrejection', (ev) => {
      pushLine(`UNHANDLED REJECTION ${safeStringify(ev.reason)}`, true);
    });
  }

  // ---------- resource loading ----------
  if (captureResources) {
    window.addEventListener(
      'error',
      (ev) => {
        const t = ev.target as HTMLElement;
        if (!t || (t as unknown) === window) return;
        const tag = t.tagName.toLowerCase();
        const src = (t.getAttribute && (t.getAttribute('src') || t.getAttribute('href'))) || '';
        pushLine(`RESOURCE ERROR <${tag}> failed ${src}`, true);
      },
      true,
    );
  }

  // ---------- fetch ----------
  if (captureFetch && 'fetch' in window) {
    const origFetch = window.fetch.bind(window);
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [input, init] = args;
      const url = typeof input === 'string' ? input : (input as Request).url;
      const method = (
        init?.method ||
        (typeof input !== 'string' ? (input as Request).method : 'GET') ||
        'GET'
      ).toUpperCase();
      pushLine(`FETCH → ${method} ${url}`);
      try {
        const res = await origFetch(...args);
        pushLine(`FETCH ← ${res.status} ${res.type || ''} ${res.url}`);
        return res;
      } catch (e) {
        pushLine(`FETCH ✖ ${method} ${url} ${safeStringify(e)}`, true);
        throw e;
      }
    };
  }

  // ---------- XHR ----------
  if (captureXHR && 'XMLHttpRequest' in window) {
    const XHR = XMLHttpRequest.prototype as any;
    const _open = XHR.open,
      _send = XHR.send;
    XHR.open = function (method: string, url: string, ...rest: any[]) {
      (this as any).__dbg_method = method;
      (this as any).__dbg_url = url;
      return _open.call(this, method, url, ...rest);
    };
    XHR.send = function (body?: any) {
      const m = (this as any).__dbg_method || 'GET';
      const u = (this as any).__dbg_url || '(unknown)';
      pushLine(`XHR → ${m} ${u}`);
      this.addEventListener('load', () => pushLine(`XHR ← ${this.status} ${u}`));
      this.addEventListener('error', () => pushLine(`XHR ✖ ${m} ${u} (error)`, true));
      this.addEventListener('timeout', () => pushLine(`XHR ✖ ${m} ${u} (timeout)`, true));
      this.addEventListener('abort', () => pushLine(`XHR ✖ ${m} ${u} (abort)`));
      return _send.call(this, body);
    };
  }

  // ---------- GIS sanity helper ----------
  (window as any).__dbgCheckGIS = () => {
    if (!(window as any).google?.accounts?.id)
      pushLine('GIS NOT LOADED: window.google.accounts.id is undefined');
    else pushLine('GIS LOADED: window.google.accounts.id is available');
    const isNative = !!(window as any).Capacitor?.isNativePlatform?.();
    const relayUrl = (window as any).__loginUri;
    if (isNative && (!relayUrl || !/^https:\/\//i.test(relayUrl))) {
      pushLine(
        'WARN: In native WebView, login_uri should be a public HTTPS URL on your frontend origin.',
      );
    }
  };

  pushLine("Debug overlay started. Set localStorage.DEBUG_OVERLAY='1' to enable automatically.");

  // Expose programmatic control if you need it:
  (window as any).__dbg = {
    minimize,
    restore,
    showPill: () => (pill.style.display = 'inline-flex'),
    hidePill: () => (pill.style.display = 'none'),
  };
}
