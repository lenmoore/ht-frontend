<template>
  <div>
    <RouterView class="container" />
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
