import { ReactNode } from 'react';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface ToastObject {
    key: string;
    message: string;
    timeToLiveMs?: number;
    loading?: boolean;
    variant?: 'success' | 'error';
    callback?: () => void;
}

const initialState: ToastObject[] = [];

export const toastsSlice = createSlice({
    name: 'toasts',
    initialState: initialState,
    reducers: {
        addToast: (toasts, { payload: toast }: PayloadAction<ToastObject>) => [
            ...toasts.filter((it) => it.key !== toast.key),
            toast,
        ],
        removeToast: (toasts, { payload: key }: PayloadAction<string>) => toasts.filter((toast) => toast.key !== key),
        removeByMessage: (toasts, { payload: message }: PayloadAction<string>) =>
            toasts.filter((toast) => toast.message !== message),
    },
});

export const addToast = createAsyncThunk('toasts/addToast', async (toast: ToastObject, { dispatch }) => {
    dispatch(toastsSlice.actions.addToast(toast));

    // TODO: Doesn't handle multiple toasts with the same key
    if (toast.timeToLiveMs) {
        setTimeout(() => {
            dispatch(toastsSlice.actions.removeToast(toast.key));
        }, toast.timeToLiveMs);
    }
});
