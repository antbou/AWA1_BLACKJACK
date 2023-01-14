<template>
  <TheNavbar />
  <div id="app">
    <router-view />
  </div>
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
