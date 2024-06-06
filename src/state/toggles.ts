import { TotrinnsvurderingState, togglesSlice } from '@store/features/toggles/togglesSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

export const useTotrinnsvurdering = () => {
    const dispatch = useAppDispatch();
    const totrinnsvurdering = useAppSelector((state) => state.toggles.totrinnsvurdering);

    return [
        totrinnsvurdering,
        (key: keyof TotrinnsvurderingState) => () => dispatch(togglesSlice.actions.toggleTotrinnsvurdering(key)),
    ] as const;
};

export const useHarBeslutterrolle = (): boolean =>
    useAppSelector((state) => state.toggles.totrinnsvurdering).harBeslutterrolle;

export const useTotrinnsvurderingErAktiv = (): boolean =>
    useAppSelector((state) => state.toggles.totrinnsvurdering).erAktiv;

export const useKanBeslutteEgneOppgaver = (): boolean =>
    useAppSelector((state) => state.toggles.totrinnsvurdering).kanBeslutteEgne;

export const useKanFrigiOppgaver = (): boolean => useAppSelector((state) => state.toggles.kanFrigiOppgaver);

export const useToggleKanFrigiOppgaver = () => {
    const dispatch = useAppDispatch();
    const value = useAppSelector((state) => state.toggles.kanFrigiOppgaver);

    return [value, () => dispatch(togglesSlice.actions.toggleKanFrigiOppgaver())] as const;
};

export const useReadonly = () => useAppSelector((state) => state.toggles.readonly);

export const useToggleReadonly = () => {
    const dispatch = useAppDispatch();
    const readonly = useReadonly();

    const toggleValue = (): void => {
        if (readonly.override) {
            dispatch(togglesSlice.actions.toggleReadonly());
        }
    };

    const toggleOverride = (): void => {
        dispatch(togglesSlice.actions.toggleOverrideReadonly());
    };

    return [readonly, toggleValue, toggleOverride] as const;
};
