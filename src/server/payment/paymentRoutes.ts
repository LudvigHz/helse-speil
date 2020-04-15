import logger from '../logging';
import { AnnulleringClient } from './annulleringClient';
import { VedtakClient } from './vedtakClient';
import { Request, Response, Router } from 'express';

interface SetupOptions {
    vedtakClient: VedtakClient;
    annulleringClient: AnnulleringClient;
}

const router = Router();
let annulleringClient: AnnulleringClient;
let vedtakClient: VedtakClient;

const setup = ({ vedtakClient: _vedtakClient, annulleringClient: _annulleringClient }: SetupOptions) => {
    vedtakClient = _vedtakClient;
    annulleringClient = _annulleringClient;
    routes(router);
    return router;
};

const routes = (router: Router) => {
    const vedtakHandler = {
        handle: (req: Request, res: Response) => {
            if (
                !(req.body.behovId || req.body.vedtaksperiodeId) ||
                !req.body.aktørId ||
                req.body.godkjent === undefined
            ) {
                res.status(400).send('BehovId eller vedtaksperiodeId, aktørId og godkjent-verdi må være tilstede');
                return;
            }
            vedtakClient
                .postVedtak({
                    behovId: req.body.behovId,
                    aktørId: req.body.aktørId,
                    vedtaksperiodeId: req.body.vedtaksperiodeId,
                    saksbehandlerIdent: req.session!.user,
                    godkjent: req.body.godkjent,
                    speilToken: req.session!.speilToken
                })
                .then(() => res.sendStatus(204))
                .catch(err => {
                    logger.error(`Feil under fatting av vedtak: ${err}`);
                    res.status(500).send('Feil under fatting av vedtak');
                });
        }
    };

    const annulleringHandler = {
        handle: (req: Request, res: Response) => {
            if (!req.body.utbetalingsreferanse || !req.body.aktørId || !req.body.fødselsnummer) {
                res.status(400).send('Både utbetalingsreferanse, aktørId og fnr må være tilstede');
                return;
            }
            annulleringClient
                .annuller({
                    utbetalingsreferanse: req.body.utbetalingsreferanse,
                    aktørId: req.body.aktørId,
                    saksbehandler: req.session!.user,
                    fødselsnummer: req.body.fødselsnummer
                })
                .then(() => {
                    logger.info(
                        `Annullering for sak med utbetalingsreferanse ${req.body.utbetalingsreferanse} sendt inn av ${
                            req.session!.user
                        }`
                    );
                    res.sendStatus(204);
                })
                .catch(err => {
                    logger.error(`Feil under annullering: ${err}`);
                    res.status(err.statusCode || 500).send('Feil under annullering');
                });
        }
    };

    router.post('/vedtak', vedtakHandler.handle);
    router.post('/annullering', annulleringHandler.handle);
};

export default { setup };
