<template>
  <TheCard class="mt-16 sm:mt-32 flex items-center flex-col">
    <div class="flex flex-col items-center mb-2">
      <p>Start the game after you set your bet.</p>
    </div>

    <div
      class="grid grid-rows-2 sm:grid-rows-1 grid-cols-2 sm:grid-cols-3 gap-x-3 place-items-center mt-3 gap-y-4"
    >
      <div class="relative place-self-end token" ref="listTokensPlayed">
        <TransitionGroup
          name="tokenTransition"
          @enter="tokenEnter"
          appear
          @appear="tokenEnter"
        >
          <PhPokerChipFill
            v-for="(tokenPlayed, index) in tokensPlayed"
            :key="index"
            :variant="tokenPlayed.variant"
            :value="tokenPlayed.value"
            @click="removeCredits($event)"
            :disabled="!canRemoveToken()"
            class="absolute"
          />
        </TransitionGroup>
      </div>
      <div class="w-full sm:text-center text-left">
        <DisplayCredits
          :next-credits="creditsBet"
          :last-credits="lastCreditsBet"
        />
      </div>

      <TheButton
        class="font-montserrat sm:w-full sm:h-16 w-2/4 h-12 col-span-2 sm:col-span-1"
        :disabled="creditsBet <= 0"
        @click="startGame"
        >Play</TheButton
      >
    </div>
  </TheCard>
  <TheCard class="mt-5">
    <div class="flex flex-col">
      <div class="flex flex-col items-center mb-2">
        <p class="text-4xl md:text-5xl mb-4"></p>
        <p>Banks</p>
        <DisplayCredits
          :next-credits="creditsInBank"
          :last-credits="lastCreditsInBank"
        />
      </div>
      <div
        class="grid grid-rows-2 sm:grid-rows-1 grid-cols-3 sm:grid-cols-6 gap-x-2 place-items-center mt-3 gap-y-2"
      >
        <TransitionGroup name="tokenDeckEnter" appear @appear="tokenDeckEnter">
          <div
            v-for="(token, idx) in tokens"
            :key="idx"
            :ref="tokensRefStack.tokensRef"
            :data-value="token.value"
            :data-index="idx"
            class="token"
          >
            <PhPokerChipFill
              :key="token.value"
              :variant="token.variant"
              :value="token.value"
              @click="addCredits(token)"
              v-show="isTokenVisible(token)"
            >
            </PhPokerChipFill>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </TheCard>
</template>

<script setup lang="ts">
import TheCard from "@/components/misc/TheCard.vue";
import TheButton from "@/components/misc/TheButton.vue";
import PhPokerChipFill from "@/components/game/PokerToken.vue";
import { useGameStore } from "@/store/game";
import { useCreditStore } from "@/store/credits";
import { TransitionGroup, computed, ref } from "vue";
import { useTokenStore } from "@/store/token";
import type { Token } from "@/store/token";
import DisplayCredits from "@/components/game/DisplayCredits.vue";
import anime from "animejs";

// Using stores
const gameStore = useGameStore();
const creditStore = useCreditStore();
const tokenStore = useTokenStore();

const tokens = ref(tokenStore.all);
const tokensPlayed = computed(() => tokenStore.allTokensPlayed);

const tokensRef = ref([] as any);
const tokensRefStack = { tokensRef };

const listTokensPlayed = ref(null as any);

const isRemoving = ref(false);

// Credits states
const lastCreditsInBank = ref(0);
const lastCreditsBet = ref(0);
const creditsInBank = computed(() => creditStore.getCredits);
const creditsBet = computed(() => gameStore.getPlayersBet);

const addCredits = (token: Token) => {
  if (creditsInBank.value >= token.value) {
    const newBet = creditsBet.value + token.value;
    lastCreditsInBank.value = creditsInBank.value;
    lastCreditsBet.value = creditsBet.value;
    gameStore.setBet(newBet);
    subtractPlayerCredits(token.value);
    tokenStore.addTokenPlayed(token);
  }
};

const removeCredits = async (event: any) => {
  if (lastTokenPlayed() && !isRemoving.value) {
    isRemoving.value = true;
    const newBet = creditsBet.value - lastTokenPlayed().value;
    lastCreditsInBank.value = creditsInBank.value;
    lastCreditsBet.value = creditsBet.value;
    gameStore.setBet(newBet);
    creditStore.addCredits(lastTokenPlayed().value);

    // Avoid cursor pointer when it's last token
    if (tokensPlayed.value.length === 1) {
      event.target.style.cursor = "default";
    }

    // Fade out token
    anime({
      targets: event.target,
      opacity: [1, 0],
      easing: "easeInOutSine",
      duration: 300,
      begin: () => {
        isRemoving.value = true;
      },
      complete: () => {
        if (canRemoveToken()) {
          tokensPlayed.value.pop();
        }
        isRemoving.value = false;
      },
      rotate: {
        value: "+=0.8turn",
        duration: 300,
        easing: "easeInOutSine",
      },
    });
  }
};

const canRemoveToken = () => {
  return tokensPlayed.value.length > 0;
};

const subtractPlayerCredits = (creditsToBeSubtracted: number) => {
  if (creditsInBank.value >= creditsToBeSubtracted) {
    creditStore.subtractCredits(creditsToBeSubtracted);
  }
};

// Set credits and start game
const startGame = () => {
  const newBet = creditsBet.value;

  // Bet needs to be set more than 0 credits and player need to have at least the smallest bet
  if (creditsInBank.value >= 0 && newBet >= 1) {
    subtractPlayerCredits(newBet);
    gameStore.setBet(newBet);
    gameStore.startGame();
  }
};

const lastTokenPlayed = (): Token => {
  return tokensPlayed.value[tokensPlayed.value.length - 1];
};

// Animation
const tokenEnter = (el: any) => {
  const token = tokensRefStack.tokensRef.value.find(
    (t: HTMLElement) =>
      t.getAttribute("data-value") === lastTokenPlayed().value.toString()
  );

  const x =
    token.getBoundingClientRect().x -
    listTokensPlayed.value.getBoundingClientRect().x;
  const y =
    token.getBoundingClientRect().y -
    listTokensPlayed.value.getBoundingClientRect().y;

  anime({
    targets: el,
    translateX: x,
    translateY: y,
    direction: "reverse",
    duration: 500,
    easing: "easeInOutSine",
  });
};

const tokenDeckEnter = (el: any) => {
  const x = window.innerWidth - el.getBoundingClientRect().x - 100;
  anime({
    targets: el.firstChild,
    translateX: [x, 0],
    opacity: {
      value: [0, 1],
      duration: 2000,
      easing: "easeInOutSine",
    },
    duration: 1000,
  });
};

const isTokenVisible = (token: Token) => {
  return creditsInBank.value - token.value >= 0;
};
</script>
