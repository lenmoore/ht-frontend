<template>
  <nav
    class="bg-white"
    style="width: 100%; display: flex; justify-content: space-between"
  >
    <span>
      <RouterLink
        v-for="link in menuLinks"
        :key="link.name"
        :to="{ name: link.name }"
        >{{ link.name }} |
      </RouterLink>
    </span>
    <button
      style="
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: end;
      "
      @click="logout"
    >
      Logout
    </button>
  </nav>
</template>
<script>
export default {
  name: "NavMenu",
  computed: {
    isAdmin() {
      return localStorage.admin === "true";
    },
    isActor() {
      return localStorage.actor === "true";
    },
    groupName() {
      return localStorage.group_name;
    },
    menuLinks() {
      if (this.isAdmin) {
        return [
          { name: "dashboard" },
          { name: "games" },
          { name: "performances" },
        ];
      } else if (this.isActor) {
        return [{ name: "dashboard", query: { group: this.groupName } }];
      } else {
        return [{ name: "visitor", query: { group: this.groupName } }];
      }
    },
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ name: "login" });
    },
  },
};
</script>
