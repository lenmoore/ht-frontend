<template>
  <div>
    <div v-if="task.isEditing" class="two-part-form">
      <div class="form-part">
        <label for="orderNumber">Järjekorranumber (naitlejale)</label>
        <input id="orderNumber" v-model="task.orderNumber" type="text" />

        <label for="filename"
          >Faili nimi:
          <code style="width: 70%">{{ displayFileName }}</code></label
        >
        <input id="filename" v-model="task.fileName" type="text" />

        <label for="visitorName">Telefon</label>

        <select id="visitorName" v-model="task.visitorName">
          <option
            v-for="team in userTeams"
            :key="team._id"
            :value="team.team_name"
          >
            {{ team.name }}
          </option>
        </select>
        <label for="type">Meedia tüüp</label>
        <select id="type" v-model="task.mediaType">
          <option value="video">heliga video</option>
          <option value="sound">soundscape</option>
          <option value="teleprompter">teleprompter</option>
        </select>

        <label for="length">Klipi pikkus (sekundites)</label>
        <input id="length" v-model="task.duration" type="number" />
      </div>
      <div class="form-part">
        <label for="title">Pealkiri (naitlejale)</label>
        <textarea v-model="task.name"></textarea>

        <label for="orderNumber">Kirjeldus (publikule)</label>
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
    displayFileName() {
      const groupName = this.groupName;
      const sceneOrderNumber = this.scene.orderNumber;
      const taskOrderNumber = this.task.orderNumber;
      const fileName = this.task.fileName.replace(" ", "_");
      const team = this.team?.team_name;
      const fileType = this.task.fileType === "video" ? "mp4" : "mp3";
      return `${groupName}_${sceneOrderNumber}_${taskOrderNumber}_${fileName}_${team}.${fileType}`;
    },
  },

  methods: {
    saveTask(task: any) {
      task.sceneId = this.scene._id;
      console.log("Salvestan", task);
      this.$emit("save", task);
    },
    deleteTask(task: any) {
      this.$emit("delete", task);
    },
  },
};
</script>

<style lang="scss">
.two-part-form {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 1rem 0;
  flex-direction: column;

  .form-part {
    display: flex;
    flex-direction: column;
  }
}
</style>
