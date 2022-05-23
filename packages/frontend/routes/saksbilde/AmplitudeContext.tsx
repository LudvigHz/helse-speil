import amplitude from 'amplitude-js';
import dayjs, { Dayjs } from 'dayjs';
import React, { PropsWithChildren, useEffect } from 'react';

import { amplitudeEnabled } from '@utils/featureToggles';
import { useActivePeriod } from '@state/periode';
import { getOppgavereferanse } from '@state/selectors/period';
import { isBeregnetPeriode } from '@utils/typeguards';

amplitudeEnabled &&
    amplitude?.getInstance().init('default', '', {
        apiEndpoint: 'amplitude.nav.no/collect-auto',
        saveEvents: false,
        platform: window.location.origin.toString(),
    });

interface AmplitudeContextValue {
    logOppgaveGodkjent: (erBeslutteroppgave: boolean) => void;
    logOppgaveForkastet: (begrunnelser: string[]) => void;
    logTotrinnsoppgaveReturnert: () => void;
}

export const AmplitudeContext = React.createContext<AmplitudeContextValue>({
    logOppgaveGodkjent(): void {},
    logOppgaveForkastet(): void {},
    logTotrinnsoppgaveReturnert(): void {},
});

const getKey = (oppgaveId: string): string => `oppgave.${oppgaveId}.åpnet`;

const setÅpnetOppgavetidspunkt = (oppgaveId: string): void => {
    window.sessionStorage.setItem(getKey(oppgaveId), dayjs().toISOString());
};

const getÅpnetOppgaveTidspunkt = (oppgaveId: string): Dayjs | undefined => {
    const åpnet = window.sessionStorage.getItem(getKey(oppgaveId));
    return åpnet ? dayjs(åpnet) : undefined;
};

const removeÅpnetOppgaveTidspunkt = (oppgaveId: string): void => {
    const key = `oppgave.${oppgaveId}.åpnet`;
    window.sessionStorage.removeItem(key);
};

const logEventCallback = (oppgaveId: string) => () => removeÅpnetOppgaveTidspunkt(oppgaveId);

const useStoreÅpnetTidspunkt = (oppgavereferanse?: string | null) => {
    useEffect(() => {
        if (oppgavereferanse) {
            const åpnetTidspunkt = getÅpnetOppgaveTidspunkt(oppgavereferanse);
            if (!åpnetTidspunkt) {
                setÅpnetOppgavetidspunkt(oppgavereferanse);
            }
        }
    }, [oppgavereferanse]);
};

export const _AmplitudeProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const activePeriod = useActivePeriod();
    const oppgavereferanse = getOppgavereferanse(activePeriod);

    useStoreÅpnetTidspunkt(oppgavereferanse);

    const eventProperties = (åpnetTidspunkt: Dayjs, begrunnelser: string[] | undefined = undefined) => {
        if (isBeregnetPeriode(activePeriod)) {
            return {
                varighet: dayjs().diff(åpnetTidspunkt),
                type: activePeriod.periodetype,
                inntektskilde: activePeriod.inntektstype,
                warnings: activePeriod.aktivitetslogg,
                antallWarnings: activePeriod.aktivitetslogg.length,
                begrunnelser: begrunnelser,
            };
        } else {
            return {
                varighet: dayjs().diff(åpnetTidspunkt),
                begrunnelser: begrunnelser,
            };
        }
    };

    type LogEventType =
        | 'oppgave godkjent'
        | 'oppgave forkastet'
        | 'totrinnsoppgave returnert'
        | 'totrinnsoppgave attestert';

    const logEvent = (event: LogEventType, begrunnelser?: string[]) => {
        if (amplitudeEnabled && oppgavereferanse) {
            const åpnetTidspunkt = getÅpnetOppgaveTidspunkt(oppgavereferanse);

            åpnetTidspunkt &&
                amplitude
                    ?.getInstance()
                    .logEvent(event, eventProperties(åpnetTidspunkt, begrunnelser), logEventCallback(oppgavereferanse));
        }
    };

    const logOppgaveGodkjent = (erBeslutteroppgave: boolean) =>
        logEvent(erBeslutteroppgave ? 'totrinnsoppgave attestert' : 'oppgave godkjent');

    const logOppgaveForkastet = (begrunnelser: string[]) => logEvent('oppgave forkastet', begrunnelser);

    const logTotrinnsoppgaveReturnert = () => logEvent('totrinnsoppgave returnert');

    useEffect(() => {
        amplitudeEnabled &&
            amplitude?.getInstance().setUserProperties({
                skjermbredde: window.screen.width,
            });
    }, []);

    return (
        <AmplitudeContext.Provider
            value={{
                logOppgaveGodkjent: logOppgaveGodkjent,
                logOppgaveForkastet: logOppgaveForkastet,
                logTotrinnsoppgaveReturnert: logTotrinnsoppgaveReturnert,
            }}
        >
            {children}
        </AmplitudeContext.Provider>
    );
};

export const AmplitudeProvider: React.FC<ChildrenProps> = ({ children }) => {
    return (
        <React.Suspense fallback={<>{children}</>}>
            <_AmplitudeProvider>{children}</_AmplitudeProvider>
        </React.Suspense>
    );
};
