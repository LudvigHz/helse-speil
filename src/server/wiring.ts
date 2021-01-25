import config from './config';
import redisClient from './redisClient';
import devRedisClient from './devRedisClient';

import instrumentationModule, { Instrumentation } from './instrumentation';
import stsClient from './auth/stsClient';
import onBehalfOf from './auth/onBehalfOf';
import devOnBehalfOf from './auth/devOnBehalfOf';
import vedtakClient from './payment/vedtakClient';
import devVedtakClient from './payment/devVedtakClient';
import annulleringClient from './payment/annulleringClient';
import devAnnulleringClient from './payment/devAnnulleringClient';
import aktørIdLookup from './aktørid/aktørIdLookup';
import spesialistClient from './person/spesialistClient';
import devSpesialistClient from './adapters/devSpesialistClient';
import overstyringClient from './overstyring/overstyringClient';
import devOverstyringClient from './overstyring/devOverstyringClient';
import tildelingClient from './tildeling/tildelingClient';
import devTildelingClient from './tildeling/devTildelingClient';
import dummyClient from './dummy/dummyClient';
import devDummyClient from './dummy/devDummyClient';
import { personClient } from './person/personClient';
import { devPersonClient } from './adapters/devPersonClient';
import opptegnelseClient from './opptegnelse/opptegnelseClient';
import devOpptegnelseClient from './opptegnelse/devOpptegnelseClient';

import { Express } from 'express';
import { RedisClient } from 'redis';

const getDependencies = (app: Express) =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app);

const getDevDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _devSpesialistClient = devSpesialistClient(instrumentation);
    const _devPersonClient = devPersonClient(instrumentation);
    return {
        person: {
            spesialistClient: _devSpesialistClient,
            personClient: _devPersonClient,
            onBehalfOf: devOnBehalfOf,
            config,
        },
        payments: { vedtakClient: devVedtakClient, annulleringClient: devAnnulleringClient },
        redisClient: devRedisClient,
        overstyring: { overstyringClient: devOverstyringClient },
        tildeling: { tildelingClient: devTildelingClient },
        opptegnelse: { opptegnelseClient: devOpptegnelseClient },
        dummy: { dummyClient: devDummyClient },
    };
};

const getProdDependencies = (app: Express) => {
    const _redisClient: RedisClient = redisClient.init(config.redis);
    stsClient.init(config.nav);
    aktørIdLookup.init(stsClient, config.nav);
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(config.oidc, instrumentation);
    const _vedtakClient = vedtakClient(config.oidc, _onBehalfOf);
    const _overstyringClient = overstyringClient(config.oidc, _onBehalfOf);
    const _tildelingClient = tildelingClient(config.oidc, _onBehalfOf);
    const _dummyClient = dummyClient(config.oidc, _onBehalfOf);
    const _annulleringClient = annulleringClient(config, _onBehalfOf);
    const _spesialistClient = spesialistClient(instrumentation);
    const _personClient = personClient(instrumentation, config.oidc, _onBehalfOf);
    const _opptegnelseClient = opptegnelseClient(config.oidc, _onBehalfOf);
    return {
        person: {
            spesialistClient: _spesialistClient,
            personClient: _personClient,
            onBehalfOf: _onBehalfOf,
            config,
        },
        payments: { vedtakClient: _vedtakClient, annulleringClient: _annulleringClient },
        redisClient: _redisClient,
        overstyring: { overstyringClient: _overstyringClient },
        tildeling: { tildelingClient: _tildelingClient },
        opptegnelse: { opptegnelseClient: _opptegnelseClient },
        dummy: { dummyClient: _dummyClient },
    };
};

export default { getDependencies };
