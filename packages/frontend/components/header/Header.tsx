import React from 'react';
import { Link } from 'react-router-dom';

import { Header as InternalHeader } from '@navikt/ds-react-internal';

import { SystemMenu } from '@components/SystemMenu';
import { UserMenu } from '@components/UserMenu';
import { Personsøk } from '@components/header/Personsøk';
import { graphqlplayground, toggleMeny } from '@utils/featureToggles';

import { EasterEgg } from '../../EasterEgg';
import { ToggleMenyButton } from './ToggleMeny/ToggleMenyButton';

import styles from './Header.module.css';

export const Header = () => {
    return (
        <InternalHeader className={styles.Header}>
            <InternalHeader.Title as="h1">
                <Link to="/" className={styles.Link}>
                    NAV Sykepenger
                </Link>
            </InternalHeader.Title>
            <Personsøk />
            <EasterEgg />
            {toggleMeny && <ToggleMenyButton />}
            {graphqlplayground && (
                <InternalHeader.Title as="h1">
                    <Link to="/playground" className={styles.Link}>
                        GraphQL Playground
                    </Link>
                </InternalHeader.Title>
            )}
            <SystemMenu />
            <UserMenu />
        </InternalHeader>
    );
};
