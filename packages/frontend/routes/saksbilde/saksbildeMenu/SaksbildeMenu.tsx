import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { onLazyLoadFail } from '@utils/error';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetVilkarsprovdPeriode } from '@utils/typeguards';

import { DropdownMenu } from './dropdown/DropdownMenu';

import styles from './SaksbildeMenu.module.css';

const HistorikkHeader = React.lazy(() =>
    import('../historikk/HistorikkHeader.js').then((res) => ({ default: res.HistorikkHeader })).catch(onLazyLoadFail),
);

const SaksbildeMenuGhostPeriode: React.FC = () => (
    <div className={styles.SaksbildeMenu}>
        <div>
            <nav className={styles.TabList} role="tablist">
                <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" />
            </nav>
            <DropdownMenu />
        </div>
        <HistorikkHeader />
    </div>
);

interface SaksbildeMenuBeregnetPeriodeProps {
    activePeriod: FetchedBeregnetPeriode;
}

const SaksbildeMenuBeregnetPeriode = ({ activePeriod }: SaksbildeMenuBeregnetPeriodeProps) => (
    <div className={styles.SaksbildeMenu}>
        <div>
            <nav className={styles.TabList} role="tablist">
                <NavLenke to="forslag-til-vedtak" tittel="Forslag til vedtak" />
                <NavLenke to="inngangsvilkår" tittel="Inngangsvilkår" />
                <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" />
                {activePeriod.risikovurdering?.funn && activePeriod.risikovurdering?.funn?.length > 0 && (
                    <NavLenke to="faresignaler" tittel="Faresignaler" />
                )}
            </nav>
            <DropdownMenu />
        </div>
        <HistorikkHeader />
    </div>
);

const SaksbildeMenuUberegnetVilkarsprovdPeriode: React.FC = () => (
    <div className={styles.SaksbildeMenu}>
        <div>
            <nav className={styles.TabList} role="tablist">
                <NavLenke to="forslag-til-vedtak" tittel="Forslag til vedtak" />
                <NavLenke to="inngangsvilkår" tittel="Inngangsvilkår" />
                <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" />
            </nav>
            <DropdownMenu />
        </div>
        <HistorikkHeader />
    </div>
);

const SaksbildeMenuUberegnetPeriode: React.FC = () => (
    <div className={styles.SaksbildeMenu}>
        <div>
            <nav className={styles.TabList} role="tablist">
                <NavLenke to="forslag-til-vedtak" tittel="Forslag til vedtak" />
            </nav>
            <DropdownMenu />
        </div>
        <HistorikkHeader />
    </div>
);

const NavLenke = ({ tittel, to }: { tittel: string; to: string }) => (
    <NavLink
        className={({ isActive }) => classNames([styles.NavLink], { [styles.ActiveLink]: isActive })}
        to={to}
        title={tittel}
    >
        {tittel}
    </NavLink>
);

const SaksbildeMenuContainer: React.FC = () => {
    const activePeriod = useActivePeriod();
    const { loading } = useFetchPersonQuery();

    if (loading) {
        return <SaksbildeMenuSkeleton />;
    }

    if (!activePeriod) {
        return null;
    }

    if (isBeregnetPeriode(activePeriod)) {
        return <SaksbildeMenuBeregnetPeriode activePeriod={activePeriod} />;
    }

    if (isGhostPeriode(activePeriod)) {
        return <SaksbildeMenuGhostPeriode />;
    }

    if (isUberegnetVilkarsprovdPeriode(activePeriod)) {
        return <SaksbildeMenuUberegnetVilkarsprovdPeriode />;
    }

    return <SaksbildeMenuUberegnetPeriode />;
};

const SaksbildeMenuSkeleton: React.FC = () => {
    return (
        <div className={classNames(styles.SaksbildeMenu, styles.Skeleton)}>
            <span className={styles.TabList}>
                <LoadingShimmer />
                <LoadingShimmer />
                <LoadingShimmer />
                <DropdownMenu />
            </span>
        </div>
    );
};

const SaksbildeMenuError: React.FC = () => {
    return (
        <div className={classNames(styles.SaksbildeMenu, styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise saksbildemeny.</BodyShort>
        </div>
    );
};

export const SaksbildeMenu: React.FC = () => {
    return (
        <React.Suspense fallback={<SaksbildeMenuSkeleton />}>
            <ErrorBoundary fallback={<SaksbildeMenuError />}>
                <SaksbildeMenuContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};
