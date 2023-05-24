import { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import fs from 'fs';
import { GraphQLSchema, IntrospectionQuery, buildClientSchema } from 'graphql';
import path from 'path';

// @ts-ignore
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { IResolvers } from '@graphql-tools/utils';

import spesialistSchema from '../graphql.schema.json';
import { behandledeOppgaver } from './data/behandledeOppgaver';
import { behandlingsstatistikk } from './data/behandlingsstatistikk';
import { getMockOppdrag } from './data/oppdrag';
import { oppgaver } from './data/oppgaver';
import { FlereFodselsnumreError, NotFoundError } from './errors';
import type {
    BeregnetPeriode,
    MutationFeilregistrerKommentarArgs,
    MutationLeggTilKommentarArgs,
    MutationSettVarselstatusAktivArgs,
    MutationSettVarselstatusVurdertArgs,
    Person,
} from './schemaTypes';
import { NotatMock } from './storage/notat';
import { OppgaveMock } from './storage/oppgave';
import { VarselMock } from './storage/varsel';

const leggTilLagretData = (person: Person): void => {
    let tildeling = person.tildeling;

    for (const arbeidsgiver of person.arbeidsgivere) {
        for (const generasjon of arbeidsgiver.generasjoner) {
            for (const periode of generasjon.perioder as Array<BeregnetPeriode>) {
                if (OppgaveMock.isAssigned(periode)) {
                    tildeling = {
                        epost: 'epost@nav.no',
                        navn: 'Utvikler, Lokal',
                        oid: 'uuid',
                        reservert: OppgaveMock.isOnHold(periode),
                    };
                }

                periode.notater = NotatMock.getNotaterForPeriode(periode);
                periode.varsler = VarselMock.getVarslerForPeriode(periode.varsler);
                const oppgavereferanse: string | null = periode.oppgavereferanse ?? periode.oppgave?.id ?? null;
                const oppgave: Oppgave | null = oppgavereferanse ? OppgaveMock.getOppgave(oppgavereferanse) : null;

                if (typeof oppgave === 'object' && periode.oppgave === null) {
                    periode.oppgave = oppgave;
                }
            }
        }
    }

    person.tildeling = tildeling;
};

const fetchPersondata = (): Record<string, JSON> => {
    const url = path.join(__dirname, '/data/personer');
    const filenames = fs.readdirSync(url);

    const files = filenames.map((filename) => {
        const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
        return JSON.parse(raw);
    });

    return files.reduce((data, { data: { person } }) => {
        leggTilLagretData(person);
        data[person.aktorId] = person;
        data[person.fodselsnummer] = person;
        return data;
    }, {});
};

const getResolvers = (): IResolvers => ({
    Query: {
        person: async (_, { fnr, aktorId }: { fnr?: string; aktorId?: string }) => {
            if (aktorId == '1337') {
                throw new FlereFodselsnumreError();
            }
            const person = fetchPersondata()[fnr ?? aktorId ?? ''];
            if (!person) {
                throw new NotFoundError(fnr ?? aktorId ?? '');
            }
            return person;
        },
        oppdrag: (_) => {
            return getMockOppdrag();
        },
        behandledeOppgaver: async () => {
            return behandledeOppgaver;
        },
        behandlingsstatistikk: async () => {
            return behandlingsstatistikk;
        },
        alleOppgaver: async () => {
            return oppgaver;
        },
    },
    Mutation: {
        feilregistrerKommentar: (_, { id }: MutationFeilregistrerKommentarArgs) => {
            NotatMock.feilregistrerKommentar({ id });
            return true;
        },
        leggTilKommentar: (_, { tekst, notatId, saksbehandlerident }: MutationLeggTilKommentarArgs) => {
            return NotatMock.addKommentar({ tekst, notatId, saksbehandlerident });
        },
        settVarselstatusVurdert: async (
            _,
            { generasjonIdString, definisjonIdString, varselkode, ident }: MutationSettVarselstatusVurdertArgs,
        ) => {
            return VarselMock.settVarselstatusVurdert({
                generasjonIdString,
                definisjonIdString,
                varselkode,
                ident,
            });
        },
        settVarselstatusAktiv: async (
            _,
            { generasjonIdString, varselkode, ident }: MutationSettVarselstatusAktivArgs,
        ) => {
            return VarselMock.settVarselstatusAktiv({ generasjonIdString, varselkode, ident });
        },
    },
    Periode: {
        __resolveType: (periode: { beregningId: string }) => {
            return periode.beregningId ? 'BeregnetPeriode' : 'UberegnetPeriode';
        },
    },
    Vilkarsgrunnlag: {
        __resolveType: (grunnlag: { grunnbelop?: number }) => {
            return typeof grunnlag.grunnbelop === 'number' ? 'VilkarsgrunnlagSpleis' : 'VilkarsgrunnlagInfotrygd';
        },
    },
    Hendelse: {
        __resolveType: (hendelse: { type: string }) => {
            return (() => {
                switch (hendelse.type) {
                    case 'INNTEKTSMELDING':
                        return 'Inntektsmelding';
                    case 'NY_SOKNAD':
                        return 'Sykmelding';
                    case 'SENDT_SOKNAD_ARBEIDSGIVER':
                        return 'SoknadArbeidsgiver';
                    case 'SENDT_SOKNAD_NAV':
                        return 'SoknadNav';
                    default:
                        throw Error(`Fant hendelse med ukjent type: ${hendelse.type}`);
                }
            })();
        },
    },
    Overstyring: {
        __resolveType: (overstyring: { dager?: Array<object>; inntekt?: object }) => {
            return overstyring.dager
                ? 'Dagoverstyring'
                : overstyring.inntekt
                ? 'Inntektoverstyring'
                : 'Arbeidsforholdoverstyring';
        },
    },
});

const buildSchema = (): GraphQLSchema => {
    return makeExecutableSchema({
        typeDefs: buildClientSchema(spesialistSchema as unknown as IntrospectionQuery),
        resolvers: getResolvers(),
    });
};

export const setUpGraphQLMiddleware = (app: Express) => {
    const schema = buildSchema();
    app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));
};
