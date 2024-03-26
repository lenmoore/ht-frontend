<template>
  <div class="video-wrapper">
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
          @click="$emit('confirm')"
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
import axios from "redaxios";
import { authHeader, refreshHeader } from "../../../services/api";

export default {
  name: "CameraOpen",
  components: { Vue3Lottie },
  data() {
    return {
      showStartFilmingAnimation: false,
      showConfirmButton: false,
      isFilming: false,
      showPreview: false,
      downloadButtonHref: null,
      downloadButtonDownload: null,
      cameraOpen: false,
    };
  },
  props: {
    confirmVideoForVisitor: {},
    currentTask: {},
    displayFileName: {
      type: String,
      default: "no file name",
    },
  },

  created() {
    this.onClickOpenCamera();
  },
  methods: {
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
    async onClickRecord() {
      console.log("clicked record");

      const preview = document.getElementById("preview");
      this.isFilming = true;
      this.showConfirmButton = false;
      navigator.mediaDevices
        .getUserMedia({
          video: {
            videoBitsPerSecond: 2500000,
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { min: 24, ideal: 24, max: 24 },
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
          let recordedBlob = new Blob(recordedChunks, { type: "video/mp4" });
          preview.src = URL.createObjectURL(recordedBlob);
          this.downloadButtonHref = preview.src;
          this.downloadButtonDownload = this.displayFileName;

          const videoPlayback = document.getElementById("preview");
          videoPlayback.src = this.downloadButtonHref;
          videoPlayback.play();

          // DOWNLOADS VIDEO TO DEVICE
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = this.downloadButtonHref;
          a.download = this.displayFileName;
          a.click();
          window.URL.revokeObjectURL(this.downloadButtonHref);
          console.log(
            `Successfully recorded ${recordedBlob.size} bytes of ${recordedBlob.type} media.`,
          );

          const uploadResult = await this.uploadVideo(recordedBlob);
          console.log(uploadResult);
        })
        .catch((error) => {
          if (error.name === "NotFoundError") {
            console.log("Camera or microphone not found. Can't record.");
          } else {
            console.log(error);
          }
        });
    },
    async onClickOpenCamera() {
      this.showConfirmButton = false;
      this.cameraOpen = true;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            videoBitsPerSecond: 2500000,
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { min: 24, ideal: 24, max: 24 },
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
    wait(delayInMS) {
      return new Promise((resolve) => setTimeout(resolve, delayInMS));
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
