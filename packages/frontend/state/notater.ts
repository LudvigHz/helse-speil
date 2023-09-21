import dayjs from 'dayjs';

import { useQuery } from '@apollo/client';
import { FetchNotaterDocument, Notat as GraphQLNotat } from '@io/graphql';
import { ApolloResponse } from '@state/oppgaver';

export const useQueryNotater = (vedtaksperiodeIder: string[]): ApolloResponse<Notat[]> => {
    const fetchNotater = useQuery(FetchNotaterDocument, {
        variables: {
            forPerioder: vedtaksperiodeIder,
        },
    });

    return {
        data: fetchNotater.data?.notater
            ?.flatMap((it) => it.notater)
            .map(toNotat)
            .sort((a, b) => (a.opprettet < b.opprettet ? 1 : -1)),
        error: fetchNotater.error,
        loading: fetchNotater.loading,
    };
};
export const useNotaterForVedtaksperiode = (vedtaksperiodeId: string) => {
    const notater = useQueryNotater([vedtaksperiodeId]);
    return notater.data?.filter((notat) => notat.vedtaksperiodeId == vedtaksperiodeId) ?? [];
};

export const toNotat = (spesialistNotat: ExternalNotat | GraphQLNotat): Notat => ({
    id: `${spesialistNotat.id}`,
    tekst: spesialistNotat.tekst,
    saksbehandler: {
        navn: spesialistNotat.saksbehandlerNavn,
        oid: spesialistNotat.saksbehandlerOid,
        epost: spesialistNotat.saksbehandlerEpost,
        ident: spesialistNotat.saksbehandlerIdent,
    },
    opprettet: dayjs(spesialistNotat.opprettet),
    vedtaksperiodeId: spesialistNotat.vedtaksperiodeId,
    feilregistrert: spesialistNotat.feilregistrert,
    type: spesialistNotat.type,
    kommentarer: (spesialistNotat as GraphQLNotat).kommentarer ?? [],
});
