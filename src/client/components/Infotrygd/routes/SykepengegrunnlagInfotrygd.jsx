import React, { useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { item } from '../../../datamapping/mappingUtils';
import { PersonContext } from '../../../context/PersonContext';
import { toLocaleFixedNumberString } from '../../../utils/locale';

const SykepengegrunnlagInfotrygd = () => {
    const { inntektskilder } = useContext(PersonContext).personTilBehandling;
    const inntektsmeldingItems = inntektskilder && [
        item(
            'Beregnet månedsinntekt',
            `${toLocaleFixedNumberString(inntektskilder.månedsinntekt, 2)} kr`
        ),
        item('Omregnet årsinntekt', `${toLocaleFixedNumberString(inntektskilder.årsinntekt, 2)} kr`)
    ];

    return (
        <>
            <h2>Sykepengegrunnlag</h2>
            <span className="Infotrygd__content">
                <InfotrygdList>
                    <InfotrygdListItem label="Hentet fra inntektsmeldingen" status="OK" />
                    {inntektsmeldingItems.map(item => (
                        <InfotrygdListItem label={item.label}>{item.value}</InfotrygdListItem>
                    ))}
                    <InfotrygdListItem label="A-ordningen må sjekkes manuelt" status="!" />
                </InfotrygdList>
            </span>
        </>
    );
};

export default SykepengegrunnlagInfotrygd;
