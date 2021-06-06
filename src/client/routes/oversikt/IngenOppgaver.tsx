import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { Sidetittel } from 'nav-frontend-typografi';

import agurk from '../../assets/ingen-oppgaver-agurk.png';
import fredagstaco from '../../assets/ingen-oppgaver-fredagstaco.png';
import brevkasse from '../../assets/ingen-oppgaver.png';

import { useAktivTab } from './tabs';

const Container = styled.div`
    align-self: flex-start;
    width: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
`;

const Tekst = styled(Sidetittel)`
    margin: 2rem 0 0;
    font-size: 1.25rem;
    flex: 1;
`;

const erFredag = () => dayjs().isoWeekday() === 5;

export const IngenOppgaver = () => {
    const aktivTab = useAktivTab();

    switch (aktivTab) {
        case 'alle':
            return (
                <Container>
                    {erFredag() ? (
                        <img alt="Agurk med armer og bein ikledd sombrero som holder en taco" src={fredagstaco} />
                    ) : (
                        <img alt="Agurk med armer og bein som holder kaffekopp" src={agurk} />
                    )}
                    <Tekst>Ooops! Ingen saker å plukke...</Tekst>
                </Container>
            );
        case 'mine':
            return (
                <Container>
                    <img alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Tekst>Du har ingen tildelte saker</Tekst>
                </Container>
            );
        case 'ventende':
            return (
                <Container>
                    <img alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Tekst>Du har ingen saker på vent</Tekst>
                </Container>
            );
        default:
            return null;
    }
};
