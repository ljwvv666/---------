<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import FunctionalPoint from "./components/functionalPointAnalysis/functionalPoint.vue";

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
