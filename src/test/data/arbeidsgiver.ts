import { mapArbeidsgivere } from '../../client/mapping/arbeidsgiver';
import { umappetVedtaksperiode } from './vedtaksperiode';
import { SpesialistArbeidsgiver, SpesialistOverstyring, SpesialistRisikovurdering } from 'external-types';

export const umappetArbeidsgiver = (
    vedtaksperioder = [umappetVedtaksperiode()],
    overstyringer: SpesialistOverstyring[] = [],
    risikovurderinger: SpesialistRisikovurdering[] = []
): SpesialistArbeidsgiver => ({
    organisasjonsnummer: '987654321',
    id: '3fb100f2-5d3d-4a89-84cd-e123544a4400',
    navn: 'Potetsekk AS',
    risikovurderinger: risikovurderinger,
    vedtaksperioder: vedtaksperioder,
    overstyringer: overstyringer,
});

export const mappetArbeidsgiver = (vedtaksperioder = [umappetVedtaksperiode()]) =>
    mapArbeidsgivere([umappetArbeidsgiver(vedtaksperioder)]).then((arbeidsgivere) => arbeidsgivere.pop());
