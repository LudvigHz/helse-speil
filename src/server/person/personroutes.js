'use strict';

const personLookup = require('./personlookup');
const personMapping = require('./personmapping');
const router = require('express').Router();
const logger = require('../logging');

const setup = stsclient => {
    personLookup.init(stsclient);
    routes(router);
    return router;
};

const routes = router => {
    const handlers = {
        getPerson: {
            prod: getPerson,
            dev: devGetPerson
        }
    };

    const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
    router.get('/:aktorId', handlers.getPerson[mode]);
};

const getPerson = (req, res) => {
    const aktørId = req.params.aktorId;
    personLookup
        .hentPerson(aktørId)
        .then(person => {
            res.send(personMapping.map(person));
        })
        .catch(err => {
            logger.error(err);
            res.sendStatus(500);
        });
};

const devGetPerson = (req, res) => {
    const response =
        req.params.aktorId === '10000000000001'
            ? { navn: 'Kong Harald', kjønn: 'mann' }
            : { navn: 'Dronning Sonja', kjønn: 'kvinne' };
    res.send(response);
};

module.exports = {
    setup
};
