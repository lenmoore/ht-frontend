<template>
  <div>
    <h1>Etenduste seaded</h1>

    <div class="card performance-form" v-if="addingPerformance">
      <label for="name">Nimi</label>
      <input id="name" v-model="newPerformanceName" type="text" />

      <label for="date">Kuupaev</label>
      <input id="date" v-model="newPerformanceDate" type="date" />

      <label for="desc">Kirjeldus</label>
      <textarea id="desc" v-model="newPerformanceDescription"></textarea>

      <button @click="clickAdd">Salvesta</button>
      <div></div>
    </div>

    <div v-else>
      <button @click="clickAdd">Lisa etendus</button>
    </div>

    <div class="performances-wrapper">
      <div v-for="performance in performances" :key="performance._id">
        <div class="performance">
          <h2>{{ performance.name }}</h2>
          <p>{{ performance.description }}</p>
          <p>{{ performance.date }}</p>
          <button @click="selectedPerformance = performance">Muuda</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useSetupStore } from "../../../store/setup.ts";

export default {
  name: "AdminPerformances",

  data() {
    return {
      addingPerformance: false,
      newPerformanceName: "",
      newPerformanceDescription: "",
      newPerformanceDate: null,
      selectedPerformanceId: null,
      selectedPerformance: null,
      performances: [],
    };
  },

  async created() {
    this.performances = await this.getPerformances();
  },

  methods: {
    ...mapActions(useSetupStore, {
      addPerformance: "addPerformance",
      getPerformances: "getPerformances",
    }),
    async clickAdd() {
      if (this.addingPerformance) {
        const newPerformance = {
          date: this.newPerformanceDate,
          title: this.newPerformanceName,
          description: this.newPerformanceDescription,
        };
        await this.addPerformance(newPerformance);
        this.performances = await this.getPerformances();
      }
      this.addingPerformance = !this.addingPerformance;
    },
  },
};
</script>

<style lang="scss">
.performance-form {
  display: flex;
  flex-direction: column;
}

.performances-wrapper {
  width: 100%;
}
</style>
