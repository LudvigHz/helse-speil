import { NetworkStatus } from '@apollo/client';
import { useFetchPersonQuery } from '@person/query';
import { erOpptegnelseForNyOppgave, useHåndterOpptegnelser } from '@state/opptegnelser';
import { useSelectPeriod } from '@state/periode';

export const useRefreshPersonVedOpptegnelse = () => {
    const { data, networkStatus, refetch } = useFetchPersonQuery();
    const selectPeriod = useSelectPeriod();

    useHåndterOpptegnelser(async (opptegnelse) => {
        if (
            data !== undefined &&
            data.person?.aktorId &&
            opptegnelse.aktørId.toString() === data.person.aktorId &&
            !(networkStatus in [NetworkStatus.loading, NetworkStatus.refetch])
        ) {
            const result = await refetch();
            if (erOpptegnelseForNyOppgave(opptegnelse)) {
                if (result.data.person) selectPeriod(result.data.person);
            }
        }
    });
};
