<template>
    <div>
        <div class="header">
            <div class="p-4">
                <h1>Valitud grupp: {{ currentRoute }}</h1>
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
            </div>
            <img src="" alt="">
        </div>

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
                    <div v-for="task in tasks" :key="task.id">
                        <div class="card" :class="{ 'wide': task.isEditing }">
                            <form class="two-part-form" v-if="task.isEditing">
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
                                    <input id="length" type="number" v-model="task.length">

                                </div>

                                <div class="form-part">
                                    <label for="title">Pealkiri (naitlejale)</label>
                                    <textarea v-model="task.name"></textarea>

                                    <label for="orderNumber">Kirjeldus (publikule)</label>
                                    <textarea v-model="task.descriptionOfTask"></textarea>
                                    <button @click="saveTask" class="bg-red">Salvesta</button>
                                </div>

                            </form>
                            <div v-else class="closed-card">
                                <div>
                                    <p><code>{{ fileName(task) }}</code> ({{ task.type }})</p>
                                    <p>Grupp: {{ task.visitorName }}</p>
                                </div>
                                <div>
                                    <p><strong>"{{ task.nameOfTask }}"</strong>: {{ task.descriptionOfTask }}</p>
                                    <button @click="task.isEditing = !task.isEditing" class="bg-red">Muuda</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script>

export default {
    name: 'GroupGame',
    data() {
        return {
            tasks: [
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
    },
    methods: {
        saveTask() {
            console.log('saveTask');

        },

        fileName(task) {
            return `1_${task.orderNumber}_${task.fileName}_${task.visitorName}_${this.currentRoute}.mp4`;
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