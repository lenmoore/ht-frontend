<template>
  <div>
    <h1>Logi sisse</h1>

    <form @submit.prevent="clickLogin">
      <div>
        <label for="email">Nimi</label>
        <input type="text" id="email" v-model="email" />
      </div>
      <div>
        <label for="password">Parool</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">Logi sisse</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useAuthStore } from "../../store/auth.ts";
import router from "../../router/index.ts";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      url: "",
    };
  },

  methods: {
    ...mapActions(useAuthStore, {
      login: "login",
    }),
    async clickLogin() {
      if (this.email.length && this.password.length) {
        try {
          const user = await this.login(this.email, this.password);
          this.url = user.url;
          console.log(user);
          if (user) {
            if (localStorage.admin === "true") {
              router.push({ name: "admin-home" });
            } else if (localStorage.actor) {
              router.push({ name: "dashboard" });
            } else {
              router.push({ name: "visitor" });
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
};
</script>
