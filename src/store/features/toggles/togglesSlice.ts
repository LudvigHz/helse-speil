import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { harBeslutterrolle, kanFrigiAndresOppgaver } from '@utils/featureToggles';

export type TotrinnsvurderingState = {
    erAktiv: boolean;
    harBeslutterrolle: boolean;
    kanBeslutteEgne: boolean;
};

type ReadonlyState = {
    value: boolean;
    override: boolean;
};

type Toggles = {
    totrinnsvurdering: TotrinnsvurderingState;
    kanFrigiOppgaver: boolean;
    readonly: ReadonlyState;
};

const initialState: Toggles = {
    totrinnsvurdering: {
        erAktiv: true,
        harBeslutterrolle: false,
        kanBeslutteEgne: false,
    },
    readonly: {
        value: false,
        override: false,
    },
    kanFrigiOppgaver: false,
};

export const togglesSlice = createSlice({
    name: 'toggles',
    initialState: (): Toggles => {
        if (typeof window === 'undefined') return initialState;

        const init = sessionStorage.getItem('toggles');
        if (init) return JSON.parse(init);
        return initialState;
    },
    reducers: {
        init: (state, { payload }: PayloadAction<{ grupper: string[]; ident: string }>) => {
            state.totrinnsvurdering.harBeslutterrolle = harBeslutterrolle(payload.grupper);
            state.kanFrigiOppgaver = kanFrigiAndresOppgaver(payload.ident);
        },
        toggleTotrinnsvurdering: (state, { payload }: PayloadAction<keyof TotrinnsvurderingState>) => {
            state.totrinnsvurdering[payload] = !state.totrinnsvurdering[payload];
        },
        toggleKanFrigiOppgaver: (state) => {
            state.kanFrigiOppgaver = !state.kanFrigiOppgaver;
        },
        toggleReadonly: (state) => {
            state.readonly.value = !state.readonly.value;
        },
        toggleOverrideReadonly: (state) => {
            state.readonly.override = !state.readonly.override;
        },
    },
});
