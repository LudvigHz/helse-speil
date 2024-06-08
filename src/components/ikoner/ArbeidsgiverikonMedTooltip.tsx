import React, { PropsWithChildren } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { useAppSelector } from '@store/hooks';

interface ArbeidsgiverikonMedTooltipProps {
    tooltipTekst?: Maybe<string>;
    className?: string;
    onClick?: () => void;
}

export const ArbeidsgiverikonMedTooltip = ({
    className,
    tooltipTekst = null,
    onClick,
    children,
}: PropsWithChildren<ArbeidsgiverikonMedTooltipProps>) => {
    const erAnonymisert = useAppSelector((state) => state.anonymisering);

    return (
        <Tooltip content={tooltipTekst && !erAnonymisert ? tooltipTekst : 'Arbeidsgiver'}>
            <div className={className} onClick={onClick}>
                <Arbeidsgiverikon alt="Arbeidsgiver" />
                {children}
            </div>
        </Tooltip>
    );
};
