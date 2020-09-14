import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../context/PersonContext';
import { Location, useNavigation } from '../hooks/useNavigation';
import { Person } from 'internal-types';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/authentication';
import { HeaderEnkel, Søk } from '@navikt/helse-frontend-header';
import '@navikt/helse-frontend-header/lib/main.css';
import { Link } from 'react-router-dom';

const Container = styled.div`
    flex-shrink: 0;
    height: max-content;
    width: 100%;
    > header {
        max-width: unset;
        min-width: 100vw;
        box-sizing: border-box;
    }
`;

export const Header = () => {
    const { name, ident, isLoggedIn } = useRecoilValue(authState);
    const { hentPerson } = useContext(PersonContext);
    const { navigateTo } = useNavigation();

    const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };

    const onSøk = (value: string) => {
        hentPerson(value)
            .then((person: Person) => {
                navigateTo(Location.Sykmeldingsperiode, person.aktørId);
            })
            .catch((_) => {
                /* Error håndtert i hentPerson i PersonContext */
            });
    };

    return (
        <Container>
            <HeaderEnkel tittel={<Link to="/">NAV Sykepenger</Link>} brukerinfo={brukerinfo}>
                <Søk onSøk={onSøk} />
            </HeaderEnkel>
        </Container>
    );
};
