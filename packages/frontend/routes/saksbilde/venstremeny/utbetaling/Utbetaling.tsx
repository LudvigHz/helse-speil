import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { ErrorMessage } from '@components/ErrorMessage';
import { postAbonnerPåAktør } from '@io/http';
import { Behandlingstype, BeregnetPeriode, Person } from '@io/graphql';
import { opptegnelsePollingTimeState } from '@state/opptegnelser';
import { getPeriodState } from '@utils/mapping';
import { isRevurdering } from '@utils/period';
import { totrinnsvurdering } from '@utils/featureToggles';

import { AvvisningButton } from './AvvisningButton';
import { GodkjenningButton } from './GodkjenningButton';
import { SendTilGodkjenningButton } from './SendTilGodkjenningButton';

import styles from './Utbetaling.module.css';
import { BodyShort, Loader } from '@navikt/ds-react';
import styled from '@emotion/styled';
import { useInnloggetSaksbehandler } from '@state/authentication';

const InfoText = styled(BodyShort)`
    color: var(--navds-semantic-color-text);
    display: flex;
`;

const Spinner = styled(Loader)`
    margin-right: 0.5rem;
`;

const skalPolleEtterNestePeriode = (person: Person) =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
        .some((periode) => periode.behandlingstype === Behandlingstype.Venter);

const hasOppgave = (period: BeregnetPeriode): boolean =>
    typeof period.oppgavereferanse === 'string' && ['oppgaver', 'revurderes'].includes(getPeriodState(period));

const useOnGodkjenn = (period: BeregnetPeriode, person: Person): (() => void) => {
    const history = useHistory();
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

    const onGodkjennUtbetaling = () => {
        if (skalPolleEtterNestePeriode(person) || isRevurdering(period)) {
            postAbonnerPåAktør(person.aktorId).then(() => {
                setOpptegnelsePollingTime(1000);
            });
        } else {
            history.push('/');
        }
    };

    return onGodkjennUtbetaling;
};

const useOnAvvis = (): (() => void) => {
    const history = useHistory();
    return () => history.push('/');
};

interface UtbetalingProps {
    activePeriod: BeregnetPeriode;
    currentPerson: Person;
}

export const Utbetaling = ({ activePeriod, currentPerson }: UtbetalingProps) => {
    const [periodenErSendt, setPeriodenErSendt] = useState(false);
    const [error, setError] = useState<SpeilError | null>();
    const ventEllerHopp = useOnGodkjenn(activePeriod, currentPerson);
    const history = useHistory();
    const { oid } = useInnloggetSaksbehandler();
    const onGodkjennUtbetaling = () => {
        setPeriodenErSendt(true);
        ventEllerHopp();
    };
    const onSendTilGodkjenning = () => {
        setPeriodenErSendt(true);
        history.push('/');
    };
    const onAvvisUtbetaling = useOnAvvis();

    if (!hasOppgave(activePeriod)) return null;

    const isRevurdering = activePeriod.utbetaling.type === 'REVURDERING';
    const harArbeidsgiverutbetaling = activePeriod.utbetaling.arbeidsgiverNettoBelop !== 0;
    const harBrukerutbetaling = activePeriod.utbetaling.personNettoBelop !== 0;
    const trengerTotrinnsvurdering = totrinnsvurdering && (activePeriod?.trengerTotrinnsvurdering ?? false);

    return (
        <>
            <div className={styles.Buttons}>
                {trengerTotrinnsvurdering ? (
                    <SendTilGodkjenningButton
                        aktørId={currentPerson.aktorId}
                        fødselsnummer={currentPerson.fodselsnummer}
                        saksbehandlerIdent={oid}
                        vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                        disabled={periodenErSendt}
                        onSuccess={onSendTilGodkjenning}
                        onError={setError}
                    >
                        Send til godkjenning
                    </SendTilGodkjenningButton>
                ) : (
                    <GodkjenningButton
                        oppgavereferanse={activePeriod.oppgavereferanse!}
                        aktørId={currentPerson.aktorId}
                        disabled={periodenErSendt}
                        onSuccess={onGodkjennUtbetaling}
                        onError={setError}
                    >
                        {isRevurdering
                            ? 'Revurder'
                            : harArbeidsgiverutbetaling || harBrukerutbetaling
                            ? 'Utbetal'
                            : 'Godkjenn'}
                    </GodkjenningButton>
                )}
                {!isRevurdering && (
                    <AvvisningButton
                        disabled={periodenErSendt}
                        activePeriod={activePeriod}
                        aktørId={currentPerson.aktorId}
                        onSuccess={onAvvisUtbetaling}
                        onError={setError}
                    />
                )}
            </div>
            {error && (
                <ErrorMessage>
                    {error.message || 'En feil har oppstått.'}
                    {error.statusCode === 401 && <a href="/"> Logg inn</a>}
                </ErrorMessage>
            )}
            {periodenErSendt && (
                <InfoText as="p">
                    <Spinner />
                    <span>
                        {isRevurdering
                            ? 'Revurdering ferdigstilles'
                            : trengerTotrinnsvurdering
                            ? 'Perioden sendes til godkjenning'
                            : 'Neste periode klargjøres'}
                    </span>
                </InfoText>
            )}
        </>
    );
};
