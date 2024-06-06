import { configureStore } from '@reduxjs/toolkit';
import { togglesSlice } from '@store/features/toggles/togglesSlice';
import { createSessionPersistMiddleware } from '@store/session-persist';

import { toastsSlice } from './features/toasts/toastsSlice';
import { varslerSlice } from './features/varsler/varslerSlice';

export const makeStore = () => {
    const sessionStorageMiddleware = createSessionPersistMiddleware();

    return configureStore({
        reducer: {
            toggles: togglesSlice.reducer,
            varsler: varslerSlice.reducer,
            toasts: toastsSlice.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(sessionStorageMiddleware.middleware),
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
