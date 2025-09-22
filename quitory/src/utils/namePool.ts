// Curate a small, safe list for now. You can expand later.
export const ADJECTIVES = [
  'Calm',
  'Bright',
  'Steady',
  'Gritty',
  'Serene',
  'Keen',
  'Vivid',
  'True',
  'Fresh',
  'Bold',
] as const;

export const NOUNS = [
  'Scholar',
  'Beacon',
  'Summit',
  'Vector',
  'Harbor',
  'Phoenix',
  'Nexus',
  'Vista',
  'Compass',
  'Momentum',
] as const;

const MAX_LEN = 18;

function rand<T extends string>(arr: readonly T[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeName(a: string, n: string) {
  const name = `${a} ${n}`;
  return name.length <= MAX_LEN ? name : `${a}${n}`; // fallback if too long
}

/** Return N unique suggestions, with ~60% alliteration bias. */
export function getNameSuggestions(count = 3): string[] {
  const out = new Set<string>();
  const allit = Math.random() < 0.6;

  while (out.size < count) {
    const a = rand(ADJECTIVES);
    let n: string = rand(NOUNS);

    if (allit) {
      // Try to match first letter; fallback if none
      const pool = NOUNS.filter((x) => x[0] === a[0]) as readonly string[];
      if (pool.length) n = rand(pool);
    }

    out.add(makeName(a, n));
  }
  return Array.from(out);
}
