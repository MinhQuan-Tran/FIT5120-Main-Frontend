<!-- src/views/AboutView.vue -->
<template>
  <main class="about-page" :class="{ 'reduce-motion': prefersReducedMotion }">
    <!-- HERO -->
    <section class="hero" :style="heroStyle" role="banner">
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="hero-inner">
        <span class="hero-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
            <path fill="currentColor" d="M12 21s-7.3-4.3-9.7-8.1C.5 10 .9 7.1 3 5.4 4.8 4 7.3 4.3 9 5.8L12 9l3-3.2c1.7-1.5 4.2-1.8 6-.4 2.1 1.7 2.5 4.6.7 7.5C19.3 16.7 12 21 12 21z"/>
          </svg>
        </span>
        <h1 class="hero-title">About Quitory</h1>
        <p class="hero-sub">Your digital companion for a vape-free life</p>
      </div>
    </section>

    <!-- MISSION -->
    <section id="mission" class="section mission">
      <div class="container">
        <div class="mission-head">
          <span class="mission-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true">
              <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-3.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
            </svg>
          </span>
          <h2 class="h2">Our Mission</h2>
        </div>
        <p class="mission-text">
          We empower young adults to break free from vaping through engaging digital support, motivational tracking, and a community that celebrates every milestone on your journey to freedom.
        </p>
      </div>
    </section>

    <!-- WHAT WE STAND FOR -->
    <section id="standfor" class="section standfor alt">
      <div class="container">
        <h2 class="h2 center">What We Stand For</h2>
        <ul class="pill-list" role="list">
          <li
            v-for="(item, i) in pillars"
            :key="item.title"
            class="pill"
            :class="{ active: activePill === i }"
            role="button"
            tabindex="0"
            @mouseenter="setActive(i)"
            @mouseleave="clearActive()"
            @focus="setActive(i)"
            @blur="clearActive()"
            @pointerdown="setActive(i)"
            @pointerup="clearActive()"
          >
            <div class="pill-ico" :style="{ backgroundColor: item.tint }" aria-hidden="true" v-html="item.icon"></div>
            <div class="pill-body">
              <h3 class="pill-title">{{ item.title }}</h3>
              <p class="pill-text">{{ item.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section id="how" class="section how alt-white">
      <div class="container">
        <h2 class="h2 center">How Quitory Works</h2>
        <ol class="steps" role="list">
          <li v-for="(step, i) in steps" :key="i" class="step">
            <div class="step-num">{{ i + 1 }}</div>
            <div class="step-body">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-text">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- KEY FEATURES -->
    <section id="features" class="section features alt">
      <div class="container">
        <h2 class="h2 center">Key Features</h2>
        <div class="feature-grid">
          <article
            v-for="(f, i) in features"
            :key="f.title"
            class="feature-card"
            role="button"
            tabindex="0"
            @mouseenter="f.active = true"
            @mouseleave="f.active = false"
            @focus="f.active = true"
            @blur="f.active = false"
            @pointerdown="f.active = true"
            @pointerup="f.active = false"
          >
            <div class="fc-ico" :class="{ pop: f.active }" :style="{ backgroundColor: f.tint }" aria-hidden="true" v-html="f.icon"></div>
            <h3 class="fc-title">{{ f.title }}</h3>
            <p class="fc-sub">{{ f.sub }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- WHY QUITTING MATTERS -->
    <section id="why" class="section why alt-white">
      <div class="container">
        <h2 class="h2 center">Why Quitting Matters</h2>
        <ul class="why-list" role="list">
          <li v-for="(w, i) in why" :key="i" class="why-card" :style="{ background: w.bg }">
            <div class="why-body">
              <div class="why-title" :style="{ color: w.color }">{{ w.title }}</div>
              <div class="why-sub">{{ w.sub }}</div>
            </div>
            <div class="why-ico" :style="{ color: w.color }" v-html="w.icon" aria-hidden="true"></div>
          </li>
        </ul>
      </div>
    </section>

    <!-- TEAM -->
    <section id="team" class="section team alt">
      <div class="container">
        <h2 class="h2 center">Built by People Who Care</h2>
        <div class="team-card">
          <div class="team-avatars" role="list">
            <button
              v-for="(m, i) in team"
              :key="m.name + i"
              class="avatar"
              role="listitem"
              :aria-label="m.name"
              @mouseenter="m.active = true"
              @mouseleave="m.active = false"
              @focus="m.active = true"
              @blur="m.active = false"
            >
              <img :src="m.src" :alt="m.name" />
            </button>
          </div>
          <h3 class="team-title">A Team That Understands</h3>
          <p class="team-text">
            Our team includes former vapers, health advocates, and young adults who understand the challenges of quitting.
            We're here to support you every step of the way.
          </p>
        </div>
      </div>
    </section>

    <!-- COMMUNITY TESTIMONIALS -->
    <section id="community" class="section community alt-white">
      <div class="container">
        <h2 class="h2 center">Join Our Community</h2>
        <ul class="testi-list" role="list">
          <li v-for="(t, i) in testimonials" :key="t.name + i" class="testi-card">
            <img class="testi-avatar" :src="t.src" :alt="t.name" />
            <div class="testi-bubble">{{ t.quote }}</div>
            <div class="testi-meta">
              <span class="testi-name">{{ t.name }}</span>
              <span class="dot"></span>
              <span class="testi-days">{{ t.days }} days clean</span>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- CTA -->
    <section id="cta" class="cta" :style="ctaStyle">
      <div class="cta-inner">
        <h2 class="cta-title">Ready to Start Your Journey?</h2>
        <p class="cta-sub">Join thousands of young adults who chose freedom over addiction</p>
        <button class="cta-btn" type="button" @click="goSignup">Get Started Today</button>
        <ul class="cta-list" aria-label="Highlights">
          <li v-for="(i, idx) in ctaPoints" :key="idx" class="cta-point">
            <span class="check" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9.2 16.3 4.9 12l1.4-1.4 2.9 2.9 8.5-8.5 1.4 1.4z"/></svg>
            </span>
            {{ i }}
          </li>
        </ul>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="site-footer" role="contentinfo">
    <div class="foot-wrap">
      <div class="brand">
        <span class="logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <defs>
              <linearGradient id="g" x1="0" x2="1" y1="1" y2="0">
                <stop offset="0" stop-color="#8b5cf6"></stop>
                <stop offset="1" stop-color="#60a5fa"></stop>
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#g)"/>
            <path d="M9 15c2.2 0 3.6-1.4 4.4-2.9.5-.9 1.5-1.1 2.4-.6-.5 2.8-2.5 5.5-6.8 5.5-1 0-1.9-.2-2.7-.6 0 0 1.1-1.4 2.7-1.4z" fill="#fff"/>
          </svg>
        </span>
        <div class="brand-text">
          <div class="brand-name">Quitory</div>
          <div class="brand-sub">Your digital companion for a vape-free life</div>
        </div>
      </div>

      <div class="cols">
        <nav class="col">
          <h3 class="col-title">Support</h3>
          <a href="#" class="col-link">Help Center</a>
          <a href="#" class="col-link">Contact Us</a>
          <a href="#" class="col-link">FAQ</a>
        </nav>

        <nav class="col">
          <h3 class="col-title">Resources</h3>
          <a href="#" class="col-link">Quit Guide</a>
          <a href="#" class="col-link">Health Tips</a>
          <a href="#" class="col-link">Success Stories</a>
        </nav>
      </div>

      <ul class="social" aria-label="Social media">
        <li><a class="sbtn" href="#" aria-label="Instagram">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5zm5.25-2.25a1.25 1.25 0 1 0 1.25 1.25 1.25 1.25 0 0 0-1.25-1.25z"/></svg>
        </a></li>
        <li><a class="sbtn" href="#" aria-label="Twitter / X">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 3h4.7l5.1 7 5.7-7H21l-7.8 9.6L21 21h-4.7l-5.3-7.2L5 21H3l8.6-10.5L3 3z"/></svg>
        </a></li>
        <li><a class="sbtn" href="#" aria-label="TikTok">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M15.5 3H17a5.5 5.5 0 0 0 4 4v2a8 8 0 0 1-4-1.1V16a5 5 0 1 1-5.9-4.9V13a3 3 0 1 0 2.9 3V3z"/></svg>
        </a></li>
      </ul>
    </div>

    <div class="copy">
      © 2024 Quitory. All rights reserved.
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutView',
  data() {
    return {
      heroBgUrl:
        'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd4ZGJxYnQ0Z2NpMjd6MGxvMjVkc2R1OGluN3lpZW1uY2NkdzJtNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6MbeStoPrvZSvdfy/giphy.gif',
      prefersReducedMotion: false,
      activePill: -1,
      pillars: [
        {
          title: 'Community Support',
          text: 'Building a judgment-free space where young adults support each other through their quitting journey.',
          tint: '#e7f0ff',
          icon: `<svg viewBox='0 0 24 24' width='28' height='28'><path fill='#3b82f6' d='M12 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm6 0a2.5 2.5 0 1 0-2.5-2.5A2.5 2.5 0 0 0 18 12zm-12 0a2.5 2.5 0 1 0-2.5-2.5A2.5 2.5 0 0 0 6 12zm6 2c-3.33 0-6 1.34-6 3v2h12v-2c0-1.66-2.67-3-6-3z'/></svg>`
        },
        {
          title: 'Progress Tracking',
          text: 'Making your progress visible through time saved, money earned, and health improvements.',
          tint: '#e8f8ee',
          icon: `<svg viewBox='0 0 24 24' width='28' height='28'><path fill='#10b981' d='M3 3h2v18H3V3zm16 2 2 2-8 8-4-4-4 4-2-2 6-6 4 4 6-6z'/></svg>`
        },
        {
          title: 'Milestone Rewards',
          text: 'Celebrating every achievement with badges, rewards, and motivational content.',
          tint: '#f2e9ff',
          icon: `<svg viewBox='0 0 24 24' width='28' height='28'><path fill='#8b5cf6' d='M17 3H7v6a5 5 0 1 0 10 0V3zm-5 20-4-4.5 4 .5 4-.5L12 23z'/></svg>`
        }
      ],
      steps: [
        { title: 'Set Your Quit Date', text: 'Choose when you want to start your vape-free journey' },
        { title: 'Track Your Progress', text: 'Monitor days clean, money saved, and health improvements' },
        { title: 'Earn Rewards', text: 'Unlock badges and achievements for reaching milestones' },
        { title: 'Stay Motivated', text: 'Receive daily reminders and motivational content' }
      ],
      features: [
        { title: 'Daily Tracking', sub: 'Monitor your progress every day', tint: '#e7efff', active: false,
          icon: `<svg viewBox='0 0 24 24' width='28' height='28'><path fill='#2563eb' d='M7 2h2v2h6V2h2v2h3v16H4V4h3V2zm11 6H6v10h12V8zm-9 2h2v2H9v-2zm4 0h2v2h-2v-2z'/></svg>` },
        { title: 'Money Saved', sub: "See how much you're saving", tint: '#e8f8ee', active: false,
          icon: `<svg viewBox='0 0 24 24' width='28' height='28'><path fill='#10b981' d='M21 7H3V5h18v2zm0 2H3v10h18V9zm-9 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z'/></svg>` },
        { title: 'Health Benefits', sub: "Track your body's recovery", tint: '#fdecec', active: false,
          icon: `<svg viewBox='0 0 24 24' width='28' height='28'><path fill='#ef4444' d='M12 21s-7-4.35-9-8.35C1 9 3.5 6 6.5 6 8.24 6 9.8 6.91 11 8.24 12.2 6.91 13.76 6 15.5 6 18.5 6 21 9 21 12.65 19 16.65 12 21 12 21zm-1-7h2l1-2 1 3h2l-2 4-1-3-1 2-2-4z'/></svg>` },
        { title: 'Achievement Badges', sub: 'Unlock milestone rewards', tint: '#f2eafe', active: false,
          icon: `<svg viewBox='0 0 24 24' width='28' height='28'><path fill='#8b5cf6' d='M17 3H7v6a5 5 0 1 0 10 0V3zM7 19l5 3 5-3-5-.6L7 19z'/></svg>` },
      ],
      why: [
        {
          title: '$1,500+',
          sub: 'Average yearly savings',
          color: '#2563eb',
          bg: 'linear-gradient(90deg,#e8f1ff 0%, #eaf2ff 100%)',
          icon: `<svg viewBox='0 0 24 24' width='28' height='28'><path fill='currentColor' d='M12 3a1 1 0 0 1 1 1v1.06c1.2.2 2.2.74 2.89 1.55.73.83 1.11 1.9 1.11 3.12h-2a2.7 2.7 0 0 0-.56-1.75C13.99 7.26 13.2 6.9 12 6.9c-1.42 0-2.4.64-2.4 1.6 0 .75.53 1.16 2.08 1.56l.9.23c2.34.6 3.72 1.72 3.72 3.6 0 1.86-1.39 3.22-3.4 3.57V19a1 1 0 0 1-2 0v-1.02c-1.35-.2-2.45-.77-3.19-1.64A4.1 4.1 0 0 1 6.2 13h2.06c.1.8.39 1.36.9 1.79.51.44 1.22.66 2.12.66 1.52 0 2.52-.62 2.52-1.64 0-.79-.58-1.23-2.2-1.67l-.94-.25c-2.2-.57-3.64-1.62-3.64-3.43 0-1.83 1.33-3.13 3.34-3.47V4a1 1 0 0 1 1-1Z'/></svg>`
        },
        {
          title: '24 Hours',
          sub: 'Nicotine leaves your system',
          color: '#16a34a',
          bg: 'linear-gradient(90deg,#ecfdf1 0%, #eafaf0 100%)',
          icon: `<svg viewBox='0 0 24 24' width='28' height='28'><path fill='currentColor' d='M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 11h-5V9h2v2h3z'/></svg>`
        },
        {
          title: '2 Weeks',
          sub: 'Improved lung function begins',
          color: '#8b5cf6',
          bg: 'linear-gradient(90deg,#f6efff 0%, #f4f0ff 100%)',
          icon: `<svg viewBox='0 0 24 24' width='28' height='28'><path fill='currentColor' d='M7 3a1 1 0 0 1 1 1v7c0 1.1.9 2 2 2h1v8H9v-5.05A6 6 0 0 1 3 10V4a1 1 0 0 1 1-1h3zm10 0a1 1 0 0 1 1 1v6a6 6 0 0 1-5 5.92V22h-2v-8h1a2 2 0 0 0 2-2V4a1 1 0 0 1 1-1h2z'/></svg>`
        }
      ],
      team: [
        { name: 'Ava',   src: 'https://randomuser.me/api/portraits/women/65.jpg', active: false },
        { name: 'Malik', src: 'https://randomuser.me/api/portraits/men/32.jpg',   active: false },
        { name: 'Lina',  src: 'https://randomuser.me/api/portraits/women/12.jpg', active: false }
      ],
      testimonials: [
        { name: 'Alex',  days: 30, src: 'https://randomuser.me/api/portraits/men/11.jpg',  quote: 'Day 30 vape-free! Quitory helped me save over $200 already ' },
        { name: 'Sarah', days: 15, src: 'https://randomuser.me/api/portraits/women/44.jpg', quote: 'The daily reminders keep me motivated. Best decision ever!' }
      ],
      ctaPoints: ['Free to start', 'No judgment', '24/7 support']
    };
  },
  computed: {
    heroStyle(): Record<string, string> {
      return this.heroBgUrl ? { backgroundImage: `url(${this.heroBgUrl})` } : {};
    },
    ctaStyle(): Record<string, string> {
      return { background: 'linear-gradient(135deg, rgba(96,165,250,0.9), rgba(139,92,246,0.95))' };
    }
  },
  mounted() {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = mq.matches;
      const listener = (e: MediaQueryListEvent) => (this.prefersReducedMotion = e.matches);
      // @ts-ignore Safari legacy
      mq.addEventListener ? mq.addEventListener('change', listener) : mq.addListener(listener);
    } catch {}
  },
  methods: {
    setActive(i: number) { this.activePill = i; },
    clearActive() { this.activePill = -1; },
    goSignup() {
      try { this.$router.push('/signup'); } catch { window.location.hash = '#/signup'; }
    }
  }
});
</script>

