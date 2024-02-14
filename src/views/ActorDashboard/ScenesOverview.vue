<template>
  <div>
    <div class="scenes-wrapper">
      <div
        class="bg-green border m-4 p-4"
        v-for="existingScene in existingScenes"
      >
        <h4>
          {{ existingScene.orderNumber }} | {{ existingScene.scene.name }}
        </h4>
        <p class="bg-pink">{{ existingScene.scene.description }}</p>
      </div>

      <div
        class="bg-yellow border m-4 p-4"
        v-for="templateScene in templateScenes"
      >
        {{ templateScene }}
      </div>
    </div>
  </div>
</template>

<script>
// actorPerformanceScene looks like this::::
// _id: string;
// sceneStarted: moment.Moment;
// sceneEnded: moment.Moment;
// sceneId: string;
// performanceId: string;
// actorUserId: string;
// teamUserId: string;
// scene: SceneDocument;
import { mapActions } from "pinia";
import { useActorStore } from "../../store/actor.ts";

export default {
  name: "ScenesOverview",

  data() {
    return {
      existingScenes: [],
      templateScenes: [],
      activePerformance: null,
    };
  },

  async created() {
    await this.getExistingScenes();
    await this.getTemplateScenes();
  },
  methods: {
    ...mapActions(useActorStore, {
      getPerformances: "getPerformances",
      getPerformanceById: "getPerformanceById",
      getActorPerformanceScenes: "getActorPerformanceScenes",
      getAllScenesForActor: "getAllScenesForActor",
    }),
    async getExistingScenes() {
      const scenes = await this.getActorPerformanceScenes({
        actorUserId: JSON.parse(localStorage.user)._id,
        performanceId: localStorage.activePerformanceId,
      });
      console.log(scenes);
      this.existingScenes = scenes;
      // fetch existing scenes from the database
      // sort based on order number
    },
    async getTemplateScenes() {
      // get all scenes we know of and filter out the ones that exist in the existing scenes
      // sort based on order number
      const scenes = await this.getAllScenesForActor();
      console.log(scenes);
      this.templateScenes = scenes;
    },
  },
};
</script>
