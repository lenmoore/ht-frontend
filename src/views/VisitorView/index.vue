<template>
  <div>
    <div>
      <h1>{{ userPhoneName }}</h1>

      <div v-if="taskIsActive">
        <div class="left">
          <button id="startButton" class="button" @click="onClickRecord">
            Lindista
          </button>
          <button
            class="btn bg-green"
            v-if="showConfirmButton"
            @click="confirmVideoForVisitor"
          >
            Kinnita
          </button>
          <h2>Preview</h2>
          <video
            id="preview"
            width="160"
            height="120"
            autoplay=""
            muted=""
          ></video>
        </div>
        <div class="right">
          <h2>Salvestus</h2>
          <video id="recording" width="160" height="120" controls=""></video>
        </div>
      </div>

      <div v-else>
        <h2>Hetkel pole sulle midagi.</h2>
      </div>
    </div>
    <div class="bottom">
      <pre id="log"></pre>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useVisitorStore } from "../../store/visitor.ts";

let recordingTimeMS = 5000;
export default {
  name: "VisitorView",

  data() {
    return {
      isFilming: false,
      showPreview: false,
      videoLength: 5000,
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
    },
    onClickRecord() {
      let preview = document.getElementById("preview");
      let recording = document.getElementById("recording");
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          preview.srcObject = stream;
          this.downloadButtonHref = stream;
          preview.captureStream =
            preview.captureStream || preview.mozCaptureStream;
          return new Promise((resolve) => (preview.onplaying = resolve));
        })
        .then(() =>
          this.startRecording(preview.captureStream(), recordingTimeMS),
        )
        .then((recordedChunks) => {
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
          this.showConfirmButton = true;
        })
        .catch((error) => {
          if (error.name === "NotFoundError") {
            this.log("Camera or microphone not found. Can't record.");
          } else {
            this.log(error);
          }
        });
    },
    startRecording(stream) {
      const lengthInMS = this.videoLength;
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

      return Promise.all([stopped, recorded]).then(() => data);
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
  },
};
</script>
