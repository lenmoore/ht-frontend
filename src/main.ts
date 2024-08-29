import { createApp } from "vue";
import "./styles/style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import axios from "redaxios";
import { createI18n } from "vue-i18n";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const app = createApp(App);
import translations from "./translations.json";
// Create the Pinia store
const pinia = createPinia();
const i18n = createI18n({
    locale: 'et',
    messages: {
        en: {
            "Logi sisse": "Log in",
            "Hetkel pole sulle ülesandeid.": "You don't have any tasks at the moment.",
            "Oota järgmist ülesannet.": "Wait for the next task.",
            "Ava diktofon": "Open the dictaphone",
            "Ava kaamera": "Open the camera",
            "sek": "sec",
            "Uus ülesanne!": "New task!",
            "Kinnita": "Confirm",
            "Lindista uuesti": "Record again",
            ...translations,
        },
    }
})
// Use the necessary plugins
app.use(router);
app.use(pinia);
app.use(i18n); // Use the i18n plugin

// Mount the Vue app
app.mount("#app");
