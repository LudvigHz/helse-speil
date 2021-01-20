import { mapPerson } from './person';
import { Kjønn, Overstyring, Vedtaksperiode } from 'internal-types';
import {
    SpleisAktivitet,
    SpleisAlvorlighetsgrad,
    SpleisSykdomsdag,
    SpleisSykdomsdagkildeType,
    SpleisSykdomsdagtype,
    SpleisUtbetalingsdagtype,
} from 'external-types';
import dayjs from 'dayjs';
import { ISO_TIDSPUNKTFORMAT } from '../utils/date';
import {
    medEkstraSykdomsdager,
    medLedendeSykdomsdager,
    medUtbetalingstidslinje,
    umappetVedtaksperiode,
} from '../../test/data/vedtaksperiode';
import { umappetArbeidsgiver } from '../../test/data/arbeidsgiver';
import { mappetPersonObject, umappetPerson } from '../../test/data/person';
import { PersoninfoFraSparkel } from '../../types';

const defaultPersonInfo: PersoninfoFraSparkel = {
    kjønn: 'Mannebjørn',
    fødselsdato: '1956-12-12',
    fnr: '01019000123',
};

const enAktivitet = (
    melding: string = 'Aktivitetsloggvarsel',
    tidsstempel: string = '2020-04-03T07:40:47.261Z',
    alvorlighetsgrad: SpleisAlvorlighetsgrad = 'W'
): SpleisAktivitet => ({
    vedtaksperiodeId: 'vedtaksperiodeId',
    alvorlighetsgrad: alvorlighetsgrad,
    melding: melding,
    tidsstempel: tidsstempel,
});

