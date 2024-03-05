<template>
  <div class="centered-on-page">
    <OrientationWrapper>
      <small>{{ userPhoneName }}</small>

      <div class="you-have-task-wrapper" v-if="taskIsActive">
        <div
          v-if="!showConfirmButton && !cameraOpen"
          class="m-4 p-4 border task-wrapper"
        >
          <div class="row">
            <img class="no-style-image task-icon" :src="imgSrc" alt="" />
            <div>
              <strong> Uus ülesanne! <br /> </strong>
              {{ currentTask.description }} ({{ currentTask.duration }}
              sek)
            </div>
          </div>
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
              ></video>
              <!--              <video-->
              <!--                id="videoPlayback"-->
              <!--                width="650"-->
              <!--                height="350"-->
              <!--                autoplay=""-->
              <!--                loop-->
              <!--                poster="/movie%20camera.png"-->
              <!--                muted=""-->
              <!--              ></video>-->
            </div>
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
              <button
                id="recordButton"
                class="record-button"
                @click="onClickRecord"
              >
                <span :class="isFilming ? 'square' : 'round'"> </span>
              </button>

              <div class="countdown">
                <span id="time" class="time">00:00.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <h2>Hetkel pole sulle midagi.</h2>
        <p>Oota järgmist ülesannet.</p>
      </div>
    </OrientationWrapper>
    <small class="bottom">
      <small id="log"></small>
      <!--      <button-->
      <!--        style="-->
      <!--          height: 1rem;-->
      <!--          display: flex;-->
      <!--          align-items: center;-->
      <!--          justify-content: center;-->
      <!--          align-self: end;-->
      <!--        "-->
      <!--        @click="logout"-->
      <!--      >-->
      <!--        Logout-->
      <!--      </button>-->
    </small>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useVisitorStore } from "../../store/visitor.ts";
import OrientationWrapper from "./OrientationWrapper.vue";

export default {
  name: "VisitorView",
  components: { OrientationWrapper },

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
      return `${this.groupName}_[nr].${this.currentTask?.orderNumber}_${this.currentTask.fileName || "[failinimi]"}.webm`;
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
            width: { min: 1280 },
            height: { min: 720 },
          },
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
            width: {
              min: 1280,
            },
            height: {
              min: 720,
            },
          },
        })
        .then(async () => {
          return await this.startRecording(preview.captureStream());
        })
        .then((recordedChunks) => {
          console.log("hello did we record?");

          console.log("chunks: ", recordedChunks);
          let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
          preview.src = URL.createObjectURL(recordedBlob);
          this.downloadButtonHref = preview.src;
          this.downloadButtonDownload = this.displayFileName;

          // const videoPlayback = document.getElementById("videoPlayback");
          // videoPlayback.src = this.downloadButtonHref;
          // videoPlayback.play();
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
      let recorder = new MediaRecorder(stream);
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

  button {
    margin-right: 1rem;
  }
}

.task-icon {
  height: 16rem;
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

  .square {
    background-color: $red;
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }

  .round {
    background-color: $red;
    width: 34px;
    border-radius: 50%;
    height: 34px;
  }
}
</style>
