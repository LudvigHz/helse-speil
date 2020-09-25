import React from 'react';
import { Ikon, IkonProps } from './Ikon';

export const GrøntSjekkikon = ({ width = 24, height = 24, viewBox = '0 0 25 25', className }: IkonProps) => (
    <Ikon width={width} height={height} viewBox={viewBox} className={className}>
        <path
            d="M12,0 C5.383,0 0,5.30116923 0,11.8153846 C0,18.3296 5.383,23.6307692 12,23.6307692 C18.616,23.6307692 24,18.3296 24,11.8153846 C24,5.30116923 18.616,0 12,0 Z"
            fill="#1C6937"
        />
        <path
            d="M9.63993168,14.2192548 L16.0998211,8.46997223 C16.4920344,8.12013129 17.1087604,8.13851058 17.4763929,8.51321602 C17.8442028,8.88810234 17.8231421,9.47629043 17.430152,9.82694424 L10.2805711,16.1905563 C10.0985537,16.3514793 9.8612111,16.438796 9.61751913,16.438796 C9.36153632,16.438796 9.11545171,16.3436566 8.92853154,16.1672113 L6.54589388,13.8950218 C6.16586146,13.532606 6.16586146,12.944248 6.54589388,12.5818321 C6.92592631,12.2194163 7.54288359,12.2194163 7.92291602,12.5818321 L9.63993168,14.2192548 Z"
            fill="#FFFFFF"
        />
    </Ikon>
);
