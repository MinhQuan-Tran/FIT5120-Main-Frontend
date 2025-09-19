<script lang="ts">
  import VapingLogView from '@/views/VapingLogView.vue';

  export default {
    name: 'CravingLogView',

    components: {
      VapingLogView,
    },

    data() {
      return {
        vaped: null as boolean | null,
        startTime: new Date(),
      };
    },

    methods: {
      handleSubmit() {
        alert('Submitted!');
      },
    },
  };
</script>

<template>
  <main>
    <div class="banner">
      <h1 class="title">Log Craving Session</h1>
      <p class="sub">How did you go?</p>
    </div>

    <form action="">
      <section class="result-check">
        <h2 class="title">Did you vape?</h2>
        <div class="actions">
          <button
            type="button"
            :class="['no-button', vaped === false ? 'active' : '']"
            @click="vaped = false"
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/ios-glyphs/30/FFFFFF/multiply.png"
              alt="multiply"
            />
          </button>

          <button
            type="button"
            :class="['yes-button', vaped === true ? 'active' : '']"
            @click="vaped = true"
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/ios-glyphs/30/FFFFFF/checkmark--v1.png"
              alt="checkmark--v1"
            />
          </button>
        </div>

        <div class="message">
          {{
            vaped === null
              ? 'Please select an option'
              : vaped === true
                ? 'This is not the end of your journey. Keep going!'
                : "Great job! Let's log some activities that helped you."
          }}
        </div>

        <VapingLogView v-if="vaped === true" class="vaping-log" :startTime="startTime" />
      </section>

      <section class="activity-log">
        <h2 class="title">Which activities where effective?</h2>
        <label for="stress">
          <span>Stress</span>
          <input type="checkbox" name="stress" id="stress" />
        </label>
        <label for="social">
          <span>Social</span>
          <input type="checkbox" name="social" id="social" />
        </label>
        <label for="eating">
          <span>Eating</span>
          <input type="checkbox" name="eating" id="eating" />
        </label>
      </section>

      <button class="submit-button" type="submit" @click.prevent="handleSubmit">
        <img width="24" height="24" src="https://img.icons8.com/fluency/48/save.png" alt="save" />
        Log Craving Session
      </button>
    </form>
  </main>
</template>

<style scoped>
  main {
    padding: 0;
    padding-bottom: var(--padding);
    display: flex;
    flex-direction: column;
  }

  main > *:not(:first-child) {
    margin: 0 var(--padding);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--padding);
  }

  .banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--padding);
    text-align: center;
    padding: 20px;
    background: linear-gradient(90deg, #6366f1, #9333ea);
  }

  .banner .title {
    color: white;
  }

  .banner .sub {
    color: rgb(255, 255, 255, 0.8);
  }

  .result-check {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    text-align: center;
    gap: var(--padding);
  }

  .result-check .actions {
    display: flex;
    flex-direction: row;
    gap: var(--padding);
  }

  .result-check .actions > * {
    flex: 1;
  }

  .no-button,
  .yes-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--padding);
  }

  .no-button,
  .yes-button {
    opacity: 0.5;
  }

  .no-button {
    background: #ef4444;
  }

  .yes-button {
    background: #10b981;
  }

  .active {
    opacity: 1;
  }

  .vaping-log {
    border-radius: var(--radius);
  }

  .activity-log {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: var(--padding);
  }

  .submit-button {
    background: #10b981;
    color: white;
  }
</style>
