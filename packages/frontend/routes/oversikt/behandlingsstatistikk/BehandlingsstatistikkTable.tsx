import React from 'react';

import { Antall, Behandlingsstatistikk } from '@io/graphql';

import { LabelCell } from './LabelCell';
import { Separator } from './Separator';
import { StatistikkRow } from './StatistikkRow';

import styles from './BehandlingsstatistikkView.module.css';

const getTotaltIdag = (statistikk: Behandlingsstatistikk): Antall => {
    return {
        manuelt: statistikk.enArbeidsgiver.manuelt + statistikk.flereArbeidsgivere.manuelt,
        automatisk: statistikk.enArbeidsgiver.automatisk + statistikk.flereArbeidsgivere.automatisk,
        tilgjengelig: statistikk.enArbeidsgiver.tilgjengelig + statistikk.flereArbeidsgivere.tilgjengelig,
    };
};

interface BehandlingsstatistikkTableProps {
    behandlingsstatistikk: Behandlingsstatistikk;
}

export const BehandlingsstatistikkTable: React.FC<BehandlingsstatistikkTableProps> = ({ behandlingsstatistikk }) => {
    const totaltIdag = getTotaltIdag(behandlingsstatistikk);

    return (
        <table>
            <thead>
                <tr>
                    <th />
                    <th>MANUELT</th>
                    <th>AUTOMATISK</th>
                    <th>TILGJENGELIG</th>
                </tr>
            </thead>
            <tbody>
                <StatistikkRow antall={behandlingsstatistikk.enArbeidsgiver}>
                    <LabelCell.EnArbeidsgiver />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.flereArbeidsgivere}>
                    <LabelCell.FlereArbeidsgivere />
                </StatistikkRow>
            </tbody>
            <Separator />
            <tbody>
                <StatistikkRow antall={behandlingsstatistikk.forstegangsbehandling}>
                    <LabelCell.Førstegangsbehandling />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.forlengelser}>
                    <LabelCell.Forlengelser />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.forlengelseIt}>
                    <LabelCell.ForlengelseInfotrygd />
                </StatistikkRow>
            </tbody>
            <Separator />
            <tbody>
                <StatistikkRow antall={behandlingsstatistikk.utbetalingTilArbeidsgiver}>
                    <LabelCell.UtbetalingTilArbeidsgiver />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.utbetalingTilSykmeldt}>
                    <LabelCell.UtbetalingTilSykmeldt />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.delvisRefusjon}>
                    <LabelCell.DelvisRefusjon />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.faresignaler}>
                    <LabelCell.Faresignaler />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.fortroligAdresse}>
                    <LabelCell.FortroligAdresse />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.stikkprover}>
                    <LabelCell.Stikkprøver />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.revurdering}>
                    <LabelCell.Revurdering />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.beslutter}>
                    <LabelCell.Beslutter />
                </StatistikkRow>
            </tbody>
            <Separator />
            <tfoot>
                <tr>
                    <td colSpan={4}>
                        <p className={styles.FooterTotal}>
                            TOTALT FULLFØRTE SAKER I DAG:{' '}
                            <span>
                                {totaltIdag.manuelt + totaltIdag.automatisk + behandlingsstatistikk.antallAnnulleringer}
                            </span>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <div className={styles.FooterCellContainer}>
                            <div className={styles.FooterCell}>
                                <p>{totaltIdag.manuelt}</p>
                                <p>MANUELT</p>
                            </div>
                            <div className={styles.FooterCell}>
                                <p>{totaltIdag.automatisk}</p>
                                <p>AUTOMATISK</p>
                            </div>
                            <div className={styles.FooterCell}>
                                <p>{totaltIdag.tilgjengelig}</p>
                                <p>TILGJENGELIG</p>
                            </div>
                            <div className={styles.FooterCell}>
                                <p>{behandlingsstatistikk.antallAnnulleringer}</p>
                                <p>ANNULLERT</p>
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};
