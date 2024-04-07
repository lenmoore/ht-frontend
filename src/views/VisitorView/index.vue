<template>
  <div style="height: 100%" :class="cameraOpen && 'visitor-wrapper'">
    <OrientationWrapper>
      <div class="you-have-task-wrapper" v-if="taskIsActive">
        <NewTaskNotification
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

      <div v-else>
        <h2>Hetkel pole sulle midagi.</h2>
        <p>Oota järgmist ülesannet.</p>
      </div>
    </OrientationWrapper>
    <small class="bottom">
      <small id="log"></small>
    </small>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useVisitorStore } from "../../store/visitor.ts";
import OrientationWrapper from "./OrientationWrapper.vue";
import { Vue3Lottie } from "vue3-lottie";
import NewTaskNotification from "./components/NewTaskNotification.vue";
import CameraOpen from "./components/CameraOpen.vue";
import DictaphoneOpen from "./components/DictaphoneOpen.vue";

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
    displayFileName() {
      return `${this.currentTask?.sceneId?.orderNumber || "x"}_${
        this.currentTask.orderNumber || "[jarjekorranr]"
      }_${this.userPhoneName || "grupp"}_${
        this.currentTask.fileName.replace(" ", "_") || "[failinimi]"
      }_${
        this.groupName || "[tiim]"
      }.${this.currentTask.fileType === "video" ? "mp4" : "mp4"}`;
    },
  },

  methods: {
    ...mapActions(useVisitorStore, {
      checkTaskForVisitor: "checkTaskForVisitor",
      confirmVideo: "confirmVideo",
    }),
    async keepCheckingForTask() {
      if (!this.taskIsActive) {
        const task = await this.checkTaskForVisitor(this.teamId);
        if (task) {
          console.log(task);
          console.log("got sth? ");
          this.taskIsActive = true;
          this.currentTask = task;

          window.navigator.vibrate([200, 100, 200]);
          alert("Uus ülesanne!");
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

      alert("Video on kinnitatud!");
      this.taskIsActive = false;
      location.reload();
      this.keepCheckingForTask();
    },
    onClickOpenDictaphone() {
      this.recorderOpen = true;
    },

    log(msg) {
      let logElement = document.getElementById("log");
      logElement.innerHTML += `${msg}\n`;
    },
    wait(delayInMS) {
      return new Promise((resolve) => setTimeout(resolve, delayInMS));
    },
    logout() {
      localStorage.clear();
      this.$router.push({ name: "login" });
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

.visitor-wrapper {
  background-color: $camera-interface-bg;
}
</style>
