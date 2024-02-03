<template>
    <div>
        <div class="group-overview">
            <button disabled class="bg-purple">
                Maakler
            </button>
            <button disabled class="bg-purple">
                Stalker
            </button>
            <button disabled class="bg-purple">
                Korraldaja
            </button>
            <button disabled class="bg-purple">
                Esoteerik
            </button>
            <button @click="goToGroup('sakala')" class="bg-purple">
                Sakala
            </button>
        </div>
        <div class="header">
            <div class="p-4">
                <h1>Valitud grupp: {{ currentRoute || '-' }}</h1>
                <p>
                    Mängijad/tiimid:
                    <span class="bg-pink">_ Helena _</span> |
                    <span class="bg-blue">_ Sander _</span>
                    Siia koht kust neid lisada
                </p>
                <h2>Stseenid</h2>
                <select name="scene" id="scene" v-model="selectedScene">
                    <option v-for="scene in scenes" :key="scene._id" :value="scene._id">{{ scene.orderNumber }}
                        {{ scene.title }}
                    </option>
                </select>

                <div v-if="addingScene" class="border p-4 new-scene">
                    <label for="number">Number</label>
                    <input id="number" type="number" v-model="newSceneOrderNumber">

                    <label for="name">Nimi</label>
                    <input id="name" type="text" v-model="newSceneName">

                    <label for="desc">Kirjeldus</label>
                    <textarea id="desc" v-model="newSceneDescription"></textarea>
                </div>
                <button @click="clickAdd">Lisa stseen</button>
            </div>
            <img src="/sakala.jpeg" alt="">
        </div>

        <RouterView/>
    </div>
</template>
<script>
import router from '../../../router';
import {mapActions, mapState} from "pinia";
import {useSetupStore} from "../../../store/setup.ts";

export default {
    name: 'AdminGames',

    data() {
        return {
            addingScene: false,
            newSceneName: '',
            newSceneDescription: '',
            newSceneOrderNumber: null,
            selectedScene: null,
            scenes: [],
        };
    },

    async created() {
        this.scenes = await this.getAllScenes();
    },

    computed: {
        currentRoute() {
            return this.$route.params.group;
        },
    },

    watch: {
        selectedScene: {
            immediate: true,
            handler(val) {
                router.push({name: 'groups', query: {scene: val}});
            }
        }
    },
    methods: {
        ...mapActions(useSetupStore, {
            createScene: 'createScene',
            getAllScenes: 'getAllScenes',
        }),
        goToGroup(name) {
            router.push({name: 'groups', params: {group: name}});
        },
        async clickAdd() {
            if (this.addingScene && this.newSceneName && this.newSceneDescription && this.newSceneOrderNumber) {
                const result = await this.createScene({
                    title: this.newSceneName,
                    description: this.newSceneDescription,
                    orderNumber: this.newSceneOrderNumber,
                    groupName: this.currentRoute,
                    teams: [],
                    tasks: [],
                });

                if (result) {
                    this.newSceneName = '';
                    this.newSceneDescription = '';
                    this.newSceneOrderNumber = null;
                    console.log(result);
                    await router.push({name: 'groups', query: {scene: result.scene._id}});
                }
            }
            this.addingScene = !this.addingScene;
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
</style>