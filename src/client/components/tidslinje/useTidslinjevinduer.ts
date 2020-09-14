import { Tidslinjevindu } from './Tidslinje.types';
import { useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Person } from 'internal-types';

type EnkelPeriode = { fom: Dayjs; tom: Dayjs };

const senesteDato = (perioder: EnkelPeriode[]) =>
    perioder
        .reduce((senesteDato, periode) => (periode.tom.isAfter(senesteDato) ? periode.tom : senesteDato), dayjs(0))
        .endOf('day') ?? dayjs().endOf('day');

export const useTidslinjevinduer = (person?: Person) => {
    const sisteDato = useMemo(() => {
        const vedtaksperioder = person?.arbeidsgivere.flatMap(({ vedtaksperioder }) => vedtaksperioder);
        const infotrygdutbetalinger = person?.infotrygdutbetalinger;
        const senesteVedtaksperiodedato = senesteDato(vedtaksperioder as EnkelPeriode[]);
        const senesteInfotrygdperiodedato = senesteDato(infotrygdutbetalinger as EnkelPeriode[]);
        return senesteInfotrygdperiodedato.isAfter(senesteVedtaksperiodedato)
            ? senesteInfotrygdperiodedato
            : senesteVedtaksperiodedato;
    }, [person]);

    const vinduer: Tidslinjevindu[] = [
        {
            fom: sisteDato.subtract(6, 'month'),
            tom: sisteDato,
            label: '6 mnd',
        },
        {
            fom: sisteDato.subtract(1, 'year'),
            tom: sisteDato,
            label: '1 år',
        },
        {
            fom: sisteDato.subtract(3, 'year'),
            tom: sisteDato,
            label: '3 år',
        },
    ];

    const [aktivtVindu, setAktivtVindu] = useState<number>(0);

    return { vinduer, aktivtVindu, setAktivtVindu };
};
