<template>
  <div>
    <h1>
      <span class="bg-purple">{{ actorName }}</span> dashboard: {{ groupName }}
    </h1>
    <div>
      <h2>Stseenid!</h2>

      <ScenesOverview />
    </div>
    <DashboardContainer v-if="showPerformanceSelector" />
    <button v-else @click="showPerformanceSelector = true">Vali etendus</button>
  </div>
</template>
<script lang="ts">
import DashboardContainer from "./ActivatePerformanceBlock.vue";
import { mapActions } from "pinia";
import { useActorStore } from "../../store/actor.ts";
import ScenesOverview from "./ScenesOverview.vue";

export default {
  name: "ActorDashboard",
  components: { ScenesOverview, DashboardContainer },

  data() {
    return {
      showPerformanceSelector: false,
      activePerformance: null,
    };
  },

  async created() {
    await this.getActivePerformance();
  },

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
  },

  methods: {
    ...mapActions(useActorStore, {
      getPerformances: "getPerformances",
      getPerformanceById: "getPerformanceById",
    }),
    async getActivePerformance() {
      const result = await this.getPerformanceById(
        localStorage.activePerformanceId,
      );
      if (result) {
        this.activePerformance = result;
      }
    },
  },
};
</script>
