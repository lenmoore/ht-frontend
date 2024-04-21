<template>
  <div class="form-wrapper">
    <div v-if="task.isEditing" class="two-part-form">
      <h4>{{ displayFileName }}</h4>
      <div class="form-part">
        <label for="orderNumber">Järjekorranumber (naitlejale)</label>
        <input id="orderNumber" v-model="task.orderNumber" type="text" />

        <label for="filename"
          >Faili nimi:
          <code style="width: 70%">{{ displayFileName }}</code></label
        >
        <input id="filename" v-model="task.fileName" type="text" />
        <label for="visitorName">Telefon</label>
        <div class="radio-row">
          <span v-for="team in userTeams" :key="team._id" class="radio-button">
            <input
              type="radio"
              :id="team._id"
              v-model="task.visitorName"
              :value="team.team_name"
            />
            <label
              :class="`bg-${team.team_name}`"
              style="font-size: 1rem"
              :for="team._id"
            >
              {{ team.team_name }}
            </label>
          </span>
        </div>

        <br />

        <div class="radio-row">
          <label for="type" style="margin-right: 2rem">Meedia tüüp</label>
          <span class="radio-button">
            <input type="radio" v-model="task.mediaType" value="video" /> Video
          </span>

          <span class="radio-button">
            <input type="radio" v-model="task.mediaType" value="sound" /> Heli
          </span>
        </div>

        <br />

        <div class="buttons-row">
          <label for="length">Klipi pikkus </label>
          <button
            v-for="durationOption in durationOptions"
            class="bg-blue small-button"
            @click="autofillDurationOption(durationOption)"
          >
            {{ durationOption }}
          </button>
          <input
            style="margin-left: 2rem"
            id="length"
            v-model="task.duration"
            type="number"
          />
          sek
        </div>
      </div>
      <div class="form-part">
        <label for="title"
          >Pealkiri (naitlejale)
          <button
            v-if="!task._id"
            class="small-button bg-yellow"
            @click="addPreviousName"
          >
            Sama, mis eelmine
          </button>
        </label>
        <textarea v-model="task.name"></textarea>

        <label for="orderNumber"
          >Kirjeldus (publikule)
          <button
            v-if="!task._id"
            class="small-button bg-yellow"
            @click="addPreviousDesc"
          >
            Sama, mis eelmine
          </button>
        </label>
        <textarea v-model="task.description"></textarea>
        <button class="bg-red" @click.prevent="saveTask(task)">Salvesta</button>
        <button class="mt-4 bg-orange" @click.prevent="deleteTask(task)">
          Kustuta
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { User } from "../types/user.type.ts";

export default {
  name: "TwoPartForm",

  props: {
    givenTask: {
      type: Object,
      required: true,
    },
    scene: {
      type: Object,
      required: true,
    },
    userTeams: {
      type: Array<User>,
      default: () => [],
    },
    previousTask: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      task: this.givenTask,
      groupName: localStorage.group_name,
    };
  },

  computed: {
    team() {
      return this.userTeams.find(
        (team) => team.team_name === this.task.visitorName,
      );
    },
    mediaType() {
      return this.task.mediaType;
    },
    displayFileName() {
      const groupName = this.groupName;
      const sceneOrderNumber = this.scene.orderNumber;
      const taskOrderNumber = this.task.orderNumber;
      const fileName = this.task.fileName.replace(" ", "_");
      const team = this.team?.team_name;
      const fileType = this.mediaType === "video" ? "mp4" : "mp3";
      return `${groupName}_${sceneOrderNumber}_${taskOrderNumber}_${fileName}_${team}.${fileType}`;
    },
    durationOptions() {
      return [5, 7, 10, 15];
    },
  },

  methods: {
    autofillDurationOption(duration: number | string) {
      this.task.duration = duration;
    },
    saveTask(task: any) {
      task.sceneId = this.scene._id;
      console.log("Salvestan", task);
      this.$emit("save", task);
    },
    deleteTask(task: any) {
      this.$emit("delete", task);
    },
    addPreviousName() {
      this.task.name = this.previousTask.name;
    },
    addPreviousDesc() {
      this.task.description = this.previousTask.description;
    },
  },
};
</script>

<style lang="scss">
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 1rem 0;
}

.two-part-form {
  display: flex;
  justify-content: space-around;
  width: 80%;
  margin: 1rem 0;
  flex-direction: column;

  .form-part {
    display: flex;
    flex-direction: column;
  }
}
</style>
