import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { ClockDashedIcon } from '@navikt/aksel-icons';
import { BodyShort, Tag, Tooltip } from '@navikt/ds-react';

import { EgenskaperTags } from '@components/EgenskaperTags';
import { Flex } from '@components/Flex';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { LovdataLenke } from '@components/LovdataLenke';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { Maksdatoikon } from '@components/ikoner/Maksdatoikon';
import { Skjæringstidspunktikon } from '@components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '@components/ikoner/Sykmeldingsperiodeikon';
import { Arbeidsgiver, Egenskap, Kategori, Periodetilstand, Periodetype, UberegnetPeriode } from '@io/graphql';
import { NORSK_DATOFORMAT_KORT } from '@utils/date';

import { ArbeidsgiverRow } from './ArbeidsgiverRow';
import { CardTitle } from './CardTitle';

import styles from './PeriodeCard.module.css';

const VentepølseRow = () => (
    <>
        <Tooltip content="Sykmeldingsperiode">
            <div className={styles.IconContainer} style={{ width: '20px' }}>
                <ClockDashedIcon title="Avventer system" fontSize="1.5rem" />
            </div>
        </Tooltip>
        <CardTitle className={styles.Title}>VENTER</CardTitle>
    </>
);

interface SykmeldingsperiodeRowProps {
    periode: DatePeriod;
}

const SykmeldingsperiodeRow: React.FC<SykmeldingsperiodeRowProps> = ({ periode }) => {
    const fom = dayjs(periode.fom).format(NORSK_DATOFORMAT_KORT);
    const tom = dayjs(periode.tom).format(NORSK_DATOFORMAT_KORT);

    return (
        <>
            <Tooltip content="Sykmeldingsperiode">
                <div className={styles.IconContainer}>
                    <Sykmeldingsperiodeikon alt="Sykmeldingsperiode" />
                </div>
            </Tooltip>
            <BodyShort>{`${fom} - ${tom}`}</BodyShort>
        </>
    );
};

interface SkjæringstidspunktRowProps {
    periodetype: Periodetype;
    skjæringstidspunkt: DateString;
}

const SkjæringstidspunktRow: React.FC<SkjæringstidspunktRowProps> = ({ periodetype, skjæringstidspunkt }) => {
    return (
        <>
            <Tooltip content="Skjæringstidspunkt">
                <div className={styles.IconContainer}>
                    <Skjæringstidspunktikon alt="Skjæringstidspunkt" />
                </div>
            </Tooltip>
            {periodetype === Periodetype.OvergangFraIt ? (
                <BodyShort>Skjæringstidspunkt i Infotrygd/Gosys</BodyShort>
            ) : (
                <BodyShort>{dayjs(skjæringstidspunkt).format(NORSK_DATOFORMAT_KORT)}</BodyShort>
            )}
        </>
    );
};

const harRedusertAntallSykepengedager = (periode: FetchedBeregnetPeriode): boolean => {
    const { forbrukteSykedager, gjenstaendeSykedager } = periode.periodevilkar.sykepengedager;
    return (
        typeof forbrukteSykedager === 'number' &&
        typeof gjenstaendeSykedager === 'number' &&
        forbrukteSykedager + gjenstaendeSykedager < 248
    );
};

interface MaksdatoRowProps {
    activePeriod: FetchedBeregnetPeriode;
    gjenståendeSykedager: number | null;
}

const MaksdatoRow: React.FC<MaksdatoRowProps> = ({ activePeriod, gjenståendeSykedager }) => {
    const maksdato = dayjs(activePeriod.maksdato).format(NORSK_DATOFORMAT_KORT);
    const alderVedSisteSykedag = activePeriod.periodevilkar.alder.alderSisteSykedag ?? null;

    return (
        <>
            <Tooltip content="Maksdato">
                <div className={styles.IconContainer}>
                    <Maksdatoikon alt="Maksdato" />
                </div>
            </Tooltip>
            <Flex gap="10px">
                <BodyShort className={styles.NoWrap}>{`${maksdato} (${
                    gjenståendeSykedager ?? activePeriod.gjenstaendeSykedager ?? 'Ukjent antall'
                } dager igjen)`}</BodyShort>
                {alderVedSisteSykedag &&
                    (alderVedSisteSykedag >= 70 ? (
                        <Flex alignItems="center" gap="8px">
                            <Tooltip content="Over 70 år">
                                <div className={styles.IconContainer}>
                                    <Advarselikon alt="Over 70 år" height={16} width={16} />
                                </div>
                            </Tooltip>
                            <BodyShort size="small">
                                <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                            </BodyShort>
                        </Flex>
                    ) : (
                        harRedusertAntallSykepengedager(activePeriod) && (
                            <Flex alignItems="center">
                                <Tooltip content="Over 67 år - redusert antall sykepengedager">
                                    <Tag className={styles.Tag} variant="info" size="small">
                                        Over 67 år
                                    </Tag>
                                </Tooltip>
                            </Flex>
                        )
                    ))}
            </Flex>
        </>
    );
};

