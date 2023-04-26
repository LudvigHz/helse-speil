import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'reset-css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Header } from '@components/header/Header';
import { useLoadingToast } from '@hooks/useLoadingToast';
import possibletypes from '@io/graphql/generated/possibletypes';
import { useUpdateAuthentication } from '@state/authentication';
import { useEasterEggIsActive } from '@state/easterEgg';
import { usePersonLoadable } from '@state/person';
import { useSetVarsler } from '@state/varsler';
import { onLazyLoadFail } from '@utils/error';

import { GlobalFeilside } from './GlobalFeilside';
import { IkkeLoggetInn } from './IkkeLoggetInn';
import { PageNotFound } from './PageNotFound';
import { Routes } from './index';

import './App.css';

const Saksbilde = React.lazy(() => import('./saksbilde/Saksbilde').catch(onLazyLoadFail));
const Oversikt = React.lazy(() => import('./oversikt').catch(onLazyLoadFail));
const Agurk = React.lazy(() => import('../components/Agurk').catch(onLazyLoadFail));
const GraphQLPlayground = React.lazy(() => import('./playground/GraphQLPlayground').catch(onLazyLoadFail));

ReactModal.setAppElement('#root');

const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache({
        dataIdFromObject: () => undefined,
        possibleTypes: possibletypes.possibleTypes,
        typePolicies: { VarselDTO: { keyFields: ['generasjonId', 'kode'] } },
    }),
});

const useSyncAlertsToLocation = () => {
    const location = useLocation();
    const setVarsler = useSetVarsler();

    useEffect(() => {
        setVarsler((prevState) =>
            prevState.filter(
                (it) => it.scope === location.pathname || (it.name === 'tildeling' && location.pathname !== '/')
            )
        );
    }, [location]);
};

const App = () => {
    useLoadingToast({ isLoading: usePersonLoadable().state === 'loading', message: 'Henter person' });
    useUpdateAuthentication();

    const easterEggIsActive = useEasterEggIsActive();

    useSyncAlertsToLocation();

    return (
        <ErrorBoundary fallback={(error) => <GlobalFeilside error={error} />}>
            <Header />
            <Varsler />
            <Switch>
                <Route path={Routes.Uautorisert}>
                    <IkkeLoggetInn />
                </Route>
                <ProtectedRoute path={Routes.Oversikt} exact>
                    <React.Suspense fallback={<div />}>
                        <Oversikt />
                    </React.Suspense>
                </ProtectedRoute>
                <ProtectedRoute path={Routes.Saksbilde}>
                    <React.Suspense fallback={<div />}>
                        <Saksbilde />
                    </React.Suspense>
                </ProtectedRoute>
                <ProtectedRoute path={Routes.Playground}>
                    <React.Suspense fallback={<div />}>
                        <GraphQLPlayground />
                    </React.Suspense>
                </ProtectedRoute>
                <Route path="*">
                    <PageNotFound />
                </Route>
            </Switch>
            <Toasts />
            {easterEggIsActive('Agurk') && (
                <React.Suspense fallback={null}>
                    <Agurk />
                </React.Suspense>
            )}
        </ErrorBoundary>
    );
};

const withRoutingAndState = (Component: React.ComponentType) => () =>
    (
        <BrowserRouter>
            <RecoilRoot>
                <ApolloProvider client={client}>
                    <Component />
                </ApolloProvider>
            </RecoilRoot>
        </BrowserRouter>
    );

export default withRoutingAndState(App);
