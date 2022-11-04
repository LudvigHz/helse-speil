import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import type { GhostPeriode, UberegnetPeriode } from '@io/graphql';
import { Periode, Periodetilstand } from '@io/graphql';
import { personState } from '@state/person';
import { isBeregnetPeriode, isPerson } from '@utils/typeguards';

type ActivePeriod = FetchedBeregnetPeriode | UberegnetPeriode | GhostPeriode;

export const isNotReady = (period: Periode) =>
    [
        Periodetilstand.VenterPaEnAnnenPeriode,
        Periodetilstand.ForberederGodkjenning,
        Periodetilstand.ManglerInformasjon,
    ].includes(period.periodetilstand);

export const activePeriodState = atom<ActivePeriod | null>({
    key: 'activePeriodState',
    default: null,
});

const personHasPeriod = (person: FetchedPerson, period: ActivePeriod): boolean => {
    return (
        person.arbeidsgivere
            .flatMap((it) => it.generasjoner.flatMap((it) => it.perioder as Array<ActivePeriod>))
            .find((it) => it.id === period.id) !== undefined ||
        person.arbeidsgivere.flatMap((it) => it.ghostPerioder).find((it) => it.id === period.id) !== undefined
    );
};

export const activePeriod = selector<ActivePeriod | null>({
    key: 'activePeriod',
    get: ({ get }) => {
        const { person } = get(personState);
        if (!isPerson(person)) {
            return null;
        }

        const activePeriod = get(activePeriodState);
        if (activePeriod && personHasPeriod(person, activePeriod)) {
            return activePeriod;
        }

        const allPeriods = person.arbeidsgivere
            .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
            .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
            .filter(isBeregnetPeriode)
            .filter((it) => it.periodetilstand !== Periodetilstand.TilInfotrygd);

        const periodWithOppgave =
            allPeriods.find(
                (periode) =>
                    isBeregnetPeriode(periode) &&
                    periode.periodetilstand === Periodetilstand.TilGodkjenning &&
                    typeof periode.oppgave?.id === 'string'
            ) ?? null;

        const periode = periodWithOppgave ?? allPeriods[0];

        return isBeregnetPeriode(periode) ? periode : null;
    },
});

export const useActivePeriod = (): ActivePeriod | null => useRecoilValue(activePeriod);

export const useSetActivePeriod = () => useSetRecoilState(activePeriodState);
