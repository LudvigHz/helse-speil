import React, { PropsWithChildren, lazy, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ReactModal from 'react-modal';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'reset-css';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Header } from '@components/header/Header';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useAuthentication, useUpdateAuthentication } from '@state/authentication';
import { usePersonLoadable } from '@state/person';
import { useSetVarsler } from '@state/varsler';
import { onLazyLoadFail } from '@utils/error';
import { erDev, erLocal } from '@utils/featureToggles';

import { GlobalFeilside } from './GlobalFeilside';
import { IkkeLoggetInn } from './IkkeLoggetInn';
import { PageNotFound } from './PageNotFound';
import { Routes } from './index';

import './App.css';

const Saksbilde = lazy(() =>
    import('./saksbilde/Saksbilde.js').then((res) => ({ default: res.Saksbilde })).catch(onLazyLoadFail),
);
const Oversikt = lazy(() =>
    import('./oversikt/Oversikt.js').then((res) => ({ default: res.Oversikt })).catch(onLazyLoadFail),
);
const GraphQLPlayground = lazy(() =>
    import('./playground/GraphQLPlayground.js')
        .then((res) => ({ default: res.GraphQLPlayground }))
        .catch(onLazyLoadFail),
);

ReactModal.setAppElement('#root');

const useSyncAlertsToLocation = () => {
    const location = useLocation();
    const setVarsler = useSetVarsler();

    useEffect(() => {
        setVarsler((prevState) =>
            prevState.filter(
                (it) => it.scope === location.pathname || (it.name === 'tildeling' && location.pathname !== '/'),
            ),
        );
    }, [location]);
};

const App = () => {
    useLoadingToast({ isLoading: usePersonLoadable().state === 'loading', message: 'Henter person' });
    useUpdateAuthentication();

    useSyncAlertsToLocation();

    return (
        <ErrorBoundary fallback={(error) => <GlobalFeilside error={error} />}>
            <Helmet>
                <title>Speil {erLocal() ? ' - localhost' : erDev() ? ' - dev' : ''}</title>
                <link
                    rel="icon"
                    type="image/x-icon"
                    href={`/favicons/${erLocal() ? 'favicon-local.ico' : erDev() ? 'favicon-dev.ico' : 'favicon.ico'}`}
                />
            </Helmet>
            <Header />
            <Varsler />
            <Switch>
                <Route path={Routes.Uautorisert}>
                    <IkkeLoggetInn />
                </Route>
                <Route
                    path={Routes.Oversikt}
                    render={() => (
                        <RequireAuth>
                            <React.Suspense fallback={<div />}>
                                <Oversikt />
                            </React.Suspense>
                        </RequireAuth>
                    )}
                    exact
                />
                <Route
                    path={Routes.Saksbilde}
                    render={() => (
                        <RequireAuth>
                            <React.Suspense fallback={<div />}>
                                <Saksbilde />
                            </React.Suspense>
                            )
                        </RequireAuth>
                    )}
                />
                <Route
                    path={Routes.Playground}
                    render={() => (
                        <RequireAuth>
                            <React.Suspense fallback={<div />}>
                                <GraphQLPlayground />
                            </React.Suspense>
                        </RequireAuth>
                    )}
                />
                <Route path="*">
                    <PageNotFound />
                </Route>
            </Switch>
            <Toasts />
        </ErrorBoundary>
    );
};

const RequireAuth = ({ children }: PropsWithChildren) => {
    const { isLoggedIn } = useAuthentication();
    return isLoggedIn !== false ? children : <Redirect to="/uautorisert" />;
};

export const AppWithRoutingAndState = () => (
    <BrowserRouter>
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </BrowserRouter>
);
