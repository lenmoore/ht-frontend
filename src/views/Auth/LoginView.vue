<template>
    <div>
        <h1>Logi sisse</h1>

        <form @submit.prevent="clickLogin">
            <div>
                <label for="email">Nimi</label>
                <input type="text" id="email" v-model="email"/>
            </div>
            <div>
                <label for="password">Parool</label>
                <input type="password" id="password" v-model="password"/>
            </div>
            <button type="submit">Logi sisse</button>
        </form>
    </div>
</template>

<script>
import {mapActions} from "pinia";
import {useAuthStore} from "../../store/auth.ts";
import router from "../../router/index.ts";

export default {
    name: 'LoginView',
    data() {
        return {
            email: '',
            password: '',
        };
    },

    methods: {
        ...mapActions(useAuthStore, {
            login: 'login',
        }),
        async clickLogin() {
            if (this.email.length && this.password.length) {
                try {
                    console.log(this.email, this.password);
                    const user = await this.login(this.email, this.password);
                    if (user) {

                        await router.push({name: 'dashboard'});
                    }

                } catch (error) {
                    console.error(error);
                }
            }
        },
    },
};
</script>