import React, { CSSProperties, ReactNode } from 'react';
import styled from '@emotion/styled';
import { LasterUtsnittsvelger, Utsnittsvelger } from './Utsnittsvelger';
import { useTidslinjerader } from './useTidslinjerader';
import { useInfotrygdrader } from './useInfotrygdrader';
import { Flex, FlexColumn } from '../Flex';
import { Person, Vedtaksperiode } from 'internal-types';
import { useSetAktivVedtaksperiode } from '../../state/vedtaksperiode';
import { AxisLabels, Pins, Row } from '@navikt/helse-frontend-timeline/lib';
import '@navikt/helse-frontend-timeline/lib/main.css';
import { TekstMedEllipsis } from '../TekstMedEllipsis';
import { Tidslinjeperiode } from './Tidslinjeperiode';
import { Arbeidsgiverikon } from '../ikoner/Arbeidsgiverikon';
import { Infotrygdikon } from '../ikoner/Infotrygdikon';
import { PinsTooltip, TidslinjeTooltip } from './TidslinjeTooltip';
import { useTidslinjeutsnitt } from './useTidslinjeutsnitt';
import { maksdatoForPeriode, sisteValgbarePeriode } from '../../mapping/selectors';
import { Undertekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';

dayjs.locale('nb');

const Container = styled(FlexColumn)`
    position: relative;
    padding: 14px 32px 16px 32px;
    border-bottom: 1px solid var(--navds-color-border);

    > div:last-of-type {
        position: relative;
        margin-top: 1rem;
    }
`;

interface Props {
    person: Person;
    aktivVedtaksperiode?: Vedtaksperiode;
}

export const LasterTidslinje = () => {
    return (
        <Container>
            <LasterUtsnittsvelger />
        </Container>
    );
};

const RadContainer = styled(Flex)`
    &:not(:last-of-type) {
        margin-bottom: 24px;
    }
`;

interface HorizontalOffsetProps {
    horizontalOffset: number;
}

const AxisLabelsContainer = styled.div<HorizontalOffsetProps>`
    ${({ horizontalOffset }) => `margin-left: ${horizontalOffset}px;`}
`;

const PinsContainer = styled.div<HorizontalOffsetProps>`
    ${({ horizontalOffset }) => `margin-left: ${horizontalOffset}px;
    width: calc(100% - ${horizontalOffset}px);`}
    position: absolute;
    height: 100%;
`;

interface ArbeidsgivernavnProps {
    width: number;
}

const Arbeidsgivernavn = styled(Flex)<ArbeidsgivernavnProps>`
    align-items: center;
    font-size: 14px;
    color: var(--navds-color-text-primary);
    line-height: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;

    > svg:first-of-type {
        margin-right: 1rem;
    }

    ${({ width }) => `width: ${width}px;`};
`;

const Tidslinjerad = styled(Row)`
    flex: 1;
`;

export const Tidslinje = ({ person, aktivVedtaksperiode }: Props) => {
    const setAktivVedtaksperiode = useSetAktivVedtaksperiode();
    const { utsnitt, aktivtUtsnitt, setAktivtUtsnitt } = useTidslinjeutsnitt(person);

    const fom = utsnitt[aktivtUtsnitt].fom;
    const tom = utsnitt[aktivtUtsnitt].tom;

    const tidslinjerader = useTidslinjerader(person, fom, tom, aktivVedtaksperiode);
    const infotrygdrader = useInfotrygdrader(person, fom, tom);

    const tidslinjeradOffset = 250;

    const maksdato = () => {
        const sistePeriode = sisteValgbarePeriode(person);
        const dato = sistePeriode && maksdatoForPeriode(sistePeriode);
        return dato && dato.isBefore(tom) && dato.isAfter(fom)
            ? {
                  date: dato.toDate(),
                  render: (
                      <PinsTooltip>
                          <Undertekst>Maksdato: {dato.format(NORSK_DATOFORMAT)}</Undertekst>
                      </PinsTooltip>
                  ),
                  style: {
                      zIndex: 1,
                  },
              }
            : undefined;
    };

    const pins = (): { date: Date; render: ReactNode; style: CSSProperties }[] => {
        const _maksdato = maksdato();
        return _maksdato ? [_maksdato] : [];
    };

    return (
        <Container>
            <FlexColumn>
                <AxisLabelsContainer horizontalOffset={tidslinjeradOffset}>
                    <AxisLabels start={fom} slutt={tom} direction={'right'} />
                </AxisLabelsContainer>
                <PinsContainer horizontalOffset={tidslinjeradOffset}>
                    <Pins start={fom.toDate()} slutt={tom.toDate()} direction={'right'} pins={pins()} />
                </PinsContainer>
                {tidslinjerader.map(({ id, perioder, arbeidsgiver }) => (
                    <RadContainer key={id}>
                        <Arbeidsgivernavn width={tidslinjeradOffset}>
                            <Arbeidsgiverikon />
                            <TekstMedEllipsis data-tip={arbeidsgiver}>{arbeidsgiver}</TekstMedEllipsis>
                        </Arbeidsgivernavn>
                        <Tidslinjerad>
                            {perioder.map((it) => (
                                <Tidslinjeperiode
                                    key={it.id}
                                    id={it.id}
                                    style={it.style}
                                    className={it.tilstand}
                                    hoverLabel={<TidslinjeTooltip>{it.hoverLabel}</TidslinjeTooltip>}
                                    skalVisePin={it.skalVisePin}
                                    onClick={setAktivVedtaksperiode}
                                    erAktiv={it.id === aktivVedtaksperiode?.id}
                                />
                            ))}
                        </Tidslinjerad>
                    </RadContainer>
                ))}
                {infotrygdrader.map(([arbeidsgiver, perioder]) => (
                    <RadContainer key={arbeidsgiver}>
                        <Arbeidsgivernavn width={tidslinjeradOffset}>
                            <Infotrygdikon />
                            <TekstMedEllipsis data-tip={arbeidsgiver}>{arbeidsgiver}</TekstMedEllipsis>
                        </Arbeidsgivernavn>
                        <Tidslinjerad>
                            {perioder.map((it) => (
                                <Tidslinjeperiode
                                    key={it.id}
                                    id={it.id}
                                    style={it.style}
                                    skalVisePin={it.skalVisePin}
                                    className={it.tilstand}
                                    hoverLabel={<TidslinjeTooltip>{it.hoverLabel}</TidslinjeTooltip>}
                                />
                            ))}
                        </Tidslinjerad>
                    </RadContainer>
                ))}
                <Utsnittsvelger utsnitt={utsnitt} aktivtUtsnitt={aktivtUtsnitt} setAktivtUtsnitt={setAktivtUtsnitt} />
            </FlexColumn>
        </Container>
    );
};

// export const _Tidslinje = React.memo(({ person, aktivVedtaksperiode }: Props) => {
//     const setAktivVedtaksperiode = useSetAktivVedtaksperiode();
//
//     const { utsnitt, aktivtUtsnitt, setAktivtUtsnitt } = useTidslinjeutsnitt(person);
//     const infotrygdrader = useInfotrygdrader(person);
//     const arbeidsgiverrader = useTidslinjerader(person).map((it) =>
//         it.map((periode) => ({ ...periode, active: periode.id === aktivVedtaksperiode?.id }))
//     );
//
//     const tidslinjerader = [...arbeidsgiverrader, ...Object.values(infotrygdrader)];
//
//     const aktivRad =
//         aktivVedtaksperiode &&
//         arbeidsgiverrader.reduce(
//             (radIndex: number, rad: Sykepengeperiode[], i: number) =>
//                 rad.find(({ id }) => id === aktivVedtaksperiode?.id) ? i : radIndex,
//             undefined
//         );
//
//     const onSelectPeriode = (periode: Periode) => {
//         setAktivVedtaksperiode(periode.id!);
//     };
//
//     const startDato = utsnitt[aktivtUtsnitt].fom;
//     const sluttDato = utsnitt[aktivtUtsnitt].tom;
//
//     const maksdato = () => {
//         const sistePeriode = sisteValgbarePeriode(person);
//         const dato = sistePeriode && maksdatoForPeriode(sistePeriode);
//         return dato && dato.isBefore(sluttDato) && dato.isAfter(startDato)
//             ? {
//                   date: dato.toDate(),
//                   render: <Undertekst>Maksdato: {dato.format(NORSK_DATOFORMAT)}</Undertekst>,
//               }
//             : undefined;
//     };
//
//     return useMemo(() => {
//         if (tidslinjerader.length === 0) return null;
//         return (
//             <Container className="tidslinjecontainer">
//                 <Flex>
//                     <FlexColumn>
//                         <Radnavn infotrygdrader={infotrygdrader} />
//                     </FlexColumn>
//                     <Sykepengetidslinje
//                         rader={tidslinjerader}
//                         startDato={startDato.toDate()}
//                         sluttDato={sluttDato.toDate()}
//                         onSelectPeriode={onSelectPeriode}
//                         aktivRad={aktivRad}
//                         maksdato={maksdato()}
//                     />
//                 </Flex>
//                 <Utsnittsvelger utsnitt={utsnitt} aktivtUtsnitt={aktivtUtsnitt} setAktivtUtsnitt={setAktivtUtsnitt} />
//             </Container>
//         );
//     }, [tidslinjerader, aktivtUtsnitt]);
// });
