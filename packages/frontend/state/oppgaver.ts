import dayjs from 'dayjs';

import { ApolloError, useQuery } from '@apollo/client';
import { FerdigstiltOppgave, FetchBehandledeOppgaverDocument, OppgaverDocument, OppgaverQuery } from '@io/graphql';
import { ISO_DATOFORMAT } from '@utils/date';
import { InfoAlert } from '@utils/error';

import { useInnloggetSaksbehandler } from './authentication';

type FetchedOppgaver = OppgaverQuery['oppgaver'];
export const useQueryBehandledeOppgaver = (): BehandledeOppgaverResponse => {
    const { oid } = useInnloggetSaksbehandler();
    const data = useQuery(FetchBehandledeOppgaverDocument, {
        variables: { oid: oid, fom: dayjs().format(ISO_DATOFORMAT) },
    });

    return {
        oppgaver: data.data?.behandledeOppgaver,
        error: data.error,
        loading: data.loading,
    };
};

export interface ApolloResponse<T> {
    data?: T;
    error?: ApolloError;
    loading: boolean;
}

export interface OppgaverResponse {
    oppgaver?: FetchedOppgaver;
    error?: ApolloError;
    loading: boolean;
}

interface BehandledeOppgaverResponse {
    oppgaver?: FerdigstiltOppgave[];
    error?: ApolloError;
    loading: boolean;
}

export const useQueryOppgaver = (): OppgaverResponse => {
    const { data, error, loading } = useQuery(OppgaverDocument, {
        initialFetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        onError: () => {
            throw Error('Kunne ikke hente saker. Prøv igjen senere.');
        },
    });
    const oppgaver = data?.oppgaver;
    return {
        oppgaver: oppgaver,
        error,
        loading,
    };
};

export const useOppgaver = (): FetchedOppgaver => {
    const oppgaver = useQuery(OppgaverDocument);
    return oppgaver.data?.oppgaver ?? [];
};

export const useMineOppgaver = (): FetchedOppgaver => {
    const { oid } = useInnloggetSaksbehandler();
    return useOppgaver().filter(({ tildeling }) => tildeling?.oid === oid);
};

export class TildelingAlert extends InfoAlert {
    name = 'tildeling';
}
