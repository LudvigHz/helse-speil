import React from 'react';
import { Vilkårstittel } from '../Vilkårstittel';
import { Vilkårdata } from '../../../../mapping/vilkår';
import BehandletAvInfotrygd from '@navikt/helse-frontend-behandlet-av-infotrygd';
import { Sjekkikon } from '../../../../components/ikoner/Sjekkikon';
import styled from '@emotion/styled';
import { Vilkårkolonne } from '../Vilkår.styles';

const VurdertTittel = styled(Vilkårstittel)`
    &:not(:last-of-type) {
        margin: 1rem 0;
    }
`;

interface VurdertIInfotrygdProps {
    vilkår: Vilkårdata[];
}

export const VurdertIInfotrygd = ({ vilkår }: VurdertIInfotrygdProps) => (
    <Vilkårkolonne data-testid="vurdert-i-infotrygd">
        <BehandletAvInfotrygd tittel="Inngangsvilkår vurdert i Infotrygd">
            {vilkår.map(({ tittel, paragraf, komponent, type }, i) => (
                <VurdertTittel type={type} ikon={<Sjekkikon />} paragraf={paragraf} key={i}>
                    {tittel}
                </VurdertTittel>
            ))}
        </BehandletAvInfotrygd>
    </Vilkårkolonne>
);
