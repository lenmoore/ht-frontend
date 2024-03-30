<template>
  <div style="margin-top: 2rem; margin-bottom: 20rem">
    <NavMenu />
    <div class="mx-4">
      <h2 style="padding-bottom: 0; margin-bottom: 0">Stseenid</h2>
    </div>
    <div>
      <ScenesOverview />
    </div>
  </div>
</template>
<script lang="ts">
import ScenesOverview from "./ScenesOverview.vue";
import NavMenu from "../../components/NavMenu.vue";
import GroupSelector from "../../components/GroupSelector.vue";

export default {
  name: "ActorDashboard",
  components: { GroupSelector, NavMenu, ScenesOverview },

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
};
</script>
