<template>
  <div>
    <div class="image-header">
      <div class="group-overview">
        <GroupSelector @go-to-group="goToGroup" />
      </div>
    </div>

    <div>
      <img alt="" :src="activeActorImage" />
      <h1>{{ activeGroupName || "-" }}</h1>
    </div>
    <div class="header">
      <div class="p-4">
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
    </div>

    <GroupGame
      :selected-scene-id="selectedSceneId"
      :group-name="activeGroupName"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from "pinia";
import { useSetupStore } from "../../../store/setup.ts";
import GroupGame from "./GroupGame/GroupGame.vue";
import GroupSelector from "../../../components/GroupSelector.vue";

export default {
  name: "AdminGames",
  components: { GroupSelector, GroupGame },

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
        maakler: "/actors/teder.png",
        esoteerik: "/actors/reinold.png",
        korraldaja: "/actors/kapper.png",
        stalker: "/actors/podersoo.png",
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
          groupName: this.activeGroupName,
          teams: [],
          tasks: [],
        });

        if (result) {
          this.newSceneName = "";
          this.newSceneDescription = "";
          this.newSceneOrderNumber = null;
          console.log(result);

          this.scenes.push(result.scene);
          this.selectedSceneId = result.scene._id;
          this.selectedScene = result.scene;
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
.image-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 4rem;

  h1 {
    margin: 0;
    padding: 0;
  }

  img {
    height: 200px;
    width: 200px;
  }

  .group-overview {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
  }
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

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
}

.column {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
