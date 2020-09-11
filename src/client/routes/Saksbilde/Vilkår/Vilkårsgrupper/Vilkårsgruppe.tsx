import React, { ReactNode } from 'react';
import { Sjekkikon } from '../../../../components/ikoner/Sjekkikon';
import { Advarselikon } from '../../../../components/ikoner/Advarselikon';
import styled from '@emotion/styled';
import { Infoikon } from '../../../../components/ikoner/Infoikon';
import Vilkårstittel from '../Vilkårstittel';
import { Kryssikon } from '../../../../components/ikoner/Kryssikon';
import { Vilkårgrid } from '../Vilkår.styles';

type Ikontype = 'ok' | 'advarsel' | 'info' | 'kryss';

interface Props {
    tittel: string;
    paragraf?: string;
    ikontype?: Ikontype;
    children?: ReactNode | ReactNode[];
}

const ikon = (type?: Ikontype) => {
    switch (type) {
        case 'ok':
            return <Sjekkikon />;
        case 'advarsel':
            return <Advarselikon />;
        case 'info':
            return <Infoikon />;
        case 'kryss':
            return <Kryssikon />;
        default:
            return undefined;
    }
};

const Container = styled.div`
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
        margin-bottom: 1rem;
    }
`;

const Vilkårsgruppe = ({ tittel, paragraf, ikontype, children }: Props) => {
    return (
        <Container>
            <Vilkårstittel paragraf={paragraf} ikon={ikon(ikontype)}>
                {tittel}
            </Vilkårstittel>
            {children && <Vilkårgrid>{children}</Vilkårgrid>}
        </Container>
    );
};

export default Vilkårsgruppe;
