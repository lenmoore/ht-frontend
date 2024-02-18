<template>
  <div>
    Let's see if a handwritten bash script works instead maybe. Or maybe not
    <NavMenu />
    <!--        <div>-->

    <!--            camera tutorial:-->
    <!--            <a-->
    <!--                href="https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element"-->
    <!--            >here</a-->
    <!--            >-->
    <!--        </div>-->

    <RouterView class="container" />
    <footer>:)</footer>
  </div>
</template>

<style lang="scss">
.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  align-items: center;

  a {
    padding: 1rem;
  }
}
</style>
<script setup lang="ts">
import NavMenu from "./components/NavMenu.vue";
</script>
