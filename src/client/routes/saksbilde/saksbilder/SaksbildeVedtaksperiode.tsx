import styled from '@emotion/styled';
import { Person } from 'internal-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import '@navikt/helse-frontend-logg/lib/main.css';

import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { Flex, FlexColumn } from '../../../components/Flex';
import { useArbeidsforhold, useArbeidsgivernavn } from '../../../modell/Arbeidsgiver';
import { Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';
import { usePersondataSkalAnonymiseres } from '../../../state/person';
import { useOppgavereferanse, useVedtaksperiode } from '../../../state/tidslinje';

import { AmplitudeProvider } from '../AmplitudeContext';
import { getErrorMelding } from '../Saksbilde';
import { Faresignaler } from '../faresignaler/Faresignaler';
import { Sakslinje } from '../sakslinje/Sakslinje';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Sykmeldingsperiode } from '../sykmeldingsperiode/Sykmeldingsperiode';
import { Utbetaling } from '../utbetaling/Utbetaling';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Vilkår } from '../vilkår/Vilkår';
import { VenstreMeny, VertikalStrek } from './Felles';
import { LoggContainer, LoggHeader, LoggListe } from './Logg';

interface SaksbildeVedtaksperiodeProps {
    personTilBehandling: Person;
    aktivPeriode: Tidslinjeperiode;
    path: String;
}

const AutoFlexContainer = styled.div`
    flex: auto;
`;

const Content = styled.div`
    margin: 0 2.5rem;
    height: 100%;
`;

export const SaksbildeVedtaksperiode = ({ personTilBehandling, aktivPeriode, path }: SaksbildeVedtaksperiodeProps) => {
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const errorMelding = getErrorMelding(vedtaksperiode.tilstand);
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);

    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer) ?? 'Ukjent arbeidsgivernavn';
    const arbeidsforhold = useArbeidsforhold(aktivPeriode.organisasjonsnummer) ?? [];
    const skjæringstidspunkt = vedtaksperiode.vilkår?.dagerIgjen.skjæringstidspunkt;
    const maksdato = vedtaksperiode.vilkår?.dagerIgjen.maksdato;
    const gjenståendeDager = vedtaksperiode.vilkår?.dagerIgjen.gjenståendeDager;
    const utbetalingstidslinje = aktivPeriode.utbetalingstidslinje;
    const sykdomstidslinje = vedtaksperiode.sykdomstidslinje;
    const periode = { fom: aktivPeriode.fom, tom: aktivPeriode.tom };
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();

    return (
        <div data-testid="saksbilde-vedtaksperiode">
            <Flex justifyContent="space-between" flex={1}>
                <AutoFlexContainer>
                    <Sakslinje aktivPeriode={aktivPeriode} />
                    <ErrorBoundary key={vedtaksperiode.id} fallback={errorMelding}>
                        <AmplitudeProvider>
                            <Flex style={{ flex: 1, height: 'calc(100% - 75px)' }}>
                                <VenstreMeny
                                    aktivPeriode={aktivPeriode}
                                    arbeidsgivernavn={arbeidsgivernavn}
                                    organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                                    arbeidsforhold={arbeidsforhold}
                                    anonymiseringEnabled={anonymiseringEnabled}
                                    skjæringstidspunkt={skjæringstidspunkt}
                                    maksdato={maksdato}
                                />
                                <VertikalStrek />
                                <FlexColumn style={{ flex: 1, height: '100%' }}>
                                    <Saksbildevarsler
                                        aktivPeriode={aktivPeriode}
                                        vedtaksperiode={vedtaksperiode}
                                        oppgavereferanse={oppgavereferanse}
                                    />
                                    <Content>
                                        <Switch>
                                            <Route path={`${path}/utbetaling`}>
                                                <Utbetaling
                                                    gjenståendeDager={gjenståendeDager}
                                                    utbetalingstidslinje={utbetalingstidslinje}
                                                    sykdomstidslinje={sykdomstidslinje}
                                                    maksdato={maksdato}
                                                    periode={periode}
                                                />
                                            </Route>
                                            <Route path={`${path}/sykmeldingsperiode`}>
                                                <Sykmeldingsperiode aktivPeriode={aktivPeriode} />
                                            </Route>
                                            <Route path={`${path}/vilkår`}>
                                                <Vilkår vedtaksperiode={vedtaksperiode} person={personTilBehandling} />
                                            </Route>
                                            <Route path={`${path}/sykepengegrunnlag`}>
                                                <Sykepengegrunnlag
                                                    vedtaksperiode={vedtaksperiode}
                                                    person={personTilBehandling}
                                                />
                                            </Route>
                                            {vedtaksperiode.risikovurdering && (
                                                <Route path={`${path}/faresignaler`}>
                                                    <Faresignaler risikovurdering={vedtaksperiode.risikovurdering} />
                                                </Route>
                                            )}
                                        </Switch>
                                    </Content>
                                </FlexColumn>
                            </Flex>
                        </AmplitudeProvider>
                    </ErrorBoundary>
                </AutoFlexContainer>
                <LoggContainer>
                    <LoggHeader />
                    <LoggListe />
                </LoggContainer>
            </Flex>
        </div>
    );
};
