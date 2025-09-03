<!-- src/views/ProfileView.vue -->
<script lang="ts">
export default {
  name: 'ProfileView',

  data() {
    return {
      // --- Fetch toggle ---
      USE_API: false,
      API_URL: '/api/user/profile',

      // --- Reactive 'now' (updates at midnight) ---
      now: new Date() as Date,
      midnightTimer: 0 as any,

      // --- Computed stats (recalculated) ---
      stats: { daysClean: 0, badges: 0, saved: 0 },

      // --- Profile info (from API or mock) ---
      form: {
        fullName: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        avatarUrl: 'https://i.pravatar.cc/160?img=13',
        quitDate: '2025-03-15', // YYYY-MM-DD
        dailyCost: 9.0,
      },

      // --- Notification settings ---
      settings: {
        dailyReminders: true,
        milestoneCelebrations: true,
        supportMessages: false,
        communityUpdates: true,
        quietFrom: '22:00',
        quietTo: '08:00',
      },

      // --- Activity & relapse data (from API or mock) ---
      activityLog: {
        '2025-03-15': 2,
        '2025-03-16': 1,
        '2025-03-17': 0,
        '2025-03-18': 2,
        '2025-03-19': 2,
        '2025-03-20': 2,
        '2025-03-21': 2,
        '2025-03-22': 2,
        '2025-03-23': 2,
      } as Record<string, number>, // "YYYY-MM-DD": goalsCompleted
      relapses: ['2025-04-02'] as string[], // ISO dates of relapse after quit

      // --- UI state ---
      editing: { profile: false },
      original: null as any,
      showSaveBar: false,
      loading: false,
      error: '',
    };
  },

  mounted() {
    // Allow testing with ?now=2025-09-10
    const q = new URLSearchParams(location.search);
    const override = q.get('now');
    if (override) this.now = new Date(override);

    this.original = this.snapshot();
    if (this.USE_API) {
      this.fetchProfile();
    } else {
      this.recalcStats();
    }
    this.scheduleMidnightTick();
  },

  beforeUnmount() {
    if (this.midnightTimer) clearTimeout(this.midnightTimer);
  },

  watch: {
    // Recompute stats when inputs change
    'form.quitDate'() {
      this.recalcStats();
      this.updateDirty();
    },
    'form.dailyCost'() {
      this.recalcStats();
      this.updateDirty();
    },
    activityLog: {
      deep: true,
      handler() {
        this.recalcStats();
        this.updateDirty();
      },
    },
    relapses: {
      deep: true,
      handler() {
        this.recalcStats();
        this.updateDirty();
      },
    },

    // Keep dirty checker
    form: { deep: true, handler() { this.updateDirty(); } },
    settings: { deep: true, handler() { this.updateDirty(); } },
  },

  methods: {
    // ---------- Midnight tick so "today" updates automatically ----------
    scheduleMidnightTick() {
      const t = new Date();
      const next = new Date(
        t.getFullYear(),
        t.getMonth(),
        t.getDate() + 1,
        0,
        0,
        1,
      ); // 00:00:01
      const ms = next.getTime() - t.getTime();
      this.midnightTimer = setTimeout(() => {
        this.now = new Date();
        this.recalcStats();
        this.scheduleMidnightTick();
      }, ms);
    },

    // ---------------- API ----------------
    async fetchProfile() {
      try {
        this.loading = true;
        this.error = '';
        const res = await fetch(this.API_URL, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Expecting: { form, settings, activityLog, relapses, serverNow? }
        if (data.form) this.form = data.form;
        if (data.settings) this.settings = data.settings;
        if (data.activityLog) this.activityLog = data.activityLog;
        if (data.relapses) this.relapses = data.relapses;
        if (data.serverNow) this.now = new Date(data.serverNow);

        this.recalcStats();
        this.original = this.snapshot();
        this.updateDirty();
      } catch (e: any) {
        this.error = 'Could not load profile. Using demo data.';
        console.warn(e);
        this.recalcStats();
      } finally {
        this.loading = false;
      }
    },

    // ---------------- Stats Calculator ----------------
    /**
     * Rules:
     * - daysClean counts days from quitDate..today
     *   - No relapse on/after quit (earliest relapse cuts window)
     *   - A day counts only if goalsCompleted >= 1
     *   - Up to 3 consecutive 0-goal days allowed; 4th breaks the streak (stop)
     * - badges = floor(daysClean / 7)
     * - saved  = daysClean * dailyCost
     */
    recalcStats() {
      const quit = this.toDateOnly(this.form.quitDate);
      const todayRaw = this.toDateOnly(this.now); // may be undefined from helper
      if (!quit || !todayRaw || quit > todayRaw) {
        this.stats = { daysClean: 0, badges: 0, saved: 0 };
        return;
      }
      const today: Date = todayRaw;

      // If relapse exists on/after quit, cap at the day before the first relapse
      const relapseDates = (this.relapses || [])
        .map((d: string) => this.toDateOnly(d))
        .filter((d: Date | undefined): d is Date => !!d && d >= quit)
        .sort((a, b) => +a - +b);

      const end = relapseDates.length ? this.addDays(relapseDates[0], -1) : today;

      let daysClean = 0;
      let consecutiveZeros = 0;

      for (let d = new Date(quit); d <= end; d = this.addDays(d, 1)) {
        const key = this.iso(d);
        const goals = this.activityLog?.[key] ?? 0;

        if (goals >= 1) {
          consecutiveZeros = 0;
          daysClean += 1;
        } else {
          consecutiveZeros += 1;
          if (consecutiveZeros > 3) {
            // streak breaks BEFORE counting this day
            break;
          }
          // Within the grace window (<=3), day does not increment daysClean
        }
      }

      const badges = Math.floor(daysClean / 7);
      const saved = Number((daysClean * (this.form.dailyCost || 0)).toFixed(2));
      this.stats = { daysClean, badges, saved };
    },

    // ---------------- Utils ----------------
    snapshot() {
      return JSON.parse(
        JSON.stringify({
          form: this.form,
          settings: this.settings,
          activityLog: this.activityLog,
          relapses: this.relapses,
          stats: this.stats,
        }),
      );
    },
    updateDirty() {
      const now = this.snapshot();
      this.showSaveBar = JSON.stringify(now) !== JSON.stringify(this.original);
    },
    currency(n: number) {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'AUD',
      }).format(n);
    },
    fmtDate(str: string) {
      const d = new Date(str);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },

    toDateOnly(value: string | Date | undefined) {
      if (!value) return undefined;
      const d = new Date(value);
      if (isNaN(+d)) return undefined;
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // local date-only
    },
    iso(d: Date) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    },
    addDays(d: Date, n: number) {
      const x = new Date(d);
      x.setDate(x.getDate() + n);
      return new Date(x.getFullYear(), x.getMonth(), x.getDate());
    },

    // ---------------- Avatar edit/upload ----------------
    onChangeAvatar() {
      const input = this.$refs.avatarFile as HTMLInputElement | undefined;
      input?.click();
    },
    async onAvatarSelected(e: Event) {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      // Instant local preview
      const url = URL.createObjectURL(file);
      this.form.avatarUrl = url;
      this.showSaveBar = true;

      // Optional: upload to backend immediately
      if (this.USE_API) {
        try {
          const formData = new FormData();
          formData.append('avatar', file);
          const res = await fetch('/api/user/avatar', {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
          if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
          const { avatarUrl } = await res.json();
          if (avatarUrl) this.form.avatarUrl = avatarUrl;
        } catch (err) {
          console.warn(err);
          alert('Avatar upload failed. Using local preview for now.');
        }
      }

      // Clear to allow the same file to be picked again
      input.value = '';
    },

    // ---------------- UI actions ----------------
    onBack() {},
    onMenu() {},
    exportData() {
      alert('Export requested (demo)');
    },
    open(which: string) {
      console.log('open', which);
    },

    resetAll() {
      const s = this.original;
      if (!s) return;
      this.form = JSON.parse(JSON.stringify(s.form));
      this.settings = JSON.parse(JSON.stringify(s.settings));
      this.activityLog = JSON.parse(JSON.stringify(s.activityLog));
      this.relapses = JSON.parse(JSON.stringify(s.relapses));
      this.stats = JSON.parse(JSON.stringify(s.stats));
      this.editing.profile = false;
      this.updateDirty();
      this.recalcStats();
    },

    async saveAll() {
      if (this.USE_API) {
        try {
          const res = await fetch(this.API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              form: this.form,
              settings: this.settings,
              activityLog: this.activityLog,
              relapses: this.relapses,
            }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch (e) {
          alert('Failed to save to server. Changes kept locally.');
          console.warn(e);
        }
      }
      this.original = this.snapshot();
      this.updateDirty();
      this.editing.profile = false;
      alert('Settings saved!');
    },
  },
};
</script>

<template>
  <main class="profile-settings">
    <!-- Background & glow layers -->
    <div class="bg-layer" aria-hidden="true"></div>

    <!-- Topbar -->
    <header class="topbar">
      <button class="icon-btn" aria-label="Back" @click="onBack">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h1>Profile &amp; Settings</h1>
      <button class="icon-btn" aria-label="Menu" @click="onMenu">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M3 6h18M3 12h18M3 18h18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </header>

    <!-- Loading / Error -->
    <p v-if="loading" class="muted small" style="padding: 8px 2px">Loading profile...</p>
    <p v-if="error" class="error small">{{ error }}</p>

    <!-- Hero / Profile card -->
    <section class="hero-card">
      <div class="avatar-wrap">
        <img :src="form.avatarUrl" alt="Profile avatar" class="avatar" />
        <button class="edit-avatar" @click="onChangeAvatar" aria-label="Change avatar">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M16.5 3.5l4 4-10 10H6.5v-4z" fill="currentColor" />
          </svg>
        </button>

        <!-- Hidden file input for avatar -->
        <input
          ref="avatarFile"
          class="sr-only"
          type="file"
          accept="image/*"
          @change="onAvatarSelected"
        />
      </div>
      <div class="identity">
        <h2>{{ form.fullName }}</h2>
        <p class="muted">{{ form.email }}</p>
      </div>
      <ul class="stats">
        <li><strong>{{ stats.daysClean }}</strong><span>Days Clean</span></li>
        <li><strong>{{ stats.badges }}</strong><span>Badges</span></li>
        <li><strong>{{ currency(stats.saved) }}</strong><span>Saved</span></li>
      </ul>
    </section>

    <!-- Profile Information -->
    <section class="card">
      <div class="card-head">
        <h3>Profile Information</h3>
        <button class="link" @click="editing.profile = !editing.profile">
          {{ editing.profile ? 'Done' : 'Edit' }}
        </button>
      </div>

      <div class="form-grid">
        <div class="row">
          <label class="row-label">Full Name</label>
          <div class="row-value">
            <template v-if="!editing.profile">{{ form.fullName }}</template>
            <input v-else v-model.trim="form.fullName" type="text" autocomplete="name" />
          </div>
        </div>

        <div class="row">
          <label class="row-label">Email</label>
          <div class="row-value">
            <template v-if="!editing.profile">{{ form.email }}</template>
            <input v-else v-model.trim="form.email" type="email" autocomplete="email" />
          </div>
        </div>

        <div class="row">
          <label class="row-label">Quit Date</label>
          <div class="row-value">
            <template v-if="!editing.profile">{{ fmtDate(form.quitDate) }}</template>
            <input v-else v-model="form.quitDate" type="date" />
          </div>
        </div>

        <div class="row">
          <label class="row-label">Daily Cost</label>
          <div class="row-value">
            <template v-if="!editing.profile">{{ currency(form.dailyCost) }}</template>
            <div v-else class="input-with-prefix">
              <span class="prefix">$</span>
              <input
                v-model.number="form.dailyCost"
                type="number"
                min="0"
                step="0.05"
                inputmode="decimal"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Notifications -->
    <section class="card">
      <h3 class="card-title">Notifications</h3>
      <ul class="setting-list">
        <li class="setting">
          <div class="setting-text">
            <span class="setting-title">Daily Reminders</span>
            <p class="muted small">Gentle nudges to achieve your daily goals</p>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.dailyReminders" />
            <span class="slider" aria-hidden="true"></span>
          </label>
        </li>
        <li class="setting">
          <div class="setting-text">
            <span class="setting-title">Milestone Celebrations</span>
            <p class="muted small">Celebrate 1-day, 1-week, 1-month milestones</p>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.milestoneCelebrations" />
            <span class="slider" aria-hidden="true"></span>
          </label>
        </li>
        <li class="setting">
          <div class="setting-text">
            <span class="setting-title">Support Messages</span>
            <p class="muted small">Occasional support tips from Quitory</p>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.supportMessages" />
            <span class="slider" aria-hidden="true"></span>
          </label>
        </li>
        <li class="setting">
          <div class="setting-text">
            <span class="setting-title">Community Updates</span>
            <p class="muted small">Monthly highlights from support groups</p>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.communityUpdates" />
            <span class="slider" aria-hidden="true"></span>
          </label>
        </li>
      </ul>

      <div class="quiet-hours">
        <div class="qh-row">
          <div class="qh-label">
            <h4>Quiet Hours</h4>
            <p class="muted">Pause notifications during these hours</p>
          </div>
          <div class="qh-inputs">
            <label class="qh-field">From
              <input type="time" v-model="settings.quietFrom" />
            </label>
            <label class="qh-field">To
              <input type="time" v-model="settings.quietTo" />
            </label>
          </div>
        </div>
      </div>
    </section>

    <!-- Account -->
    <section class="card">
      <h3 class="card-title">Account</h3>
      <ul class="nav-list">
        <li>
          <button class="nav-item" @click="open('privacy')">
            <span>Privacy Settings</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </li>
        <li>
          <button class="nav-item" @click="exportData">
            <span>Export Data</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </li>
        <li>
          <button class="nav-item" @click="open('backup')">
            <span>Backup &amp; Sync</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </li>
        <li>
          <button class="nav-item danger" @click="open('delete')">
            <span>Delete Account</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </li>
      </ul>
    </section>

    <!-- Help & Support -->
    <section class="card">
      <h3 class="card-title">Help &amp; Support</h3>
      <ul class="nav-list">
        <li>
          <button class="nav-item" @click="open('faq')">
            <span>FAQ</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </li>
        <li>
          <button class="nav-item" @click="open('support')">
            <span>Contact Support</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </li>
        <li>
          <button class="nav-item" @click="open('rate')">
            <span>Rate App</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </li>
        <li>
          <button class="nav-item" @click="open('about')">
            <span>About Quitory</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </li>
      </ul>
    </section>

    <!-- Save bar -->
    <footer class="save-bar" v-if="showSaveBar">
      <button class="btn ghost" @click="resetAll">Discard</button>
      <button class="btn primary" @click="saveAll">Save Changes</button>
    </footer>
  </main>
</template>

<style scoped>
:root {
  --bg: #0b0f14;
  --card: #0f1520;
  --muted: #a0a8b4;
  --text: #e8eef8;
  --brandA: #3b82f6;
  --brandB: #22c55e;
  --accent: #9c5eff;
  --danger: #ff6b6b;
  --ring: #93c5fd;
}

/* Utility for visually hidden inputs */
.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.profile-settings {
  position: relative;
  min-height: 100vh;
  padding: 12px;
  margin: 0 auto;
  color: var(--text);
  max-width: 720px;
}

/* Background with glow blobs */
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(1200px 800px at 10% 10%, rgba(63, 94, 251, 0.16), transparent 60%),
    radial-gradient(1200px 800px at 90% 20%, rgba(139, 92, 246, 0.14), transparent 55%),
    linear-gradient(180deg, #0b0f14 0%, #0e1522 60%, #0b0f14 100%);
}

.bg-layer::before,
.bg-layer::after {
  content: '';
  position: absolute;
  width: 420px;
  height: 420px;
  filter: blur(80px);
  opacity: 0.25;
  border-radius: 999px;
  animation: floaty 18s ease-in-out infinite alternate;
}

.bg-layer::before {
  left: -120px;
  bottom: -90px;
  background: radial-gradient(circle at 30% 30%, #3b82f6, transparent 60%);
}

.bg-layer::after {
  right: -140px;
  top: -100px;
  background: radial-gradient(circle at 60% 40%, #9c5eff, transparent 60%);
  animation-delay: 3s;
}

@keyframes floaty {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(40px, -20px, 0) scale(1.05); }
}

/* Topbar */
.topbar {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(6, 9, 15, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  backdrop-filter: blur(6px);
}
.topbar h1 {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}
.icon-btn {
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: var(--text);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.icon-btn:hover {
  background: rgba(255, 255, 255, 0.06);
}

/* Hero */
.hero-card {
  position: relative;
  margin: 12px 0;
  padding: 24px 16px 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, var(--brandA), var(--accent));
  color: #fff;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35), 0 8px 28px rgba(110, 83, 255, 0.25);
}
.avatar-wrap {
  position: absolute;
  top: -24px;
  left: 16px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
  object-fit: cover;
}
.edit-avatar {
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #10141a;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.identity {
  padding-left: 88px;
}
.identity h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}
.muted {
  color: var(--muted);
}
.small {
  font-size: 12px;
}
.stats {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.stats li {
  display: grid;
  place-items: center;
  padding: 10px 6px;
  background: rgba(10, 12, 20, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  text-align: center;
  backdrop-filter: blur(4px);
  color: #f6f8ff;
}
.stats strong {
  font-size: 18px;
  display: block;
}
.stats span {
  font-size: 12px;
  opacity: 0.95;
}

/* Card */
.card {
  background: rgba(15, 21, 32, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 14px;
  margin: 12px 0;
  box-shadow: 0 12px 22px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
}
.link {
  color: #a9b7ff;
  font-weight: 700;
  background: transparent;
  border: 0;
  cursor: pointer;
}

/* Form grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
.row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
  align-items: center;
}
.row-label {
  color: var(--muted);
  font-size: 12px;
}
.row-value input {
  width: 100%;
  padding: 10px 12px;
  background: #0b111a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: var(--text);
  outline: none;
}
.row-value input:focus {
  border-color: var(--ring);
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.15);
}
.input-with-prefix {
  display: grid;
  grid-template-columns: 28px 1fr;
  align-items: center;
}
.input-with-prefix .prefix {
  text-align: center;
  color: var(--muted);
}

/* Toggles */
.setting-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.setting {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px;
  background: #0b111a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: transform 0.15s ease, background 0.2s ease;
}
.setting:hover {
  transform: translateY(-1px);
  background: rgba(16, 24, 38, 0.85);
}
.setting-title {
  font-weight: 700;
}
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  inset: 0;
  background: #2a3240;
  border-radius: 999px;
  transition: background 0.2s;
}
.slider::before {
  content: '';
  position: absolute;
  height: 22px;
  width: 22px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}
.switch input:checked + .slider {
  background: linear-gradient(135deg, var(--brandA), var(--accent));
}
.switch input:checked + .slider::before {
  transform: translateX(20px);
}

/* Quiet hours */
.quiet-hours {
  margin-top: 12px;
}
.qh-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
}
.qh-inputs {
  display: flex;
  gap: 10px;
}
.qh-field {
  display: grid;
  gap: 4px;
  font-size: 12px;
  color: var(--muted);
}
.qh-field input {
  padding: 8px 10px;
  background: #0b111a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #f5f9ff;
}

/* Nav list */
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
}
.nav-item {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  text-align: left;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: #0b111a;
  color: var(--text);
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
}
.nav-item + li,
.nav-list li + li {
  margin-top: 8px;
}
.nav-item:hover {
  background: #0d1522;
  transform: translateY(-1px);
}
.nav-item.danger {
  color: var(--danger);
  border-color: rgba(255, 107, 107, 0.35);
}

/* Save bar */
.save-bar {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 12px;
  margin-top: 8px;
  background: rgba(6, 9, 15, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(6px);
}
.btn {
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.btn.primary {
  color: #0b0f14;
  background: linear-gradient(135deg, var(--brandA), var(--accent));
  border: 0;
}
.btn.ghost {
  background: transparent;
  color: var(--text);
}

/* Responsive */
@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
  .row {
    grid-template-columns: 160px 1fr;
  }
}

.error {
  color: #ffb4b4;
}
</style>
