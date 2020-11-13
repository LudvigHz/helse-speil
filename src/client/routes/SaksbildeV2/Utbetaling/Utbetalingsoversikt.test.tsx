import React from 'react';
import { mapVedtaksperiode } from '../../../mapping/vedtaksperiode';
import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { Dagtype } from 'internal-types';
import '@testing-library/jest-dom/extend-expect';
import { totaltAntallUtbetalingsdager, totalUtbetaling, vedtaksperiodeDagerIgjen } from './Utbetalingsoversikt';
import dayjs from 'dayjs';

const enIkkeUtbetaltVedtaksperiode = () =>
    mapVedtaksperiode({
        ...umappetVedtaksperiode(),
        organisasjonsnummer: '123456789',
        overstyringer: [],
    });

describe('Utbetalingsoversikt', () => {
    test('Totalutbetaling blir 0 uten vedtaksperiode', () => {
        const vedtaksperiode = undefined;
        const utbetaling = totalUtbetaling(vedtaksperiode);
        expect(utbetaling).toBe(0);
    });

    test('Totalutbetaling regner ut riktig beløp', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        const utbetaling = totalUtbetaling(vedtaksperiode);
        expect(utbetaling).toBe(34500);
    });

    test('Totalutbetaling regner ut riktig beløp ved en avvist dagtype', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        vedtaksperiode.utbetalingstidslinje[0].type = Dagtype.Avvist;
        const utbetaling = totalUtbetaling(vedtaksperiode);
        expect(utbetaling).toBe(33000);
    });

    test('Totalutbetalingsdager blir 0 uten vedtaksperiode', () => {
        const vedtaksperiode = undefined;
        const utbetalingsdager = totaltAntallUtbetalingsdager(vedtaksperiode);
        expect(utbetalingsdager).toBe(0);
    });

    test('Totalutbetalingsdager regner ut riktig antall dager', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        const utbetalingsdager = totaltAntallUtbetalingsdager(vedtaksperiode);
        expect(utbetalingsdager).toBe(23);
    });

    test('Totalutbetalingsdager regner ut riktig antall dager ved en avvist dag', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        vedtaksperiode.utbetalingstidslinje[0].type = Dagtype.Avvist;
        const utbetalingsdager = totaltAntallUtbetalingsdager(vedtaksperiode);
        expect(utbetalingsdager).toBe(22);
    });

    test('Dager igjen per dato i en vedtaksperiode er en tom liste dersom vedtaksperiode ikke er satt', () => {
        const vedtaksperiode = undefined;
        const dagerIgjen = vedtaksperiodeDagerIgjen(vedtaksperiode);
        expect(dagerIgjen).toStrictEqual([]);
    });

    test('Dager igjen per dato i en vedtaksperiode regnes riktig dersom maksdato har vært og gjenstående dager er 0', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        vedtaksperiode.vilkår!!.dagerIgjen.gjenståendeDager = 0;
        vedtaksperiode.vilkår!!.dagerIgjen.maksdato = dayjs('2019-12-31');
        const dagerIgjen = vedtaksperiodeDagerIgjen(vedtaksperiode);
        expect(dagerIgjen[0]).toBe(0);
        expect(dagerIgjen[30]).toBe(0);
    });

    test('Dager igjen per dato i en vedtaksperiode regnes ut riktig for en vedtaksperiode', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        vedtaksperiode.vilkår!!.dagerIgjen.gjenståendeDager = 50;
        const dagerIgjen = vedtaksperiodeDagerIgjen(vedtaksperiode);
        expect(dagerIgjen[0]).toBe(72);
        expect(dagerIgjen[1]).toBe(71);
        expect(dagerIgjen[30]).toBe(50);
        expect(dagerIgjen[30]).toBe(vedtaksperiode.vilkår?.dagerIgjen.gjenståendeDager);
    });

    test('Dager igjen per dato i en vedtaksperiode regnes ut riktig for en vedtaksperiode med en avvist dag', async () => {
        const vedtaksperiode = await enIkkeUtbetaltVedtaksperiode();
        vedtaksperiode.vilkår!!.dagerIgjen.gjenståendeDager = 50;
        vedtaksperiode.utbetalingstidslinje[1].type = Dagtype.Avvist;
        const dagerIgjen = vedtaksperiodeDagerIgjen(vedtaksperiode);
        expect(dagerIgjen[0]).toBe(71);
        expect(dagerIgjen[1]).toBe(71);
        expect(dagerIgjen[30]).toBe(50);
    });
});
