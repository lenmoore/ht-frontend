<template>
  <div>
    <NavMenu />
    <RouterView style="padding-bottom: 10rem" />

    <div class="unconfirm-all-tasks-wrapper">
      <button @click="clickUnconfirm">Unconfirm all tasks</button>
    </div>
  </div>
</template>
<script>
import NavMenu from "../../components/NavMenu.vue";
import { mapActions } from "pinia";
import { useSetupStore } from "../../store/setup";

export default {
  name: "Admin",

  components: { NavMenu },

  methods: {
    ...mapActions(useSetupStore, ["unconfirmAllTasks"]),
    async clickUnconfirm() {
      await this.unconfirmAllTasks();
    },
  },
};
</script>

<style>
.unconfirm-all-tasks-wrapper {
  padding-top: 20rem;
}
</style>
