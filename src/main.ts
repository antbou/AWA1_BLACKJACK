import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import { createApp, watch, h } from "vue";

import "./assets/main.css";

const app = createApp(App);
app.use(router);
app.use(store);

app.component("App", {
  setup() {
    store.dispatch("initialiseStore");

    watch(
      () => store.state,
      (state) => {
        localStorage.setItem("store", JSON.stringify(state));
      },
      { deep: true }
    );

    // Fetch deck and preload card images
    store.state.deck.forEach((card: any) => {
      const img = new Image();
      img.src = `images/cards/${card.image}`;
    });
    // Preload back card image too
    const img = new Image();
    img.src = "images/cards/back.png";

    return () => h(App);
  },
});

app.mount("#app");
