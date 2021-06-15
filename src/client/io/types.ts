import { Dagtype } from 'internal-types';

export interface Options {
    method?: string;
    headers?: { [key: string]: any };
}

export interface OverstyrtDagDTO {
    dato: string;
    type: 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | 'Permisjonsdag' | 'Avvist' | Dagtype;
    grad?: number;
}

export interface OverstyringDTO {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    begrunnelse: string;
    dager: OverstyrtDagDTO[];
}

export interface AnnulleringDTO {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    fagsystemId: string;
}

export interface PersonoppdateringDTO {
    fødselsnummer: string;
}
