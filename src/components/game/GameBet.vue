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
            @click="removeCredits($event)"
            :disabled="!canRemoveToken()"
            class="absolute z-50"
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
        class="font-montserrat sm:w-full sm:h-16 w-2/4 h-12 col-span-2 sm:col-span-1 rounded-full"
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
import { TransitionGroup, computed, onMounted, ref } from "vue";
import { useTokenStore } from "@/store/token";
import type { Token } from "@/store/token";
import anime from "animejs";
import DisplayCredits from "@/components/game/DisplayCredits.vue";

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
const lastCreditsInBank = ref(0);
const lastCreditsBet = ref(0);
const creditsInBank = computed(() => creditStore.getCredits);
const creditsBet = computed(() => gameStore.getPlayersBet);

onMounted(() => {
  const orderedTokens = [...tokens.value].sort((a, b) => b.value - a.value);
  console.log(orderedTokens);

  let credits = creditsBet.value;
  // sort tokens by value desc
  while (credits > 0) {
    // substract credits from tokens list to know which tokens to show
    orderedTokens.forEach((token) => {
      if (credits >= token.value) {
        credits -= token.value;
        AddPlayedToken(token);
      }
    });
  }
});

const AddPlayedToken = (token: Token) => {
  tokensPlayed.value.push(token);
};

const addCredits = (token: Token) => {
  console.log("addCredits");
  if (creditsInBank.value >= token.value) {
    const newBet = creditsBet.value + token.value;
    lastCreditsInBank.value = creditsInBank.value;
    lastCreditsBet.value = creditsBet.value;
    gameStore.setBet(newBet);
    subtractPlayerCredits(token.value);
    AddPlayedToken(token);
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
        value: "+=0.8turn", // 0 + 2 = '2turn'
        duration: 300,
        easing: "easeInOutSine",
      },
    });
  }
};

const canRemoveToken = () => {
  return tokensPlayed.value.length > 0;
};

// Animation
const tokenEnter = (el: any) => {
  // const lastPlayedToken = tokensPlayed.value[tokensPlayed.value.length - 1];

  // Get token from tokens list by value
  const token = tokensRefStack.tokensRef.value.find(
    (t) => t.getAttribute("data-value") === lastTokenPlayed().value.toString()
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
  return creditsInBank.value - token.value >= 0;
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
  if (newBet > 0 && creditsInBank.value >= 1 && creditsInBank.value >= newBet) {
    creditStore.subtractCredits(newBet);
    gameStore.setBet(newBet);
    gameStore.startGame();
  }
};

// Reset credits
const resetCredits = () => {
  creditStore.resetCredits();
};

const lastTokenPlayed = (): Token => {
  return tokensPlayed.value[tokensPlayed.value.length - 1];
};
</script>
