<template>
  
  </template>
  
  <script>
  import * as THREE from 'three'
  import Net from 'vanta/src/vanta.net'
  export default {   
    name: "hello",
    data() {
      return {
        
      };
    },
    mounted() {
      this.vantaEffect = Net({
        el: this.$refs.vantaRef,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xf2f5f7,
        backgroundColor: 0xbebecc,
        points: 9.00,
        maxDistance: 21.00
      })
    },
    beforeDestroy() {
      if (this.vantaEffect) {
        this.vantaEffect.destroy()
      }
    },
    methods: {
      
    },
  
  };
  </script>
  
  <style>
  .my_title{
    z-index: 999;
    position: fixed;
    top: 40%;
    left: 10%;
    color: aquamarine;
    font-size: 100px;
    font-weight: bolder;
  }
  </style>
  