describe('personmapper', () => {
    test('mapper person', async () => {
        const { person } = await mapPerson(umappetPerson(), defaultPersonInfo);
        expect(person).toEqual(mappetPersonObject);
    });

    test('mapper aktivitetslogg', async () => {
        const melding = 'Aktivitetsvarsel';
        const tidsstempel = '2020-01-01T13:37:00.000Z';
        const alvorlighetsgrad = 'W';
        const spleisAktivitet = enAktivitet(melding, tidsstempel, alvorlighetsgrad);

        const vedtaksperiode = umappetVedtaksperiode({ varsler: [melding], aktivitetslogg: [spleisAktivitet] });
        const arbeidsgiver = umappetArbeidsgiver([vedtaksperiode]);
        const { person } = await mapPerson(umappetPerson([arbeidsgiver]), defaultPersonInfo);

        const aktivitetslog = (person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode).aktivitetslog;

        expect(aktivitetslog).toHaveLength(1);
        expect(aktivitetslog).toContainEqual(melding);
    });

    test('mapper person med flere vedtaksperioder', async () => {
        let { person } = await mapPerson(
            umappetPerson([
                umappetArbeidsgiver([
                    umappetVedtaksperiode(),
                    medUtbetalingstidslinje(umappetVedtaksperiode(), [
                        {
                            type: SpleisUtbetalingsdagtype.NAVDAG,
                            inntekt: 999.5,
                            dato: '2019-10-06',
                            utbetaling: 1000.0,
                        },
                        {
                            type: SpleisUtbetalingsdagtype.NAVDAG,
                            inntekt: 999.5,
                            dato: '2019-10-07',
                            utbetaling: 1000.0,
                        },
                        {
                            type: SpleisUtbetalingsdagtype.NAVDAG,
                            inntekt: 999.5,
                            dato: '2019-10-08',
                            utbetaling: 1000.0,
                        },
                        {
                            type: SpleisUtbetalingsdagtype.NAVDAG,
                            inntekt: 999.5,
                            dato: '2019-10-09',
                            utbetaling: 1000.0,
                        },
                    ]),
                ]),
            ]),
            defaultPersonInfo
        );

        const andreVvedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[1] as Vedtaksperiode;
        expect(andreVvedtaksperiode.oppsummering.totaltTilUtbetaling).toEqual(4000.0);
        expect(andreVvedtaksperiode.oppsummering.antallUtbetalingsdager).toEqual(4);
    });

    test('filtrerer vekk paddede arbeidsdager', async () => {
        const ledendeArbeidsdager: SpleisSykdomsdag[] = [
            {
                dagen: '2019-12-30',
                type: SpleisSykdomsdagtype.ARBEIDSDAG,
                kilde: {
                    kildeId: '0F89BC6F-EDB2-4ED4-B124-19F0DF59545C',
                    type: SpleisSykdomsdagkildeType.INNTEKTSMELDING,
                },
                grad: 100.0,
            },
            {
                dagen: '2019-12-31',
                type: SpleisSykdomsdagtype.ARBEIDSDAG,
                kilde: {
                    kildeId: '62F0A473-82D1-4A38-9B8F-E220ACF598C9',
                    type: SpleisSykdomsdagkildeType.INNTEKTSMELDING,
                },
                grad: 100.0,
            },
        ];

        const førsteSykdomsdag = umappetVedtaksperiode().sykdomstidslinje[0];
        const vedtaksperiode = medLedendeSykdomsdager(umappetVedtaksperiode(), ledendeArbeidsdager);
        const { person } = await mapPerson(umappetPerson([umappetArbeidsgiver([vedtaksperiode])]), defaultPersonInfo);
        const mappetVedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode;

        expect(mappetVedtaksperiode.sykdomstidslinje[0].dato.format('YYYY-MM-DD')).toEqual(førsteSykdomsdag.dagen);
    });

    test('Vedtaksperioder sorteres på fom i synkende rekkefølge', async () => {
        const { person } = await mapPerson(
            umappetPerson([
                umappetArbeidsgiver([
                    medLedendeSykdomsdager(umappetVedtaksperiode(), [
                        {
                            dagen: '2019-12-31',
                            type: SpleisSykdomsdagtype.SYKEDAG,
                            kilde: {
                                kildeId: '1D7B00B8-216D-4090-8DEA-72E97183F8D7',
                                type: SpleisSykdomsdagkildeType.SYKMELDING,
                            },
                        },
                    ]),
                    umappetVedtaksperiode(),
                ]),
            ]),
            defaultPersonInfo
        );

        const vedtaksperioder = person.arbeidsgivere[0].vedtaksperioder;
        expect(vedtaksperioder[0].fom.format('YYYY-MM-DD')).toStrictEqual('2020-01-01');
        expect(vedtaksperioder[1].fom.format('YYYY-MM-DD')).toStrictEqual('2019-12-31');
    });

    test('mapper overstyring av tidslinje', async () => {
        const saksbehandlerKildeId = '5B807A30-E197-474F-9AFB-D136649A02DB';
        const overstyrtDato = '2019-10-07';
        const ekstraDager: SpleisSykdomsdag[] = [
            {
                dagen: '2019-10-06',
                type: SpleisSykdomsdagtype.SYK_HELGEDAG,
                kilde: {
                    type: SpleisSykdomsdagkildeType.SØKNAD,
                    kildeId: 'D94DD20F-8B95-4769-87DA-80F8F3AE6576',
                },
            },
            {
                dagen: overstyrtDato,
                type: SpleisSykdomsdagtype.FERIEDAG,
                kilde: {
                    type: SpleisSykdomsdagkildeType.SAKSBEHANDLER,
                    kildeId: saksbehandlerKildeId,
                },
            },
        ];
        const { person } = await mapPerson(
            umappetPerson([
                umappetArbeidsgiver(
                    [medEkstraSykdomsdager(umappetVedtaksperiode(), ekstraDager)],
                    [
                        {
                            begrunnelse: 'begrunnelse',
                            hendelseId: saksbehandlerKildeId,
                            timestamp: dayjs().format(ISO_TIDSPUNKTFORMAT),
                            saksbehandlerNavn: 'Ola Narr',
                            overstyrteDager: [
                                {
                                    dagtype: SpleisSykdomsdagtype.FERIEDAG,
                                    dato: overstyrtDato,
                                    grad: undefined,
                                },
                            ],
                        },
                    ]
                ),
            ]),
            defaultPersonInfo
        );

        const førsteVedtaksperiode = person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode;
        const hendelseId: string = førsteVedtaksperiode.sykdomstidslinje[
            førsteVedtaksperiode.sykdomstidslinje.length - 1
        ].kildeId!;

        expect(hendelseId).toBeDefined();
    });
});

export const enPersoninfo = () => ({
    fornavn: 'Kari',
    mellomnavn: null,
    etternavn: 'Normann',
    kjønn: 'Mann' as Kjønn,
    fødselsdato: dayjs(),
    overstyringer: new Map<string, Overstyring>(),
});
