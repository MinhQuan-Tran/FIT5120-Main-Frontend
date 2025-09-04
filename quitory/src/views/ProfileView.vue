<!-- src/views/ProfileView.vue -->
<template>
  <main class="profile-page" :class="{ 'reduce-motion': prefersReducedMotion }">
    <!-- Top App Bar -->
    <header class="appbar">
      <button class="icon-btn" aria-label="Go back" @click="onBack">
        <!-- left arrow -->
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path fill="currentColor" d="M14 7l-5 5 5 5 1.4-1.4L12.8 12l2.6-2.6L14 7z"/>
        </svg>
      </button>

      <h1 class="appbar-title">Profile &amp; Settings</h1>

      <div class="menu-wrap" ref="menuWrap">
        <button
          class="icon-btn"
          aria-haspopup="menu"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-label="Open menu"
          @click="toggleMenu"
        >
          <!-- three lines (hamburger) -->
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="currentColor" d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z"/>
          </svg>
        </button>

        <ul
          v-show="menuOpen"
          class="menu"
          role="menu"
          @keydown.escape.stop.prevent="closeMenu"
        >
          <li role="menuitem" tabindex="0" @click="onEditFromMenu" @keydown.enter="onEditFromMenu">
            {{ editing ? 'Save' : 'Edit Profile' }}
          </li>
          <li role="menuitem" tabindex="0" @click="onPrivacy" @keydown.enter="onPrivacy">Privacy Settings</li>
          <li role="menuitem" tabindex="0" @click="onAbout" @keydown.enter="onAbout">About Quitory</li>
        </ul>
      </div>
    </header>

    <!-- Purple Hero Box -->
    <section class="hero" aria-label="User summary">
      <img :src="form.avatarUrl" alt="User avatar" class="avatar" />
      <h2 class="name">{{ form.fullName }}</h2>
      <p class="email">{{ form.email }}</p>
      <p class="member">Member since {{ monthYear(memberSince) }}</p>
    </section>

    <!-- Stats Chips -->
    <section class="chips" aria-label="Progress stats">
      <div class="chip chip-blue" role="status" aria-live="polite">
        <div class="chip-emoji" aria-hidden="true">&#128467&#65039</div>
        <div class="chip-value">{{ stats.daysClean }}</div>
        <div class="chip-label">Days Clean</div>
      </div>
      <div class="chip chip-green" role="status" aria-live="polite">
        <div class="chip-emoji" aria-hidden="true">&#127941</div>
        <div class="chip-value">{{ stats.badges }}</div>
        <div class="chip-label">Badges</div>
      </div>
      <div class="chip chip-purple" role="status" aria-live="polite">
        <div class="chip-emoji" aria-hidden="true">&#128176</div>
        <div class="chip-value">{{ currency(stats.saved) }}</div>
        <div class="chip-label">Saved</div>
      </div>
    </section>

    <!-- Profile Information -->
    <section class="card" aria-labelledby="profile-info-heading">
      <header class="card-head">
        <h3 id="profile-info-heading">Profile Information</h3>
        <button class="link" @click="onEdit" :aria-pressed="editing">
          {{ editing ? "Save" : "Edit" }}
        </button>
      </header>

      <ul class="rows">
        <li class="row">
          <span class="label">Full Name</span>
          <span v-if="!editing" class="value">{{ form.fullName }}</span>
          <input
            v-else
            v-model="form.fullName"
            inputmode="text"
            autocomplete="name"
            aria-label="Full name"
          />
        </li>
        <li class="row">
          <span class="label">Email</span>
          <span v-if="!editing" class="value">{{ form.email }}</span>
          <input
            v-else
            v-model="form.email"
            type="email"
            inputmode="email"
            autocomplete="email"
            aria-label="Email"
          />
        </li>
        <li class="row">
          <span class="label">Quit Date</span>
          <span v-if="!editing" class="value">
            {{ new Date(form.quitDate + "T00:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) }}
          </span>
          <input
            v-else
            v-model="form.quitDate"
            type="date"
            @change="recalcStats"
            aria-label="Quit date"
          />
        </li>
        <li class="row">
          <span class="label">Daily Cost</span>
          <span v-if="!editing" class="value">{{ currency(form.dailyCost) }}</span>
          <input
            v-else
            v-model.number="form.dailyCost"
            type="number"
            min="0"
            step="0.5"
            inputmode="decimal"
            @change="recalcStats"
            aria-label="Daily cost"
          />
        </li>
      </ul>
    </section>

    <!-- Notifications -->
    <section class="card" aria-labelledby="notifications-heading">
      <header class="card-head">
        <h3 id="notifications-heading">Notifications</h3>
      </header>

      <div class="switch-row">
        <div class="switch-text">
          <div class="title">Daily Reminders</div>
          <div class="subtitle">Get reminded about your daily goals</div>
        </div>
        <label class="switch" :aria-checked="settings.dailyReminders" role="switch" tabindex="0" @keydown.enter.prevent="toggle('dailyReminders')" @keydown.space.prevent="toggle('dailyReminders')">
          <input type="checkbox" v-model="settings.dailyReminders" />
          <span class="slider"></span>
        </label>
      </div>

      <div class="switch-row">
        <div class="switch-text">
          <div class="title">Milestone Celebrations</div>
          <div class="subtitle">Celebrate your achievements</div>
        </div>
        <label class="switch" :aria-checked="settings.milestoneCelebrations" role="switch" tabindex="0" @keydown.enter.prevent="toggle('milestoneCelebrations')" @keydown.space.prevent="toggle('milestoneCelebrations')">
          <input type="checkbox" v-model="settings.milestoneCelebrations" />
          <span class="slider"></span>
        </label>
      </div>

      <div class="switch-row">
        <div class="switch-text">
          <div class="title">Support Messages</div>
          <div class="subtitle">Motivational messages and tips</div>
        </div>
        <label class="switch" :aria-checked="settings.supportMessages" role="switch" tabindex="0" @keydown.enter.prevent="toggle('supportMessages')" @keydown.space.prevent="toggle('supportMessages')">
          <input type="checkbox" v-model="settings.supportMessages" />
          <span class="slider"></span>
        </label>
      </div>

      <div class="switch-row">
        <div class="switch-text">
          <div class="title">Community Updates</div>
          <div class="subtitle">Updates from peer support groups</div>
        </div>
        <label class="switch" :aria-checked="settings.communityUpdates" role="switch" tabindex="0" @keydown.enter.prevent="toggle('communityUpdates')" @keydown.space.prevent="toggle('communityUpdates')">
          <input type="checkbox" v-model="settings.communityUpdates" />
          <span class="slider"></span>
        </label>
      </div>

      <div class="quiet">
        <div class="quiet-title">Quiet Hours</div>
        <div class="quiet-grid">
          <div>
            <label class="quiet-label">From</label>
            <input class="quiet-time" type="time" v-model="settings.quietFrom" />
          </div>
          <div>
            <label class="quiet-label">To</label>
            <input class="quiet-time" type="time" v-model="settings.quietTo" />
          </div>
        </div>
      </div>
    </section>

    <!-- Account -->
    <section class="card" aria-labelledby="account-heading">
      <header class="card-head">
        <h3 id="account-heading">Account</h3>
      </header>

      <ul class="list">
        <li class="list-item" role="button" tabindex="0" @click="onPrivacy" @keydown.enter="onPrivacy" @keydown.space.prevent="onPrivacy">
          <span class="left">
            <span class="icon-pill icon-blue" aria-hidden="true">
              <!-- shield -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 2l7 3v6c0 5-3.4 9.4-7 10-3.6-.6-7-5-7-10V5l7-3z"/>
              </svg>
            </span>
            <span class="title">Privacy Settings</span>
          </span>
          <span class="chevron" aria-hidden="true"></span>
        </li>

        <li class="list-item" role="button" tabindex="0" @click="onExport" @keydown.enter="onExport" @keydown.space.prevent="onExport">
          <span class="left">
            <span class="icon-pill icon-green" aria-hidden="true">
              <!-- download -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M5 20h14v-2H5v2zM11 4h2v7h3l-4 4-4-4h3V4z"/>
              </svg>
            </span>
            <span class="title">Export Data</span>
          </span>
          <span class="chevron" aria-hidden="true"></span>
        </li>

        <li class="list-item" role="button" tabindex="0" @click="onBackup" @keydown.enter="onBackup" @keydown.space.prevent="onBackup">
          <span class="left">
            <span class="icon-pill icon-purple" aria-hidden="true">
              <!-- sync -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 6V3L8 7l4 4V8c2.8 0 5 2.2 5 5 0 .7-.1 1.3-.4 1.9l1.8 1.1C18.8 15 19 14 19 13c0-3.9-3.1-7-7-7zm-5 6c0-.7.1-1.3.4-1.9L5.6 9C5.2 10 5 11 5 12c0 3.9 3.1 7 7 7v3l4-4-4-4v3c-2.8 0-5-2.2-5-5z"/>
              </svg>
            </span>
            <span class="title">Backup &amp; Sync</span>
          </span>
          <span class="chevron" aria-hidden="true"></span>
        </li>

        <li class="list-item danger-tile" role="button" tabindex="0" @click="onDelete" @keydown.enter="onDelete" @keydown.space.prevent="onDelete">
          <span class="left">
            <span class="icon-pill icon-red" aria-hidden="true">
              <!-- trash solid, centered -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M9 3.75A1.75 1.75 0 0 1 10.75 2h2.5A1.75 1.75 0 0 1 15 3.75V5h4a1 1 0 1 1 0 2h-1.06l-1.1 12.08A2.75 2.75 0 0 1 14.11 22H9.89a2.75 2.75 0 0 1-2.73-2.92L6.06 7H5a1 1 0 1 1 0-2h4V3.75Zm2 .25h2v1h-2V4Zm-3.92 3h9.84l-1.04 11.48a.75.75 0 0 1-.74.68H9.89a.75.75 0 0 1-.74-.68L7.08 7Z"/>
              </svg>
            </span>
            <span class="title">Delete Account</span>
          </span>
          <span class="chevron" aria-hidden="true"></span>
        </li>
      </ul>
    </section>

    <!-- Help & Support -->
    <section class="card" aria-labelledby="help-heading">
      <header class="card-head">
        <h3 id="help-heading">Help &amp; Support</h3>
      </header>

      <ul class="list">
        <!-- FAQ (force "?" glyph so it renders properly) -->
        <li class="list-item" role="button" tabindex="0" @click="onFAQ" @keydown.enter="onFAQ" @keydown.space.prevent="onFAQ">
          <span class="left">
            <span class="icon-pill icon-orange" aria-hidden="true">
              <span class="glyph">?</span>
            </span>
            <span class="title">FAQ</span>
          </span>
          <span class="chevron" aria-hidden="true"></span>
        </li>

        <li class="list-item" role="button" tabindex="0" @click="onContactSupport" @keydown.enter="onContactSupport" @keydown.space.prevent="onContactSupport">
          <span class="left">
            <span class="icon-pill icon-blue" aria-hidden="true">
              <!-- headset/support -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 2a8 8 0 0 0-8 8v4a3 3 0 0 0 3 3h2v-5H7V10a5 5 0 0 1 10 0v2h-2v5h2a3 3 0 0 0 3-3v-4a8 8 0 0 0-8-8Z"/>
              </svg>
            </span>
            <span class="title">Contact Support</span>
          </span>
          <span class="chevron" aria-hidden="true"></span>
        </li>

        <li class="list-item" role="button" tabindex="0" @click="onRateApp" @keydown.enter="onRateApp" @keydown.space.prevent="onRateApp">
          <span class="left">
            <span class="icon-pill icon-gold" aria-hidden="true">
              <!-- star -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="m12 17.3 6.2 3.7-1.6-7 5.4-4.7-7.1-.6L12 2 9.1 8.7l-7.1.6 5.4 4.7-1.6 7z"/>
              </svg>
            </span>
            <span class="title">Review</span>
          </span>
          <span class="chevron" aria-hidden="true"></span>
        </li>

        <li class="list-item" role="button" tabindex="0" @click="onAbout" @keydown.enter="onAbout" @keydown.space.prevent="onAbout">
          <span class="left">
            <span class="icon-pill icon-grey" aria-hidden="true">
              <!-- info -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/>
              </svg>
            </span>
            <span class="title">About Quitory</span>
          </span>
          <span class="chevron" aria-hidden="true"></span>
        </li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts">
export default {
  name: "ProfileView",
  data() {
    return {
      // ---- Profile data ----
      form: {
        fullName: "Alex Johnson",
        email: "alex.johnson@email.com",
        avatarUrl: "https://i.pravatar.cc/160?img=13",
        quitDate: "2025-03-15",
        dailyCost: 8.0,
      },
      memberSince: "2024-03-01",

      // ---- Stats ----
      stats: { daysClean: 0, badges: 0, saved: 0 },

      // ---- UI state ----
      editing: false,

      // ---- Notifications settings ----
      settings: {
        dailyReminders: true,
        milestoneCelebrations: true,
        supportMessages: false,
        communityUpdates: true,
        quietFrom: "22:00",
        quietTo: "08:00",
      },

      // App bar menu
      menuOpen: false as boolean,

      // Platform polish
      prefersReducedMotion:
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
      midnightTimer: 0 as any,
    };
  },
  created() {
    this.recalcStats();
    this.scheduleMidnightTick();
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener?.("change", this.onReducedMotionChange);
    } catch {}
  },
  mounted() {
    document.addEventListener("click", this.onDocClick, { capture: true });
  },
  beforeUnmount() {
    clearTimeout(this.midnightTimer);
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.removeEventListener?.("change", this.onReducedMotionChange);
    } catch {}
    document.removeEventListener("click", this.onDocClick, { capture: true } as any);
  },
  watch: {
    "form.quitDate"() { this.recalcStats(); },
    "form.dailyCost"() { this.recalcStats(); },
  },
  methods: {
    // Formatting helpers
    currency(n: number) {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD" }).format(n ?? 0);
    },
    monthYear(d: string) {
      const dt = new Date(d + "T00:00:00");
      return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(dt);
    },

    // Core stats
    recalcStats() {
      const quit = new Date(this.form.quitDate + "T00:00:00");
      const today = new Date();
      const days = Math.max(0, Math.floor((today.getTime() - quit.getTime()) / 86400000));
      const badges = (days > 0 ? 1 : 0) + Math.floor(days / 7);
      const saved = days * (this.form.dailyCost || 0);
      this.stats = { daysClean: days, badges, saved };
    },

    // Edit toggle
    onEdit() {
      this.editing = !this.editing;
      if (!this.editing) this.recalcStats();
    },
    onEditFromMenu() {
      this.onEdit();
      this.closeMenu();
    },

    // Switch keyboard toggle
    toggle(key: "dailyReminders" | "milestoneCelebrations" | "supportMessages" | "communityUpdates") {
      this.settings[key] = !this.settings[key];
    },

    // App bar actions
    onBack() {
      history.length > 1 ? history.back() : (window.location.href = "/");
    },
    toggleMenu(e: MouseEvent) {
      e.stopPropagation();
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    onDocClick() {
      if (this.menuOpen) this.closeMenu();
    },

    // Account actions (stubbed)
    onPrivacy() { alert("Open Privacy Settings"); this.closeMenu(); },
    onExport() { alert("Exporting your data..."); },
    onBackup() { alert("Open Backup & Sync"); },
    onDelete() {
      if (confirm("Delete your account? This cannot be undone.")) {
        alert("Account deletion requested.");
      }
    },

    // Help & Support
    onFAQ() { alert("Open FAQ"); },
    onContactSupport() {
      window.location.href = "mailto:support@quitory.app?subject=Support%20Request";
    },
    onRateApp() { window.open("https://quitory.app/rate", "_blank"); },
    onAbout() { alert("Quitory - helping you stay vape free."); },

    // Midnight tick so stats keep fresh
    scheduleMidnightTick() {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0);
      const ms = next.getTime() - now.getTime();
      this.midnightTimer = window.setTimeout(() => {
        this.recalcStats();
        this.scheduleMidnightTick();
      }, Math.max(1000, ms));
    },

    onReducedMotionChange(e: MediaQueryListEvent) {
      this.prefersReducedMotion = e.matches;
    },
  },
};
</script>

<style scoped>
/* Base layout with iOS safe areas and better tap targets */
.profile-page {
  max-width: 480px;
  margin: 0 auto;
  padding: calc(8px + env(safe-area-inset-top)) 12px calc(28px + env(safe-area-inset-bottom));
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: #f4f7fb;
  color: #0f172a;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  touch-action: manipulation;
}

/* Top App Bar */
.appbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffffcc;
  backdrop-filter: saturate(1.2) blur(8px);
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;
  border-radius: 12px;
  border: 1px solid #e5e9f2;
  margin-bottom: 10px;
  box-shadow: 0 6px 24px rgba(2,6,23,0.06);
}

