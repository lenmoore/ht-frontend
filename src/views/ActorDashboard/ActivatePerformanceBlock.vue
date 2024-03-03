<template>
  <div>
    <h1>Vali etendus:</h1>
    <div class="performance-activator">
      <div
        class="card performance-card"
        v-for="performance in performances"
        :key="performance._id"
      >
        <h4>
          {{ performance.title }}
          <small v-if="performance.isActive" class="bg-green">Aktiivne</small>
        </h4>
        <p>{{ performance.description }}</p>
        <p>Plaanis: {{ performanceDate(performance.date) }}</p>

        <div v-if="performance.startedAt">
          Alustati: {{ performanceDate(performance.startedAt) }}
        </div>
        <div v-if="performance.endedAt">
          Lopetati: {{ performanceDate(performance.endedAt) }}
        </div>
        <button
          v-if="performance.isActive"
          @click="stopPerformance(performance)"
        >
          Lopeta
        </button>
        <button
          v-else
          @click="startPerformance(performance)"
          class="bg-green"
          :disabled="anyOtherActivePerformance"
        >
          Alusta
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useActorStore } from "../../store/actor.ts";

export default {
  name: "DashboardContainer",

  computed: {
    actorInfo() {
      return JSON.parse(localStorage.user);
    },
    actorName() {
      return this.actorInfo?.name;
    },
    groupName() {
      return localStorage.group_name;
    },
    anyOtherActivePerformance() {
      return this.performances.find(
        (performance) => performance.startedAt && !performance.endedAt,
      );
    },
  },
  async created() {
    this.performances = await this.getPerformances();
    if (this.performances.find((performance) => performance.isActive)) {
      localStorage.activePerformanceId = this.performances.find(
        (performance) => performance.isActive,
      )._id;
    }
  },
  data() {
    return {
      performances: [],
    };
  },
  methods: {
    ...mapActions(useActorStore, {
      getPerformances: "getPerformances",
      editPerformance: "editPerformance",
    }),
    async startPerformance(performance) {
      localStorage.activePerformanceId = performance._id;
      const result = await this.editPerformance({
        performanceId: localStorage.activePerformanceId,
        startedAt: new Date(),
        isActive: true,
      });
      console.log(result);
      this.performances = await this.getPerformances();
    },
    async stopPerformance(performance) {
      localStorage.activePerformanceId = performance._id;
      const result = await this.editPerformance({
        performanceId: localStorage.activePerformanceId,
        endedAt: new Date(),
        isActive: false,
      });
      console.log(result);
      this.performances = await this.getPerformances();
    },
    performanceDate(date) {
      return `${new Date(date).toDateString()} ${new Date(date).toTimeString().split(" ")[0]}`;
    },
  },
};
</script>

<style lang="scss">
.performance-card {
  display: flex;
  flex-direction: column;
  width: 15rem;
}

.performance-activator {
  width: 100%;
}
</style>
