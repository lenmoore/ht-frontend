<template>
  <div
    v-if="!showConfirmButton && !cameraOpen && !recorderOpen"
    class="m-4 p-4 border task-wrapper"
  >
    <div class="row">
      <img class="no-style-image task-icon" :src="imgSrc" alt="" />
      <div class="column">
        <small >{{ userPhoneName }}</small>
        <strong v-if="currentTask.mediaType === 'video'"> {{$t('Filmi klipp:')}} <br /> </strong>
        <strong v-else> {{$t('Lindista tekst:')}} <br /> </strong>
        <div class="task-desc">
          {{ $t(currentTask.description) }} ({{ currentTask.duration }}
            {{ $t('sek') }})
        </div>
        <button
          v-if="currentTask.mediaType === 'video' && !isFilming"
          id="startButton"
          class="button"
          style="z-index: 100"
          @click="onClickOpenCamera"
        >
            {{ $t('Ava kaamera') }}
        </button>
        <button
          v-else
          id="startButton"
          class="button"
          style="z-index: 100"
          @click="onClickOpenDictaphone"
        >
            {{ $t('Ava diktofon') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Camera from "simple-vue-camera";
import OrientationWrapper from "../OrientationWrapper.vue";

export default {
  name: "NewTaskNotification",
  components: { OrientationWrapper, Camera },
  data() {
    return {
      userPhoneName: JSON.parse(localStorage.user).name,
    };
  },
  computed: {
    imgSrc() {
      console.log(this.currentTask);
      if (this.currentTask.mediaType === "video") {
        return "/movie camera.png";
      } else {
        return "/dictophone.png";
      }
    },
  },
  props: {
    recorderOpen: {},
    cameraOpen: {},
    currentTask: {},
    isFilming: {},
    showConfirmButton: {},
  },
  methods: {
    onClickOpenCamera() {
      this.$emit("open-camera");
    },
    onClickOpenDictaphone() {
      this.$emit("open-recorder");
    },
  },
};
</script>
<style lang="scss">
@import "../../../styles/variables";

.task-icon {
  height: 16rem;
}

.task-desc {
  text-wrap: normal;
  width: 60%;
}

.column {
  button {
    margin-top: 1rem;
  }

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
}
</style>
