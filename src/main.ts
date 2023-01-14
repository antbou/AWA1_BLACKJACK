import App from "./App.vue";
import router from "./router";
import { createApp, watch, h } from "vue";
import { createPinia } from "pinia";
import "./assets/main.css";
import "@fontsource/montserrat";
import "@fontsource/roboto";

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);

app.mount("#app");
