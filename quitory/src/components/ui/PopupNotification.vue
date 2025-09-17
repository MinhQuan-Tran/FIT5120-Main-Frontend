<script lang="ts">
  export default {
    name: 'PopupNotification',

    props: {
      title: {
        type: String,
        required: true,
      },
    },
  };
</script>

<template>
  <div>
    <section class="popup-notification">
      <div class="icon">
        <!-- You can replace this with an actual icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-bell"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </div>
      <div class="content">
        <p class="title">{{ title }}</p>
        <slot></slot>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .popup-notification {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 16px;
  }

  .popup-notification .icon {
    width: 24px;
    height: 24px;
    background-color: #007bff;
    border-radius: 50%;
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .popup-notification .content {
    flex: 1;
  }

  .popup-notification .title {
    font-weight: bold;
    margin: 0 0 8px 0;
  }
</style>
