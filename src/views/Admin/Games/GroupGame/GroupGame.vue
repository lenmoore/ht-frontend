<template>
  <div>
    <div class="scene-wrapper border">
      <h4>
        {{ groupName }}: <strong>{{ scene && scene.title }}</strong> ({{
          tasks && tasks.length
        }})
      </h4>

      <p class="max-width-20-rem border-top border-bottom bg-yellow">
        {{ scene && scene.description }}
      </p>
      <div v-if="tasks.length" class="tasks-wrapper">
        <div class="card py-4" v-for="task in tasks" :key="task._id">
          <div
            :class="{ wide: task.isEditing }"
            style="padding-left: 0; padding-right: 0"
          >
            <TwoPartForm
              v-if="task.isEditing"
              :given-task="task"
              :user-teams="userTeams"
              :scene="scene"
              @save="saveTask"
              @delete="deleteTask"
            />

            <div v-else class="closed-card">
              <p>
                <label>
                  <label>Faili nimi: </label>
                  <code class="bg-blue">{{ displayFileName(task) }}</code>
                  <br />
                  <label for="length">
                    {{ task.duration }} sek {{ task.mediaType }}
                  </label>

                  <span
                    class="mx-2"
                    :class="`bg-${task.team && task.team.name}`"
                  >
                    {{ task.team && task.team.name }}
                  </span>
                </label>
              </p>
              <p>
                <label>Nimi näitlejale: </label>
                <strong>{{ task.name }}</strong>
              </p>
              <p>
                <label>Ülesanne publikule:</label>
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
      newTask: {},
      addingNewTask: false,
      scene: null,
      userTeams: [],
    };
  },

  props: {
    selectedSceneId: {
      type: String,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
  },

  watch: {
    selectedSceneId: {
      immediate: true,
      async handler() {
        await this.getTeams();
        this.scene = await this.getSceneById(this.selectedSceneId);
        console.log(this.scene);
        this.tasks = this.scene.tasks;
      },
    },
    groupName: {
      immediate: true,
      async handler() {
        await this.getTeams();
      },
    },
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
    deleteTask(task) {
      this.deleteTaskById(task._id);
    },
    teamNameById(id) {
      return this.userTeams.find((team) => team._id === id)?.team_name;
    },
    async getTeams() {
      this.userTeams = await this.getAllTeamsInGroup({
        groupName: this.groupName,
      });
    },
    async saveTask(task) {
      console.log(task);

      if (this.addingNewTask) {
        const newTask = await this.createTask(task);
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
      console.log(task.mediaType);
      const groupName = this.groupName;
      const sceneOrderNumber = this.scene.orderNumber;
      const taskOrderNumber = task.orderNumber;
      const fileName = task.fileName.replace(" ", "_");
      const team = task.team?.team_name;
      const fileType = task.mediaType === "video" ? "mp4" : "mp3";
      return `${groupName}_${sceneOrderNumber}_${taskOrderNumber}_${fileName}_${team}.${fileType}`;
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
.card {
  width: 90%;
}

.closed-card {
  width: 100%;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scene-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tasks-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
