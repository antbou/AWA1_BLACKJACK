<template>
  <TheCard class="mt-16 sm:mt-32 flex items-center flex-col">
    <div class="flex flex-col items-center mb-2">
      <p>Start the game after you set your bet.</p>
    </div>

    <div
      class="grid grid-rows-2 sm:grid-rows-1 grid-cols-2 sm:grid-cols-3 gap-x-3 place-items-center mt-3 gap-y-4"
    >
      <div class="relative place-self-end token" ref="listPlayedChips">
        <TransitionGroup
          name="tokenTransition"
          :duration="2"
          @enter="tokenEnter"
          tag="ul"
        >
          <PhPokerChipFill
            v-for="(tokenPlayed, index) in tokensPlayed"
            :key="index"
            :variant="tokenPlayed.variant"
            :value="tokenPlayed.value"
            @click="remove($event)"
            :disabled="!canRemove()"
            class="absolute z-50"
          />
        </TransitionGroup>
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
        <span
          v-for="(token, idx) in tokens"
          :key="idx"
          :ref="tokensRefStack.tokensRef"
          :data-value="token.value"
          class="token"
        >
          <PhPokerChipFill
            :variant="token.variant"
            :value="token.value"
            @click="addCredits(token)"
            v-show="isTokenVisible(token)"
          >
          </PhPokerChipFill>
        </span>
      </div>
    </div>
  </TheCard>
</template>

<script setup lang="ts">
import TheCard from "@/components/misc/TheCard.vue";
import TheButton from "@/components/misc/TheButton.vue";
import PhPokerChipFill from "@/components/icons/PhPokerChipFill.vue";
import { useGameStore } from "@/store/game";
import { useCreditStore } from "@/store/credits";
import { computed, ref } from "vue";
import { useTokenStore } from "@/store/token";
import type { Token } from "@/store/token";
import anime from "animejs";

// Using stores
const gameStore = useGameStore();
const creditStore = useCreditStore();
const tokenStore = useTokenStore();

const tokens = computed(() => tokenStore.all);
const tokensPlayed = ref([] as Token[]);

const tokensRef = ref([]);

const tokensRefStack = { tokensRef };

const listPlayedChips = ref(null);

const isRemoving = ref(false);

// Credits states
const currentCredits = computed(() => creditStore.getCredits);
const currentlyCreditsSet = computed(() => gameStore.getPlayersBet);

const addCredits = (token: Token) => {
  if (currentCredits.value >= token.value) {
    const newBet = currentlyCreditsSet.value + token.value;
    gameStore.setBet(newBet);
    subtractPlayerCredits(token.value);
    tokensPlayed.value.push(token);
  }
};

// Animation
const tokenEnter = (el: any) => {
  // const lastPlayedToken = tokensPlayed.value[tokensPlayed.value.length - 1];

  // Get token from tokens list by value
  const token = tokensRefStack.tokensRef.value.find(
    (t) =>
      t.getAttribute("data-value") === getLastTokenPlayed().value.toString()
  );

  const x =
    token.getBoundingClientRect().x -
    listPlayedChips.value.getBoundingClientRect().x;
  const y =
    token.getBoundingClientRect().y -
    listPlayedChips.value.getBoundingClientRect().y;

  anime({
    targets: el,
    translateX: x,
    translateY: y,
    direction: "reverse",
    duration: 500,
    easing: "easeInOutSine",
  });
};

const isTokenVisible = (token: Token) => {
  return currentCredits.value - token.value >= 0;
};

const subtractPlayerCredits = (creditsToBeSubtracted: number) => {
  if (currentCredits.value >= creditsToBeSubtracted) {
    creditStore.subtractCredits(creditsToBeSubtracted);
  }
};

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

const remove = async (event: any) => {
  const lastTokenPlayed = getLastTokenPlayed();
  if (lastTokenPlayed && !isRemoving.value) {
    isRemoving.value = true;
    const newBet = currentlyCreditsSet.value - lastTokenPlayed.value;
    gameStore.setBet(newBet);
    creditStore.addCredits(lastTokenPlayed.value);

    // Avoid cursor pointer when it's last token
    if (tokensPlayed.value.length === 1) {
      event.target.style.cursor = "default";
    }

    // Fade out token
    anime({
      targets: event.target,
      opacity: [1, 0],
      easing: "easeOutExpo",
      duration: 250,
      begin: () => {
        isRemoving.value = true;
      },
      complete: () => {
        if (canRemove()) {
          tokensPlayed.value.pop();
        }
        isRemoving.value = false;
      },
    });
  }
};

const canRemove = () => {
  return tokensPlayed.value.length > 0;
};
</script>