.icon-btn {
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e5e9f2;
  background: #fff;
  cursor: pointer;
}
.icon-btn:focus-visible { outline: 2px solid #93c5fd; outline-offset: 2px; }

.appbar-title {
  font-size: 16px;
  font-weight: 800;
  margin: 0;
  text-align: left;
  color: #111827;
}

/* Menu */
.menu-wrap { position: relative; justify-self: end; }
.menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 180px;
  background: #fff;
  border: 1px solid #e5e9f2;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(2,6,23,0.12);
  padding: 6px;
  list-style: none;
  margin: 0;
}
.menu li {
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
}
.menu li:hover, .menu li:focus-visible {
  background: #f3f4f6;
  outline: none;
}

/* Purple hero */
.hero {
  border-radius: 16px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: #fff;
  text-align: center;
  padding: 60px 16px 18px;
  margin-bottom: 12px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
}
.avatar {
  width: 88px; height: 88px; border-radius: 50%;
  border: 3px solid #fff; object-fit: cover; margin-bottom: 10px;
}
.name { font-size: 20px; font-weight: 800; margin: 4px 0 2px; }
.email { font-size: 13px; opacity: .95; margin: 0; word-break: break-all; }
.member { font-size: 12px; opacity: .9; margin: 2px 0 0; }

