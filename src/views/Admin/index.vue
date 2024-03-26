<template>
  <div>
    <NavMenu />
    <RouterView style="padding-bottom: 10rem" />
  </div>
</template>
<script setup lang="ts">
import NavMenu from "../../components/NavMenu.vue";
</script>
