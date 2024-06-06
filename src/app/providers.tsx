'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, ReactElement, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Provider as ReduxProvider } from 'react-redux';
import { RecoilRoot, SetRecoilState } from 'recoil';

import { createApolloClient } from '@/app/apollo/apolloClient';
import { Bruker, BrukerContext } from '@/auth/brukerContext';
import { initInstrumentation } from '@/observability/faro';
import { hydrateAllFilters } from '@/routes/oversikt/table/state/filter';
import { hydrateSorteringForTab } from '@/routes/oversikt/table/state/sortation';
import { VenterPåEndringProvider } from '@/routes/saksbilde/VenterPåEndringContext';
import { ApolloProvider } from '@apollo/client';
import { varslerSlice } from '@store/features/varsler/varslerSlice';
import { useAppDispatch } from '@store/hooks';
import { useStore } from '@store/use-store';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.locale('nb');

initInstrumentation();

type Props = {
    bruker: Bruker;
};

export const Providers = ({ children, bruker }: PropsWithChildren<Props>): ReactElement => {
    const store = useStore(bruker);
    const [apolloClient] = useState(() => createApolloClient(store));

    const initializeState = useCallback(
        ({ set }: { set: SetRecoilState }) => {
            if (typeof window === 'undefined') return;
            hydrateAllFilters(set, bruker.grupper);
            hydrateSorteringForTab(set);
        },
        [bruker.grupper, bruker.ident],
    );

    useLayoutEffect(() => {
        // TODO: Kan fjernes når vi går over til aksel sin modal
        ReactModal.setAppElement('#root');
    }, []);

    return (
        <ApolloProvider client={apolloClient}>
            <ReduxProvider store={store}>
                <RecoilRoot initializeState={initializeState}>
                    <VenterPåEndringProvider>
                        <BrukerContext.Provider value={bruker}>
                            {children}
                            <SyncAlerts />
                        </BrukerContext.Provider>
                    </VenterPåEndringProvider>
                </RecoilRoot>
            </ReduxProvider>
        </ApolloProvider>
    );
};

const SyncAlerts = (): null => {
    useSyncAlertsToLocation();
    return null;
};

const useSyncAlertsToLocation = () => {
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    useEffect(() => {
        dispatch(varslerSlice.actions.ryddVarselForPathname(pathname));
    }, [dispatch, pathname]);
};
