import React from 'react';

import { Loader } from '@navikt/ds-react';

import { ToastObject } from '@store/features/toasts/toastsSlice';

export const kalkulererToastKey = 'kalkulererToast';

export const kalkulererFerdigToastKey = 'kalkulererFerdigToast';

export const kalkulererToast = ({
    message = 'Kalkulerer endringer',
    callback,
    timeToLiveMs,
}: Partial<ToastObject>): ToastObject => ({
    key: kalkulererToastKey,
    loading: true,
    message,
    callback,
    timeToLiveMs,
});

export const kalkuleringFerdigToast = ({
    message = 'Oppgaven er ferdig kalkulert',
    timeToLiveMs = 5000,
    callback,
}: Partial<ToastObject>): ToastObject => ({
    key: kalkulererFerdigToastKey,
    message,
    callback,
    timeToLiveMs,
});
