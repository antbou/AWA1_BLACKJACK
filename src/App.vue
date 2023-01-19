<template class="h-screen">
  <TheNavbar />
  <router-view />
</template>

<script setup lang="ts">
import TheNavbar from "@/components/layout/TheNavbar.vue";
</script>

<style>
/* Default font */
body {
  font-family: "Roboto";
}
</style>
