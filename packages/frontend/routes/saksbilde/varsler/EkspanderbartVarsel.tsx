import classNames from 'classnames';
import React, { useState } from 'react';

import { Accordion } from '@navikt/ds-react';

import { VarselDto } from '@io/graphql';

import { Varsel } from './Varsel';
import { Varselseksjon } from './Varselseksjon';
import { VarselstatusType } from './Varsler';

import styles from './EkspanderbartVarsel.module.css';

interface EkspanderbartVarselProps {
    varsel: VarselDto;
    type: VarselstatusType;
}

export const EkspanderbartVarsel: React.FC<EkspanderbartVarselProps> = ({ varsel, type }) => {
    const [open, setOpen] = useState(false);

    return (
        <Accordion.Item defaultOpen={open} className={classNames(styles.ekspanderbartVarsel, styles[type])}>
            <Accordion.Header onClick={() => setOpen(!open)}>
                <Varsel className={styles.varsel} varsel={varsel} type={type} />
            </Accordion.Header>
            <Accordion.Content className={classNames(styles.content, styles[type])}>
                <Varselseksjon tittel="Hva betyr det?">{varsel.forklaring}</Varselseksjon>
                <Varselseksjon tittel="Hva gjør du?">{varsel.handling}</Varselseksjon>
            </Accordion.Content>
        </Accordion.Item>
    );
};
