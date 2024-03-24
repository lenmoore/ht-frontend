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
        <h1>{{ activeGroupName || "-" }}</h1>

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
      <img alt="" :src="activeActorImage" />
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

    <GroupGame
      :selected-scene-id="selectedSceneId"
      :group-name="activeGroupName"
    />
  </div>
</template>
<script>
import router from "../../../router";
import { mapActions, mapState } from "pinia";
import { useSetupStore } from "../../../store/setup.ts";
import GroupGame from "./GroupGame/GroupGame.vue";

export default {
  name: "AdminGames",
  components: { GroupGame },

  data() {
    return {
      activeGroupName: "sakala",

      addingScene: false,
      newSceneName: "",
      newSceneDescription: "",
      newSceneOrderNumber: null,

      selectedSceneId: null,
      selectedScene: null,
      scenes: [],
    };
  },

  computed: {
    activeActorImage() {
      return {
        sakala: "/actors/sakala.jpeg",
      }[this.activeGroupName];
    },
  },

  watch: {
    activeGroupName: {
      handler: async function (newVal) {
        this.scenes = await this.getAllScenes(newVal);
        this.selectedSceneId = this.scenes[0]._id;
        this.selectedScene = this.scenes[0];
      },
      immediate: true,
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
      console.log("go to group ", name);
      this.activeGroupName = name;
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
