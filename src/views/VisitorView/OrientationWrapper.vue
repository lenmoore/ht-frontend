<template>
  <div style="height: 100%">
    <slot v-if="isLandscape"></slot>
    <div v-else class="please-turn-phone-wrapper">
      Palun keera telefoni!

      <Vue3Lottie
        :animationData="turnPhoneJSON"
        style="width: 400px; height: 400px"
        speed="0.5"
      />
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
  background-color: #2c2525;
  height: 100%;
}
</style>
