import { ToastObject, toastsSlice } from '@store/features/toasts/toastsSlice';
import { useAppDispatch } from '@store/hooks';

export const useAddToast = () => {
    const dispatch = useAppDispatch();

    return (toast: ToastObject) => {
        dispatch(toastsSlice.actions.addToast(toast));
    };
};

export const useRemoveToast = () => {
    const dispatch = useAppDispatch();

    return (key: string) => {
        dispatch(toastsSlice.actions.removeToast(key));
    };
};
