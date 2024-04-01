<template>
  <div class="bg-white">
    <GroupSelector />
    <div class="py-2 bg-yellow">
      <div
        class="bg-white border m-4 p-2"
        v-for="templateScene in templateScenes"
      >
        <SceneBlock
          :loading="loading"
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
import GroupSelector from "../../components/GroupSelector.vue";
import NavMenu from "../../components/NavMenu.vue";

export default {
  name: "ScenesOverview",
  components: { NavMenu, GroupSelector, SceneBlock },

  data() {
    return {
      templateScenes: [],
      activePerformance: null,
      loading: false,
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
      this.$forceUpdate();
    },
    async activateTasks(tasksToStart) {
      this.loading = true;
      for (const task of tasksToStart) {
        await this.toggleTask({
          taskId: task._id,
          isActive: true,
        });
      }
      this.loading = false;
    },
    async stopTasks(tasksToStop) {
      this.loading = true;
      for (const task of tasksToStop) {
        await this.toggleTask({
          taskId: task._id,
          isActive: false,
        });
      }
      this.loading = false;
    },
    async toggleTask(task) {
      console.log(task);
      this.loading = true;
      await this.toggleTaskStatus({
        _id: task.taskId,
        isActive: task.isActive,
      });

      this.loading = false;
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
