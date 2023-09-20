import request from 'request-promise-native';

import { sleep } from '../devHelpers';
import { Instrumentation } from '../instrumentation';
import logger from '../logging';
import { OidcConfig } from '../types';

export default (config: OidcConfig, instrumentation: Instrumentation) => {
    const counter = instrumentation.onBehalfOfCounter();

    return {
        hentFor: async (targetClientId: string, accessToken: string) => {
            counter.inc(targetClientId);

            const options = {
                uri: config.tokenEndpoint,
                json: true,
                method: 'POST',
                form: {
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    client_id: config.clientID, // our own
                    client_secret: config.clientSecret,
                    assertion: accessToken,
                    scope: targetClientId, // the app we're reaching out to
                    requested_token_use: 'on_behalf_of',
                },
            };
            let forsøk = 0;
            let response;
            while (!response || response.error) {
                try {
                    response = await request.post(options);
                } catch (error) {
                    if (forsøk <= 3) {
                        logger.error(`Feil ved henting av token for ${targetClientId}: ${error}`);
                    } else {
                        logger.error(
                            `Feil etter ${forsøk} forsøk ved henting av token for ${targetClientId}: ${error}, gir opp`,
                        );
                        throw error;
                    }
                } finally {
                    forsøk++;
                    await sleep(500 * forsøk);
                }
            }

            if (forsøk > 1) {
                logger.info(`Brukte ${forsøk} forsøk på å hente token for ${targetClientId}`);
            }

            return response.access_token;
        },
    };
};
