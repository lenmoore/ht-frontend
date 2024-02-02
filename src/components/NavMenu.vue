<template>

    <nav>
        <RouterLink v-for="link in menuLinks" :key="link.name" :to="{ name: link.name }">{{ link.name }} |
        </RouterLink>
    </nav>
</template>
<script>
export default {
    name: 'NavMenu',
    computed: {
        isAdmin() {
            return localStorage.admin;
        },
        isActor() {
            return localStorage.actor;
        },

        groupName() {
            return localStorage.group_name;
        },
        menuLinks() {
            if (this.isAdmin) {
                return [{name: 'games'}, {name: 'performances'}];
            } else if (this.isActor) {
                return [{name: 'dashboard', query: {group: this.groupName}}];
            } else {
                return [{name: 'visitor', query: {group: this.groupName}}];
            }
        },
    }
};
</script>