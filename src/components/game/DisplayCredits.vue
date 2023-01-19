<template><span ref="creditRef"> </span></template>

<script setup lang="ts">
import { onMounted, onUpdated, ref } from "vue";
import anime from "animejs";

const creditRef = ref(null as any);

const props = defineProps({
  lastCredits: {
    type: Number,
    default: 0,
  },
  nextCredits: {
    type: Number,
    default: 0,
  },
  symbol: {
    type: String,
    default: "$",
  },
});

onUpdated(() => {
  AnimateMonney();
});
onMounted(() => {
  AnimateMonney();
});

const AnimateMonney = () => {
  anime({
    targets: creditRef.value,
    innerHTML: [props.lastCredits, props.nextCredits + " " + props.symbol],
    round: 1,
    easing: "linear",
    duration: 400,
  });
};
</script>
