<template>
  <div>
    <div class="scene-wrapper border">
      <h4>Ylesanded ({{ tasks.length }})</h4>

      <div class="tasks-wrapper">
        <div v-for="task in tasks" :key="task._id">
          <div :class="{ wide: task.isEditing }" class="card">
            <TwoPartForm
              v-if="task.isEditing"
              :given-task="task"
              :user-teams="userTeams"
              :scene="scene"
              @save="saveTask"
            />

            <div v-else class="closed-card">
              <div>
                <p>
                  <code class="bg-blue">{{ displayFileName(task) }}</code>
                </p>
                <p :class="`bg-${task.team && task.team.name}`">
                  {{ task.team && task.team.name }}
                </p>
              </div>
              <div>
                <p>
                  <strong>"{{ task.name }}"</strong>:
                  {{ task.description }}
                </p>
                <button
                  class="bg-red"
                  @click.prevent="task.isEditing = !task.isEditing"
                >
                  Muuda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 m-4 border" v-if="addingNewTask">
        <p>Uus</p>
        <TwoPartForm
          :user-teams="userTeams"
          :given-task="newTask"
          :scene="scene"
          @save="saveTask"
        />
      </div>
      <button class="m-4" v-else @click="addTask">Lisa</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useSetupStore } from "../../../../store/setup.ts";
import TwoPartForm from "../../../../components/TwoPartForm.vue";

export default {
  name: "GroupGame",
  components: { TwoPartForm },
  data() {
    return {
      tasks: [],
      newTask: null,
      addingNewTask: false,
      scene: null,
      userTeams: [],
    };
  },
  computed: {
    currentRoute() {
      return this.$route.params.groupName;
    },
    selectedSceneId() {
      return this.$route.query.scene;
    },
  },

  watch: {
    selectedSceneId: {
      immediate: true,
      async handler(val) {
        console.log("on first enter", val);
        if (val) {
          this.scene = await this.getSceneById(val);
          this.tasks = this.scene.tasks;
        }
      },
    },
  },
  async created() {
    await this.getTeams();
  },
  methods: {
    ...mapState(useSetupStore, ["teams"]),
    ...mapActions(useSetupStore, {
      createTask: "createTask",
      getSceneById: "getSceneById",
      updateTaskById: "updateTaskById",
      deleteTaskById: "deleteTaskById",
      getAllTeamsInGroup: "getAllTeamsInGroup",
    }),
    teamNameById(id) {
      return this.userTeams.find((team) => team._id === id)?.team_name;
    },
    async getTeams() {
      this.userTeams = await this.getAllTeamsInGroup({
        groupName: this.currentRoute,
      });
    },
    async saveTask(task) {
      console.log(task);
      if (this.addingNewTask) {
        const newTask = await this.createTask(this.newTask);
        if (newTask) {
          this.addingNewTask = false;
          this.newTask = null;
        }
      } else {
        await this.updateTaskById({
          _id: task._id,
          orderNumber: task.orderNumber,
          name: task.name,
          visitorName: task.visitorName,
          description: task.description,
          mediaType: task.mediaType,
          duration: task.duration,
          fileName: task.fileName,
          sceneId: this.selectedSceneId,
        });
      }

      this.scene = await this.getSceneById(this.selectedSceneId);
      this.tasks = this.scene.tasks;
    },
    displayFileName(task) {
      const fileExtension = ["teleprompter", "sound"].includes(task.mediaType)
        ? "mp3"
        : "mp4";
      return `${task.team.group_name}_${this.scene.orderNumber}-${task.orderNumber}_${task.fileName || "[failinimi]"}.${fileExtension}`;
    },
    addTask() {
      this.addingNewTask = true;
      this.newTask = {
        orderNumber: this.tasks?.length + 1 || 1,
        name: "",
        visitorName: "",
        description: "",
        mediaType: "video",
        fileName: "",
        duration: 5,
        isEditing: true,
      };
    },
  },
};
</script>

<style lang="scss">
.scene-wrapper {
  text-align: left;
}

.wide {
  width: 90% !important;
}

.tasks-wrapper {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;

  .card {
    width: 90%;
  }
}

.closed-card {
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    width: 50%;
  }
}
</style>
