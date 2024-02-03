<template>
  <div v-if="task.isEditing" class="two-part-form">
    <div class="form-part">
      <label for="orderNumber">Järjekorranumber (naitlejale)</label>
      <input id="orderNumber" v-model="task.orderNumber" type="text" />

      <label for="filename"
        >Faili nimi:
        <code style="width: 70%">{{ displayFileName(task) }}</code></label
      >
      <input id="filename" v-model="task.fileName" type="text" />

      <label for="visitorName">Tiim (publik=värv=meie)</label>
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
        <option value="video">video</option>
        <option value="sound">sound</option>
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
    };
  },

  computed: {
    team() {
      return this.userTeams.find(
        (team) => team.team_name === this.task.visitorName,
      );
    },
  },

  methods: {
    displayFileName(task: any) {
      return `1_${task.orderNumber || "[jarjekorranr]"}_${task.fileName || "[failinimi]"}_${task.visitorName || "[tiim]"}_midagiveel.mp4`;
    },
    saveTask(task: any) {
      task.sceneId = this.scene._id;
      console.log("Salvestan", task);
      this.$emit("save", task);
    },
  },
};
</script>
