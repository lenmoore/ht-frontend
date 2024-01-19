<template>
    <div>
        <div>
            <h1>Visitor</h1>
            please make a video :D

            <div class="left">
                <button id="startButton" class="button" @click="onClickRecord">Start Recording</button>
                <h2>Preview</h2>
                <video id="preview" width="160" height="120" autoplay="" muted=""></video>
            </div>
            <div class="right">
                <div id="stopButton" class="button">Stop Recording</div>
                <h2>Recording</h2>
                <video id="recording" width="160" height="120" controls=""></video>
                <a
                    id="downloadButton"
                    class="button"
                    :href="downloadButtonHref"
                    :download="downloadButtonDownload">Download</a>
            </div>
        </div>

        <div class="bottom">
            <pre id="log"></pre>
        </div>
    </div>
</template>


<script>

let recordingTimeMS = 5000;
export default {
    name: 'VisitorView',

    data() {
        return {
            isFilming: false,
            showPreview: false,
            videoLength: 5000,
            downloadButtonHref: null,
            downloadButtonDownload: null,
        };
    },

    methods: {
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
                .then(() => this.startRecording(preview.captureStream(), recordingTimeMS))
                .then((recordedChunks) => {
                    let recordedBlob = new Blob(recordedChunks, {type: "video/webm"});
                    recording.src = URL.createObjectURL(recordedBlob);
                    this.downloadButtonHref = recording.src;
                    this.downloadButtonDownload = "RecordedVideo.webm";

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
        }

    }
};

</script>