import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { togglesSlice } from '@store/features/toggles/togglesSlice';
import { RootState } from '@store/store';

export function createSessionPersistMiddleware() {
    const localStorageMiddleware = createListenerMiddleware();

    localStorageMiddleware.startListening({
        matcher: isAnyOf(
            togglesSlice.actions.toggleTotrinnsvurdering,
            togglesSlice.actions.toggleOverrideReadonly,
            togglesSlice.actions.toggleKanFrigiOppgaver,
            togglesSlice.actions.toggleReadonly,
        ),
        effect: (action, listenerApi) => {
            const state = listenerApi.getState() as RootState;
            sessionStorage.setItem('toggles', JSON.stringify(state.toggles));
        },
    });

    return localStorageMiddleware;
}
