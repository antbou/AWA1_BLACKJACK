import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import GameView from "@/views/GameView.vue";
import RulesView from "@/views/RulesView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFound from "@/views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/game",
      name: "game",
      component: GameView,
    },
    {
      path: "/rules",
      name: "rules",
      component: RulesView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFound,
    },
  ],
});

export default router;
