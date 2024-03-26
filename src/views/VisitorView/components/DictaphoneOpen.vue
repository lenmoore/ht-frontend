<template>
  <div v-if="recorderOpen" class="audio-wrapper">
    <div class="recorder-interface">
      <div v-if="showConfirmButton" class="confirm-box bg-white">
        <p>Are you satisfied with the recording?</p>
        <button id="reRecordButton" class="button" @click="onClickReRecord">
          Record Again
        </button>
        <button class="btn bg-green mt-4" @click="confirmAudio">Confirm</button>
      </div>

      <div v-else class="controls">
        <small class="description" style="max-width: 100px">
          {{ currentTask.description }}
        </small>
        <button id="recordButton" class="record-button" @click="onClickRecord">
          <span :class="isRecording ? 'square' : 'round'"></span>
        </button>
        <div class="countdown">
          <span id="time" class="time">00:00.00</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DictaphoneOpen",
  props: {
    recorderOpen: Boolean,
    currentTask: Object,
    confirmAudioForVisitor: Function,
  },
  data() {
    return {
      isRecording: false,
      showConfirmButton: false,
      mediaRecorder: null,
      audioChunks: [],
      audioBlob: null,
      countdownInterval: null,
    };
  },
  methods: {},
};
</script>
