<template>
  <BoardWrapper>
    <div class="home h-100 d-flex align-items-center justify-content-center">
      <img src="../assets/logo.png" alg="logo" class="mb-5 w-25 d-block" />
      <a href="#" class="button d-block mb-5" @click="launchGame">
        <b-icon-play-fill /> Play
      </a>

      <Highscores v-if="atLeastOneHighscore" />
    </div>
  </BoardWrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from "vue";
import BoardWrapper from "@/components/TheBoardWrapper.vue";
import Highscores from "@/components/TheHighscores.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "HomeView",
  components: {
    BoardWrapper,
    Highscores,
  },
  setup() {
    const store = useStore();
    const { push } = useRouter();
    const state = reactive({
      highscores: store.state.highscores,
    });
    const atLeastOneHighscore = computed(() => state.highscores.length > 0);

    function launchGame() {
      push({ name: "game" });
    }

    return {
      atLeastOneHighscore,
      launchGame,
    };
  },
});
</script>

<style scoped lang="scss">
$color: #0cf;

.home {
  flex-direction: column;
}

.button {
  display: inline-block;
  padding: 0.75rem 2.25rem;
  border-radius: 10rem;
  color: #fff;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 0.15rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  z-index: 1;
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color;
    border-radius: 10rem;
    z-index: -2;
  }
  &:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background-color: darken($color, 15%);
    transition: all 0.3s;
    border-radius: 10rem;
    z-index: -1;
  }
  &:hover {
    color: #fff;
    &:before {
      width: 100%;
    }
  }
}
</style>
