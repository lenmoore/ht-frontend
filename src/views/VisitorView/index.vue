<template>
  <div :class="cameraOpen && 'visitor-wrapper'">
    <OrientationWrapper>
      <div class="you-have-task-wrapper" v-if="taskIsActive">
        <NewTaskNotification
          :camera-open="cameraOpen"
          :current-task="currentTask"
          :img-src="imgSrc"
          :is-filming="isFilming"
          :on-click-open-camera="onClickOpenCamera"
          :show-confirm-button="showConfirmButton"
        />

        <CameraOpen
          :camera-open="cameraOpen"
          :confirm-video-for-visitor="confirmVideoForVisitor"
          :current-task="currentTask"
          :is-filming="isFilming"
          :file-name="displayFileName"
          :on-click-open-camera="onClickOpenCamera"
          :on-click-record="onClickRecord"
          :show-confirm-button="showConfirmButton"
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
import { authHeader, refreshHeader } from "../../services/api";
import axios from "redaxios";
import { Vue3Lottie } from "vue3-lottie";
import NewTaskNotification from "./NewTaskNotification.vue";
import CameraOpen from "./CameraOpen.vue";

export default {
  name: "VisitorView",
  components: {
    CameraOpen,
    NewTaskNotification,
    Vue3Lottie,
    OrientationWrapper,
  },

  data() {
    return {
      isFilming: false,
      showPreview: false,
      cameraOpen: false,
      downloadButtonHref: null,
      downloadButtonDownload: null,

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
      return `${this.currentTask?.sceneId?.orderNumber || "x"}_${this.currentTask.orderNumber || "[jarjekorranr]"}_${this.userPhoneName || "grupp"}_${this.currentTask.fileName || "[failinimi]"}_${this.groupName || "[tiim]"}.mp4`;
    },
    imgSrc() {
      console.log(this.currentTask);
      if (this.currentTask.mediaType === "video") {
        return "/movie camera.png";
      } else if (this.currentTask.mediaType === "teleprompter") {
        return "/dictophone.png";
      }
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
    async onClickOpenCamera() {
      this.showConfirmButton = false;
      this.cameraOpen = true;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30, max: 60 },
            stabilization: true, // Note: This is not universally supported
            focusMode: "continuous", // Request continuous focus if available
          },
          audio: true,
        });
        const videoElement = document.getElementById("preview");
        videoElement.srcObject = stream;
      } catch (error) {
        console.error("Error opening the camera", error);
        this.cameraOpen = false; // Reset camera state if there is an error
      }
    },

    async onClickRecord() {
      console.log("clicked record");

      const preview = document.getElementById("preview");
      this.isFilming = true;
      this.showConfirmButton = false;
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30, max: 60 },
            stabilization: true, // Note: This is not universally supported
            focusMode: "continuous", // Request continuous focus if available
          },
          audio: true,
        })
        .then(async () => {
          return await this.startRecording(preview.captureStream());
        })
        .then(async (recordedChunks) => {
          console.log("hello did we record?");

          console.log("chunks: ", recordedChunks);
          let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
          preview.src = URL.createObjectURL(recordedBlob);
          this.downloadButtonHref = preview.src;
          this.downloadButtonDownload = this.displayFileName;

          // const videoPlayback = document.getElementById("videoPlayback");
          // videoPlayback.src = this.downloadButtonHref;
          // videoPlayback.play();

          // DOWNLOADS VIDEO TO DEVICE
          // const a = document.createElement("a");
          // document.body.appendChild(a);
          // a.style = "display: none";
          // a.href = this.downloadButtonHref;
          // a.download = this.displayFileName;
          // a.click();
          // window.URL.revokeObjectURL(this.downloadButtonHref);
          this.log(
            `Successfully recorded ${recordedBlob.size} bytes of ${recordedBlob.type} media.`,
          );

          const uploadResult = await this.uploadVideo(recordedBlob);
          console.log(uploadResult);
        })
        .catch((error) => {
          if (error.name === "NotFoundError") {
            this.log("Camera or microphone not found. Can't record.");
          } else {
            this.log(error);
          }
        });
    },

    startCountdown() {
      // Assuming this.currentTask.duration is in seconds, convert it to milliseconds
      let timeLeft = this.currentTask.duration * 1000; // timeLeft is in milliseconds

      // Clear any existing countdowns to avoid multiple countdowns running at the same time
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }

      // Update the DOM every millisecond
      this.countdownInterval = setInterval(() => {
        // Calculate minutes, seconds, and milliseconds
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        const milliseconds = Math.floor((timeLeft % 1000) / 10); // Display two digits for milliseconds

        // Format the time string
        const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;

        // Update the DOM
        if (timeLeft > 0) {
          document.getElementById("time").textContent = timeString;
        }

        // Decrease the time left
        timeLeft -= 10; // Decrease by 10ms which is the smallest unit we're displaying

        // Stop the countdown when it reaches zero
        if (timeLeft < 0) {
          clearInterval(this.countdownInterval);
          document.getElementById("time").textContent = "00:00.00"; // Reset to zero
        }
      }, 10); // Update every 10 milliseconds to keep the countdown smooth

      // Return the interval ID in case you need to clear it from somewhere else
      return this.countdownInterval;
    },
    async startRecording(stream) {
      const lengthInMS = this.currentTask.duration * 1000;
      console.log(lengthInMS);
      let options = { mimeType: 'video/webm; codecs="av01.0.05M.08"' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(`${options.mimeType} is not Supported`);
        options = { mimeType: 'video/webm; codecs="vp9"' }; // Fallback to VP9
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(`${options.mimeType} is not Supported`);
          options = { mimeType: 'video/webm; codecs="vp8"' }; // Fallback to VP8
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(`${options.mimeType} is not Supported`);
            options = { mimeType: "video/webm" }; // Fallback to default WebM if nothing else is supported
          }
        }
      }
      let recorder = new MediaRecorder(stream, options);
      let data = [];

      recorder.ondataavailable = (event) => data.push(event.data);
      recorder.start();
      console.log(`${recorder.state} for ${lengthInMS / 1000} seconds…`);

      let stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = (event) => reject(event.name);
      });

      let recorded = this.wait(lengthInMS).then(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      });
      this.startCountdown();
      console.log("start countdown");

      await Promise.all([stopped, recorded]);
      this.showConfirmButton = true;
      this.isFilming = false;
      console.log(data);
      return data;
    },
    async uploadVideo(file) {
      console.log("file to upload: ", file); // This should show the Blob details.
      const formData = new FormData();
      const filename = this.displayFileName;
      console.log("filename----->>>>>>", filename);
      formData.append("video", file, filename); // Assuming 'file' is a Blob or File

      // FormData objects don't stringify well directly; they appear empty.
      // This is normal and does not mean your formData is actually empty.

      const instance = axios.create({
        headers: {
          Authorization: authHeader().toString(),
          "X-Refresh": refreshHeader().toString(),
        },
        baseURL: import.meta.env.VITE_API_URL,
      });

      try {
        const response = await instance.post(
          "/visitor/upload-video",
          formData,
          {
            headers: {},
          },
        );
        console.log("Upload response:", response);
        // Handle response, such as confirming the video upload and providing the option to re-record
      } catch (error) {
        console.error("Error uploading the video:", error);
      }
    },

    stop(stream) {
      stream.getTracks().forEach((track) => track.stop());
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

.video-absolute {
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}

div.video-absolute {
  z-index: 40;
  width: 650px;
  height: 350px;

  //display: flex;
  //align-items: center;
  //flex-direction: column;
  //justify-content: center;

  img {
    width: 100%;
    height: 100%;
  }

  .countdown {
    position: absolute;
    bottom: 28px;
    color: white;
    background-color: rgba(0, 0, 0, 0.6);
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

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

.you-have-task-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;

  .task-wrapper {
    background-color: #f0f0f0;
    border-radius: 4px;
    width: 100%;
    box-shadow: 2px 2px 0px black;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

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
