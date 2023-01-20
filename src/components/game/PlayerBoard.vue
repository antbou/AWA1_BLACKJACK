<template>
  <TheCard class="pt-2">
    <div class="flex flex-col">
      <div class="flex flex-row items-center mb-2">
        <p>You:</p>
        <DisplayScore :score="playerSum" />
      </div>
      <!-- Player cards -->
      <TransitionGroup
        v-if="playerCards"
        name="cards"
        tag="div"
        class="flex flex-row mx-auto"
        @enter="enter"
      >
        <GameCard
          v-for="(card, index) in playerCards"
          :key="index + card.name"
          :card="card"
          :class="playerCards.length > index + 1 ? '-mr-16' : ''"
        />
      </TransitionGroup>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <TheButton
          class="font-montserrat col-span-1"
          :disabled="!playerCanHit"
          @click="gameStore.hit()"
          >Hit</TheButton
        >
        <TheButton
          class="font-montserrat col-span-1"
          type="secondary"
          :disabled="showingResults"
          @click="gameStore.stay()"
          >Stay</TheButton
        >
        <TheButton
          v-if="showingResults"
          class="font-montserrat col-span-2"
          @click="nextGame"
          >Next Game</TheButton
        >
      </div>
    </div>
  </TheCard>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import TheCard from "@/components/misc/TheCard.vue";
import TheButton from "@/components/misc/TheButton.vue";
import GameCard from "@/components/game/GameCard.vue";
import DisplayScore from "@/components/game/DisplayScore.vue";
import { useGameStore } from "@/store/game";
import anime from "animejs";

// Using game store
const gameStore = useGameStore();

// Game running state
const gameRunning = computed(() => gameStore.getGameRunning);
const showingResults = computed(() => gameStore.getShowResults);

// Player cards + Player sum
const playerCards = computed(() => gameStore.getPlayerCards);
const playerSum = computed(() => gameStore.getPlayerSum);
const playerCanHit = computed(() => gameStore.canHit);

// Watcher if game is running and player can't hit anymore
watch(playerCanHit, (newValue) => {
  if (!newValue && gameRunning.value) {
    // Game ends - player is equal or above 21
    gameStore.stay();
  }
});

const enter = (el: any, done: any) => {
  anime({
    targets: el,
    opacity: [0, 1],
    duration: 500,
    delay: 100,
    easing: "easeInOutQuart",
    scale: [2, 1],
    complete: done,
  });
};

// Starting new game
const nextGame = () => {
  gameStore.newGame();
};
</script>

<style>
/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.cards-leave-active {
  position: absolute;
}
</style>
