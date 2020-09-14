import React from 'react';
import dayjs from 'dayjs';
import Vilkår from './Vilkår';
import { MemoryRouter } from 'react-router';
import { PersonContext } from '../../../context/PersonContext';
import { render, screen } from '@testing-library/react';
import { enVedtaksperiode } from '../../../context/mapping/testdata/enVedtaksperiode';
import { mapVedtaksperiode } from '../../../context/mapping/vedtaksperiode';
import { Kjønn, Overstyring, Periodetype, Person, Vedtaksperiode } from 'internal-types';
import '@testing-library/jest-dom/extend-expect';

const enSpeilVedtaksperiode = () =>
    mapVedtaksperiode({
        overstyringer: [],
        ...enVedtaksperiode(),
        organisasjonsnummer: '123456789',
        risikovurderingerForArbeidsgiver: [],
    });

const enPersoninfo = () => ({
    fornavn: 'Kari',
    mellomnavn: null,
    etternavn: 'Normann',
    kjønn: 'Mann' as Kjønn,
    fødselsdato: dayjs(),
});

const enArbeidsgiver = async () => ({
    id: '123',
    navn: 'En bedrift',
    organisasjonsnummer: '123456789',
    vedtaksperioder: [await enSpeilVedtaksperiode()],
    overstyringer: new Map<string, Overstyring>(),
});

const personTilBehandling = async () => ({
    aktørId: '12345',
    fødselsnummer: '12345678901',
    arbeidsgivere: [await enArbeidsgiver()],
    personinfo: enPersoninfo(),
    infotrygdutbetalinger: [],
    enhet: { id: '', navn: '' },
});

const vilkårTilVurdering = () => screen.queryByText('Vilkår systemet ikke vurderer');
const automatiskVurderteVilkår = () => screen.queryByText('Vurderte vilkår');
const behandletAvInfotrygd = () => screen.queryByText('Behandlet av infotrygd');
const behandletInnhold = () => screen.queryByText('Behandlet innhold');

const defaultPersonContextValue = {
    markerPersonSomTildelt: (_: string) => null,
    hentPerson: (_: string) => Promise.resolve(undefined),
    isFetching: false,
    aktiverVedtaksperiode: (_: string) => null,
};

const renderVilkår = (personTilBehandling: Person, aktivVedtaksperiode: Vedtaksperiode) =>
    render(
        <MemoryRouter>
            <PersonContext.Provider value={{ ...defaultPersonContextValue, personTilBehandling, aktivVedtaksperiode }}>
                <Vilkår />
            </PersonContext.Provider>
        </MemoryRouter>
    );

describe('Vilkår', () => {
    describe('som er ubehandlet', () => {
        test('skal ha automatisk vurderte vilkår og vilkår til vurdering', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = await enSpeilVedtaksperiode();

            renderVilkår(person, vedtaksperiode);

            expect(vilkårTilVurdering()).toBeInTheDocument();
            expect(automatiskVurderteVilkår()).toBeInTheDocument();
            expect(behandletInnhold()).not.toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('og er en forlengelse skal ha automatisk vurderte vilkår, vilkår til vurdering og behandlet innhold', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = {
                ...(await enSpeilVedtaksperiode()),
                periodetype: Periodetype.Forlengelse,
            };

            renderVilkår(person, vedtaksperiode);

            expect(vilkårTilVurdering()).toBeInTheDocument();
            expect(automatiskVurderteVilkår()).toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('og er forlengelse fra infotrygd skal ha automatisk vurderte vilkår, vilkår til vurdering og behandlet av infotrygd', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = {
                ...(await enSpeilVedtaksperiode()),
                periodetype: Periodetype.Infotrygdforlengelse,
            };

            renderVilkår(person, vedtaksperiode);

            expect(vilkårTilVurdering()).toBeInTheDocument();
            expect(automatiskVurderteVilkår()).toBeInTheDocument();
            expect(behandletInnhold()).not.toBeInTheDocument();
            expect(behandletAvInfotrygd()).toBeInTheDocument();
        });
    });

    describe('som er behandlet', () => {
        test('skal ha behandlet innhold', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = {
                ...(await enSpeilVedtaksperiode()),
                behandlet: true,
            };

            renderVilkår(person, vedtaksperiode);

            expect(vilkårTilVurdering()).not.toBeInTheDocument();
            expect(automatiskVurderteVilkår()).not.toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('og er en forlengelse skal ha behandlet innhold', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = {
                ...(await enSpeilVedtaksperiode()),
                behandlet: true,
                periodetype: Periodetype.Forlengelse,
            };

            renderVilkår(person, vedtaksperiode);

            expect(vilkårTilVurdering()).not.toBeInTheDocument();
            expect(automatiskVurderteVilkår()).not.toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).not.toBeInTheDocument();
        });
        test('og er forlengelse fra infotrygd skal ha behandlet innhold og behandlet av infotrygd', async () => {
            const person = await personTilBehandling();
            const vedtaksperiode = {
                ...(await enSpeilVedtaksperiode()),
                forlengelseFraInfotrygd: true,
                behandlet: true,
            };

            renderVilkår(person, vedtaksperiode);

            expect(vilkårTilVurdering()).not.toBeInTheDocument();
            expect(automatiskVurderteVilkår()).not.toBeInTheDocument();
            expect(behandletInnhold()).toBeInTheDocument();
            expect(behandletAvInfotrygd()).toBeInTheDocument();
        });
    });
});
