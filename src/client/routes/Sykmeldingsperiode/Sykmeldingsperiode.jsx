import React, { useContext } from 'react';
import IconRow from '../../components/Rows/IconRow';
import Timeline from '../../components/Timeline';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { sykmeldingsperiodetekster } from '../../tekster';
import './Sykmeldingsperiode.less';
import { PersonContext } from '../../context/PersonContext';
import { pages } from '../../hooks/useLinks';

const Sykmeldingsperiode = () => {
    const { personTilBehandling: person } = useContext(PersonContext);

    return (
        <Panel className="Sykmeldingsperiode">
            {person.arbeidsgivere ? (
                <>
                    <IconRow label={sykmeldingsperiodetekster('dager')} bold />
                    <Timeline person={person} showDagsats={false} />
                </>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}
            <Navigasjonsknapper next={pages.SYKDOMSVILKÅR} />
        </Panel>
    );
};

export default Sykmeldingsperiode;
