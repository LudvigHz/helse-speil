//@ts-nocheck
import * as React from 'react';

export enum Varseltype {
    Info = 'info',
    Suksess = 'suksess',
    Advarsel = 'advarsel',
    Feil = 'feil',
}

export class BehandletVarsel extends React.Component {
    static setAppElement = (string) => null;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {' '}
                {this.props.automatiskBehandlet ? <p>Automatisk godkjent</p> : <p>Behandlet innhold</p>}
                {this.props.children}
            </div>
        );
    }
}
