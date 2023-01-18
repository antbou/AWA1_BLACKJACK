<template>
  <button
    class="rounded-full sm:w-16 sm:h-16 w-12 h-12 border-4 border-slate-400 sm:text-2xl text-xs mx-px"
    :style="{ backgroundColor: bgColor }"
    :class="textColor"
  >
    {{ props.value }}
  </button>
</template>

<script setup lang="ts">
import { useTokenStore } from "@/store/token";
import { computed } from "vue";
import type { ColorVariants } from "@/store/token";

const tokenStore = useTokenStore();

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  variant: {
    type: String,
    required: true,
  },
});

const bgColor = computed(() => {
  return tokenStore.tokenColor(props.variant as ColorVariants);
});

const textColor = computed(() => {
  console.log(props.variant);
  return props.variant === "light" ? "text-black  " : "text-white";
});
</script>
