import React from 'react';
import { Route } from 'react-router-dom';
import './MainContentWrapper.css';
import JsonView from '../JsonView/JsonView';
import Nav from '../Nav/NavView';
import Inngangsvilkår from '../JsonView/Inngangsvilkår';

const MainContentWrapper = () => {
    return (
        <div className="main-content">
            <Nav />

            <div>
                <Route path={'/'} exact component={JsonView} />
                <Route
                    path={'/inngangsvilkår'}
                    exact
                    component={Inngangsvilkår}
                />
            </div>
        </div>
    );
};

export default MainContentWrapper;
