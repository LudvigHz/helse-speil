import React, { ReactNode } from 'react';
import { Alert, Loader } from '@navikt/ds-react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { isNotReady } from '@state/periode';
import { onLazyLoadFail } from '@utils/error';
import { Dag, Sykdomsdagtype, UberegnetPeriode } from '@io/graphql';

import { Venstremeny } from '../venstremeny/Venstremeny';

import styles from './PeriodeView.module.css';

const Utbetaling = React.lazy(() => import('../utbetaling/Utbetaling').catch(onLazyLoadFail));

const containsOnly = (days: Array<Dag>, ...dayTypes: Array<Sykdomsdagtype>): boolean => {
    const weekends = [Sykdomsdagtype.SykHelgedag, Sykdomsdagtype.FriskHelgedag];
    return days.every((dag) => [...dayTypes, ...weekends].includes(dag.sykdomsdagtype));
};

const containsPayment = (days: Array<Dag>): boolean => {
    return days.some((day) => typeof day.utbetalingsinfo?.utbetaling === 'number');
};

const getErrorMessage = (period: UberegnetPeriode): ReactNode => {
    if (isNotReady(period)) {
        return (
            <Alert className={styles.Varsel} variant="info">
                Perioden har ingen utbetaling og er ikke beregnet.
            </Alert>
        );
    }

    if (containsOnly(period.tidslinje, Sykdomsdagtype.Feriedag)) {
        return (
            <Alert className={styles.Varsel} variant="info">
                Perioden inneholder kun ferie og er ikke beregnet.
            </Alert>
        );
    }

    if (containsOnly(period.tidslinje, Sykdomsdagtype.Permisjonsdag)) {
        return (
            <Alert className={styles.Varsel} variant="info">
                Perioden inneholder kun permisjon og er ikke beregnet.
            </Alert>
        );
    }

    if (!containsPayment(period.tidslinje)) {
        return (
            <Alert className={styles.Varsel} variant="info">
                Perioden har ingen utbetaling og er ikke beregnet.
            </Alert>
        );
    }

    return (
        <Alert className={styles.Varsel} variant="info">
            Perioden er ikke beregnet.
        </Alert>
    );
};

const UberegnetPeriodeViewLoader: React.VFC = () => {
    return (
        <div className={styles.Skeleton}>
            <Loader size="xlarge" />
        </div>
    );
};

interface UberegnetPeriodeViewProps {
    activePeriod: UberegnetPeriode;
}

export const UberegnetPeriodeView = ({ activePeriod }: UberegnetPeriodeViewProps) => {
    const errorMelding = getErrorMessage(activePeriod);

    const { path } = useRouteMatch();

    return (
        <>
            <Venstremeny />
            <div className={styles.Content}>
                {errorMelding}
                <div className={styles.RouteContainer}>
                    <Switch>
                        <React.Suspense fallback={<UberegnetPeriodeViewLoader />}>
                            <Route path={`${path}/utbetaling`}>
                                <Utbetaling />
                            </Route>
                        </React.Suspense>
                    </Switch>
                </div>
            </div>
        </>
    );
};

export default UberegnetPeriodeView;
