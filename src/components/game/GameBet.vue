<template>
  <!-- <div class="flex items-center"> -->
  <TheCard class="mt-16 sm:mt-32 flex items-center flex-col">
    <!-- <div class="m-50"> -->
    <div class="flex flex-col items-center mb-2">
      <p>Start the game after you set your bet.</p>
    </div>

    <div
      class="grid grid-rows-2 sm:grid-rows-1 grid-cols-2 sm:grid-cols-3 gap-x-3 place-items-center mt-3 gap-y-4"
    >
      <div class="place-self-end">
        <PhPokerChipFill
          v-if="currentlyCreditsSet >= 1"
          :variant="getLastTokenPlayed().variant"
          :value="getLastTokenPlayed().value"
          @click="remove()"
          :disabled="!canRemove()"
        />
      </div>
      <div class="w-full sm:text-center text-left">
        {{ currentlyCreditsSet }}
      </div>

      <TheButton
        class="font-montserrat sm:w-full sm:h-16 w-2/4 h-12 col-span-2 sm:col-span-1 rounded-full"
        :disabled="currentlyCreditsSet <= 0"
        @click="startGame"
        >Play</TheButton
      >
    </div>
  </TheCard>
  <TheCard class="absolute sm:bottom-5 sm:left-5 bottom-2 left-2">
    <div class="flex flex-col">
      <div class="flex flex-col items-center mb-2">
        <p class="text-4xl md:text-5xl mb-4"></p>
        <p>Start the game after you set your bet.</p>
        {{ currentCredits }}
      </div>
      <div
        class="grid grid-rows-2 sm:grid-rows-1 grid-cols-3 sm:grid-cols-6 gap-x-2 place-items-center mt-3 gap-y-2"
      >
        <transition-group mode="out-in" name="token" :duration="500">
          <template v-for="(token, idx) in tokens" :key="idx">
            <PhPokerChipFill
              :variant="token.variant"
              :value="token.value"
              @click="add(token)"
            >
            </PhPokerChipFill>
          </template>
        </transition-group>
      </div>
    </div>
  </TheCard>
</template>

<script setup lang="ts">
import TheCard from "@/components/misc/TheCard.vue";
import TheButton from "@/components/misc/TheButton.vue";
import DisplayCredits from "@/components/game/DisplayCredits.vue";
import PhPokerChipFill from "@/components/icons/PhPokerChipFill.vue";
import { useGameStore } from "@/store/game";
import { useCreditStore } from "@/store/credits";
import { computed } from "vue";
import { useTokenStore } from "@/store/token";
import type { Token } from "@/store/token";

// Using stores
const gameStore = useGameStore();
const creditStore = useCreditStore();
const tokenStore = useTokenStore();

// Credits states
const currentCredits = computed(() => creditStore.getCredits);
const currentlyCreditsSet = computed(() => gameStore.getPlayersBet);

const add = (token: Token) => {
  if (currentCredits.value >= token.value) {
    const newBet = currentlyCreditsSet.value + token.value;
    gameStore.setBet(newBet);
    subtractPlayerCredits(token.value);
    tokensPlayed.value.push(token);
  }
};

// Set credits if you have enough
// const setCredits = (token: token) => {
//   if (currentCredits.value >= creditsToBeSet) {
//     const newBet = currentlyCreditsSet.value + creditsToBeSet;
//     gameStore.setBet(newBet);
//     subtractPlayerCredits(creditsToBeSet);
//     tokensPlayed.value.push(creditsToBeSet);
//   }
// };

const disabledTokens = computed(() => {
  return tokens.value.filter((token) => token.value > currentCredits.value);
});

const subtractPlayerCredits = (creditsToBeSubtracted: number) => {
  if (currentCredits.value >= creditsToBeSubtracted) {
    creditStore.subtractCredits(creditsToBeSubtracted);
  }
};

const tokens = computed(() => tokenStore.all);
const tokensPlayed = computed(() => [] as Token[]);

// Set credits and start game
const startGame = () => {
  const newBet = currentlyCreditsSet.value;
  // Bet needs to be set more than 0 credits and player need to have at least the smallest bet
  if (
    newBet > 0 &&
    currentCredits.value >= 10 &&
    currentCredits.value >= newBet
  ) {
    creditStore.subtractCredits(newBet);
    gameStore.setBet(newBet);
    gameStore.startGame();
  }
};

// Reset credits
const resetCredits = () => {
  creditStore.resetCredits();
};

const getLastTokenPlayed = (): Token => {
  return tokensPlayed.value[tokensPlayed.value.length - 1];
};

const remove = () => {
  const lastTokenPlayed = getLastTokenPlayed();
  if (lastTokenPlayed) {
    const newBet = currentlyCreditsSet.value - lastTokenPlayed.value;
    gameStore.setBet(newBet);
    creditStore.addCredits(lastTokenPlayed.value);
    tokensPlayed.value.pop();
  }
};

const canRemove = () => {
  return tokensPlayed.value.length > 0;
};
</script>
