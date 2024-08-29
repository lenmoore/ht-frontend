<template>
  <div>
    <h3 style="padding-bottom: 0; margin-bottom: 0">
      {{ scene.orderNumber }} | {{ scene.title }}
    </h3>
    <div class="scene-header">
      <h2 :class="doneTasks === scene.tasks.length ? 'green' : 'red'">
        {{ doneTasks }} / {{ scene.tasks.length }}
      </h2>
      <button
        :disabled="loading"
        v-if="anyTasksActive"
        class="btn"
        @click.prevent="stopScene"
      >
        Lõpeta kõik
      </button>
      <button
        :disabled="loading"
        v-else
        class="btn bg-green"
        @click.prevent="startAllTasksInScene"
      >
        Käivita kõik
      </button>
    </div>

    <div class="row">
      <div class="mx-4 scene-description-wrapper">
        <div class="label">Stseeni kirjeldus</div>
        <div class="description-box">{{ scene.description }}</div>
      </div>

      <div class="mx-4">
        <div class="label">Stseeni staatus</div>
        <div v-if="allTasksConfirmedByTeams">Stseen on valmis!</div>
        <div v-else>K6ik tiimid pole veel kinnitanud.</div>
      </div>

      <button @click="isOpen = !isOpen" class="font-size-huge bg-purple">
        {{ isOpen ? "˄" : "˅" }}
      </button>
    </div>

    <div v-if="isOpen">
      <div class="my-2 border" v-for="task in scene.tasks">
        <div class="task-header">
          <h4>
            <small
              class="rounded p-1"
              :class="task.isConfirmedByTeam ? 'bg-green' : 'bg-red'"
              >{{ scene.orderNumber }}.{{ task.orderNumber }}
            </small>
            <small
              :class="`m-1 rounded p-1 bg-${task.team && task.team.team_name}`"
              >{{
                (task.team && task.team.team_name) || "Tundmatu tiim"
              }}</small
            >
            <span class="px-2"
              ><br />
              <small>Näitleja ülesanne: <br /></small>
              {{ task.name }}
            </span>
          </h4>

          <button
            :disabled="loading"
            v-if="task.isActive"
            class="btn bg-red"
            @click.prevent="stopTask(task)"
          >
            Lõpeta
          </button>
          <button
            :disabled="loading"
            v-else
            class="btn bg-green"
            @click.prevent="startTask(task)"
          >
            Käivita
          </button>
        </div>

        <div class="mx-4 mb-4">
          Ülesanne tiimile: {{ task.description }}

            <small>
                {{ $t(task.description) }}
            </small>
          <div>
            {{ task.mediaType }} ({{ task.duration }} sek) -
            <strong :class="task.isConfirmedByTeam ? 'bg-green' : 'bg-red'">
              {{ task.isConfirmedByTeam ? "Kinnitatud" : "Kinnitamata" }}
            </strong>
          </div>
        </div>
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
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isOpen: this.anyTasksActive,
    };
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
    startAllTasksInScene() {
      this.scene.isActive = true;
      this.scene.tasks.forEach((task) => {
        this.startTask(task);
      });
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

.font-size-huge {
  font-size: 2rem;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.green {
  color: $green;
}

.red {
  color: $red;
}
</style>
