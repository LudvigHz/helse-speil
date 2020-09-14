import { somDato, somTidspunkt } from '../vedtaksperiode';
import {
    Arbeidsgiver,
    Dagtype,
    Kildetype,
    Kjønn,
    Periodetype,
    Person,
    Vedtaksperiode,
    Vedtaksperiodetilstand,
    Vilkår,
} from 'internal-types';
import { Dayjs } from 'dayjs';

export const mappetPerson: Person = {
    fødselsnummer: '01019000123',
    aktørId: '1211109876233',
    personinfo: {
        fornavn: 'Kringle',
        mellomnavn: null,
        etternavn: 'Krangel',
        fødselsdato: somDato('1956-12-12'),
        kjønn: 'Mannebjørn' as Kjønn,
        fnr: '01019000123',
    },
    arbeidsgivere: [
        {
            organisasjonsnummer: '123456789',
            id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
            navn: 'Potetsekk AS',
            vedtaksperioder: [
                {
                    id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
                    fom: somDato('2019-09-10'),
                    tom: somDato('2019-10-05'),
                    gruppeId: 'gruppe-1',
                    kanVelges: true,
                    tilstand: Vedtaksperiodetilstand.Oppgaver,
                    oppgavereferanse: '3982',
                    utbetalingsreferanse: '12345',
                    utbetalinger: {
                        arbeidsgiverUtbetaling: {
                            fagsystemId: '81549300',
                            linjer: [
                                {
                                    fom: somDato('2019-09-26'),
                                    tom: somDato('2019-09-30'),
                                    dagsats: 1431,
                                    grad: 100,
                                },
                            ],
                        },
                        personUtbetaling: {
                            fagsystemId: '81549301',
                            linjer: [
                                {
                                    fom: somDato('2019-09-26'),
                                    tom: somDato('2019-09-30'),
                                    dagsats: 1431,
                                    grad: 100,
                                },
                            ],
                        },
                    },
                    utbetalingstidslinje: [
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-10'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-11'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-12'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-13'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-14'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-15'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-16'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-17'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-18'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-19'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-20'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-21'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-22'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-23'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-24'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Arbeidsgiverperiode,
                            dato: somDato('2019-09-25'),
                            gradering: undefined,
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: somDato('2019-09-26'),
                            gradering: undefined,
                            utbetaling: 1431,
                        },
                        {
                            type: Dagtype.Syk,
                            dato: somDato('2019-09-27'),
                            gradering: undefined,
                            utbetaling: 1431,
                        },
                        {
                            type: Dagtype.Helg,
                            gradering: undefined,
                            dato: somDato('2019-09-28'),
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Helg,
                            gradering: undefined,
                            dato: somDato('2019-09-29'),
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Syk,
                            gradering: undefined,
                            dato: somDato('2019-09-30'),
                            utbetaling: 1431,
                        },
                        {
                            type: Dagtype.Ferie,
                            gradering: undefined,
                            dato: somDato('2019-10-01'),
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Ferie,
                            gradering: undefined,
                            dato: somDato('2019-10-02'),
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Ferie,
                            gradering: undefined,
                            dato: somDato('2019-10-03'),
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Ferie,
                            gradering: undefined,
                            dato: somDato('2019-10-04'),
                            utbetaling: undefined,
                        },
                        {
                            type: Dagtype.Helg,
                            gradering: undefined,
                            dato: somDato('2019-10-05'),
                            utbetaling: undefined,
                        },
                    ],
                    sykdomstidslinje: [
                        {
                            dato: somDato('2019-09-10'),
                            type: Dagtype.Egenmelding,
                            kilde: Kildetype.Inntektsmelding,
                            kildeId: '512781D2-690E-4B4B-8A00-84A5FCC41AEE',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-11'),
                            type: Dagtype.Egenmelding,
                            kilde: Kildetype.Inntektsmelding,
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-12'),
                            type: Dagtype.Egenmelding,
                            kilde: Kildetype.Inntektsmelding,
                            kildeId: '512781D2-690E-4B4B-8A00-84A5FCC41AEE',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-13'),
                            type: Dagtype.Egenmelding,
                            kilde: Kildetype.Inntektsmelding,
                            kildeId: '512781D2-690E-4B4B-8A00-84A5FCC41AEE',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-14'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-15'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-16'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-17'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-18'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-19'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-20'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-21'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-22'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-23'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-24'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-25'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-26'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-27'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-28'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-29'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-09-30'),
                            type: Dagtype.Syk,
                            kilde: Kildetype.Sykmelding,
                            kildeId: 'DC7A5F57-DE63-4648-9631-B50C100859BA',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-10-01'),
                            type: Dagtype.Ferie,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-10-02'),
                            type: Dagtype.Ferie,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-10-03'),
                            type: Dagtype.Ferie,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-10-04'),
                            type: Dagtype.Ferie,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                        {
                            dato: somDato('2019-10-05'),
                            type: Dagtype.Helg,
                            kilde: Kildetype.Søknad,
                            kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                            gradering: undefined,
                        },
                    ],
                    godkjentAv: undefined,
                    godkjenttidspunkt: undefined,
                    vilkår: {
                        alder: {
                            alderSisteSykedag: 28,
                            oppfylt: true,
                        },
                        dagerIgjen: {
                            dagerBrukt: 3,
                            førsteFraværsdag: somDato('2019-09-10'),
                            førsteSykepengedag: somDato('2019-09-26'),
                            maksdato: somDato('2020-09-07'),
                            oppfylt: true,
                            gjenståendeDager: undefined,
                            tidligerePerioder: [],
                        },
                        søknadsfrist: {
                            oppfylt: true,
                            søknadTom: somDato('2019-10-10'),
                            sendtNav: somTidspunkt('2019-10-15T00:00:00'),
                        },
                        sykepengegrunnlag: {
                            sykepengegrunnlag: 372000.0,
                            grunnebeløp: 99858,
                            oppfylt: true,
                        },
                        opptjening: {
                            antallOpptjeningsdagerErMinst: 3539,
                            opptjeningFra: somDato('2010-01-01'),
                            oppfylt: true,
                        },
                    },
                    inntektskilder: [
                        {
                            organisasjonsnummer: '123456789',
                            månedsinntekt: 31000,
                            årsinntekt: 372000.0,
                            refusjon: true,
                            forskuttering: true,
                        },
                    ],
                    sykepengegrunnlag: {
                        årsinntektFraAording: 372000.0,
                        årsinntektFraInntektsmelding: 372000.0,
                        sykepengegrunnlag: 372000.0,
                        avviksprosent: 0.0,
                    },
                    oppsummering: {
                        antallUtbetalingsdager: 3,
                        totaltTilUtbetaling: 4293,
                    },
                    hendelser: [
                        {
                            id: 'c554ee9b-30ca-4c7f-adce-c0224108e83a',
                            rapportertDato: somDato('2020-02-14'),
                            fom: somDato('2019-09-01'),
                            tom: somDato('2019-10-10'),
                            type: Kildetype.Sykmelding,
                        },
                        {
                            id: '726e57d9-7844-4a28-886b-8485dbdbd4d2',
                            rapportertDato: somDato('2020-02-14'),
                            sendtNav: somDato('2019-10-15'),
                            fom: somDato('2019-09-01'),
                            tom: somDato('2019-10-10'),
                            type: Kildetype.Søknad,
                        },
                        {
                            id: '09851096-bcba-4c7a-8dc0-a1617a744f1f',
                            beregnetInntekt: 31000.0,
                            mottattTidspunkt: somTidspunkt('2019-10-15T00:00:00'),
                            type: Kildetype.Inntektsmelding,
                        },
                    ],
                    aktivitetslog: [],
                    forlengelseFraInfotrygd: false,
                    periodetype: Periodetype.Førstegangsbehandling,
                    behandlet: false,
                    overstyringer: [],
                },
            ],
        },
    ],
    infotrygdutbetalinger: [],
    enhet: { id: '', navn: '' },
};

const arbeidsgiver = (): Arbeidsgiver => mappetPerson.arbeidsgivere[0];
const vedtaksperiode = (): Vedtaksperiode => arbeidsgiver().vedtaksperioder[0] as Vedtaksperiode;
const vilkår = (): Vilkår => vedtaksperiode().vilkår as Vilkår;

export const vedtaksperiodeMedMaksdato = (maksdato: Dayjs): Vedtaksperiode => ({
    ...vedtaksperiode(),
    vilkår: {
        ...vilkår(),
        dagerIgjen: {
            ...vilkår().dagerIgjen,
            maksdato,
        },
    },
});

export const mappetPersonMedMaksdato = (maksdato: Dayjs): Person => ({
    ...mappetPerson,
    arbeidsgivere: [
        {
            ...arbeidsgiver(),
            vedtaksperioder: [
                {
                    ...vedtaksperiode(),
                    vilkår: {
                        ...vilkår(),
                        dagerIgjen: {
                            ...vilkår().dagerIgjen,
                            maksdato,
                        },
                    },
                },
            ],
        },
    ],
});
