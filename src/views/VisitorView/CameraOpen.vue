<template>
  <div v-if="cameraOpen" class="video-wrapper">
    <div class="recorder-interface">
      <div class="video-stuff">
        <video
          id="preview"
          width="650"
          height="350"
          autoplay=""
          loop
          poster="/movie%20camera.png"
          muted
        >
          <source type='video/mp4; codecs="avc1.64001E, mp4a.40.2"' src="" />
        </video>
      </div>

      <Vue3Lottie
        v-if="showStartFilmingAnimation"
        animationData="/public/start_filming.json"
        style="width: 50px; height: 50px"
      />

      <div v-if="showConfirmButton" class="confirm-box bg-white">
        <p class="">Kas oled videoga rahul?</p>
        <button
          v-if="!isFilming"
          id="startButton"
          class="button"
          @click="onClickOpenCamera"
        >
          Lindista uuesti
        </button>
        <button
          class="btn bg-green mt-4"
          v-if="showConfirmButton"
          @click="confirmVideoForVisitor"
        >
          Kinnita
        </button>
      </div>
      <div v-else-if="!showConfirmButton && cameraOpen" class="controls">
        <small style="max-width: 100px">
          {{ currentTask.description }}
        </small>
        <button id="recordButton" class="record-button" @click="onClickRecord">
          <span :class="isFilming ? 'square' : 'round'"> </span>
        </button>

        <div class="countdown">
          <span id="time" class="time">00:00.00</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Vue3Lottie } from "vue3-lottie";

export default {
  name: "CameraOpen",
  components: { Vue3Lottie },
  data() {
    return {
      showStartFilmingAnimation: false,
    };
  },
  props: {
    cameraOpen: {},
    confirmVideoForVisitor: {},
    currentTask: {},
    isFilming: {},
    onClickOpenCamera: {},
    onClickRecord: {},
    showConfirmButton: {},
  },
};
</script>
<style lang="scss">
@import "../../styles/variables.scss";

.video-wrapper {
  margin-right: 10rem;
}

.recorder-interface {
  display: flex;
  align-items: center;
}

.confirm-box {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 50px;
  z-index: 100;
  height: 300px;
}

.controls {
  position: absolute;
  right: 50px;
  z-index: 100;
  height: 300px;
  //width: 50px;

  padding: 1rem;
  background-color: $white;
  //border: 2px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.record-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;
  margin: 0;
}
</style>
