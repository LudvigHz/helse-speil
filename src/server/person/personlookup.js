'use strict';

const moment = require('moment');

const logger = require('../logging');
const { isValidSsn } = require('../aktørid/ssnvalidation');
const { valueFromClaim } = require('../auth/authsupport');
const spleis = require('./spleisClient');

const personIdHeaderName = 'nav-person-id';

let aktørIdLookup;
let spadeClient;
let spleisId;
let spadeId;
let onBehalfOf;

const setup = ({
    aktørIdLookup: aktøridlookup,
    spadeClient: spadeclient,
    config,
    onBehalfOf: onbehalfof
}) => {
    aktørIdLookup = aktøridlookup;
    spadeClient = spadeclient;
    spleisId = config.oidc.clientIDSpleis;
    spadeId = config.oidc.clientIDSpade;
    onBehalfOf = onbehalfof;
};

const personSøk = async (req, res) => {
    const undeterminedPersonId = req.headers[personIdHeaderName];
    auditLog(req, undeterminedPersonId || 'missing person id');
    if (!undeterminedPersonId) {
        logger.error(`Missing header '${personIdHeaderName}' in request`);
        res.status(400).send(`Påkrevd header '${personIdHeaderName}' mangler`);
        return;
    }

    let aktorId = isValidSsn(undeterminedPersonId)
        ? await toAktørId(undeterminedPersonId)
        : undeterminedPersonId;
    if (!aktorId) {
        res.status(404).send('Kunne ikke finne aktør-ID for oppgitt fødselsnummer');
        return;
    }

    respondWith({
        res,
        lookupPromise: onBehalfOf
            .hentFor(spleisId, req.session.speilToken)
            .then(token => spleis.hentPerson(aktorId, token)),
        mapper: response => ({
            person: response.body
        })
    });
};

const behovForPeriode = (req, res) => {
    auditLog(req);

    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD');

    respondWith({
        res,
        lookupPromise: onBehalfOf
            .hentFor(spadeId, req.session.speilToken)
            .then(behalfOfToken =>
                spadeClient.behandlingerForPeriode(yesterday, today, behalfOfToken)
            ),
        mapper: response => ({
            behov: response.body
        })
    });
};

const auditLog = (request, ...queryParams) => {
    const speilUser = valueFromClaim('name', request.session.speilToken);
    logger.audit(
        `${speilUser} is doing lookup with params: ${queryParams?.reduce(
            (previous, current) => `${previous}, ${current}`,
            ''
        )}`
    );
};

const toAktørId = async fnr => {
    return await aktørIdLookup.hentAktørId(fnr).catch(err => {
        logger.error(`Could not fetch aktørId. ${err}`);
    });
};

const respondWith = ({ res, lookupPromise, mapper }) => {
    lookupPromise
        .then(apiResponse => {
            if (apiResponse === undefined) {
                logger.error('Unexpected error, missing apiResponse value');
                return res.sendStatus(503);
            }
            res.status(apiResponse.statusCode).send(mapper(apiResponse));
        })
        .catch(err => {
            logger.error(`Error during data fetching: ${err}`);
            res.sendStatus(err.statusCode || 503);
        });
};

module.exports = {
    setup,
    personSøk,
    behovForPeriode
};
