<template>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <type/>
  <!-- 粒子背景组件 -->
   <vue-particles id="tsparticles" @particles-loaded="particlesLoaded" url="http://foo.bar/particles.json" />
   <vue-particles
         id="tsparticles"
         @particles-loaded="particlesLoaded"
         :options="{
           background: {
             color: {
               value: '#f9fcfc',
             },
           },
           fpsLimit: 120,
           interactivity: {
             events: {
               onClick: {
                 enable: true,
                 mode: 'push',
               },
               onHover: {
                 enable: true,
                 mode: 'repulse',
               },
             },
             modes: {
               bubble: {
                 distance: 150,
                 duration: 2,
                 opacity: 0.9,
                 size: 60,
               },
               push: {
                 quantity: 4,
               },
               repulse: {
                 distance: 200,
                 duration: 0.4,
               },
             },
           },
           particles: {
             color: {
               value: '#4f6a6f',
             },
             links: {
               color: '#4f6a6f',
               distance: 150,
               enable: true,
               opacity: 1.0,
               width: 2,
             },
             move: {
               direction: 'none',
               enable: true,
               outModes: 'bounce',
               random: false,
               speed: 6,
               straight: false,
             },
             number: {
               density: {
                 enable: true,
               },
               value: 60,
             },
             opacity: {
               value: 0.7,
             },
             shape: {
               type: 'circle',
             },
             size: {
               value: { min: 1, max: 5 },
             },
           },
           detectRetina: true,
         }"
     />
 </template>
 
 <script setup lang="ts">
 import type from "@/components/type.vue"
import type { Opacity } from "tsparticles-engine";
 const particlesLoaded = async container => {
     console.log("Particles container loaded", container);
 };
 </script>
 
 <style>
 .particles-bg {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     z-index: -100; /* 确保粒子背景在底层 */
   }
 </style>
 