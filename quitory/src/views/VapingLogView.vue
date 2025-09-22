<script lang="ts">
  export default {
    name: 'VapingLogView',

    props: {
      startTime: {
        type: [Date, null],
        required: false,
        default: null,
      },

      duration: {
        type: Number,
        required: false,
        default: null,
      },
    },

    data() {
      return {
        time: this.startTime
          ? typeof this.startTime === 'string'
            ? this.startTime
            : this.startTime.toISOString().slice(0, 16)
          : null,
        sessionDuration: this.duration,
        money: null as number | null,
        triggers: {
          stress: false,
          social: false,
          eating: false,
          boredom: false,
        },
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
      <h1 class="title">Log Vaping Session</h1>
      <p class="sub">How did you feels?</p>
    </div>

    <label class="time" for="time">
      <span>When did you vape?</span>
      <input type="datetime-local" id="time" name="time" v-model="time" />
    </label>

    <label class="duration" for="duration">
      <span>How long did you vape? (in minutes)</span>
      <input type="number" id="duration" name="duration" v-model="sessionDuration" />
    </label>

    <label class="money" for="money">
      <span>How much money did you spend? (in dollars)</span>
      <span class="sub">for this vaping session</span>
      <input type="number" id="money" name="money" step="0.01" />
    </label>

    <label class="triggers">
      <p>What were the triggers?</p>
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
      <label for="boredom">
        <span>Boredom</span>
        <input type="checkbox" name="boredom" id="boredom" />
      </label>
    </label>

    <button class="submit-button" type="submit" @click.prevent="handleSubmit">
      <img width="24" height="24" src="https://img.icons8.com/fluency/48/save.png" alt="save" />
      Log Vaping Session
    </button>
  </main>
</template>

<style scoped>
  main {
    background-color: white;
    padding: 0;
    padding-bottom: var(--padding);
    display: flex;
    flex-direction: column;
  }

  main > *:not(:first-child) {
    margin: 0 var(--padding);
  }

  .banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--padding);
    text-align: center;
    padding: 20px;
    background: linear-gradient(90deg, #ef4444, #db2777);
  }

  .banner .title {
    color: white;
  }

  .banner .sub {
    color: rgb(255, 255, 255, 0.8);
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: left;
    gap: 8px;
  }

  .money .sub {
    font-size: 0.875rem;
    color: rgb(0, 0, 0, 0.6);
  }

  .money input::before {
    prefix: '$';
  }

  .triggers label {
    flex-direction: row;
    align-items: center;
    gap: var(--padding);
  }

  .submit-button {
    background: #10b981;
    color: white;
  }
</style>
