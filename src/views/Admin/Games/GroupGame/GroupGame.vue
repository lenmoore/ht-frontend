<template>
    <div>
        <h1 class="bg-pink">
            todo there is some shit here: there should always be an auto-selected scene; it should be deep-linkable;
            cant save tasks because of some reactivity issue
        </h1>


        <div>
            <div class="scene-wrapper border">
                <h3>Stseen 1: kohv</h3>
                <div class="bg-yellow border-top border-bottom p-4">
                    <p>Stseeni kirjeldus</p>
                    <p>Helena paneb vee keema ja laheb kuhugi diivanile. Sander avastab, et kohvijahvatajas pole enam
                        ube. Sander valab sinna ube.</p>
                </div>

                <h4>Ylesanded</h4>

                <div class="tasks-wrapper">
                    <div v-for="task in tasks" :key="task._id || 'new'">
                        <div class="card" :class="{ 'wide': task.isEditing }">
                            <div class="two-part-form" v-if="task.isEditing">
                                <div class="form-part">
                                    <label for="orderNumber">Järjekorranumber (naitlejale)</label>
                                    <input id="orderNumber" type="text" v-model="task.orderNumber">

                                    <label for="filename">Faili nimi:
                                        <code style="width: 70%;">{{ fileName(task) }}</code></label>
                                    <input id="filename" type="text" v-model="task.fileName">

                                    <label for="visitorName">Tiim (publik=värv=meie)</label>
                                    <select id="visitorName" v-model="task.visitorName">
                                        <option value="helena">helena</option>
                                        <option value="sander">sander</option>
                                    </select>

                                    <label for="orderNumber">Meedia tüüp</label>
                                    <select id="orderNumber" v-model="task.type">
                                        <option value="video">video</option>
                                        <option value="sound">sound</option>
                                        <option value="teleprompter">teleprompter</option>
                                    </select>


                                    <label for="length">Klipi pikkus (sekundites)</label>
                                    <input id="length" type="number" v-model="task.duration">

                                </div>

                                <div class="form-part">
                                    <label for="title">Pealkiri (naitlejale)</label>
                                    <textarea v-model="task.name"></textarea>

                                    <label for="orderNumber">Kirjeldus (publikule)</label>
                                    <textarea v-model="task.descriptionOfTask"></textarea>
                                    <button @click.prevent="saveTask(task)" class="bg-red">Salvesta</button>
                                </div>

                            </div>
                            <div v-else class="closed-card">
                                <div>
                                    <p><code>{{ fileName(task) }}</code> ({{ task.type }})</p>
                                    <p>Grupp: {{ task.visitorName }}</p>
                                </div>
                                <div>
                                    <p><strong>"{{ task.nameOfTask }}"</strong>: {{ task.descriptionOfTask }}</p>
                                    <button @click.prevent="task.isEditing = !task.isEditing" class="bg-red">Muuda
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button @click="addTask">Lisa</button>
            </div>


        </div>
    </div>
</template>

<script>

import {mapActions} from "pinia";
import {useSetupStore} from "../../../../store/setup.ts";

export default {
    name: 'GroupGame',
    data() {
        return {
            tasks: [],
            scene: null,
            dummyTasks: [
                {
                    id: 1,
                    orderNumber: 1,
                    nameOfTask: 'Vesi keeb',
                    visitorName: 'helena',
                    descriptionOfTask: 'Filmi l2hedalt vee keemist ja mullitamist.',
                    type: "video",
                    fileName: 'vesikeeb',
                    isEditing: false,
                },
                {
                    id: 2,
                    orderNumber: 2,
                    nameOfTask: 'Kohvijahvataja',
                    visitorName: 'sander',
                    descriptionOfTask: 'Sander avastab, et kohvijahvatajas pole enam ube. Sander valab sinna ube.',
                    type: "sound",
                    fileName: 'kohvijahvataja',
                    isEditing: false,
                },
                {
                    id: 3,
                    orderNumber: 3,
                    nameOfTask: 'Raagi mulle tasakesi midagi',
                    visitorName: 'sander',
                    descriptionOfTask: 'Kirjuta andmebaasi see teleprompteri contenti field ka haha',
                    type: "teleprompter",
                    fileName: 'saladus',
                    isEditing: false,
                },
            ],
        };
    },
    computed: {
        currentRoute() {
            return this.$route.params.group;
        },
        currentSceneId() {
            return this.$route.query.scene;
        },
    },

    watch: {
        currentSceneId: {
            immediate: true,
            async handler(val) {
                this.scene = await this.getSceneById(val);
                this.tasks = this.scene.tasks;
            }
        }
    },
    methods: {
        ...mapActions(useSetupStore, {
            createTask: 'createTask',
            getSceneById: 'getSceneById',
            updateTaskById: 'updateTaskById',
            deleteTaskById: 'deleteTaskById',
        }),
        async saveTask(event) {
            // todo there is some shit here. cannot save tasks
            const task = event;
            console.log('saveTask', task);
            if (task._id === 'new') {
                await this.createTask({
                    orderNumber: task.orderNumber,
                    nameOfTask: task.nameOfTask,
                    visitorName: task.visitorName,
                    descriptionOfTask: task.descriptionOfTask,
                    type: task.type,
                    fileName: this.fileName(task),
                    duration: task.duration,
                    sceneId: this.scene._id,
                });
            } else {
                await this.updateTaskById({
                    _id: task._id,
                    orderNumber: task.orderNumber,
                    nameOfTask: task.nameOfTask,
                    visitorName: task.visitorName,
                    descriptionOfTask: task.descriptionOfTask,
                    type: task.type,
                    duration: task.duration,
                    fileName: this.fileName(task),
                    sceneId: this.scene._id,
                });
            }

        },
        fileName(task) {
            return `1_${task.orderNumber}_${task.fileName}_${task.visitorName}_${this.currentRoute}.mp4`;
        },
        addTask() {
            console.log(this.tasks);
            this.tasks = [...this.tasks, {
                _id: 'new',
                orderNumber: this.tasks.length + 1,
                nameOfTask: '',
                visitorName: '',
                descriptionOfTask: '',
                type: "video",
                fileName: '',
                duration: 5,
                isEditing: true,
            }];
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