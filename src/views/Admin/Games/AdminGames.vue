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
                <select name="scene" id="scene">
                    <option value="scene1">Stseen 1: Kohv</option>
                    <option value="scene1">Stseen 2: Siim</option>
                    <option value="scene1">Stseen 3: Kastame lilli</option>
                </select>

                <div v-if="addingScene" class="bg-yellow">
                    <input type="number" v-model="newSceneOrderNumber">
                    <input type="text" v-model="newSceneName">
                    <textarea v-model="newSceneDescription"></textarea>
                </div>
                <button @click="clickAdd">Lisa stseen</button>
            </div>
            <img src="" alt="">
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
        };
    },
    computed: {
        currentRoute() {
            return this.$route.params.group;
        },
    },

    methods: {
        ...mapActions(useSetupStore, {
            createScene: 'createScene',
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
                    teams: [],
                    tasks: [],
                });

                if (result) {
                    this.newSceneName = '';
                    this.newSceneDescription = '';
                    this.newSceneOrderNumber = null;
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
</style>