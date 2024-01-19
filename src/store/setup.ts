import { defineStore } from 'pinia';

interface SetupStoreState {

}

export const useSetupStore = defineStore('setup', {
    state: (): SetupStoreState => ({}),

    actions: {
        // createPhaseAndGame
        // editPhaseAndGame
        // deletePhaseAndGame

        // addGameStepTask
        // editGameStepTask
        // deleteGameStepTask
    },
});