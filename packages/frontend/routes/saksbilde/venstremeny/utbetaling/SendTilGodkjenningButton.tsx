import { nanoid } from 'nanoid';
import React, { ReactNode, useContext, useState } from 'react';

import { Alert, BodyShort, Button } from '@navikt/ds-react';

import { Key, useKeyboard } from '@hooks/useKeyboard';
import { AmplitudeContext } from '@io/amplitude';
import { postUtbetalingTilTotrinnsvurdering } from '@io/http';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useAddToast } from '@state/toasts';
import { isBeregnetPeriode, isPerson } from '@utils/typeguards';

import { NyttNotatModal } from '../../../oversikt/table/rader/notat/NyttNotatModal';
import { UtbetalingModal } from './UtbetalingModal';

import styles from './SendTilGodkjenningButton.module.css';

const useAddSendtTilGodkjenningtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Saken er sendt til beslutter',
            timeToLiveMs: 5000,
            key: nanoid(),
            variant: 'success',
        });
    };
};

interface SendTilGodkjenningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError'> {
    children: ReactNode;
    oppgavereferanse: string;
    manglerNotatVedVurderLovvalgOgMedlemskapVarsel?: boolean;
    disabled: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const SendTilGodkjenningButton: React.FC<SendTilGodkjenningButtonProps> = ({
    children,
    oppgavereferanse,
    manglerNotatVedVurderLovvalgOgMedlemskapVarsel,
    disabled = false,
    onSuccess,
    onError,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [showGenereltNotatModal, setShowGenereltNotatModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const amplitude = useContext(AmplitudeContext);
    const addToast = useAddSendtTilGodkjenningtoast();
    const activePeriod = useActivePeriod();
    const person = useCurrentPerson();

    useKeyboard({
        [Key.F6]: {
            action: () =>
                manglerNotatVedVurderLovvalgOgMedlemskapVarsel ? setShowGenereltNotatModal(true) : setShowModal(true),
            ignoreIfModifiers: false,
        },
    });

    if (!isPerson(person) || !isBeregnetPeriode(activePeriod)) {
        return null;
    }

    const closeModal = () => setShowModal(false);
    const closeGenereltNotatModal = () => setShowGenereltNotatModal(false);

    const sendTilGodkjenning = () => {
        setIsSending(true);
        postUtbetalingTilTotrinnsvurdering(oppgavereferanse)
            .then(() => {
                amplitude.logTotrinnsoppgaveTilGodkjenning();
                addToast();
                onSuccess?.();
            })
            .catch((error) => {
                if (error.statusCode === 409) {
                    onError?.({ ...error, message: 'Saken er allerede utbetalt.' });
                } else onError?.(error);
            })
            .finally(() => {
                setIsSending(false);
                closeModal();
            });
    };

    return (
        <>
            <Button
                disabled={disabled}
                variant="primary"
                size="small"
                data-testid="godkjenning-button"
                onClick={() =>
                    manglerNotatVedVurderLovvalgOgMedlemskapVarsel
                        ? setShowGenereltNotatModal(true)
                        : setShowModal(true)
                }
                {...buttonProps}
            >
                {children}
            </Button>
            {showModal && (
                <UtbetalingModal
                    onClose={closeModal}
                    onApprove={sendTilGodkjenning}
                    isSending={isSending}
                    totrinnsvurdering={true}
                />
            )}
            {showGenereltNotatModal && (
                <NyttNotatModal
                    onClose={closeGenereltNotatModal}
                    personinfo={person.personinfo}
                    vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                    notattype="Generelt"
                    ekstraInnhold={
                        <Alert className={styles.ManglerLovvalgOgMedlemskapNotat} variant="warning">
                            <BodyShort className={styles.NotatParagraf}>
                                Du må skrive notat for lovvalg og medlemskap før du sender oppgaven til beslutter.
                            </BodyShort>
                        </Alert>
                    }
                />
            )}
        </>
    );
};