/* Chips */
.chips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 12px 0 14px; }
.chip {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  border-radius: 12px; text-align: center; padding: 14px 6px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06); border: 1px solid #e5e9f2;
  min-height: 84px; font-weight: 800;
}
.chip-emoji { font-size: 22px; line-height: 1; margin-top: 2px; }
.chip-value { font-size: 24px; line-height: 1.1; font-weight: 800; }
.chip-label { font-size: 12px; font-weight: 700; opacity: .8; margin-top: 2px; }
.chip-blue   { background: #dbeafe; color: #1e3a8a; }
.chip-green  { background: #dcfce7; color: #166534; }
.chip-purple { background: #ede9fe; color: #4c1d95; }

/* Cards */
.card {
  background: #fff; border-radius: 16px; overflow: hidden;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06); border: 1px solid #e5e9f2;
  margin-top: 8px; padding-bottom: 8px;
}
.card-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px 8px;
}
.card-head h3 { margin: 0; font-size: 15px; font-weight: 800; }
.link {
  background: none; border: none; color: #3b82f6; font-weight: 700; cursor: pointer;
  padding: 8px 10px; border-radius: 10px;
}
.link:focus-visible { outline: 2px solid #93c5fd; outline-offset: 2px; }

/* Profile info rows */
.rows { list-style: none; margin: 0; padding: 0; }
.row {
  display: grid; grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 12px 16px; border-top: 1px solid #e5e9f2; align-items: center;
}
.row:first-child { border-top: none; }
.label { color: #6b7280; font-size: 14px; }
.value { font-size: 14px; font-weight: 700; color: #0f172a; }
input {
  border: 1px solid #e5e9f2; border-radius: 10px; padding: 10px 12px; font-size: 16px; color: #0f172a;
  background: #fff; width: min(240px, 60vw);
}

/* Notifications (iOS-style switches) */
.switch-row {
  display: grid; grid-template-columns: 1fr auto; align-items: center;
  gap: 12px; padding: 12px 16px; border-top: 1px solid #e5e9f2;
}
.switch-text .title { font-size: 14px; font-weight: 700; color: #0f172a; }
.switch-text .subtitle { font-size: 12px; color: #6b7280; margin-top: 2px; }

/* Toggle */
.switch { position: relative; width: 50px; height: 30px; display: inline-block; }
.switch input { display: none; }
.slider {
  position: absolute; inset: 0; background: #e5e7eb; border-radius: 999px; transition: all .2s ease;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.06);
}
.slider:before {
  content: ""; position: absolute; height: 24px; width: 24px; left: 3px; top: 3px;
  background: #fff; border-radius: 50%; transition: all .2s ease; box-shadow: 0 1px 3px rgba(0,0,0,.2);
}
.switch input:checked + .slider { background: #3b82f6; }
.switch input:checked + .slider:before { transform: translateX(20px); }

/* Quiet hours */
.quiet { padding: 8px 16px 12px; border-top: 1px solid #e5e9f2; }
.quiet-title { font-weight: 800; margin: 8px 0 10px; }
.quiet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.quiet-label { display: block; font-size: 12px; color: #6b7280; margin: 0 0 6px 2px; }
.quiet-time {
  width: 100%; border: 1px solid #e5e9f2; background: #fff; color: #0f172a;
  border-radius: 10px; padding: 10px 12px; font-size: 16px;
}

/* Account list tiles */
.list { list-style: none; margin: 4px 8px 12px; padding: 0; display: grid; gap: 10px; }
.list-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 14px;
  border-radius: 12px;
  border: 1px solid #e5e9f2;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(2,6,23,0.06);
  cursor: pointer;
  width: 100%;
}
.list-item:focus-visible { outline: 2px solid #93c5fd; outline-offset: 2px; }
.left { display: inline-flex; align-items: center; gap: 10px; }
.title { font-size: 14px; font-weight: 700; color: #0f172a; }

/* Right chevron */
.chevron { flex: 0 0 auto; width: 18px; text-align: right; color: #9aa4b2; }
.chevron::before { content: ">"; font-size: 18px; line-height: 1; }

/* Icon pills */
.icon-pill {
  width: 32px; height: 32px; border-radius: 999px;
  display: grid; place-items: center;
  background: #eef2f7; color: #334155;
}
.icon-pill svg { width: 18px; height: 18px; display: block; }
.icon-pill .glyph { font-weight: 900; font-size: 18px; line-height: 1; transform: translateY(-1px); } /* the "?" */

/* Color variants */
.icon-blue   { background: #e0ecff; color: #1e40af; }
.icon-green  { background: #dcfce7; color: #166534; }
.icon-purple { background: #ede9fe; color: #4c1d95; }
.icon-red    { background: #fee2e2; color: #b91c1c; }
.icon-orange { background: #fde68a; color: #92400e; }
.icon-gold   { background: #fef3c7; color: #b45309; }
.icon-grey   { background: #e5e7eb; color: #374151; }

/* Danger tile */
.danger-tile { border-color: #fecaca; background: #fff5f5; color: #b91c1c; }
.danger-tile .title { color: #b91c1c; }
.danger-tile .chevron { color: #ef4444; }

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .profile-page { background: #0b0f14; color: #e5e7eb; }
  .appbar { background: #0b0f14e6; border-color: #1f2937; }
  .icon-btn { background: #111827; border-color: #1f2937; }
  .appbar-title { color: #e5e7eb; }

  .card { background: #111827; border-color: #1f2937; }
  .row, .switch-row, .quiet { border-color: #1f2937; }
  .label, .switch-text .subtitle { color: #9ca3af; }
  .value, .switch-text .title { color: #e5e7eb; }
  input, .quiet-time { background: #0f1622; border-color: #1f2937; color: #e5e7eb; }

  .chip { border-color: #1f2937; }
  .chip-blue   { background: #1e3a8a22; color: #93c5fd; }
  .chip-green  { background: #14532d22; color: #86efac; }
  .chip-purple { background: #4c1d9522; color: #c4b5fd; }

  .list-item { background: #111827; border-color: #1f2937; box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
  .title { color: #e5e7eb; }
  .chevron { color: #9ca3af; }
  .danger-tile { background: #2a1111; border-color: #5b1a1a; color: #fca5a5; }
  .danger-tile .title { color: #fca5a5; }
  .danger-tile .chevron { color: #f87171; }
}

/* Reduced motion */
.reduce-motion * { transition: none !important; animation: none !important; }
</style>
