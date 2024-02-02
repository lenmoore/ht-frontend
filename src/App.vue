<template>
    <div>
        <div>
            development links:
            <div class="nav">
                <RouterLink :to="{ name: 'visitor'} ">visitor view</RouterLink>
                <RouterLink :to="{ name: 'dashboard'} ">actor dash</RouterLink>
                <RouterLink :to="{ name: 'games'} ">games</RouterLink>
                <RouterLink :to="{ name: 'performances'} ">performances</RouterLink>
            </div>
        </div>

        <div>

            camera tutorial:
            <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element"
            >here</a
            >
        </div>

        <RouterView/>
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
</script>