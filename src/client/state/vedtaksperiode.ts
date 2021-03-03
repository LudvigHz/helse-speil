import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { Person, Vedtaksperiode } from 'internal-types';
import { usePerson } from './person';

export const aktivVedtaksperiodeIdState = atom<string | undefined>({
    key: 'aktivVedtaksperiodeIdState',
    default: undefined,
});

export const useSetAktivVedtaksperiode = () => useSetRecoilState(aktivVedtaksperiodeIdState);

const periodeMedId = (person: Person, periodeId: string): Vedtaksperiode | undefined =>
    person.arbeidsgivere.reduce(
        (periode: Vedtaksperiode, { vedtaksperioder }) => periode ?? vedtaksperioder.find(({ id }) => id === periodeId),
        undefined
    );

const defaultPeriode = (person: Person): Vedtaksperiode | undefined =>
    person.arbeidsgivere
        .flatMap((arb) => arb.vedtaksperioder)
        .filter((periode) => periode.kanVelges)
        .sort((a, b) => (a.fom.isBefore(b.fom) ? 1 : -1))?.[0] as Vedtaksperiode;

export const useAktivVedtaksperiode = () => {
    const person = usePerson();
    const periodeId = useRecoilValue(aktivVedtaksperiodeIdState);

    if (person && periodeId) {
        return periodeMedId(person, periodeId);
    } else if (person) {
        return defaultPeriode(person);
    } else {
        return undefined;
    }
};
