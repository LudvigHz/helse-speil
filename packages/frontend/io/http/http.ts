import { Avvisningsskjema } from '../../routes/saksbilde/venstremeny/utbetaling/AvvisningModal';
import { AnnulleringDTO, NotatDTO, Options, PersonoppdateringDTO } from './types';

export const ResponseError = (statusCode: number, message?: string) => ({
    statusCode,
    message,
});

export type SpeilResponse<T = null> = {
    status: number;
    data?: T;
};

type Headers = {
    [key: string]: unknown;
};

// eslint-disable-next-line no-undef
const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/api';
const baseUrlGraphQL = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/graphql';

const getData = async (response: Response) => {
    try {
        return await response.json();
    } catch (e) {
        return undefined;
    }
};

const getErrorMessage = async (response: Response) => {
    try {
        return await response.text();
    } catch (e) {
        return undefined;
    }
};

const ensureAcceptHeader = (options: Options = {}): RequestInit | undefined => {
    const acceptHeader = { Accept: 'application/json' };
    if (!options?.headers) {
        return { ...options, headers: acceptHeader };
    } else if (!options.headers.Accept || !options.headers.accept) {
        return { ...options, headers: { ...acceptHeader, ...options.headers } };
    }
    return undefined;
};

const get = async <T>(url: string, options?: Options): Promise<SpeilResponse<T>> => {
    const response = await fetch(url, ensureAcceptHeader(options));

    if (response.status >= 400) {
        throw ResponseError(response.status);
    }

    return {
        status: response.status,
        data: await getData(response),
    };
};

export const post = async (url: string, data: unknown, headere?: Headers): Promise<SpeilResponse<unknown>> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            ...headere,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (response.status !== 200 && response.status !== 204) {
        const message = await getErrorMessage(response);

        throw ResponseError(response.status, message);
    }

    return {
        status: response.status,
        data: await getData(response),
    };
};

export const del = async (url: string, data?: unknown, options?: Options) => {
    const response = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(data),
        ...options,
    } as RequestInit);

    if (response.status >= 400) {
        throw ResponseError(response.status);
    }
    return response;
};
export const getOpptegnelser = async (sisteSekvensId?: number): Promise<SpeilResponse<Array<Opptegnelse>>> => {
    return sisteSekvensId
        ? get<Opptegnelse[]>(`${baseUrl}/opptegnelse/hent/${sisteSekvensId}`)
        : get<Opptegnelse[]>(`${baseUrl}/opptegnelse/hent`);
};

export const getNotater = async (
    vedtaksperiodeIder: string[],
): Promise<{
    vedtaksperiodeId: Array<ExternalNotat>;
}> => {
    return get<{
        vedtaksperiodeId: ExternalNotat[];
    }>(`${baseUrl}/notater?vedtaksperiodeId=${vedtaksperiodeIder.join('&vedtaksperiodeId=')}`).then(({ data }) => {
        if (data === undefined) throw 'Notater response mangler data';
        return data;
    });
};

const postVedtak = async (
    oppgavereferanse: string,
    aktørId: string,
    godkjent: boolean,
    skjema?: Avvisningsskjema,
    beregningId?: string,
) => post(`${baseUrl}/payments/vedtak`, { oppgavereferanse, aktørId, godkjent, skjema, beregningId });

export const postUtbetalingsgodkjenning = async (oppgavereferanse: string, aktørId: string) =>
    postVedtak(oppgavereferanse, aktørId, true, undefined);

export const postSendTilInfotrygd = async (oppgavereferanse: string, aktørId: string, skjema: Avvisningsskjema) =>
    postVedtak(oppgavereferanse, aktørId, false, skjema);

export const postSendTilbakeTilSaksbehandler = async (oppgavereferanse: string, notat: NotatDTO) =>
    post(`${baseUrl}/totrinnsvurdering/retur`, { oppgavereferanse, notat });

export const postUtbetalingTilTotrinnsvurdering = async (oppgavereferanse: string) =>
    post(`${baseUrl}/totrinnsvurdering`, { oppgavereferanse });

export const postAnnullering = async (annullering: AnnulleringDTO) =>
    post(`${baseUrl}/payments/annullering`, annullering);

export const postForespørPersonoppdatering = async (oppdatering: PersonoppdateringDTO) =>
    post(`${baseUrl}/person/oppdater`, oppdatering);

export const postAbonnerPåAktør = async (aktørId: string) => {
    return post(`${baseUrl}/opptegnelse/abonner/${aktørId}`, {});
};
export const postGraphQLQuery = async (operation: string) => {
    return post(`${baseUrlGraphQL}`, JSON.parse(operation));
};
