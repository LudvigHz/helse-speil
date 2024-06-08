import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const anonymiseringSlice = createSlice({
    name: 'anonymisering',
    initialState: false,
    reducers: {
        toggle: (state) => !state,
        set: (_, action: PayloadAction<boolean>) => action.payload,
    },
});
