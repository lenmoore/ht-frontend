<template>
  <div>
    <div class="scene-header">
      <h3>{{ scene.orderNumber }} | {{ scene.title }}</h3>

      <div>{{ doneTasks }} / {{ scene.tasks.length }}</div>
      <button v-if="anyTasksActive" class="btn" @click="stopScene">
        Lopeta
      </button>
    </div>

    <div class="mx-4 scene-description-wrapper">
      <div class="label">Stseeni kirjeldus</div>
      <div class="description-box">{{ scene.description }}</div>
    </div>

    <div class="mx-4">
      <div class="label">Stseeni staatus</div>
      <div v-if="allTasksConfirmedByTeams">Stseen on valmis!</div>
      <div v-else>K6ik tiimid pole veel kinnitanud.</div>
    </div>

    <div class="my-2 border" v-for="task in scene.tasks">
      <div class="task-header">
        <h4>
          <span :class="task.isConfirmedByTeam ? 'bg-green' : 'bg-red'"
            >{{ scene.orderNumber }}.{{ task.orderNumber }}
          </span>
          <small :class="`bg-${task.team && task.team.team_name}`">{{
            (task.team && task.team.team_name) || "Tundmatu tiim"
          }}</small>
          <span class="px-2">
            {{ task.name }}
          </span>
        </h4>

        <button v-if="task.isActive" class="btn bg-red" @click="stopTask(task)">
          Lopeta
        </button>
        <button v-else class="btn bg-green" @click="startTask(task)">
          Käivita
        </button>
      </div>

      <div class="mx-4 mb-4">
        Ülesanne tiimile: {{ task.description }}
        <div>{{ task.mediaType }} ({{ task.duration }} sek)</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SceneBlock",

  props: {
    scene: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["begin-scene", "start", "stop"],
  computed: {
    anyTasksActive() {
      return this.scene.tasks.some((task) => task.isActive);
    },
    allTasksConfirmedByTeams() {
      return this.doneTasks === this.scene.tasks.length;
    },
    doneTasks() {
      return this.scene.tasks.filter((task) => task.isConfirmedByTeam).length;
    },
  },
  methods: {
    stopScene() {
      this.scene.isActive = false;
      this.$emit("stop", this.scene.tasks);
    },
    stopTask(task) {
      task.isActive = false;
      this.$emit("stop", [task]);
    },
    startTask(task) {
      task.isActive = true;
      this.$emit("start", [task]);
    },
  },
};
</script>

<style lang="scss">
.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
