export default async function isPasswordValid(password: string, phc: string): Promise<boolean> {
  // Strip accidental wrapping quotes and whitespace
  const raw = (phc ?? '').trim().replace(/^['"]|['"]$/g, '');

  const m = /^\$pbkdf2-sha256\$it=(\d+)\$([^$]+)\$([^$]+)$/.exec(raw);
  if (!m) {
    console.warn('Bad PBKDF2 PHC string:', raw);
    return false;
  }
  const iterations = Number(m[1]);

  const padB64 = (s: string) => s + '='.repeat((4 - (s.length % 4)) % 4);
  const salt = Uint8Array.from(atob(padB64(m[2])), (c) => c.charCodeAt(0));
  const expect = Uint8Array.from(atob(padB64(m[3])), (c) => c.charCodeAt(0));

  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );

  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    baseKey,
    expect.length * 8,
  );

  const got = new Uint8Array(bits);
  let diff = got.length ^ expect.length;
  for (let i = 0; i < expect.length; i++) diff |= got[i] ^ expect[i];
  return diff === 0;
}
