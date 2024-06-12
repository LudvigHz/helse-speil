import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import styles from './table.module.css';

export const OppgaverTableError = (): ReactElement => {
    return (
        <div className={styles.TableContainer}>
            <div className={styles.Content}>
                <Alert variant="error" size="small">
                    Vi klarte ikke hente oppgaver. Prøv igjen senere eller kontakt en utvikler hvis problemet
                    fortsetter.
                </Alert>
            </div>
        </div>
    );
};