<style scoped>
:root { --hero-min-h: 56vh; }
.about-page { display: block; color: #1a1a1a; background: #fff; }

/* HERO */
.hero { position: relative; min-height: var(--hero-min-h); display: grid; place-items: center; background-position: center; background-size: cover; background-repeat: no-repeat; isolation: isolate; }
.hero-overlay { position: absolute; inset: 0; background: rgba(60, 0, 120, 0.55); z-index: 0; }
.hero-inner { position: relative; z-index: 1; text-align: center; padding: 56px 16px; color: #fff; }
.hero-ico { display: inline-flex; margin-bottom: 12px; opacity: 0.95; }
.hero-title { font-size: clamp(24px, 3vw, 36px); margin: 0 0 6px; font-weight: 700; }
.hero-sub { font-size: clamp(14px, 2.2vw, 18px); margin: 0; opacity: 0.95; }

/* SECTION BASE */
.section { padding: 40px 16px; }
.container { max-width: 1000px; margin: 0 auto; }
.center { text-align: center; }
.alt { background: #f7f9fb; }
.alt-white { background: #ffffff; }

/* MISSION */
.mission-head { text-align: center; margin-bottom: 10px; }
.mission-ico { display: inline-flex; margin-bottom: 10px; color: #5b43ff; }
.h2 { font-size: clamp(20px, 2.6vw, 28px); font-weight: 700; margin: 0 0 12px; color: #111827; letter-spacing: 0.2px; }
.mission-text { max-width: 820px; margin: 10px auto 0; line-height: 1.7; color: #4b5563; font-size: 16px; }

/* PILL LIST */
.pill-list { list-style: none; padding: 0; margin: 24px 0 0; display: grid; gap: 18px; }
.pill { display: grid; grid-template-columns: auto 1fr; gap: 18px; align-items: center; background: #fff; border-radius: 16px; padding: 18px; box-shadow: 0 2px 10px rgba(17,24,39,0.06); transition: transform 180ms ease, box-shadow 180ms ease; cursor: pointer; outline: none; border: 1px solid rgba(17,24,39,0.05); }
.pill.active, .pill:hover, .pill:focus-visible { transform: translateY(-1px) scale(1.01); box-shadow: 0 10px 24px rgba(17,24,39,0.12); }
.pill-ico { width: 56px; height: 56px; border-radius: 12px; display: grid; place-items: center; }
.pill-title { font-size: 22px; margin: 0 0 6px; color: #0f172a; font-weight: 700; }
.pill-text { margin: 0; color: #4b5563; line-height: 1.7; }

/* HOW IT WORKS */
.steps { list-style: none; padding: 0; margin: 32px 0 0; display: grid; gap: 22px; }
.step { display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: flex-start; }
.step-num { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #9333ea); color: #fff; font-weight: 700; font-size: 18px; display: grid; place-items: center; flex-shrink: 0; box-shadow: 0 6px 14px rgba(79, 70, 229, 0.25); }
.step-title { margin: 0 0 4px; font-size: 20px; color: #111827; font-weight: 700; }
.step-text { margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6; }

/* FEATURES */
.feature-grid { display: grid; grid-template-columns: 1fr; gap: 18px; margin-top: 16px; }
.feature-card { background: #fff; border-radius: 16px; padding: 28px 20px; text-align: center; box-shadow: 0 2px 10px rgba(17,24,39,0.06); border: 1px solid rgba(17,24,39,0.05); cursor: pointer; outline: none; transition: transform 180ms ease, box-shadow 180ms ease; }
.feature-card:hover, .feature-card:focus-visible { transform: translateY(-2px) scale(1.02); box-shadow: 0 14px 28px rgba(17,24,39,0.12); }
.fc-ico { width: 64px; height: 64px; border-radius: 16px; display: grid; place-items: center; margin: 0 auto 12px; transition: transform 180ms ease, filter 180ms ease; }
.fc-ico.pop { transform: translateY(-2px) scale(1.05); filter: saturate(1.25) brightness(1.05); }
.fc-title { margin: 6px 0 6px; font-size: 20px; font-weight: 800; color: #0f172a; }
.fc-sub { margin: 0; color: #4b5563; }
@media (min-width: 840px) { .feature-grid { grid-template-columns: 1fr 1fr; } }

/* WHY QUITTING MATTERS */
.why-list { list-style: none; padding: 0; margin: 18px 0 0; display: grid; gap: 18px; }
.why-card { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 16px; padding: 22px; border-radius: 18px; box-shadow: 0 2px 10px rgba(17,24,39,0.06); border: 1px solid rgba(17,24,39,0.05); transition: transform 180ms ease, box-shadow 180ms ease; }
.why-card:hover, .why-card:focus-within { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(17,24,39,0.12); }
.why-title { font-size: 28px; font-weight: 800; }
.why-sub { margin-top: 6px; color: #374151; }
.why-ico { width: 42px; height: 42px; display: grid; place-items: center; }

/* TEAM */
.team-card { background: #fff; border-radius: 20px; padding: 28px 20px; box-shadow: 0 2px 10px rgba(17,24,39,0.06); border: 1px solid rgba(17,24,39,0.05); text-align: center; }
.team-avatars { display: flex; justify-content: center; gap: 16px; margin: 10px 0 12px; }
.avatar { width: 72px; height: 72px; border-radius: 999px; overflow: hidden; padding: 0; border: none; background: transparent; cursor: pointer; outline: none; transition: transform 180ms ease, box-shadow 180ms ease; box-shadow: 0 2px 10px rgba(17,24,39,0.06); }
.avatar:hover, .avatar:focus-visible { transform: translateY(-2px) scale(1.04); box-shadow: 0 14px 28px rgba(17,24,39,0.12); }
.avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.team-title { font-size: 20px; font-weight: 800; margin: 6px 0 6px; color: #111827; }
.team-text { max-width: 820px; margin: 0 auto; color: #4b5563; line-height: 1.7; }

/* COMMUNITY */
.testi-list { list-style: none; padding: 0; margin: 16px 0 0; display: grid; gap: 22px; }
.testi-card { background: #f6f8fb; border-radius: 18px; padding: 16px; display: grid; grid-template-columns: 56px 1fr; gap: 14px; align-items: start; border: 1px solid rgba(17,24,39,0.05); }
.testi-avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.testi-bubble { background: #fff; border-radius: 14px; padding: 16px; line-height: 1.6; color: #111827; box-shadow: inset 0 0 0 1px rgba(17,24,39,0.05); }
.testi-meta { grid-column: 2; color: #6b7280; font-size: 14px; margin-top: 6px; display: flex; align-items: center; gap: 8px; }
.testi-name { color: #111827; font-weight: 600; }
.dot { opacity: .6; }

/* CTA */
.cta { color: #fff; padding: 70px 16px; text-align: center; background: linear-gradient(135deg, #60a5fa, #8b5cf6); }
.cta-inner { max-width: 960px; margin: 0 auto; }
.cta-title { margin: 0 0 10px; font-weight: 800; font-size: clamp(26px, 4vw, 42px); }
.cta-sub { margin: 0 0 24px; font-size: clamp(15px, 2.2vw, 22px); opacity: 0.95; }
.cta-btn { appearance: none; border: none; border-radius: 999px; padding: 16px 28px; font-weight: 800; font-size: 20px; background: #fff; color: #3b82f6; box-shadow: 0 10px 30px rgba(0,0,0,.15); cursor: pointer; transition: transform .18s ease, box-shadow .18s ease; }
.cta-btn:hover, .cta-btn:focus-visible { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(0,0,0,.22); }
.cta-list { display: flex; flex-wrap: wrap; gap: 22px; justify-content: center; margin: 20px 0 0; padding: 0; list-style: none; }
.cta-point { display: inline-flex; align-items: center; gap: 10px; font-size: 18px; opacity: 0.95; }
.check { display: inline-flex; width: 24px; height: 24px; border-radius: 999px; background: rgba(255,255,255,.2); align-items: center; justify-content: center; }

/* FOOTER */
.site-footer { background: #0f1b26; color: #cbd5e1; margin-top: 48px; }
.foot-wrap { max-width: 1100px; margin: 0 auto; padding: 36px 16px 18px; display: grid; gap: 28px; }
.brand { display: flex; align-items: center; gap: 12px; justify-content: center; text-align: center; flex-wrap: wrap; }
.logo { display: grid; place-items: center; padding: 8px; background: rgba(148,163,184,.1); border-radius: 12px; }
.brand-text { line-height: 1.2; }
.brand-name { font-size: 28px; font-weight: 800; color: #e5e7eb; }
.brand-sub { font-size: 16px; color: #94a3b8; margin-top: 6px; }

.cols { display: grid; grid-template-columns: 1fr; gap: 24px; justify-items: center; }
.col { text-align: left; }
.col-title { color: #e5e7eb; font-weight: 800; margin-bottom: 10px; }
.col-link { display: block; color: #aab4c6; text-decoration: none; margin: 8px 0; transition: color .18s ease; }
.col-link:hover { color: #ffffff; }

.social { display: flex; justify-content: center; gap: 14px; list-style: none; padding: 10px 0 0; margin: 0; }
.sbtn { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 999px; background: #1f2a37; color: #cbd5e1; text-decoration: none; transition: transform .18s ease, background .18s ease; }
.sbtn:hover, .sbtn:focus-visible { background: #263445; transform: translateY(-2px); }

.copy { border-top: 1px solid rgba(148,163,184,.2); text-align: center; padding: 14px 16px 22px; color: #8aa0b4; font-size: 14px; }

@media (min-width: 720px) {
  .cols { grid-template-columns: repeat(2, 220px); justify-content: center; }
}

.reduce-motion * { transition: none !important; animation: none !important; }
@media (min-width: 768px) {
  :root { --hero-min-h: 62vh; }
  .hero-inner { padding: 80px 24px; }
}
</style>
