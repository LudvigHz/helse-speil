import logger from '../logging';
import { ipAddressFromRequest } from '../requestData';
import { Request } from 'express';
import { Client, TokenSet } from 'openid-client';
import { OidcConfig } from '../types';

const isValidNow = (token: string) => {
    return isValidAt(token, Math.floor(Date.now()) / 1000);
};

const isValidAt = (token: string, timeInSeconds: number) => {
    if (!token) {
        return false;
    }

    try {
        const claims = claimsFrom(token);
        const expirationTime = parseInt(claims['exp'] as string);
        return expirationTime >= timeInSeconds;
    } catch (err) {
        logger.error(`error while checking token validity: ${err}`);
        return false;
    }
};

const willExpireInLessThan = (seconds: number, token: string) => {
    const timeToTest = Math.floor(Date.now() / 1000) + seconds;
    const expirationTime = parseInt(claimsFrom(token)['exp'] as string);
    return timeToTest > expirationTime;
};

const redirectUrl = (req: Request, oidc: OidcConfig) => {
    const hostHeader = req.get('Host');
    if (hostHeader?.startsWith('localhost')) {
        return 'http://' + hostHeader + '/callback';
    } else {
        return oidc.redirectUrl;
    }
};

const validateOidcCallback = (req: Request, azureClient: Client, config: OidcConfig) => {
    if (req.body.code === undefined) {
        return Promise.reject('missing data in POST after login');
    }
    const params = azureClient.callbackParams(req);
    const nonce = req.session!.nonce;
    const state = req.session!.state;

    return azureClient
        .callback(redirectUrl(req, config), params, { nonce, state })
        .catch((err) => Promise.reject(`error in oidc callback: ${err}`))
        .then((tokenSet: TokenSet) => {
            const accessTokenKey = 'access_token';
            const idTokenKey = 'id_token';
            const errorMessages = checkAzureResponseContainsTokens(tokenSet, accessTokenKey, idTokenKey);
            if (errorMessages.length > 0) {
                return Promise.reject(`Access denied: ${errorMessages.join(' ')}`);
            }

            const accessToken = tokenSet[accessTokenKey];
            const idToken = tokenSet[idTokenKey];
            const requiredGroup = config.requiredGroup;
            const username = valueFromClaim('name', idToken);
            if (accessToken && isMemberOf(accessToken, requiredGroup)) {
                logger.info(`User ${username} has been authenticated, from IP address ${ipAddressFromRequest(req)}`);
                return [accessToken, idToken];
            } else {
                return Promise.reject(`'${username}' is not member of '${requiredGroup}', denying access`);
            }
        });
};

const checkAzureResponseContainsTokens = (tokenSet: TokenSet, ...tokens: string[]) =>
    [...tokens]
        .filter((tokenName) => tokenSet[tokenName] === undefined)
        .map((tokenName) => `Missing ${[tokenName]} in response from Azure AD.`);

const isMemberOf = (token: string, group?: string) => {
    const claims = claimsFrom(token);
    const groups = claims['groups'] as string[];
    return groups.filter((element: string) => element === group).length === 1;
};

const valueFromClaim = (claim: string, token?: string): string => {
    if (token === undefined) {
        logger.info(`no token, cannot extract claim value ${claim}`);
        return 'unknown value';
    }
    try {
        return (claimsFrom(token)[claim] as string) || 'unknown value';
    } catch (err) {
        logger.error(`error while extracting value from claim '${claim}': ${err}`);
        return 'unknown value';
    }
};
const claimsFrom = (token: string): any => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

const createTokenForTest = () =>
    `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')}.${Buffer.from(
        JSON.stringify({ name: 'S. A. Ksbehandler', email: 'dev@nav.no', NAVident: 'dev-ident' })
    ).toString('base64')}.bogussignature`;

export default {
    isValidAt,
    isValidNow,
    redirectUrl,
    willExpireInLessThan,
    validateOidcCallback,
    isMemberOf,
    valueFromClaim,
    createTokenForTest,
};
