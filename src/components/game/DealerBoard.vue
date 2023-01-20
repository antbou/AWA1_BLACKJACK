<template>
  <TheCard class="pt-2">
    <div class="flex flex-col">
      <div class="flex flex-row items-center mb-2">
        <p>Dealer:</p>
        <DisplayScore :score="dealerSum" />
      </div>
      <!-- Dealer cards -->
      <TransitionGroup
        v-if="dealerCards"
        name="cards"
        tag="div"
        class="flex flex-row mx-auto"
        @enter="enter"
        mode="out-in"
      >
        <GameCard
          v-for="(card, index) in dealerCards"
          :key="index + card.name"
          :card="card"
          :class="dealerCards.length > index + 1 ? '-mr-16' : ''"
        />
      </TransitionGroup>
    </div>
  </TheCard>
</template>

<script setup lang="ts">
import TheCard from "@/components/misc/TheCard.vue";
import GameCard from "@/components/game/GameCard.vue";
import DisplayScore from "@/components/game/DisplayScore.vue";
import { useGameStore } from "@/store/game";
import { computed } from "vue";
import anime from "animejs";

// Using game store
const gameStore = useGameStore();

// Dealer cards + Dealer sum (without hidden card)
const dealerCards = computed(() => gameStore.getDealerCards);
const dealerSum = computed(() => gameStore.getDealerSum);

const enter = (el: any, done: any) => {
  console.log("entering");
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
</script>

<style>
/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.cards-leave-active {
  position: absolute;
}
</style>
