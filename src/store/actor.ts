import { defineStore } from 'pinia';

interface ActorStoreState {

}

export const useActorStore = defineStore('actor', {
    state: (): ActorStoreState => ({}),
});