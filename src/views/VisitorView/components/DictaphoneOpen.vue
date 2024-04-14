<template>
  <div class="dictaphone-wrapper">
    <div class="dictaphone-interface">
      <div class="dictaphone-stuff">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-around;
          "
        >
          <video
            id="preview"
            autoplay=""
            loop
            poster="/dictophone.png"
            style="height: 300px; width: 200px"
            muted
          >
            <source type="audio/mp3" src="" />
          </video>
          <div class="task-description">
            <strong> Sinu ülesanne: </strong> <br />
            <span class="large">
              {{ currentTask.description }}
            </span>
          </div>
          <div
            style="
              width: 300px;
              display: flex;
              justify-content: center;
              align-content: center;
              flex-direction: column;
            "
          >
            <div style="display: flex; justify-content: center">
              <button
                v-if="!showConfirmButton && recorderOpen"
                id="recordButton"
                class="record-button"
                @click="onClickRecord"
              >
                <span :class="isRecording ? 'square' : 'round'"> </span>
              </button>
            </div>
            <Vue3Lottie
              v-if="showRecordingAnimation"
              :animationData="startRecordingJSON"
              style="width: 300px; height: 300px"
            />

            <div
              v-if="!showConfirmButton"
              class="countdown"
              style="text-align: center; width: 100%"
            >
              <span
                id="time"
                class="time"
                style="text-align: center; width: 100%"
                >00:00.00</span
              >
            </div>
          </div>
        </div>
      </div>

      <div v-if="showConfirmButton" class="confirm-box">
        <audio
          controls
          autoplay
          loop
          :src="`https://haihtuv.ee/videod/${displayFileName}`"
        ></audio>
        <p class="bg-white">Kas oled lindistusega rahul?</p>
        <button
          v-if="!isRecording"
          id="startButton"
          class="button"
          @click="onClickOpenRecorder"
        >
          Lindista uuesti
        </button>
        <button
          class="btn bg-green mt-4"
          id="confirmButton"
          v-if="showConfirmButton"
          @click="$emit('confirm')"
        >
          Kinnita
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { Vue3Lottie } from "vue3-lottie";
import lottieRecordAnimation from "../../../../public/animations/recording.json";
import axios from "redaxios";
import { authHeader, refreshHeader } from "../../../services/api";

export default {
  name: "DictaphoneOpen",
  components: { Vue3Lottie },
  data() {
    return {
      showRecordingAnimation: false,
      showConfirmButton: false,
      isRecording: false,
      showPreview: false,
      downloadButtonHref: null,
      downloadButtonDownload: null,
      recorderOpen: false,
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
  computed: {
    startRecordingJSON() {
      return lottieRecordAnimation;
    },
  },

  created() {
    this.onClickOpenRecorder();
  },
  methods: {
    async onClickOpenRecorder() {
      this.showConfirmButton = false;
      this.recorderOpen = true;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        const videoElement = document.getElementById("preview");
        videoElement.srcObject = stream;
      } catch (error) {
        console.error("Error opening the camera", error);
        this.recorderOpen = false; // Reset camera state if there is an error
      }
    },
    async onClickRecord() {
      this.showRecordingAnimation = true; // Animation starts
      const preview = document.getElementById("preview");
      this.isRecording = true;
      this.showConfirmButton = false;
      this.recorderOpen = false; // Disable other controls during recording

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        // Move startRecording here to ensure proper async flow
        const recordedChunks = await this.startRecording(
          preview.srcObject || stream,
        );
        let recordedBlob = new Blob(recordedChunks, { type: "audio/mp3" });
        preview.src = URL.createObjectURL(recordedBlob);
        this.downloadButtonHref = preview.src;
        this.downloadButtonDownload = this.displayFileName;

        // Handle post-recording actions like playback and download
        const videoPlayback = document.getElementById("preview");
        videoPlayback.src = this.downloadButtonHref;
        videoPlayback.play();

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = this.downloadButtonHref;
        a.download = this.displayFileName;
        // a.click();
        window.URL.revokeObjectURL(this.downloadButtonHref);

        await this.uploadRecording(recordedBlob); // Assuming you want to upload immediately after recording
      } catch (error) {
        console.error("Error during the recording process", error);
        this.showRecordingAnimation = false; // Stop the animation if an error occurs
      }
      this.showRecordingAnimation = false; // Ensure animation stops when recording stops
    },

    async startRecording(stream) {
      const lengthInMS = this.currentTask.duration * 1000;
      let recorder = new MediaRecorder(stream, { mimeType: "audio/webm" }); // Ensure correct MIME type
      let data = [];

      return new Promise((resolve, reject) => {
        recorder.ondataavailable = (event) => data.push(event.data);
        recorder.onerror = (event) => reject(event.error);

        recorder.onstart = () => {
          // Wait for the duration of the recording, then stop
          setTimeout(() => {
            if (recorder.state === "recording") {
              recorder.stop();
            }
          }, lengthInMS);
        };

        recorder.onstop = () => {
          resolve(data);
          this.isRecording = false;
          this.showConfirmButton = true;
          this.showRecordingAnimation = false;
        };

        recorder.start();
        this.startCountdown(); // Assuming this is working as intended
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
    async uploadRecording(file) {
      this.showRecordingAnimation = true;
      console.log("file to upload: ", file); // This should show the Blob details.
      const formData = new FormData();
      const filename = this.displayFileName;
      formData.append("video", file, filename); // Assuming 'file' is a Blob or File

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
.dictaphone-wrapper {
  //border: 4px solid fuchsia;
  width: 100%;
  height: 100%;
}

#time {
  font-size: 2rem;
}

.dictaphone-interface {
  //border: 4px solid green;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;

  .dictaphone-stuff {
    //border: 4px solid blue;
    display: flex;
    align-items: center;
    justify-content: space-around;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.dictaphone-confirm-box {
  //border: 4px solid red;

  display: flex;
  margin-right: 1rem;

  button#startButton {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    margin-right: 1rem;
  }

  button#confirmButton {
    height: 100px;
    width: 100px;
  }
}

.dictaphone-controls {
  background: transparent;
}

.task-description {
  max-width: 40%;

  .large {
    font-size: 1rem;
  }
}
</style>
