import React, { useState } from 'react';

import { Alert, Button, Textarea } from '@navikt/ds-react';

import { Bold } from '@components/Bold';

import styles from './UntattFraAutomatisering.module.css';

interface UnntattFraAutomatiseringTagProps {}

export const UnntattFraAutomatisering: React.FC<UnntattFraAutomatiseringTagProps> = () => {
    const [trykket, useTrykket] = useState(false);

    const åpne = (ting: boolean | ((prevState: boolean) => boolean)) => {
        useTrykket(ting);
    };

    return (
        <Alert variant="info" className={styles.untatt}>
            <Bold>Automatisk behandling stanset av veileder</Bold>
            <Bold>Årsak til stans:</Bold>{' '}
            {!trykket && (
                <div>
                    <Bold>Dato:</Bold>
                    <Button size="xsmall" onClick={() => åpne(true)}>
                        Opphev stans
                    </Button>
                </div>
            )}
            {trykket && (
                <form>
                    <Textarea
                        label="Begrunn oppheving av stans"
                        description="Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn"
                    >
                        hei
                    </Textarea>
                    <Button size="xsmall" onClick={() => åpne(true)}>
                        Opphev stans
                    </Button>
                    <Button variant="secondary" size="xsmall" onClick={() => åpne(false)}>
                        Avbryt
                    </Button>
                </form>
            )}
        </Alert>
    );
};
