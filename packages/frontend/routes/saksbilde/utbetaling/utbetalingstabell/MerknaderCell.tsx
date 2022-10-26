import styled from '@emotion/styled';
import React from 'react';

import { BodyShort, Tooltip } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';

import { CellContent } from '../../table/CellContent';

const Container = styled.span`
    display: flex;
    white-space: nowrap;
    gap: 0.25rem;
`;

interface MerknadProps {
    begrunnelse: Begrunnelse;
    alderVedSkjæringstidspunkt?: Maybe<number>;
}

const Merknad: React.FC<MerknadProps> = ({ begrunnelse, alderVedSkjæringstidspunkt }) => {
    switch (begrunnelse) {
        case 'ETTER_DODSDATO':
            return <BodyShort>Personen er død</BodyShort>;
        case 'EGENMELDING_UTENFOR_ARBEIDSGIVERPERIODE':
            return (
                <Tooltip content="Egenmelding utenfor arbeidsgiverperioden">
                    <Container data-testid="Egenmelding utenfor arbeidsgiverperioden">
                        <LovdataLenke paragraf="8-23">§ 8-23</LovdataLenke>
                    </Container>
                </Tooltip>
            );
        case 'MINIMUM_SYKDOMSGRAD':
            return (
                <Tooltip content="Sykdomsgrad under 20 %">
                    <Container data-testid="Sykdomsgrad under 20 %">
                        <LovdataLenke paragraf="8-13">§ 8-13</LovdataLenke>
                    </Container>
                </Tooltip>
            );
        case 'MINIMUM_INNTEKT': {
            const paragraf = (alderVedSkjæringstidspunkt ?? 0) >= 67 ? '8-51' : '8-3';
            return (
                <Tooltip content="Inntekt under krav til minste sykepengegrunnlag">
                    <Container data-testid="Inntekt under krav til minste sykepengegrunnlag">
                        <LovdataLenke paragraf={paragraf}>§ {paragraf}</LovdataLenke>
                    </Container>
                </Tooltip>
            );
        }
        case 'MINIMUM_INNTEKT_OVER_67': {
            return (
                <Tooltip content="Inntekt under krav til minste sykepengegrunnlag">
                    <Container data-testid="Inntekt under krav til minste sykepengegrunnlag">
                        <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                    </Container>
                </Tooltip>
            );
        }
        case 'MANGLER_OPPTJENING':
            return (
                <Tooltip content="Krav til 4 ukers opptjening er ikke oppfylt">
                    <Container data-testid="Krav til 4 ukers opptjening er ikke oppfylt">
                        <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                    </Container>
                </Tooltip>
            );
        case 'MANGLER_MEDLEMSKAP':
            return (
                <Tooltip content="Krav til medlemskap er ikke oppfylt">
                    <Container data-testid="Krav til medlemskap er ikke oppfylt">
                        <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                        <BodyShort> og </BodyShort>
                        <LovdataLenke paragraf="2-" harParagraf={false}>
                            kap. 2
                        </LovdataLenke>
                    </Container>
                </Tooltip>
            );
        case 'SYKEPENGEDAGER_OPPBRUKT_OVER_67':
            return (
                <Tooltip content="Maks antall sykepengedager er nådd">
                    <Container data-testid="Maks antall sykepengedager er nådd">
                        <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                    </Container>
                </Tooltip>
            );
        case 'SYKEPENGEDAGER_OPPBRUKT': {
            return (
                <Tooltip content="Maks antall sykepengedager er nådd">
                    <Container data-testid="Maks antall sykepengedager er nådd">
                        <LovdataLenke paragraf="8-12">§ 8-12</LovdataLenke>
                    </Container>
                </Tooltip>
            );
        }
        case 'OVER_70':
            return (
                <Tooltip content="Personen er 70 år eller eldre">
                    <Container data-testid="Personen er 70 år eller eldre">
                        <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                    </Container>
                </Tooltip>
            );
        default:
            return null;
    }
};

const sisteUtbetalingsdagMerknad = (isMaksdato: boolean): React.ReactNode | undefined =>
    isMaksdato ? 'Siste utbetalingsdag for sykepenger' : undefined;

const foreldetDagMerknad = (isForeldet: boolean): React.ReactNode | undefined =>
    isForeldet ? (
        <Tooltip content="Foreldet">
            <Container data-testid="Foreldet">
                <LovdataLenke paragraf="22-13">§ 22-13</LovdataLenke>
            </Container>
        </Tooltip>
    ) : undefined;

const avvisningsårsakerMerknad = (dag: UtbetalingstabellDag, alderVedSkjæringstidspunkt?: Maybe<number>) =>
    dag.begrunnelser?.map((begrunnelse, i) => (
        <React.Fragment key={i}>
            {i !== 0 && <BodyShort>,&nbsp;</BodyShort>}
            <Merknad begrunnelse={begrunnelse} alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt} />
        </React.Fragment>
    ));

interface MerknaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    dag: UtbetalingstabellDag;
    alderVedSkjæringstidspunkt?: Maybe<number>;
}

export const MerknaderCell = ({ dag, alderVedSkjæringstidspunkt, ...rest }: MerknaderCellProps) => (
    <td {...rest}>
        <CellContent>
            {sisteUtbetalingsdagMerknad(dag.erMaksdato) ??
                foreldetDagMerknad(dag.erForeldet) ??
                avvisningsårsakerMerknad(dag, alderVedSkjæringstidspunkt)}
        </CellContent>
    </td>
);
