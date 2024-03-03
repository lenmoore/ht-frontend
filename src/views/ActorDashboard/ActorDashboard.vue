<template>
  <div style="margin-top: 2rem">
    <NavMenu />
    <div class="mx-4">
      <span :class="`bg-${actorName} font-2rem`">{{ actorName }}</span>
      <h1 style="padding-top: 0; margin-top: 0">
        dashboard:
        {{ groupName }}
      </h1>

      <h2 style="padding-bottom: 0; margin-bottom: 0">Stseenid!</h2>
    </div>
    <div>
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
import NavMenu from "../../components/NavMenu.vue";

export default {
  name: "ActorDashboard",
  components: { NavMenu, ScenesOverview, DashboardContainer },

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
