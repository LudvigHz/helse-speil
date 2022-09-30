import styled from '@emotion/styled';
import React, { useState } from 'react';

import { LinkButton } from '@components/LinkButton';
import { TableModal } from '@components/TableModal';
import { Personinfo } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { getFormatertNavn } from '@utils/string';

import { NotatListeRad } from './NotatListeRad';
import { NyttNotatModal } from './NyttNotatModal';

const Title = styled.div`
    > p:first-of-type {
        font-size: 18px;
        margin-bottom: 0.5rem;
    }

    > p:not(:first-of-type) {
        font-size: 14px;
        font-weight: normal;
    }
`;

interface NotatListeModalProps {
    notater: Notat[];
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    onClose: (event: React.SyntheticEvent) => void;
    erPåVent?: boolean;
    notattype: NotatType;
}

const getModalTittel = (notattype: NotatType): string => {
    switch (notattype) {
        case 'PaaVent':
            return 'Lagt på vent - notater';
        case 'Retur':
            return 'Retur - notater';
        default:
            return 'Notater';
    }
};

export const NotatListeModal = ({
    notater,
    vedtaksperiodeId,
    personinfo,
    onClose,
    erPåVent,
    notattype,
}: NotatListeModalProps) => {
    const [showNyttNotatModal, setShowNyttNotatModal] = useState(false);
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const søkernavn = getFormatertNavn(personinfo);
    const modalTittel = getModalTittel(notattype);

    const closeModal = (event: React.SyntheticEvent) => {
        onClose(event);
    };

    const toggleShowNyttNotatModal = () => {
        setShowNyttNotatModal((prevState) => !prevState);
    };

    return showNyttNotatModal ? (
        <NyttNotatModal
            onClose={toggleShowNyttNotatModal}
            personinfo={personinfo}
            vedtaksperiodeId={vedtaksperiodeId}
            notattype={notattype}
        />
    ) : (
        <TableModal
            title={
                <Title>
                    <p>{modalTittel}</p>
                    <p>Søker: {søkernavn}</p>
                </Title>
            }
            contentLabel={modalTittel}
            isOpen
            onRequestClose={closeModal}
        >
            <thead>
                <tr>
                    <th>Dato</th>
                    <th>Saksbehandler</th>
                    <th>Kommentar</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {notater
                    .filter((it) => it.type === notattype)
                    .map((notat) => (
                        <NotatListeRad
                            key={notat.id}
                            notat={notat}
                            vedtaksperiodeId={vedtaksperiodeId}
                            innloggetSaksbehandler={innloggetSaksbehandler}
                        />
                    ))}
            </tbody>
            {erPåVent && notattype === 'PaaVent' && (
                <tfoot>
                    <tr>
                        <td colSpan={4} style={{ textAlign: 'right', paddingTop: '1.5rem' }}>
                            <LinkButton onClick={toggleShowNyttNotatModal}>Legg til nytt notat</LinkButton>
                        </td>
                    </tr>
                </tfoot>
            )}
        </TableModal>
    );
};
