import { GraphQLError } from 'graphql/error';
import { useSearchParams } from 'next/navigation';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { GraphQLErrors } from '@apollo/client/errors';
import { FetchError, FlereFodselsnumreError, NotFoundError, ProtectedError } from '@io/graphql/errors';
import { useFetchPersonQuery } from '@state/person';
import { varslerSlice } from '@store/features/varsler/varslerSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { SpeilError } from '@utils/error';

export const useVarsler = (): Array<SpeilError> => {
    const params = useSearchParams();
    const { error } = useFetchPersonQuery();
    const varsler = useAppSelector((state) => state.varsler);

    const errors: SpeilError[] =
        error?.graphQLErrors.map((error: GraphQLError) => {
            switch (error.extensions?.code) {
                case 403: {
                    return new ProtectedError();
                }
                case 404: {
                    return new NotFoundError();
                }
                case 500: {
                    if (error.extensions.feilkode === 'HarFlereFodselsnumre') {
                        const fodselsnumre = error.extensions.fodselsnumre;
                        return new FlereFodselsnumreError(fodselsnumre as string[]);
                    } else return new FetchError();
                }
                default: {
                    return new FetchError();
                }
            }
        }) ?? [];

    return varsler.concat(params.get('aktorId') !== undefined ? errors : []);
};

export const useRapporterGraphQLErrors = (): ((graphQLErrors: GraphQLErrors) => void) => {
    const addVarsel = useAddVarsel();

    return (errors) =>
        errors.map((error: GraphQLError) => {
            switch (error.extensions?.code) {
                case 403: {
                    addVarsel(new ProtectedError());
                    break;
                }
                case 404: {
                    addVarsel(new NotFoundError());
                    break;
                }
                case 500: {
                    if (error.extensions.feilkode === 'HarFlereFodselsnumre') {
                        const fodselsnumre = error.extensions.fodselsnumre;
                        addVarsel(new FlereFodselsnumreError(fodselsnumre as string[]));
                    } else addVarsel(new FetchError());
                    break;
                }
                default: {
                    addVarsel(new FetchError());
                }
            }
        });
};

export const useAddVarsel = (): ((varsel: SpeilError) => void) => {
    const dispatch = useAppDispatch();

    return (varsel: SpeilError) => {
        dispatch(varslerSlice.actions.leggTilVarsel(varsel));
    };
};

export const useOperationErrorHandler = (operasjon: string) => {
    const dispatch = useAppDispatch();
    const varsel: SpeilError = new SpeilError(`Det oppstod en feil. Handlingen som ikke ble utført: ${operasjon}`);

    return (ex: Error) => {
        console.log(`Feil ved ${operasjon}. ${ex.message}`);
        dispatch(varslerSlice.actions.leggTilVarsel(varsel));
    };
};

export const useRemoveVarsel = () => {
    const dispatch = useAppDispatch();

    return (name: string) => {
        dispatch(varslerSlice.actions.fjernVarsel(name));
    };
};
