import styled from 'styled-components';

export const Btn = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: ${p => p.$sm ? '7px 14px' : '10px 20px'};
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: ${p => p.$sm ? '13px' : '14px'};
    font-weight: 600;
    transition: ${({ theme }) => theme.transition};
    white-space: nowrap;
    cursor: pointer;
    ${p => p.$variant === 'danger' && `
        background: #FEF2F2; color: #EF4444; border: 1.5px solid #FCA5A5;
        &:hover { background: #EF4444; color: #fff; }
    `}
    ${p => p.$variant === 'success' && `
        background: #ECFDF5; color: #10B981; border: 1.5px solid #6EE7B7;
        &:hover { background: #10B981; color: #fff; }
    `}
    ${p => p.$variant === 'outline' && `
        background: transparent;
        color: ${p.theme.colors.textSecondary};
        border: 1.5px solid ${p.theme.colors.border};
        &:hover { border-color: ${p.theme.colors.accent}; color: ${p.theme.colors.accent}; }
    `}
    ${p => (!p.$variant || p.$variant === 'primary') && `
        background: ${p.theme.colors.primary};
        color: #fff;
        border: 1.5px solid transparent;
        &:hover { opacity: 0.85; }
    `}
    &:disabled { opacity: 0.45; cursor: not-allowed; }
`;

export const Card = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    padding: ${p => p.$pad || '28px'};
`;

export const PageContainer = styled.div`
    max-width: ${p => p.$wide ? '1200px' : '1000px'};
    margin: 0 auto;
    padding: 40px 24px;
`;

export const SectionTitle = styled.h2`
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    ${p => {
        const s = p.$status;
        if (s === '承認' || s === '継承' || s === 'APPROVED') return `background:#D1FAE5; color:#065F46;`;
        if (s === '断り' || s === 'REJECTED')                  return `background:#FEE2E2; color:#991B1B;`;
        if (s === '待機中' || s === 'PENDING')                 return `background:#FEF3C7; color:#92400E;`;
        return `background:#F3F4F6; color:#374151;`;
    }}
`;

export const TableWrap = styled.div`
    overflow-x: auto;
    border-radius: ${({ theme }) => theme.radius.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
`;

export const Th = styled.th`
    background: ${({ theme }) => theme.colors.bg};
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
`;

export const Td = styled.td`
    padding: 14px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.text};
    vertical-align: middle;
    &:last-child { white-space: nowrap; }
    tr:last-child & { border-bottom: none; }
`;

export const EmptyMsg = styled.div`
    text-align: center;
    padding: 52px 24px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    background: ${({ theme }) => theme.colors.bg};
    border-radius: ${({ theme }) => theme.radius.lg};
`;

export const Input = styled.input`
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: 14px;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    transition: border-color 0.18s;
    &:focus { border-color: ${({ theme }) => theme.colors.accent}; background: ${({ theme }) => theme.colors.surface}; }
    &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const Label = styled.label`
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 6px;
`;

export const FormGroup = styled.div`
    margin-bottom: 18px;
`;