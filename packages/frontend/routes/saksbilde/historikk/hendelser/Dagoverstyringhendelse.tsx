import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { CaseworkerFilled } from '@navikt/ds-icons';
import { getFormattedDateString } from '@utils/date';

import { Hendelse } from './Hendelse';
import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';

import styles from './Dagoverstyringhendelse.module.css';
import { HendelseDate } from './HendelseDate';

type Endring = Pick<OverstyrtDag, 'grad' | 'type' | 'fraGrad' | 'fraType'>;

type GroupedDays = {
    start: DateString;
    end: DateString;
} & Endring;

const areSimilar = (a: Endring, b: Endring): boolean => {
    return a.grad === b.grad && a.type === b.type && a.fraType === b.fraType && a.fraGrad === b.fraGrad;
};

const byDate = (a: OverstyrtDag, b: OverstyrtDag): number => {
    return new Date(a.dato).getTime() - new Date(b.dato).getTime();
};

const groupSimilarDays = (days: Array<OverstyrtDag>): Array<GroupedDays> => {
    return [...days].sort(byDate).reduce((groups: Array<GroupedDays>, day: OverstyrtDag) => {
        const group = groups[groups.length - 1];
        if (!group || !areSimilar(group, day)) {
            return [
                ...groups,
                {
                    start: day.dato,
                    end: day.dato,
                    grad: day.grad,
                    type: day.type,
                    fraGrad: day.fraGrad,
                    fraType: day.fraType,
                },
            ];
        }
        groups[groups.length - 1].end = day.dato;
        return groups;
    }, []);
};

interface DagoverstyringhendelseProps extends Omit<DagoverstyringhendelseObject, 'type' | 'id'> {}

export const Dagoverstyringhendelse: React.FC<DagoverstyringhendelseProps> = ({
    erRevurdering,
    saksbehandler,
    timestamp,
    begrunnelse,
    dager,
}) => (
    <Hendelse
        title={erRevurdering ? 'Revurdert utbetalingsdager' : 'Endret utbetalingsdager'}
        icon={<CaseworkerFilled height={20} width={20} />}
    >
        <ExpandableHistorikkContent>
            <BodyShort size="small">Begrunnelse: {begrunnelse}</BodyShort>
            <div className={styles.Content}>
                {groupSimilarDays(dager).map((group, i) => (
                    <div key={i} className={styles.Grid}>
                        <BodyShort>Dato:</BodyShort>
                        <BodyShort>
                            {getFormattedDateString(group.start)}
                            {group.start !== group.end && ` - ${getFormattedDateString(group.end)}`}
                        </BodyShort>
                        <BodyShort>Grad:</BodyShort>
                        <BodyShort>
                            {group.fraGrad !== null && group.fraGrad !== undefined && group.grad !== group.fraGrad && (
                                <span className={styles.FromValue}>{group.fraGrad} %</span>
                            )}
                            {group.grad} %
                        </BodyShort>
                        <BodyShort>Type:</BodyShort>
                        <BodyShort>
                            {group.fraType && <span className={styles.FromValue}>{group.fraType}</span>}
                            {group.type}
                        </BodyShort>
                    </div>
                ))}
            </div>
        </ExpandableHistorikkContent>
        <HendelseDate timestamp={timestamp} ident={saksbehandler} />
    </Hendelse>
);
