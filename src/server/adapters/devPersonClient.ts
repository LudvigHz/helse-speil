import { PersonClient } from '../person/personClient';
import { Instrumentation } from '../instrumentation';

export const devPersonClient = (_: Instrumentation): PersonClient => ({
    oppdaterPersoninfo: async (oppdatering, _): Promise<any> => {
        console.log(`Mottok oppdatering ${JSON.stringify(oppdatering)}`);
        return Promise.resolve();
    },
});
