<template>
  <div>
    <div class="group-overview">
      <button class="bg-purple" disabled>Maakler</button>
      <button class="bg-purple" disabled>Stalker</button>
      <button class="bg-purple" disabled>Korraldaja</button>
      <button class="bg-purple" @click="goToGroup('esoteerik')">
        Esoteerik
      </button>
      <button class="bg-purple" @click="goToGroup('sakala')">Sakala</button>
    </div>
    <div class="header">
      <div class="p-4">
        <h1>Aktiivne: {{ currentRoute || "-" }}</h1>

        <div class="scene-selector">
          <h2>Vali stseen:</h2>
          <select
            id="scene"
            v-model="selectedSceneId"
            class="large-select"
            name="scene"
          >
            <option v-for="scene in scenes" :key="scene._id" :value="scene._id">
              {{ scene.orderNumber }}
              {{ scene.title }}
            </option>
          </select>
        </div>

        <div v-if="addingScene" class="border p-4 new-scene">
          <label for="number">Number</label>
          <input id="number" v-model="newSceneOrderNumber" type="number" />

          <label for="name">Nimi</label>
          <input id="name" v-model="newSceneName" type="text" />

          <label for="desc">Kirjeldus</label>

          <textarea id="desc" v-model="newSceneDescription"></textarea>
          <div>
            <button class="bg-pink" @click="cancelAddScene">Cancel</button>

            <button @click="clickAdd">Salvesta</button>
          </div>
        </div>
        <div v-else>
          <button @click="clickAdd">Lisa stseen</button>
        </div>
      </div>
      <img alt="" src="/sakala.jpeg" />
    </div>
    <div v-if="selectedScene">
      <h3 class="p-4">
        Stseen {{ selectedScene.orderNumber || "-" }}: {{ selectedScene.title }}
      </h3>
      <div class="bg-yellow border-top border-bottom p-4">
        <p>Stseeni kirjeldus</p>
        <p>
          {{ selectedScene.description }}
        </p>
      </div>
    </div>

    <RouterView />
  </div>
</template>
<script>
import router from "../../../router";
import { mapActions, mapState } from "pinia";
import { useSetupStore } from "../../../store/setup.ts";

export default {
  name: "AdminGames",

  data() {
    return {
      addingScene: false,
      newSceneName: "",
      newSceneDescription: "",
      newSceneOrderNumber: null,
      selectedSceneId: null,
      selectedScene: null,
      scenes: [],
    };
  },

  async created() {
    // todo add filter for which group scenes are for
    this.scenes = await this.getAllScenes(this.$route.params?.groupName);
    if (this.scenes.length) {
      this.selectedSceneId = this.scenes[0]?._id;
    }
  },

  computed: {
    currentRoute() {
      return this.$route.params?.groupName;
    },
  },

  watch: {
    selectedSceneId: {
      immediate: true,
      async handler(val) {
        if (!val) {
          if (this.scenes.length) {
            this.selectedSceneId = this.scenes[0]?._id;
          }
        }
        router.push({
          name: "groups",
          query: { scene: val },
          params: { groupName: this.currentRoute || "sakala" },
        });
        this.selectedScene = await this.getSceneById(this.selectedSceneId);
      },
    },
  },

  methods: {
    ...mapState(useSetupStore, { userTeams: "teams" }),
    ...mapActions(useSetupStore, {
      createScene: "createScene",
      getAllScenes: "getAllScenes",
      getSceneById: "getSceneById",
    }),
    goToGroup(name) {
      router.push({ name: "groups", params: { groupName: name } });
    },
    async clickAdd() {
      if (
        this.addingScene &&
        this.newSceneName &&
        this.newSceneDescription &&
        this.newSceneOrderNumber
      ) {
        const result = await this.createScene({
          title: this.newSceneName,
          description: this.newSceneDescription,
          orderNumber: this.newSceneOrderNumber,
          groupName: this.currentRoute,
          teams: [],
          tasks: [],
        });

        if (result) {
          this.newSceneName = "";
          this.newSceneDescription = "";
          this.newSceneOrderNumber = null;
          console.log(result);

          await router.push({
            name: "groups",
            query: { scene: result.scene._id },
          });
          this.scenes.push(result.scene);
        }
      }
      this.addingScene = !this.addingScene;
    },
    cancelAddScene() {
      this.addingScene = false;
      this.newSceneName = "";
      this.newSceneDescription = "";
      this.newSceneOrderNumber = null;
    },
  },
};
</script>

<style lang="scss">
.group-overview {
  display: flex;
  width: 100%;
}

.new-scene {
  display: flex;
  flex-direction: column;
}

.scene-selector {
  display: flex;
  align-items: center;

  h2 {
    margin-right: 1rem;
  }
}

.group-overview {
  margin-top: 4rem;
}
</style>
