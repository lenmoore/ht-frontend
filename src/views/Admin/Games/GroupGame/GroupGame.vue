<template>
  <div>
    <div class="scene-wrapper border">
      <h4>Ylesanded ({{ tasks.length }})</h4>
      <p class="p-4">
        Tiimid:
        <span class="m-1 bg-yellow" v-for="team in userTeams" :key="team._id">{{
          team.team_name
        }}</span>
      </p>
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
                  <code>{{ displayFileName(task) }}</code> ({{ task.type }})
                </p>
                <p>Grupp: {{ teamNameById(task.teamId) }}</p>
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
    if (!this.userTeams.length) {
      await this.getTeams();
    }
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
      return `${this.scene.orderNumber}_${task.orderNumber}_${task.fileName}_${this.teamNameById(task.teamId)}_${this.currentRoute}.mp4`;
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