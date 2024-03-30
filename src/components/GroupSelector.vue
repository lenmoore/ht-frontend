<template>
  <div>
    <button
      class="bg-purple"
      :class="activeGroupName === 'maakler' && 'active'"
      disabled
    >
      Maakler
    </button>
    <button
      class="bg-purple"
      :class="activeGroupName === 'stalker' && 'active'"
      @click="goToGroup('stalker')"
    >
      Stalker
    </button>
    <button
      class="bg-purple"
      :class="activeGroupName === 'korraldaja' && 'active'"
      disabled
    >
      Korraldaja
    </button>
    <button
      class="bg-purple"
      :class="activeGroupName === 'esoteerik' && 'active'"
      @click="goToGroup('esoteerik')"
    >
      Esoteerik
    </button>
    <!--    <button-->
    <!--      class="bg-purple"-->
    <!--      :class="activeGroupName === 'sakala' && 'active'"-->
    <!--      @click="goToGroup('sakala')"-->
    <!--    >-->
    <!--      Sakala-->
    <!--    </button>-->
  </div>
</template>
<script>
export default {
  name: "GroupSelector",

  data() {
    return {
      activeGroupName: localStorage.getItem("group_name") || "stalker",
    };
  },

  methods: {
    goToGroup(group) {
      localStorage.setItem("group_name", group);
      this.activeGroupName = localStorage.getItem("group_name");
      this.$emit("go-to-group", group);
    },
  },
};
</script>

<style>
.active {
  background-color: #64edfc !important;
  color: black;
}
</style>
