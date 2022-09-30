import { PåVentDropdownMenuButton } from './PåVentDropdownMenuButton';
import React, { useRef, useState } from 'react';

import { Collapse, Expand } from '@navikt/ds-icons';
import { Dropdown } from '@navikt/ds-react-internal';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { TabButton } from '@components/TabButton';
import { useInteractOutside } from '@hooks/useInteractOutside';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isArbeidsgiver, isBeregnetPeriode, isPerson } from '@utils/typeguards';

import { AnnullerButton } from './AnnullerButton';
import { OppdaterPersondataButton } from './OppdaterPersondataButton';
import { SkrivGenereltNotatDropdownMenuButton } from './SkrivGenereltNotatDropdownMenuButton';
import { TildelingDropdownMenuButton } from './TildelingDropdownMenuButton';

import styles from './DropdownMenu.module.css';

const DropdownMenuContentSkeleton: React.FC = () => {
    return (
        <Dropdown.Menu placement="bottom-start">
            <Dropdown.Menu.List>
                <Dropdown.Menu.List.Item>
                    <LoadingShimmer />
                </Dropdown.Menu.List.Item>
                <Dropdown.Menu.List.Item>
                    <LoadingShimmer />
                </Dropdown.Menu.List.Item>
                <Dropdown.Menu.List.Item>
                    <LoadingShimmer />
                </Dropdown.Menu.List.Item>
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    );
};
const DropdownMenuContent: React.FC = () => {
    const user = useInnloggetSaksbehandler();
    const period = useActivePeriod();
    const person = useCurrentPerson();
    const readOnly = useIsReadOnlyOppgave();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!isPerson(person)) {
        return null;
    }

    const personIsAssignedUser = (person?.tildeling && person?.tildeling?.oid === user.oid) ?? false;

    return (
        <Dropdown.Menu placement="bottom-start" className={styles.DropdownMenu}>
            {isBeregnetPeriode(period) && period.oppgavereferanse && !readOnly && (
                <>
                    <Dropdown.Menu.List>
                        <SkrivGenereltNotatDropdownMenuButton
                            vedtaksperiodeId={period.vedtaksperiodeId}
                            personinfo={person.personinfo}
                        />
                        <TildelingDropdownMenuButton
                            oppgavereferanse={period.oppgavereferanse}
                            erTildeltInnloggetBruker={personIsAssignedUser}
                            tildeling={person?.tildeling}
                        />
                        {personIsAssignedUser && (
                            <PåVentDropdownMenuButton
                                oppgavereferanse={period.oppgavereferanse}
                                vedtaksperiodeId={period.vedtaksperiodeId}
                                personinfo={person.personinfo}
                                erPåVent={person.tildeling?.reservert}
                            />
                        )}
                    </Dropdown.Menu.List>
                    <Dropdown.Menu.Divider />
                </>
            )}
            <Dropdown.Menu.List>
                <OppdaterPersondataButton person={person} />
                {isBeregnetPeriode(period) && isArbeidsgiver(arbeidsgiver) && (
                    <AnnullerButton person={person} periode={period} arbeidsgiver={arbeidsgiver} />
                )}
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    );
};

export const DropdownMenu: React.FC = () => {
    const [open, setOpen] = useState(false);
    const content = useRef<HTMLSpanElement>(null);

    const toggleDropdown = () => {
        setOpen((prevState) => !prevState);
    };

    const closeDropdown = () => {
        setOpen(false);
    };

    useInteractOutside({
        ref: content,
        onInteractOutside: closeDropdown,
        active: open,
    });

    return (
        <span ref={content}>
            <Dropdown onSelect={closeDropdown}>
                <TabButton as={Dropdown.Toggle} className={styles.MenuButton} onClick={toggleDropdown}>
                    Meny {open ? <Collapse /> : <Expand />}
                </TabButton>
                <React.Suspense fallback={<DropdownMenuContentSkeleton />}>
                    <DropdownMenuContent />
                </React.Suspense>
            </Dropdown>
        </span>
    );
};
