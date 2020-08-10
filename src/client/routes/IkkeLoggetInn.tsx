import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import styled from '@emotion/styled';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100% - 3em);

    p {
        font-size: 1.5rem;
        padding: 0.5rem;
    }
`;

export const IkkeLoggetInn = () => (
    <Container>
        <Normaltekst>Du må logge inn for å få tilgang til systemet</Normaltekst>
        <Normaltekst>
            <Lenke href="/">Gå til innloggingssiden</Lenke>
        </Normaltekst>
    </Container>
);
