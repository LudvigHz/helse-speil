import React, { ReactNode } from 'react';
import { IkonDialog } from './icons/IkonDialog';
import { IkonHistorikk } from './icons/IkonHistorikk';
import { IkonDokumenter } from './icons/IkonDokumenter';
import { HendelseMedTidspunkt, mapDokumenter, mapGodkjenninger, mapOverstyringer } from './mapping';
import {
    Hendelse as LoggHendelse,
    Hendelsetype,
    LoggProvider as EksternLoggProvider,
} from '@navikt/helse-frontend-logg';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';
import { UfullstendigVedtaksperiode, Vedtaksperiode } from 'internal-types';

interface LoggProviderProps {
    children: ReactNode | ReactNode[];
}

export const LoggProvider = ({ children }: LoggProviderProps) => {
    const aktivVedtaksperiode = useAktivVedtaksperiode() as Vedtaksperiode | UfullstendigVedtaksperiode;

    const erFullstendig = (periode: Vedtaksperiode | UfullstendigVedtaksperiode): boolean => !!periode?.kanVelges;

    const dokumenter =
        (erFullstendig(aktivVedtaksperiode) && mapDokumenter(aktivVedtaksperiode as Vedtaksperiode)) || [];
    const overstyringer =
        (erFullstendig(aktivVedtaksperiode) && mapOverstyringer(aktivVedtaksperiode as Vedtaksperiode)) || [];
    const godkjenninger =
        (erFullstendig(aktivVedtaksperiode) && mapGodkjenninger(aktivVedtaksperiode as Vedtaksperiode)) || [];

    const hendelser = [...dokumenter, ...overstyringer, ...godkjenninger].sort(hendelsesorterer).map(tilEksternType);

    return (
        <EksternLoggProvider
            hendelser={hendelser}
            filtere={[
                {
                    filterFunction: (_: LoggHendelse) => true,
                    renderProp: <IkonHistorikk />,
                    disabled: hendelser.length === 0,
                },
                {
                    filterFunction: (hendelse: LoggHendelse) => hendelse.type === Hendelsetype.Dokumenter,
                    renderProp: <IkonDokumenter />,
                    disabled: hendelser.find(({ type }) => type === Hendelsetype.Dokumenter) === undefined,
                },
                {
                    filterFunction: (hendelse: LoggHendelse) => hendelse.type === Hendelsetype.Meldinger,
                    renderProp: <IkonDialog />,
                    disabled: hendelser.find(({ type }) => type === Hendelsetype.Meldinger) === undefined,
                },
            ]}
        >
            {children}
        </EksternLoggProvider>
    );
};

const tilEksternType = (intern: HendelseMedTidspunkt) => ({
    ...intern,
    dato: intern.tidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato',
});

const hendelsesorterer = (a: HendelseMedTidspunkt, b: HendelseMedTidspunkt): number => {
    if (a.tidspunkt === undefined) return -1;
    if (b.tidspunkt === undefined) return 1;
    return b.tidspunkt.diff(a.tidspunkt);
};
