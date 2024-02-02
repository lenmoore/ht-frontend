<template>
    <div>
        <div class="group-overview">
            <button disabled class="bg-purple">
                Maakler
            </button>
            <button disabled class="bg-purple">
                Stalker
            </button>
            <button disabled class="bg-purple">
                Korraldaja
            </button>
            <button disabled class="bg-purple">
                Esoteerik
            </button>
            <button @click="router.push({ name: 'groups', params: { group: 'sakala'} })" class="bg-purple">
                Sakala
            </button>
        </div>

        <RouterView/>
    </div>
</template>
<script setup lang="ts">
import router from '../../../router/index.js';
</script>

<style lang="scss">
.group-overview {
    display: flex;
    width: 100%;
}
</style>