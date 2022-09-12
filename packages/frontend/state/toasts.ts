import { ReactNode } from 'react';
import { atom, useSetRecoilState } from 'recoil';

export interface ToastObject {
    key: string;
    message: ReactNode;
    timeToLiveMs?: number;
    variant?: 'success' | 'error';
    callback?: () => void;
}

export const useAddToast = () => {
    const setToasts = useSetRecoilState(toastsState);

    return (toast: ToastObject) => {
        setToasts((staleToasts) => [...staleToasts.filter((it) => it.key !== toast.key), toast]);
    };
};

export const useRemoveToast = () => {
    const setToasts = useSetRecoilState(toastsState);

    return (key: string) => {
        setToasts((staleToasts) => staleToasts.filter((toast) => toast.key !== key));
    };
};

export const toastsState = atom<ToastObject[]>({
    key: 'toastsState',
    default: [],
    effects: [
        ({ setSelf, onSet }) => {
            onSet((newValue, oldValue) => {
                if (!Array.isArray(oldValue) || oldValue.length > newValue.length) {
                    return;
                }

                const newToast = newValue.at(-1);

                if (typeof newToast?.timeToLiveMs === 'number') {
                    setTimeout(() => {
                        setSelf((staleToasts) => {
                            if (!Array.isArray(staleToasts)) {
                                return staleToasts;
                            }
                            return staleToasts.filter((toast) => toast.key !== newToast.key);
                        });
                    }, newToast.timeToLiveMs);
                }
            });
        },
    ],
});
