'use client';

import { useRef } from 'react';

import { togglesSlice } from '@store/features/toggles/togglesSlice';

import { AppStore, makeStore } from './store';

type Bruker = {
    ident: string;
    grupper: string[];
};

export const useStore = ({ ident, grupper }: Bruker): AppStore => {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        storeRef.current = makeStore();
        storeRef.current.dispatch(togglesSlice.actions.init({ grupper, ident }));
    }
    return storeRef.current;
};
