import request from 'request-promise-native';
import { AppConfig, OnBehalfOf } from '../types';

export interface PostAnnulleringOptions {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    fagsystemId: string;
    saksbehandlerIdent: string;
    speilToken: string;
    vedtaksperiodeId: string;
}

export interface AnnulleringClient {
    annuller: (body: PostAnnulleringOptions, accessToken?: string) => Promise<Response>;
}

export default (config: AppConfig, onBehalfOf: OnBehalfOf) => ({
    annuller: async ({
        aktørId,
        fødselsnummer,
        organisasjonsnummer,
        fagsystemId,
        saksbehandlerIdent,
        speilToken,
        vedtaksperiodeId,
    }: PostAnnulleringOptions) => {
        const onBehalfOfToken = await onBehalfOf.hentFor(config.oidc.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.cluster.local/api/annullering`,
            headers: { Authorization: `Bearer ${onBehalfOfToken}` },
            body: { aktørId, fødselsnummer, organisasjonsnummer, fagsystemId, saksbehandlerIdent, vedtaksperiodeId },
            json: true,
        };

        return request.post(options);
    },
});
