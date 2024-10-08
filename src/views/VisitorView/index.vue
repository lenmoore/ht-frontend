<template>
  <OrientationWrapper
    style="height: 100%"
    :class="cameraOpen && 'visitor-wrapper'"
  >
    <div class="you-have-task-wrapper" v-if="taskIsActive">
      <NewTaskNotification
        v-if="!cameraOpen && !recorderOpen"
        :camera-open="cameraOpen"
        :recorder-open="recorderOpen"
        :current-task="currentTask"
        :show-confirm-button="showConfirmButton"
        @open-camera="cameraOpen = true"
        @open-recorder="onClickOpenDictaphone"
      />

      <CameraOpen
        ref="camera"
        v-if="cameraOpen"
        :current-task="currentTask"
        :display-file-name="displayFileName"
        @confirm="confirmVideoForVisitor"
      />
      <DictaphoneOpen
        ref="recorder"
        v-if="recorderOpen"
        :current-task="currentTask"
        :display-file-name="displayFileName"
        @confirm="confirmVideoForVisitor"
      />
    </div>

    <div v-else class="nothing-wrapper">
      <h2>{{ $t('Hetkel pole sulle ülesandeid.') }}</h2>
      <p>{{ $t('Oota järgmist ülesannet.') }}</p>
    </div>
    <small class="bottom">
      <small id="log"></small>
    </small>
  </OrientationWrapper>
</template>

<script>
import { mapActions } from "pinia";
import { useVisitorStore } from "../../store/visitor.ts";
import OrientationWrapper from "./OrientationWrapper.vue";
import { Vue3Lottie } from "vue3-lottie";
import NewTaskNotification from "./components/NewTaskNotification.vue";
import CameraOpen from "./components/CameraOpen.vue";
import DictaphoneOpen from "./components/DictaphoneOpen.vue";
import dictaphoneOpen from "./components/DictaphoneOpen.vue";

export default {
  name: "VisitorView",
  components: {
    DictaphoneOpen,
    CameraOpen,
    NewTaskNotification,
    Vue3Lottie,
    OrientationWrapper,
  },

  data() {
    return {
      recorderOpen: false,
      cameraOpen: false,

      groupName: localStorage.group_name,
      userPhoneName: JSON.parse(localStorage.user).name,
      teamId: JSON.parse(localStorage.user)._id,
      taskIsActive: false,
      currentTask: null,
      showConfirmButton: false,
    };
  },

  created() {
    this.keepCheckingForTask();
  },

  computed: {
    dictaphoneOpen() {
      return dictaphoneOpen;
    },
    displayFileName() {
      console.log(this.currentTask);
      const groupName = this.groupName;
      const sceneOrderNumber = this.currentTask?.sceneId?.orderNumber;
      const taskOrderNumber = this.currentTask.orderNumber;
      const fileName = this.currentTask.fileName.replace(" ", "_");
      const team = this.userPhoneName;
      const fileType = this.currentTask.mediaType === "video" ? "mp4" : "mp3";
      return `${groupName}_${sceneOrderNumber}_${taskOrderNumber}_${fileName}_${team}.${fileType}`;
    },
  },

  methods: {
    ...mapActions(useVisitorStore, {
      checkTaskForVisitor: "checkTaskForVisitor",
      confirmVideo: "confirmVideo",
    }),
    async keepCheckingForTask() {
      if (!this.taskIsActive) {
        if (this.teamId) {
          const task = await this.checkTaskForVisitor(this.teamId);
          if (task) {
            this.taskIsActive = true;
            this.currentTask = task;
          }
        }
      }
      setTimeout(this.keepCheckingForTask, 1000);
    },
    async confirmVideoForVisitor() {
      await this.confirmVideo(
        this.teamId,
        this.currentTask._id,
        this.displayFileName,
      );

      this.taskIsActive = false;
      this.currentTask = null;
      this.recorderOpen = false;
      this.cameraOpen = false;
      this.$forceUpdate();
    },
    onClickOpenDictaphone() {
      this.recorderOpen = true;
    },
    log(msg) {
      let logElement = document.getElementById("log");
      logElement.innerHTML += `${msg}\n`;
    },
  },
};
</script>

<style lang="scss">
@import "../../styles/variables.scss";

.centered-on-page {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  flex-direction: column;
  //height: 100vh;
}

.video-wrapper {
  margin-right: 10rem;
}

.visitor-wrapper {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: $back;
  color: white;
}

.you-have-task-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  height: 100%;
  width: 100vw;

  .task-wrapper {
    background-color: #f0f0f0;
    border-radius: 4px;
    box-shadow: 2px 2px 0px black;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;

    .row {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-around;
    }
  }
}

.task-icon {
  height: 16rem;
}

.nothing-wrapper {
    display: flex;
    align-items: center;justify-content: center;
    height: 100%;
    width: 100%;
    padding: 1rem;
}
</style>
