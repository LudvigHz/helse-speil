import styled from '@emotion/styled';
import ReactTooltip from 'react-tooltip';

export const Tooltip = styled(ReactTooltip)`
    padding: 2px 8px !important;
    font-size: 14px !important;
    line-height: 20px !important;
    border-width: 0 !important;
    border-radius: 4px;
    box-shadow: 0 1px 2px var(--navds-semantic-color-border);
    background-color: var(--navds-global-color-orange-100) !important;
    color: var(--navds-semantic-color-text) !important;
    border-color: var(--navds-semantic-color-border) !important;

    &:after {
        display: none !important;
    }
`;
