import classNames from 'classnames';
import React from 'react';

import { Clock, DialogDots, Folder } from '@navikt/ds-icons';

import { TabButton } from '@components/TabButton';

import { useFilterState, useShowHistorikkState } from './state';

import styles from './HistorikkHeader.module.css';

export const HistorikkHeader = () => {
    const [filter, setFilter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();

    const activateFilter = (filter: Filtertype) => () => {
        setShowHistorikk(true);
        setFilter(filter);
    };

    return (
        <div className={styles.HistorikkHeader}>
            <TabButton
                className={styles.FilterButton}
                active={showHistorikk && filter === 'Historikk'}
                onClick={activateFilter('Historikk')}
                title="Historikk"
            >
                <Clock title="Clock-icon" height={22} width={22} />
            </TabButton>
            <TabButton
                className={styles.FilterButton}
                active={showHistorikk && filter === 'Dokument'}
                onClick={activateFilter('Dokument')}
                title="Dokumenter"
            >
                <Folder title="Folder-icon" height={22} width={22} />
            </TabButton>
            <TabButton
                className={classNames(styles.FilterButton)}
                active={showHistorikk && filter === 'Notat'}
                onClick={activateFilter('Notat')}
                title="Notat"
            >
                <DialogDots title="Dialog-icon" height={22} width={22} />
            </TabButton>
        </div>
    );
};
