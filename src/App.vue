<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <router-view />
  <div id="app">
  </div>
</template>

<style >
html,body,#app{
  margin: 0;
  padding: 0;
  height:100%;
}
</style>
