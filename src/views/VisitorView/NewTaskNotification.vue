<template>
  <div
    v-if="!showConfirmButton && !cameraOpen"
    class="m-4 p-4 border task-wrapper"
  >
    <div class="row">
      <img class="no-style-image task-icon" :src="imgSrc" alt="" />
      <div class="column">
        <strong> Uus ülesanne! <br /> </strong>
        {{ currentTask.description }} ({{ currentTask.duration }}
        sek)
        <button
          v-if="!isFilming"
          id="startButton"
          class="button"
          style="z-index: 100"
          @click="onClickOpenCamera"
        >
          Lindista
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NewTaskNotification",
  props: {
    cameraOpen: {},
    currentTask: {},
    imgSrc: {},
    isFilming: {},
    onClickOpenCamera: {},
    showConfirmButton: {},
  },
};
</script>
<style lang="scss">
@import "../../styles/variables.scss";

.task-icon {
  height: 16rem;
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
