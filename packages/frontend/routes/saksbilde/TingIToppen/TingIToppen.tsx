import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useCurrentPerson, useFetchPersonQuery } from '@state/person';

import { UnntattFraAutomatisering } from './UnntattFraAutomatisering';

import styles from '../personHeader/PersonHeader.module.css';

const TingIToppen: React.FC = () => {
    const currentPerson = useCurrentPerson();
    const { loading } = useFetchPersonQuery();

    if (loading) {
        return <div></div>;
    }

    if (!currentPerson) {
        return <div />;
    }

    if (currentPerson.personinfo.unntattFraAutomatisering.erUntatt) {
        return <UnntattFraAutomatisering />;
    }

    return null;
};

const TingError: React.FC = () => {
    return (
        <div className={classNames(styles.Error)}>
            <BodyShort>Det oppstod en feil, speil vet ingenting om stoppknapp.</BodyShort>
        </div>
    );
};

export const TingIToppenTing: React.FC = () => {
    return (
        <ErrorBoundary fallback={<TingError />}>
            <TingIToppen />
        </ErrorBoundary>
    );
};
