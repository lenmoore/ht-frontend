import { createApp } from "vue";
import "./styles/style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import axios from "redaxios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.mount("#app");
