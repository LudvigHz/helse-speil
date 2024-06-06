import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SpeilError } from '@utils/error';

type VarslerState = SpeilError[];

const initialState: VarslerState = [];

export const varslerSlice = createSlice({
    name: 'varsler',
    initialState: initialState,
    reducers: {
        leggTilVarsel: (varsler, { payload }: PayloadAction<SpeilError>) => [
            ...varsler.filter((it) => it.name !== payload.name),
            payload,
        ],
        fjernVarsel: (varsler, { payload: name }: PayloadAction<string>) => varsler.filter((it) => it.name !== name),
        ryddVarselForPathname: (varsler, { payload: pathname }: PayloadAction<string>) =>
            varsler.filter((it) => it.scope === pathname || (it.name === 'tildeling' && pathname !== '/')),
    },
});
