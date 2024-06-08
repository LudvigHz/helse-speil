import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { anonymiseringSlice } from '@store/features/anonymisering/anonymiseringSlice';
import { togglesSlice } from '@store/features/toggles/togglesSlice';
import { RootState } from '@store/store';

export function createSessionPersistMiddleware() {
    const sessionMiddleware = createListenerMiddleware();

    sessionMiddleware.startListening({
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

    sessionMiddleware.startListening({
        matcher: isAnyOf(anonymiseringSlice.actions.toggle),
        effect: (action, listenerApi) => {
            const state = listenerApi.getState() as RootState;
            sessionStorage.setItem('anonymisering', JSON.stringify(state.anonymisering));
        },
    });

    return sessionMiddleware;
}
