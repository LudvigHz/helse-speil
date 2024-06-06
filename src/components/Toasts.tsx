'use client';

import { AnimatePresence } from 'framer-motion';
import React from 'react';

import { Toast } from '@components/Toast';
import { useAppSelector } from '@store/hooks';

import styles from './Toasts.module.css';

export const Toasts = () => {
    const toasts = useAppSelector((state) => state.toasts);

    return (
        <div className={styles.Toasts}>
            <AnimatePresence>
                {toasts.map((it) => (
                    <Toast variant={it.variant} key={it.key} id={it.key} spinner={it.loading}>
                        {it.message}
                    </Toast>
                ))}
            </AnimatePresence>
        </div>
    );
};
