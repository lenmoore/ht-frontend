<template>
  <div v-if="cameraOpen" class="video-wrapper">
    <div class="recorder-interface">
      <div class="video-stuff">
        <div class="video-absolute">
          <div class="countdown">
            <span id="time" class="time">00:00.00</span>
          </div>
        </div>
        <video id="preview" autoplay="" loop poster="/movie%20camera.png" muted>
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
        <small class="description" style="max-width: 100px">
          {{ currentTask.description }}
        </small>
        <button id="recordButton" class="record-button" @click="onClickRecord">
          <span :class="isFilming ? 'square' : 'round'"> </span>
        </button>
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
    showConfirmButton: {},
  },

  methods: {
    onClickOpenCamera() {
      this.$emit("open-camera");
    },
    onClickRecord() {
      this.$emit("click-record");
    },
  },
};
</script>
<style lang="scss">
@import "../../../styles/variables";

.video-wrapper {
  background-color: $camera-interface-bg;
}

.recorder-interface {
  height: 100vh;
  display: flex;
  align-items: center;
}

.confirm-box {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 50px;
  z-index: 100;
  height: 100%;
}

.controls {
  position: absolute;
  right: 0;
  z-index: 100;
  height: 100%;
  width: 17.5%;

  background-color: $camera-interface-bg;
  //border: 2px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.video-stuff {
  width: 100%;
  height: auto;

  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  right: 0;

  video {
    right: 0;
    width: 90%;
    height: auto;
    object-fit: cover;
  }
}

.video-absolute {
  width: 670px;
  height: 380px;
  position: absolute;
  z-index: 2;
  display: flex;
  justify-content: center;

  background-image: url("videoframe.png");
  background-position: center;

  .countdown {
    position: absolute;
    bottom: 28px;
    color: white;
    background-color: rgba(0, 0, 0, 0.6);
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

small.description {
  color: white;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
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

  .square {
    background-color: $red;
    width: 34px;
    height: 34px;
    border-radius: 4px;
  }

  .round {
    background-color: $red;
    width: 42px;
    border-radius: 50%;
    height: 42px;
  }
}
</style>
