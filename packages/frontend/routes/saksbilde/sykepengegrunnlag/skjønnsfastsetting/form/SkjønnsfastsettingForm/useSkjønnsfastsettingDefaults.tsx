import { Arbeidsgiver, Arbeidsgiverinntekt } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isSykepengegrunnlagskjønnsfastsetting } from '@utils/typeguards';

import { skjønnsfastsettelseBegrunnelser } from '../../skjønnsfastsetting';
import { SkjønnsfastsettingFormFields } from './SkjønnsfastsettingForm';

export const useSkjønnsfastsettingDefaults = (
    inntekter: Arbeidsgiverinntekt[],
): {
    aktiveArbeidsgivere?: Arbeidsgiver[];
    aktiveArbeidsgivereInntekter?: Arbeidsgiverinntekt[];
    defaults: SkjønnsfastsettingFormFields;
} => {
    const period = useActivePeriod();
    const person = useCurrentPerson();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!period || !person || !arbeidsgiver)
        return {
            aktiveArbeidsgivere: undefined,
            aktiveArbeidsgivereInntekter: undefined,
            defaults: {
                begrunnelseFritekst: '',
                begrunnelseId: '',
                årsak: '',
                arbeidsgivere: [],
            },
        };

    // Finner alle aktive arbeidsgivere ved å først filtrere ut dem som ikke har omregnet årsinntekt, og deretter filtrere ut deaktiverte ghosts
    const aktiveArbeidsgivere =
        person?.arbeidsgivere
            .filter(
                (arbeidsgiver) =>
                    inntekter.find((inntekt) => inntekt.arbeidsgiver === arbeidsgiver.organisasjonsnummer)
                        ?.omregnetArsinntekt !== null,
            )
            .filter(
                (arbeidsgiver) =>
                    arbeidsgiver.ghostPerioder.filter(
                        (it) => it.skjaeringstidspunkt === period.skjaeringstidspunkt && !it.deaktivert,
                    ).length > 0 || arbeidsgiver.generasjoner.length > 0,
            ) ?? [];

    const aktiveArbeidsgivereInntekter = inntekter.filter((inntekt) =>
        aktiveArbeidsgivere.some(
            (arbeidsgiver) =>
                arbeidsgiver.organisasjonsnummer === inntekt.arbeidsgiver && inntekt.omregnetArsinntekt !== null,
        ),
    );

    const erReturoppgave = (period as BeregnetPeriode)?.totrinnsvurdering?.erRetur ?? false;
    const forrigeSkjønnsfastsettelse = erReturoppgave
        ? arbeidsgiver?.overstyringer
              .filter(isSykepengegrunnlagskjønnsfastsetting)
              .filter((overstyring) => !overstyring.ferdigstilt)
              .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
              .pop()
        : undefined;
    const forrigeSkjønnsfastsettelseFritekst = forrigeSkjønnsfastsettelse?.skjonnsfastsatt?.begrunnelseFritekst ?? '';
    const forrigeBegrunnelseId = skjønnsfastsettelseBegrunnelser().find(
        (begrunnelse) => begrunnelse.type.replace('Å', 'A') === forrigeSkjønnsfastsettelse?.skjonnsfastsatt?.type,
    )?.id;

    return {
        aktiveArbeidsgivere: aktiveArbeidsgivere,
        aktiveArbeidsgivereInntekter: aktiveArbeidsgivereInntekter,
        defaults: {
            begrunnelseFritekst: forrigeSkjønnsfastsettelseFritekst,
            begrunnelseId: forrigeBegrunnelseId ?? '',
            årsak: '',
            arbeidsgivere: aktiveArbeidsgivereInntekter.map((inntekt) => ({
                organisasjonsnummer: inntekt.arbeidsgiver,
                årlig: 0,
            })),
        },
    };
};
