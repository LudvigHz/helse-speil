import React from 'react';

import { BodyShort, Dropdown, InternalHeader as Header } from '@navikt/ds-react';

import { TastaturModal } from '@components/TastaturModal';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { anonymiseringSlice } from '@store/features/anonymisering/anonymiseringSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import styles from './UserMenu.module.css';

const useBrukerinfo = () => {
    const { navn, ident, isLoggedIn } = useInnloggetSaksbehandler();
    return isLoggedIn ? { navn, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };
};

export const UserMenu: React.FC = () => {
    const { navn, ident } = useBrukerinfo();
    const isAnonymous = useAppSelector((state) => state.anonymisering);
    const dispatch = useAppDispatch();
    const [visTastatursnarveier, setVisTastatursnarveier] = React.useState(false);

    return (
        <>
            <Dropdown>
                <Header.UserButton name={navn} description={ident} as={Dropdown.Toggle} />
                <Dropdown.Menu className={styles.UserMenu}>
                    <Dropdown.Menu.List>
                        <BodyShort className={styles.MenuItem}>
                            {navn}
                            <br />
                            {ident}
                        </BodyShort>
                        <Dropdown.Menu.Divider />
                        <Dropdown.Menu.List.Item
                            className={styles.MenuItem}
                            onClick={() => {
                                dispatch(anonymiseringSlice.actions.toggle());
                            }}
                            suppressHydrationWarning
                        >
                            {isAnonymous ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}
                        </Dropdown.Menu.List.Item>
                        <Dropdown.Menu.Divider />
                        <Dropdown.Menu.List.Item
                            as="a"
                            className={styles.MenuItem}
                            onClick={() => setVisTastatursnarveier(!visTastatursnarveier)}
                        >
                            Tastatursnarveier
                        </Dropdown.Menu.List.Item>
                        <Dropdown.Menu.Divider />
                        <Dropdown.Menu.List.Item as="a" href="/oauth2/logout" className={styles.MenuItem}>
                            Logg ut
                        </Dropdown.Menu.List.Item>
                    </Dropdown.Menu.List>
                </Dropdown.Menu>
            </Dropdown>
            <TastaturModal
                isOpen={visTastatursnarveier}
                onSetVisTastatursnarveier={(open) => setVisTastatursnarveier(open)}
            />
        </>
    );
};
