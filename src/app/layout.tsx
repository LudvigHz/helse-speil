import type { Metadata } from 'next';
import Head from 'next/head';
import React, { PropsWithChildren, ReactElement } from 'react';

import { browserEnv, erLokal } from '@/env';
import { Providers } from '@app/providers';
import { getTokenPayload } from '@auth/token';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Header } from '@components/header/Header';

import './globals.css';

export const metadata: Metadata = {
    title: `Speil ${erLokal ? ' - localhost' : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev' ? ' - dev' : ''}`,
    icons: {
        icon: `/favicons/${
            erLokal
                ? 'favicon-local.ico'
                : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev'
                  ? 'favicon-dev.ico'
                  : 'favicon.ico'
        }`,
    },
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>): Promise<ReactElement> {
    const payload = await getTokenPayload();

    return (
        <html lang="en">
            <Head>
                <link
                    rel="preload"
                    href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
            </Head>
            <body>
                <Providers
                    bruker={{
                        oid: payload.oid,
                        epost: payload.preferred_username,
                        navn: payload.name,
                        ident: payload.NAVident,
                        grupper: payload.groups,
                    }}
                >
                    <Header />
                    <Varsler />
                    {children}
                    <Toasts />
                </Providers>
            </body>
        </html>
    );
}
