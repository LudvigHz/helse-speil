import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Dropdown } from '@navikt/ds-react-internal';
import { Loader } from '@navikt/ds-react';
import { useOperationErrorHandler } from '@state/varsler';
import { useFjernPåVent, useLeggPåVent } from '@state/person';
import { ignorePromise } from '@utils/promise';
import { Personinfo } from '@io/graphql';

import { NyttNotatModal } from '../../../oversikt/table/rader/notat/NyttNotatModal';

interface PåVentDropdownMenuButtonProps {
    oppgavereferanse: string;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    erPåVent?: boolean;
}

export const PåVentDropdownMenuButton = ({
    erPåVent,
    oppgavereferanse,
    vedtaksperiodeId,
    personinfo,
}: PåVentDropdownMenuButtonProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const [visModal, setVisModal] = useState(false);

    const history = useHistory();
    const leggPåVentMedNotat = useLeggPåVent();
    const fjernPåVent = useFjernPåVent();
    const errorHandler = useOperationErrorHandler('Legg på vent');

    const settPåVent = (notattekst: string) => {
        setIsFetching(true);
        ignorePromise(
            leggPåVentMedNotat(oppgavereferanse, { tekst: notattekst, type: 'PaaVent' }).then(() => {
                history.push('/');
            }),
            errorHandler,
        );
    };

    const fjernFraPåVent = () => {
        setIsFetching(true);
        ignorePromise(
            fjernPåVent(oppgavereferanse).finally(() => {
                setIsFetching(false);
            }),
            errorHandler,
        );
    };

    return (
        <>
            {erPåVent ? (
                <Dropdown.Menu.List.Item onClick={fjernFraPåVent}>
                    Fjern fra på vent
                    {isFetching && <Loader size="xsmall" />}
                </Dropdown.Menu.List.Item>
            ) : (
                <Dropdown.Menu.List.Item onClick={() => setVisModal(true)}>Legg på vent</Dropdown.Menu.List.Item>
            )}
            {visModal && (
                <NyttNotatModal
                    onClose={() => setVisModal(false)}
                    personinfo={personinfo}
                    vedtaksperiodeId={vedtaksperiodeId}
                    onSubmitOverride={settPåVent}
                    notattype="PaaVent"
                />
            )}
        </>
    );
};
