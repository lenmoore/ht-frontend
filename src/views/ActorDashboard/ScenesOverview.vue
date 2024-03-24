<template>
  <div class="bg-white">
    <div class="py-2 bg-yellow">
      <div
        class="bg-white border m-4 p-2"
        v-for="templateScene in templateScenes"
      >
        <SceneBlock
          :scene="templateScene"
          @start="activateTasks"
          @stop="stopTasks"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useActorStore } from "../../store/actor.ts";
import SceneBlock from "./SceneBlock/SceneBlock.vue";

export default {
  name: "ScenesOverview",
  components: { SceneBlock },

  data() {
    return {
      templateScenes: [],
      activePerformance: null,
    };
  },

  async created() {
    await this.getTemplateScenes();
  },

  methods: {
    ...mapActions(useActorStore, {
      getPerformances: "getPerformances",
      getPerformanceById: "getPerformanceById",
      getActorPerformanceScenes: "getActorPerformanceScenes",
      getAllScenesForActor: "getAllScenesForActor",
      startScene: "startScene",
      toggleTaskStatus: "toggleTask",
    }),
    async getTemplateScenes() {
      // get all scenes we know of and filter out the ones that exist in the existing scenes
      // sort based on order number
      const scenes = await this.getAllScenesForActor();
      // sort by if scene is completed and then by order number
      scenes.sort((a, b) => {
        if (a.isCompleted && !b.isCompleted) {
          return -1;
        }
        if (!a.isCompleted && b.isCompleted) {
          return 1;
        }
        return a.orderNumber - b.orderNumber;
      });

      this.templateScenes = scenes;
      setTimeout(this.getTemplateScenes, 3000);
    },
    async activateTasks(tasksToStart) {
      for (const task of tasksToStart) {
        await this.toggleTask({
          taskId: task._id,
          isActive: true,
        });
      }
    },
    async stopTasks(tasksToStop) {
      for (const task of tasksToStop) {
        await this.toggleTask({
          taskId: task._id,
          isActive: false,
        });
      }
    },
    async toggleTask(task) {
      console.log(task);
      return await this.toggleTaskStatus({
        _id: task.taskId,
        isActive: task.isActive,
      });
    },
  },
};
</script>

<style lang="scss">
.scene-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
