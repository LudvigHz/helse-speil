import { RecoilWrapper } from '@test-wrappers';
import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { Kildetype, Opptegnelsetype, OverstyrDagerMutationDocument } from '@io/graphql';
import { postAbonnerPåAktør } from '@io/http';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useCurrentPerson } from '@state/person';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { renderHook, waitFor } from '@testing-library/react';

import { tilOverstyrteDager, useOverstyrDager } from './useOverstyrDager';

jest.mock('@state/person');
jest.mock('@state/arbeidsgiver');
jest.mock('@state/toasts');
jest.mock('@state/opptegnelser');
jest.mock('@io/http');

const AKTØR_ID = 'aktørId';
const FØDSELSNUMMER = 'fødselsnummer';
const ORGNUMMER = 'orgnummer';
const VEDTAKSPERIODE_ID = 'vedtaksperiode';
const BEGRUNNELSE = 'begrunnelse';

(useCurrentPerson as jest.Mock).mockReturnValue({
    aktorId: AKTØR_ID,
    fodselsnummer: FØDSELSNUMMER,
});

(useCurrentArbeidsgiver as jest.Mock).mockReturnValue({
    organisasjonsnummer: ORGNUMMER,
});

(useAddToast as jest.Mock).mockReturnValue(() => {
    //do nothing
});

(useRemoveToast as jest.Mock).mockReturnValue(() => {
    //do nothing
});
(useSetOpptegnelserPollingRate as jest.Mock).mockReturnValue(() => {
    //do nothing
});
(useOpptegnelser as jest.Mock).mockReturnValue([]);
(postAbonnerPåAktør as jest.Mock).mockReturnValue(Promise.resolve());

describe('useOverstyrDager', () => {
    test('skal ha state initial ved oppstart', async () => {
        const { result } = renderHook(useOverstyrDager, {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
        });
        expect(result.current.state).toBe('initial');
    });
    test('skal ha state hasValue etter posting av korrekt overstyring', async () => {
        const { result, rerender } = renderHook(useOverstyrDager, {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
        });

        const { postOverstyring } = result.current;
        await postOverstyring(dager, oversyrteDager, BEGRUNNELSE, VEDTAKSPERIODE_ID);

        rerender();
        const { state } = result.current;

        await waitFor(() => expect(state).toBe('hasValue'));
    });
    test('skal ha state done etter person er oppdatert', async () => {
        const { result, rerender } = renderHook(useOverstyrDager, {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
        });

        const { postOverstyring } = result.current;
        await postOverstyring(dager, oversyrteDager, BEGRUNNELSE, VEDTAKSPERIODE_ID);

        (useCurrentPerson as jest.Mock).mockReturnValue({
            aktorId: AKTØR_ID,
            fodselsnummer: FØDSELSNUMMER,
            noeNytt: 'yolo',
        });
        (useOpptegnelser as jest.Mock).mockReturnValue([
            {
                aktørId: AKTØR_ID,
                sekvensnummer: 1,
                type: Opptegnelsetype.NySaksbehandleroppgave,
                payload: { huskerIkke: 'shrug' },
            },
        ]);

        rerender();
        const { state } = result.current;
        await waitFor(() => expect(state).toBe('done'));
    });
    test('skal ha state hasError hvis ovberstyring ikke virker', async () => {
        const { result, rerender } = renderHook(useOverstyrDager, {
            wrapper: ({ children }) => (
                <MockedProvider mocks={mocks}>
                    <RecoilWrapper>{children}</RecoilWrapper>
                </MockedProvider>
            ),
        });

        const { postOverstyring } = result.current;
        await postOverstyring([], [], BEGRUNNELSE, 'en feil');

        rerender();
        const { state, error } = result.current;
        await waitFor(() => expect(state).toBe('hasError'));
        await waitFor(() => expect(error).not.toBeNull());
    });
});

const dager: Utbetalingstabelldag[] = [
    {
        dag: {
            overstyrtDagtype: 'Sykedag',
            speilDagtype: 'Syk',
            visningstekst: 'Syk',
        },
        dato: '2020-01-01',
        grad: 100,
        kilde: { id: '1', type: Kildetype.Soknad },
        erForeldet: false,
        erAGP: false,
        erAvvist: false,
        erMaksdato: false,
    },
];
const oversyrteDager: Utbetalingstabelldag[] = [
    {
        dag: {
            overstyrtDagtype: 'Feriedag',
            speilDagtype: 'Ferie',
            visningstekst: 'Ferie',
        },
        dato: '2020-01-01',
        grad: undefined,
        kilde: { id: '2', type: Kildetype.Saksbehandler },
        erForeldet: false,
        erAGP: false,
        erAvvist: false,
        erMaksdato: false,
    },
];
const mocks = [
    {
        request: {
            query: OverstyrDagerMutationDocument,
            variables: {
                overstyring: {
                    aktorId: AKTØR_ID,
                    fodselsnummer: FØDSELSNUMMER,
                    organisasjonsnummer: ORGNUMMER,
                    dager: tilOverstyrteDager(dager, oversyrteDager),
                    begrunnelse: BEGRUNNELSE,
                    vedtaksperiodeId: VEDTAKSPERIODE_ID,
                },
            },
        },
        result: {
            data: {
                overstyrDager: true,
            },
        },
    },
    {
        request: {
            query: OverstyrDagerMutationDocument,
            variables: {
                overstyring: {
                    aktorId: AKTØR_ID,
                    fodselsnummer: FØDSELSNUMMER,
                    organisasjonsnummer: ORGNUMMER,
                    dager: [],
                    begrunnelse: BEGRUNNELSE,
                    vedtaksperiodeId: 'en feil',
                },
            },
        },
        error: new Error('en feil'),
    },
];
