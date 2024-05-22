<template>
  <div style="height: 100%; position: relative">
    <slot></slot>
    <div v-if="!isLandscape" class="overlay">
      <div class="please-turn-phone-wrapper">
        Palun keera telefoni!
        <Vue3Lottie
          :animationData="turnPhoneJSON"
          style="width: 400px; height: 400px"
          speed="0.5"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Vue3Lottie } from "vue3-lottie";
import turnPhone from "../../assets/animations/turn-phone.json";

export default {
  name: "OrientationWrapper",
  components: { Vue3Lottie },
  data() {
    return {
      isLandscape: false,
    };
  },
  created() {
    window.addEventListener("orientationchange", this.checkOrientation);
    this.checkOrientation();
  },
  beforeDestroy() {
    window.removeEventListener("orientationchange", this.checkOrientation);
  },
  computed: {
    turnPhoneJSON() {
      return turnPhone;
    },
  },
  methods: {
    checkOrientation() {
      this.isLandscape =
        window.orientation === 90 || window.orientation === -90;
    },
  },
};
</script>
<style>
.please-turn-phone-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  background-color: rgba(44, 37, 37, 0.9);
  height: 100%;
  width: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
