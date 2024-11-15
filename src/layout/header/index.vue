<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="navbar">
    <div class="title"><h2>软件造价评估系统</h2></div>
    <Breadcrumb />
    <div class="navbar-right">
      <avatar />
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from "./components/breadcrumb.vue";
import avatar from "./components/avatar.vue";

</script>

<style>
.title {
  margin-right: 60px;
}
.navbar {
  width: 100%;
  height: 60px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 16px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  .navbar-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    ::v-deep .navbar-item {
      display: inline-block;
      margin-left: 18px;
      font-size: 22px;
      color: #5a5e66;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
}
</style>
