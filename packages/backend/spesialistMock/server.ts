import dayjs from 'dayjs';
import express, { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import { sleep } from '../devHelpers';
import { setupGraphQLMiddleware } from './graphql';

import oppgaveFil from '../__mock-data__/oppgaver.json';

const app = express();
const port = 9001;

const passeLenge = () => Math.random() * 500 + 200;

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, fodselsnummer'
    );
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    next();
});

export const oppgaveTildelinger: { [oppgavereferanse: string]: string } = {};

export const oppgaverPåVent: { [oppgavereferanse: string]: boolean } = {};

export const oppgaverTrengerTotrinnsvurdering: { [oppgavereferanse: string]: boolean } = {};

export const oppgaverTilBeslutter: { [oppgavereferanse: string]: boolean } = {};

export const oppgaverTilRetur: { [oppgavereferanse: string]: boolean } = {};

export const notater: { [vedtaksperiodereferanser: string]: SpesialistNotat[] } = {};

interface SpesialistNotat {
    id: string;
    tekst: string;
    opprettet: string;
    saksbehandlerOid: string;
    saksbehandlerNavn: string;
    saksbehandlerEpost: string;
    saksbehandlerIdent?: string;
    vedtaksperiodeId: string;
    feilregistrert: boolean;
    type: 'PaaVent' | 'Retur' | 'Generelt';
}

const mockNotat: SpesialistNotat = {
    id: '123456',
    tekst: 'Revidert utgave 2',
    opprettet: '2021-02-01T23:04:09.454',
    saksbehandlerOid: 'uuid',
    saksbehandlerNavn: 'Bernt Bjelle 2',
    saksbehandlerEpost: 'bernt.bjelle@nav.no',
    saksbehandlerIdent: 'E123456',
    vedtaksperiodeId: '87c0469c-16a5-4986-b756-7e4a7cdfcd71',
    feilregistrert: false,
    type: 'PaaVent',
};

const personer: { [aktørId: string]: string } = oppgaveFil
    .map(({ aktørId, oppgavereferanse }: { aktørId: string; oppgavereferanse: string }) => [aktørId, oppgavereferanse])
    .reduce((acc, [aktørId, oppgavereferanse]) => {
        let ret: {
            [aktørId: string]: string;
        } = { ...acc, [aktørId]: oppgavereferanse };
        return ret;
    }, {});

const feilresponsForTildeling = {
    feilkode: 'oppgave_er_allerede_tildelt',
    kildesystem: 'mockSpesialist',
    kontekst: {
        tildeling: {
            navn: 'Saksbehandler Frank',
            epost: 'frank@nav.no',
            oid: 'en annen oid',
        },
    },
};

app.post('/api/tildeling/:oppgavereferanse', (req: Request, res: Response) => {
    sleep(passeLenge()).then(() => {
        if (Math.random() < 1) {
            const oppgavereferanse = req.params.oppgavereferanse;
            oppgaveTildelinger[oppgavereferanse] = 'uuid';
            res.sendStatus(200);
        } else {
            res.status(409).json(feilresponsForTildeling);
        }
    });
});

app.delete('/api/tildeling/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;
    delete oppgaveTildelinger[oppgavereferanse];
    delete oppgaverPåVent[oppgavereferanse];
    sleep(passeLenge()).then(() => res.sendStatus(200));
});

app.post('/api/leggpaavent/:oppgaveReferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgaveReferanse;
    const notatDto = req.body;
    oppgaverPåVent[oppgavereferanse] = true;
    res.sendStatus(200);
});

app.delete('/api/leggpaavent/:oppgaveReferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgaveReferanse;
    delete oppgaverPåVent[oppgavereferanse];
    res.sendStatus(200);
});

app.post('/api/notater/:vedtaksperiodeId', (req: Request, res: Response) => {
    const vedtaksperiodeId = req.params.vedtaksperiodeId;
    const nyttNotat: SpesialistNotat = {
        ...mockNotat,
        vedtaksperiodeId: vedtaksperiodeId,
        id: nanoid(),
        tekst: req.body.tekst,
        opprettet: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    };
    notater[vedtaksperiodeId] = [...(notater[vedtaksperiodeId] || []), nyttNotat];
    res.sendStatus(200);
});

app.put('/api/notater/:vedtaksperiodeId/feilregistrer/:notatId', (req: Request, res: Response) => {
    const vedtaksperiodeId = req.params.vedtaksperiodeId;
    const notatId = req.params.notatId;

    const notat = notater[vedtaksperiodeId].find((notat) => notat.id === notatId)!!;

    const nyttNotat: SpesialistNotat = {
        ...notat,
        feilregistrert: true,
    };

    const gamleNotater = notater[vedtaksperiodeId].filter((notat) => notat.id !== notatId);

    notater[vedtaksperiodeId] = [...gamleNotater, nyttNotat];
    res.sendStatus(200);
});

app.get('/api/notater', (req: Request, res: Response) => {
    const vedtaksperioderIder = req.query.vedtaksperiode_id;
    if (vedtaksperioderIder === undefined) res.sendStatus(400);

    const vedtaksperioderIderArray = Array.isArray(vedtaksperioderIder) ? vedtaksperioderIder : [vedtaksperioderIder];
    let response: { [oppgaveref: string]: SpesialistNotat[] } = {};
    vedtaksperioderIderArray.forEach((ref) => {
        const string_ref = ref as string; // todo: fjern as string
        response[string_ref] = notater[string_ref] ?? [];
    });
    res.send(response);
});

app.post('/api/totrinnsvurdering/retur', (req: Request, res: Response) => {
    // mangler å legge til returnotat
    const oppgavereferanse = req.body.oppgavereferanse;
    oppgaverTilRetur[oppgavereferanse] = true;
    oppgaverTilBeslutter[oppgavereferanse] = false;
    res.sendStatus(200);
});

app.post('/api/totrinnsvurdering', (req: Request, res: Response) => {
    // mangler å legge til periodehistorikk
    const oppgavereferanse = req.body.oppgavereferanse;
    oppgaverTilRetur[oppgavereferanse] = false;
    oppgaverTilBeslutter[oppgavereferanse] = true;
    res.sendStatus(200);
});

app.get('/api/mock/personstatus/:aktorId', (req: Request, res: Response) => {
    const aktørId = req.params.aktorId;
    const oppgavereferanse = personer[aktørId];
    const påVent = oppgaverPåVent[oppgavereferanse] || false;
    const oid = oppgaveTildelinger[oppgavereferanse];
    res.send(oid ? { påVent, oid, epost: 'dev@nav.no', navn: 'dev' } : undefined);
});

setupGraphQLMiddleware(app);

app.listen(port, () => console.log(`Spesialist-mock kjører på port ${port}`));
