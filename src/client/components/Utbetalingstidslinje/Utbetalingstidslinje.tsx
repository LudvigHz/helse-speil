import React from 'react';
import { guid } from 'nav-frontend-js-utils';
import { Optional, Person, Utbetalingsdag, Utbetalingsdagtype } from '../../context/types';
import 'nav-frontend-tabell-style';
import { enesteArbeidsgiver } from '../../context/mapper';
import TimelineRow from '../Timeline/TimelineRow';
import '../Timeline/Timeline.less';
import UtbetalingstidslinjeRow from './UtbetalingstidslinjeRow';

interface Props {
    person: Person;
    showDagsats: boolean;
}

const sumDagsatser = (utbetalingsdager: Utbetalingsdag[]) => {
    return utbetalingsdager.reduce(
        (sum, utbetalingsdag) => sum + (utbetalingsdag.utbetaling ?? 0),
        0
    );
};

const Utbetalingstidslinje = ({ person, showDagsats }: Props) => {
    const { utbetalingstidslinjer } = enesteArbeidsgiver(person);
    const dager = utbetalingstidslinjer[0].dager;
    const dagsatserSummed = showDagsats && sumDagsatser(dager);

    return (
        <table className="Timeline tabell">
            <thead>
                <tr>
                    <th>Utbetalingsoversikt</th>
                    <th>Dagsats</th>
                </tr>
            </thead>
            <tbody>
                {dager
                    .map(item => ({ ...item, key: guid() }))
                    .map((item, i, array) => {
                        const showType = i === 0 || array[i - 1].type !== item.type;
                        return (
                            <UtbetalingstidslinjeRow
                                {...item}
                                key={item.key}
                                showType={showType}
                                dagsats={item.utbetaling}
                            />
                        );
                    })}
            </tbody>
            {dagsatserSummed && (
                <tfoot>
                    <tr>
                        <th>SUM</th>
                        <th>{`${dagsatserSummed} kr`}</th>
                    </tr>
                </tfoot>
            )}
        </table>
    );
};

export default Utbetalingstidslinje;
