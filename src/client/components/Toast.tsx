import React, { ReactNode, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import GrøntSjekkikon from './Ikon/GrøntSjekkikon';
import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { toastState } from '../state/toastState';

interface ToastProps {
    children?: ReactNode | ReactNode[];
}

const ToastView = styled.div`
    display: flex;
    z-index: 1000;
    align-items: center;
    position: absolute;
    background: #cde7d8;
    min-height: 1rem;
    min-width: 1rem;
    width: max-content;
    padding: 0.5rem 0.75rem;
    box-shadow: 0 0 0 3px #06893a;
    border-radius: 4px;
    margin: 1rem;
`;

const SuksessIkon = styled(GrøntSjekkikon)`
    margin-right: 0.5rem;
`;

export const SuksessToast = () => (
    <Toast>
        <SuksessIkon />
    </Toast>
);

export const Toast = ({ children }: ToastProps) => {
    const [showing, setShowing] = useState(false);
    const [toast, setToast] = useRecoilState(toastState);

    useEffect(() => {
        let timeouter: any;
        if (toast) {
            setShowing(true);
            timeouter = setTimeout(() => {
                setShowing(false);
                setToast(undefined);
            }, 5000);
        }
        return () => {
            setToast(undefined);
            clearTimeout(timeouter);
        };
    }, [toast]);

    return (
        <AnimatePresence>
            {showing && (
                <motion.div
                    key="toast"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                    <ToastView role="alert" aria-live="polite">
                        {children}
                        {toast}
                    </ToastView>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
