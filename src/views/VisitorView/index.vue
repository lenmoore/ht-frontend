<template>
  <div>
    <div>
      <small>{{ userPhoneName }}</small>

      <div v-if="taskIsActive">
        <div v-if="!showConfirmButton" class="m-4 p-4 border task-wrapper">
          Sul on ülesanne: {{ currentTask.description }} ({{
            currentTask.duration
          }}
          sek)
          <button
            v-if="!isFilming"
            id="startButton"
            class="button"
            style="z-index: 100"
            @click="onClickRecord"
          >
            Lindista
          </button>
        </div>

        <div class="video-wrapper">
          <video
            :class="isFilming && 'video-absolute'"
            id="preview"
            width="650"
            height="350"
            autoplay=""
            muted=""
          ></video>
          <div :class="isFilming && 'video-absolute'">
            <div class="countdown">
              <span id="time" class="time">00:00.00</span>
            </div>
            <img class="no-input" src="/videoframe.png" alt="" />
          </div>

          <div v-if="showConfirmButton" class="confirm-box">
            <p class="bg-white">Kas oled videoga rahul?</p>
            <div>
              <button
                v-if="!isFilming"
                id="startButton"
                class="button"
                @click="onClickRecord"
              >
                Lindista uuesti
              </button>
              <button
                class="btn bg-green"
                v-if="showConfirmButton"
                @click="confirmVideoForVisitor"
              >
                Kinnita
              </button>
            </div>
          </div>
          <!--          <video id="recording" width="10" height="10" controls=""></video>-->
        </div>
      </div>

      <div v-else>
        <h2>Hetkel pole sulle midagi.</h2>
      </div>
    </div>
    <small class="bottom">
      <small id="log"></small>
      <button
        style="
          height: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: end;
        "
        @click="logout"
      >
        Logout
      </button>
    </small>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useVisitorStore } from "../../store/visitor.ts";

export default {
  name: "VisitorView",

  data() {
    return {
      isFilming: false,
      showPreview: false,
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
      return `${this.groupName}_[nr].${this.currentTask?.orderNumber}_${this.currentTask.fileName || "[failinimi]"}.webm`;
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
      location.reload();
      this.keepCheckingForTask();
    },
    async onClickRecord() {
      let preview = document.getElementById("preview");
      let recording = document.getElementById("recording");

      this.isFilming = true;
      this.showConfirmButton = false;
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment",
            width: {
              min: 1280,
            },
            height: {
              min: 720,
            },
          },
        })
        .then((stream) => {
          preview.srcObject = stream;
          this.downloadButtonHref = stream;
          preview.captureStream =
            preview.captureStream || preview.mozCaptureStream;
          return new Promise((resolve) => (preview.onplaying = resolve));
        })
        .then(() => {
          this.startRecording(
            preview.captureStream(),
            this.currentTask.duration * 1000,
          );
        })
        .then((recordedChunks) => {
          console.log("hello did we record?");

          let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
          recording.src = URL.createObjectURL(recordedBlob);
          this.downloadButtonHref = recording.src;
          this.downloadButtonDownload = this.displayFileName;

          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = this.downloadButtonHref;
          a.download = this.displayFileName;
          a.click();
          window.URL.revokeObjectURL(this.downloadButtonHref);
          this.log(
            `Successfully recorded ${recordedBlob.size} bytes of ${recordedBlob.type} media.`,
          );
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
        document.getElementById("time").textContent = timeString;

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
      let recorder = new MediaRecorder(stream);
      let data = [];

      recorder.ondataavailable = (event) => data.push(event.data);
      recorder.start();
      this.log(`${recorder.state} for ${lengthInMS / 1000} seconds…`);

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

      await Promise.all([stopped, recorded]);
      this.showConfirmButton = true;
      this.isFilming = false;
      return data;
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
.confirm-box {
  z-index: 1;
  position: absolute;
  top: 40%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.video-absolute {
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}

div.video-absolute {
  z-index: 40;
  border: 1px solid red;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
  }

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  .countdown {
    position: absolute;
    bottom: 28px;
    color: white;
    background-color: rgba(0, 0, 0, 0.6);
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
