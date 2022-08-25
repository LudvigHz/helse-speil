import request from 'request-promise-native';

import { OidcConfig, OnBehalfOf } from '../types';
import config from '../config';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

// noinspection JSUnusedGlobalSymbols
enum Dagtype {
    Syk = 'Syk',
    Helg = 'Helg',
    Ferie = 'Ferie',
    Avvist = 'Avvist',
    Ubestemt = 'Ubestemt',
    Arbeidsdag = 'Arbeidsdag',
    Egenmelding = 'Egenmelding',
    Foreldet = 'Foreldet',
    Arbeidsgiverperiode = 'Arbeidsgiverperiode',
}

interface OverstyrtDagDTO {
    dato: string;
    type: 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | Dagtype;
    grad?: number;
}

interface OverstyringDTO {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    begrunnelse: string;
    dager: OverstyrtDagDTO[];
}

interface OverstyringInntektDTO {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    begrunnelse: string;
    forklaring: string;
    månedligInntekt: number;
    skjæringstidspunkt: string;
}

interface OverstyrtArbeidsforholdDTO {
    fødselsnummer: string;
    aktørId: string;
    skjæringstidspunkt: string;
    overstyrteArbeidsforhold: OverstyrtArbeidsforholdElementDTO[];
}

interface OverstyrtArbeidsforholdElementDTO {
    orgnummer: string;
    deaktivert: boolean;
    forklaring: string;
    begrunnelse: string;
}

export interface OverstyringClient {
    overstyrDager: (overstyring: OverstyringDTO, speilToken: string) => Promise<Response>;
    overstyrInntekt: (overstyring: OverstyringInntektDTO, speilToken: string) => Promise<Response>;
    overstyrArbeidsforhold: (overstyring: OverstyrtArbeidsforholdDTO, speilToken: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): OverstyringClient => ({
    overstyrDager: async (overstyring: OverstyringDTO, speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/overstyr/dager`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            body: overstyring,
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },
    overstyrInntekt: async (overstyring: OverstyringInntektDTO, speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/overstyr/inntekt`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            body: overstyring,
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },
    overstyrArbeidsforhold: async (overstyring: OverstyrtArbeidsforholdDTO, speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `${spesialistBaseUrl}/api/overstyr/arbeidsforhold`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            body: overstyring,
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },
});
