<script lang="ts">
  export default {};
</script>

<template>
  <main class="progress-view">
    <!-- HERO -->
    <section class="hero">
      <div class="streak">
        <div class="streak-icon" aria-hidden="true"></div>
        <h1 class="streak-days">23</h1>
        <p class="streak-label">Days Vape-Free</p>
        <p class="streak-sub">Your longest streak yet! 🔥</p>
      </div>

      <!-- next milestone lives inside hero -->
      <div class="next-milestone">
        <p class="next-milestone-label">Next milestone in</p>
        <p class="next-milestone-value">7 days</p>
        <p class="next-milestone-note">30-day champion badge</p>
      </div>
    </section>

    <!-- PROGRESS SUMMARY -->
    <section class="progress-summary">
      <h2 class="progress-summary-title">Incredible Progress, Alex!</h2>

      <p class="progress-summary-text">
        You’ve saved <strong>$184</strong> and regained <strong>552 hours</strong> of life!
      </p>

      <div class="progress-summary-stats">
        <div class="summary-stat">
          <span class="summary-stat-value">$184</span>
          <span class="summary-stat-label">saved</span>
        </div>

        <div class="summary-stat">
          <span class="summary-stat-value">552</span>
          <span class="summary-stat-label">hours</span>
        </div>
      </div>
    </section>

    <!-- MILESTONE PROGRESS -->
    <section class="milestone-progress">
      <div class="milestone-progress-header">
        <b>Milestone Progress</b>
        <span class="milestone-progress-percent">76% to next goal</span>
      </div>

      <div class="milestone-progress-bar">
        <progress value="76" max="100"></progress>
      </div>

      <div class="milestone-progress-ticks">
        <span>20 days</span>
        <span>23 days</span>
        <span>30 days</span>
      </div>
    </section>

    <!-- ACHIEVEMENTS -->
    <section class="achievements">
      <div class="achievement-alert">
        <div class="achievement-alert-icon" aria-hidden="true"></div>
        <div class="achievement-alert-content">
          <p class="achievement-alert-title">New Achievement Unlocked!</p>
          <p class="achievement-alert-desc">Strong Will badge earned yesterday</p>
        </div>
      </div>

      <!-- earned only (example) -->
      <div class="achievements-header">
        <h3>Your Achievements</h3>
        <span>4 of 12 earned</span>
      </div>

      <div class="achievements-grid">
        <article class="badge badge--gold">
          <div class="badge-icon" aria-hidden="true">🏆</div>
          <h4 class="badge-title">First Week</h4>
          <p class="badge-desc">7 days strong</p>
        </article>

        <article class="badge badge--blue">
          <div class="badge-icon" aria-hidden="true">🛡️</div>
          <h4 class="badge-title">Strong Will</h4>
          <p class="badge-desc">Resisted 10 cravings</p>
        </article>

        <article class="badge badge--green">
          <div class="badge-icon" aria-hidden="true">💵</div>
          <h4 class="badge-title">Money Saver</h4>
          <p class="badge-desc">$100+ saved</p>
        </article>

        <article class="badge badge--purple">
          <div class="badge-icon" aria-hidden="true">⭐</div>
          <h4 class="badge-title">Milestone</h4>
          <p class="badge-desc">20 days clean</p>
        </article>
      </div>

      <div class="achievements-pills">
        <button class="pill pill--active" type="button">Streak Badges <span>2 of 6</span></button>
        <button class="pill" type="button">Health Badges <span>2 of 6</span></button>
      </div>
    </section>

    <!-- SHARE (internal groups only) -->
    <section class="share">
      <h3 class="share-title">Share Your Success</h3>
      <p class="share-sub">Inspire your quitting groups with your 23-day streak!</p>

      <div class="share-groups">
        <button class="share-chip" type="button">My Support Team</button>
        <button class="share-chip" type="button">Campus Quitters</button>
        <button class="share-chip" type="button">Family Group</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
  .progress-view {
    --start-color: #d17bff;
    --end-color: #ffb36a;
  }

  /* 1) hero */
  .hero {
    position: relative;
    padding: 14px;
    border-radius: var(--radius);
    color: #fff;
    background: linear-gradient(180deg, #9a35ff 0%, #f04f86 50%, #ee7a4d 100%);
    overflow: hidden;
  }
  .streak {
    text-align: center;
  }
  .streak-icon {
    width: 56px;
    height: 56px;
    margin: 4px auto 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.24);
  }
  .streak-days {
    font-size: 56px;
    line-height: 1;
    margin: 6px 0 4px;
    font-weight: 800;
  }
  .streak-label {
    font-size: 15px;
    opacity: 0.98;
  }
  .streak-sub {
    font-size: 13px;
    opacity: 0.92;
    margin-top: 2px;
  }

  /* next milestone inside hero */
  .next-milestone {
    margin-top: 14px;
    padding: 12px;
    border-radius: 12px;
    text-align: center;
    background: rgba(255, 255, 255, 0.22);
    backdrop-filter: blur(2px);
  }
  .next-milestone-label {
    font-size: 12px;
  }
  .next-milestone-value {
    font-size: 18px;
    font-weight: 800;
  }
  .next-milestone-note {
    font-size: 12px;
    opacity: 0.95;
  }

  /* 2) progress summary */
  .progress-summary {
    padding: 14px;
    border-radius: 16px;
    background: linear-gradient(180deg, #ffd46a 0%, #ff9b6a 100%);
    color: #fff;
  }
  .progress-summary-title {
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 6px;
  }
  .progress-summary-text {
    font-size: 13px;
    margin-bottom: 10px;
  }
  .progress-summary-stats {
    display: flex;
    gap: 16px;
  }
  .summary-stat {
    display: grid;
  }
  .summary-stat-value {
    font-weight: 800;
  }
  .summary-stat-label {
    font-size: 12px;
    opacity: 0.85;
  }

  /* 3) milestone progress */
  .milestone-progress {
    padding: 12px;
    border-radius: 14px;
  }

  .milestone-progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .milestone-progress-header h3 {
    font-size: 14px;
  }

  .milestone-progress-percent {
    font-size: 12px;
  }

  .milestone-progress-bar {
    margin: 14px auto 10px;
  }

  .milestone-progress-ticks {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 11px;
  }

  /* 4) achievements */
  .achievements .achievements-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0 8px;
  }
  .achievement-alert {
    display: flex;
    gap: 10px;
    padding: 12px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
  }
  .achievement-alert-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(180deg, #38ef7d, #11998e);
  }
  .achievement-alert-title {
    font-weight: 700;
    font-size: 14px;
  }
  .achievement-alert-desc {
    font-size: 12px;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .badge {
    padding: 12px;
    border-radius: 14px;
    min-height: 110px;
    background: #1a1f2b;
    border: 1px solid var(--line);
    color: #fff;
  }
  .badge--gold {
    background: linear-gradient(180deg, #ffe28b, #ffba6b);
    color: #fff;
  }
  .badge--blue {
    background: linear-gradient(180deg, #6fc3ff, #8fa7ff);
    color: #fff;
  }
  .badge--green {
    background: linear-gradient(180deg, #79f2a8, #57d6a1);
    color: #fff;
  }
  .badge--purple {
    background: linear-gradient(180deg, #c79aff, #9a7bff);
    color: #fff;
  }
  .badge-icon {
    font-size: 20px;
  }
  .badge-title {
    margin-top: 4px;
    font-weight: 800;
    font-size: 14px;
  }
  .badge-desc {
    font-size: 12px;
    opacity: 0.95;
  }

  .achievements-pills {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 12px;
  }
  .pill {
    padding: 10px 12px;
    border-radius: 999px;
    background: #121318;
    border: 1px solid var(--line);
    color: #fff;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
  .pill--active {
    border-color: rgba(255, 255, 255, 0.2);
  }

  /* 5) share section */
  .share {
    padding: 16px;
    border-radius: 16px;
    color: #fff;
    text-align: center;
    background: linear-gradient(180deg, #7c4dff, #ff6f91);
    margin-bottom: 20px;
  }
  .share-title {
    font-size: 16px;
    margin-bottom: 4px;
  }
  .share-sub {
    font-size: 12px;
    opacity: 0.95;
    margin-bottom: 12px;
  }

  .share-groups {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .share-chip {
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.28);
    color: #fff;
    font-size: 12px;
  }
</style>
