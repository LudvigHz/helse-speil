import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';

import { Accordion, Alert } from '@navikt/ds-react';

import styles from './EkspanderbartVarsel.module.css';

interface EkspanderbartVarselProps {
    label: ReactNode;
    children: ReactNode;
    type?: 'error' | 'warning' | 'info' | 'success';
}

export const EkspanderbartVarsel: React.FC<EkspanderbartVarselProps> = ({ label, children, type = 'warning' }) => {
    const [open, setOpen] = useState(false);

    return (
        <Accordion.Item defaultOpen={open} className={classNames(styles.EkspanderbartVarsel, styles[type])}>
            <Accordion.Header onClick={() => setOpen(!open)}>
                <Alert className={styles.Alert} variant={type ?? 'warning'}>
                    {label}
                </Alert>
            </Accordion.Header>
            <Accordion.Content className={classNames(styles.Content, styles[type])}>{children}</Accordion.Content>
        </Accordion.Item>
    );
};