interface PeriodeCardUberegnetProps {
    periode: UberegnetPeriode | UberegnetVilkarsprovdPeriode;
    arbeidsgiver: Arbeidsgiver;
    månedsbeløp?: number;
}

const PeriodeCardUberegnet: React.FC<PeriodeCardUberegnetProps> = ({ periode, arbeidsgiver, månedsbeløp }) => {
    return (
        <section className={styles.Grid}>
            {[Periodetilstand.UtbetaltVenterPaEnAnnenPeriode, Periodetilstand.VenterPaEnAnnenPeriode].includes(
                periode.periodetilstand,
            ) ? (
                <VentepølseRow />
            ) : (
                <>
                    <span className={styles.egenskaper}>
                        <EgenskaperTags
                            egenskaper={[
                                {
                                    egenskap:
                                        periode.periodetype === Periodetype.Forlengelse
                                            ? Egenskap.Forlengelse
                                            : Egenskap.Forstegangsbehandling,
                                    kategori: Kategori.Periodetype,
                                },
                            ]}
                        />
                    </span>
                    <span />
                </>
            )}
            <SykmeldingsperiodeRow periode={periode} />
            <SkjæringstidspunktRow periodetype={periode.periodetype} skjæringstidspunkt={periode.skjaeringstidspunkt} />
            <ArbeidsgiverRow.Uberegnet
                navn={arbeidsgiver.navn}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                arbeidsforhold={arbeidsgiver.arbeidsforhold}
                månedsbeløp={månedsbeløp}
            />
        </section>
    );
};

interface PeriodeCardBeregnetProps {
    periode: FetchedBeregnetPeriode;
    arbeidsgiver: Arbeidsgiver;
    månedsbeløp: number | undefined;
    gjenståendeSykedager: number | null;
}

const PeriodeCardBeregnet: React.FC<PeriodeCardBeregnetProps> = ({
    periode,
    arbeidsgiver,
    månedsbeløp,
    gjenståendeSykedager,
}) => {
    const egenskaperForVisning = periode.egenskaper.filter(
        (it) => it.kategori !== Kategori.Mottaker && it.kategori !== Kategori.Inntektskilde,
    );
    return (
        <div>
            <span className={styles.egenskaper}>
                {[Periodetilstand.UtbetaltVenterPaEnAnnenPeriode, Periodetilstand.VenterPaEnAnnenPeriode].includes(
                    periode.periodetilstand,
                ) ? (
                    <VentepølseRow />
                ) : (
                    <EgenskaperTags egenskaper={egenskaperForVisning} />
                )}
            </span>
            <section className={styles.Grid}>
                <SykmeldingsperiodeRow periode={periode} />
                <SkjæringstidspunktRow
                    periodetype={periode.periodetype}
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                />
                <MaksdatoRow activePeriod={periode} gjenståendeSykedager={gjenståendeSykedager} />
                <ArbeidsgiverRow.Beregnet
                    navn={arbeidsgiver.navn}
                    organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                    arbeidsforhold={arbeidsgiver.arbeidsforhold}
                    månedsbeløp={månedsbeløp}
                />
            </section>
        </div>
    );
};

interface PeriodeCardGhostProps {
    arbeidsgiver: Arbeidsgiver;
}

const PeriodeCardGhost: React.FC<PeriodeCardGhostProps> = ({ arbeidsgiver }) => {
    return (
        <section className={styles.Grid}>
            <ArbeidsgiverRow.Ghost
                navn={arbeidsgiver.navn}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                arbeidsforhold={arbeidsgiver.arbeidsforhold}
            />
        </section>
    );
};

const PeriodeCardSkeleton: React.FC = () => {
    return (
        <section className={classNames(styles.Skeleton, styles.Grid)}>
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
        </section>
    );
};

export const PeriodeCard = {
    Beregnet: PeriodeCardBeregnet,
    Uberegnet: PeriodeCardUberegnet,
    Ghost: PeriodeCardGhost,
    Skeleton: PeriodeCardSkeleton,
};
