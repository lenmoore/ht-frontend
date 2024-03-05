<template>
  <div>
    <slot v-if="isLandscape"></slot>
    <div v-else class="please-turn-phone-wrapper">
      Palun keera telefoni!

      <p>
        Ma panen siia yhe animatsiooni hiljem ka, mis seda telefoni keeramist
        kujutab
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrientationWrapper",
  data() {
    return {
      isLandscape: false,
    };
  },
  created() {
    window.addEventListener("orientationchange", this.checkOrientation);
    this.checkOrientation();
  },
  methods: {
    checkOrientation() {
      this.isLandscape =
        window.orientation === 90 || window.orientation === -90;
    },
  },
};
</script>
