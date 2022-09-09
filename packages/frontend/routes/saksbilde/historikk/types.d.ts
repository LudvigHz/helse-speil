type OverstyrtDag = import('@io/graphql').OverstyrtDag;
type OverstyrtInntekt = import('@io/graphql').OverstyrtInntekt;
type PeriodehistorikkType = import('@io/graphql').PeriodehistorikkType;
type Utbetalingtype = import('@io/graphql').Utbetalingtype;
type ReactNode = import('react').ReactNode;

declare type Filtertype = 'Dokument' | 'Historikk' | 'Notat';

declare type Hendelsetype =
    | 'Dagoverstyring'
    | 'Arbeidsforholdoverstyring'
    | 'Inntektoverstyring'
    | 'Dokument'
    | 'Notat'
    | 'Utbetaling'
    | 'Historikk';

declare type BaseHendelseObject = {
    id: string;
    type: Hendelsetype;
    timestamp?: DateString;
    saksbehandler?: Maybe<string>;
};

declare type DagoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Dagoverstyring';
    erRevurdering: boolean;
    saksbehandler: string;
    timestamp: DateString;
    begrunnelse: string;
    dager: Array<OverstyrtDag>;
};

declare type ArbeidsforholdoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Arbeidsforholdoverstyring';
    erDeaktivert: boolean;
    saksbehandler: string;
    timestamp: DateString;
    begrunnelse: string;
    forklaring: string;
    skjæringstidspunkt: DateString;
};

declare type InntektoverstyringhendelseObject = BaseHendelseObject & {
    type: 'Inntektoverstyring';
    erRevurdering: boolean;
    saksbehandler: string;
    timestamp: DateString;
    begrunnelse: string;
    inntekt: OverstyrtInntekt;
};

declare type DokumenthendelseObject = BaseHendelseObject & {
    type: 'Dokument';
    dokumenttype: 'Inntektsmelding' | 'Sykmelding' | 'Søknad';
    timestamp: DateString;
};

declare type NotathendelseObject = BaseHendelseObject & {
    type: 'Notat';
    tekst: string;
    notattype: NotatType;
    saksbehandler: string;
    saksbehandlerOid: string;
    timestamp: DateString;
    feilregistrert: boolean;
    vedtaksperiodeId: string;
};

declare type UtbetalinghendelseObject = BaseHendelseObject & {
    type: 'Utbetaling';
    automatisk: boolean;
    godkjent: boolean;
    utbetalingstype: Utbetalingtype;
    saksbehandler: string;
    timestamp: DateString;
};

declare type HistorikkhendelseObject = BaseHendelseObject & {
    type: 'Historikk';
    historikktype: PeriodehistorikkType;
    timestamp: DateString;
};

declare type HendelseObject =
    | DagoverstyringhendelseObject
    | ArbeidsforholdoverstyringhendelseObject
    | InntektoverstyringhendelseObject
    | DokumenthendelseObject
    | NotathendelseObject
    | UtbetalinghendelseObject
    | HistorikkhendelseObject;
