import styled from 'styled-components';

export const Container = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 24px;
    font-family: ${({ theme }) => theme.fonts.sans};
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
    h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 4px; color: ${({ theme }) => theme.colors.text}; }
    .store-info { font-size: 14px; color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const RoleBadge = styled.div`
    padding: 6px 16px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.03em;
    background: ${p => p.$isOwner ? '#EDE9FE' : '#DBEAFE'};
    color: ${p => p.$isOwner ? '#6D28D9' : '#1D4ED8'};
`;

export const FilterArea = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 20px 24px;
    border-radius: 14px;
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: ${({ theme }) => theme.shadow.sm};
    .date-filter {
        display: flex;
        align-items: center;
        gap: 12px;
        label { font-size: 14px; font-weight: 600; color: ${({ theme }) => theme.colors.textSecondary}; }
    }
    .add-btn {
        padding: 10px 22px;
        background: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.isDark ? '#0F1117' : '#fff'};
        border-radius: 10px;
        font-weight: 700;
        font-size: 14px;
        border: none;
        cursor: pointer;
        transition: opacity 0.18s;
        &:hover { opacity: 0.85; }
    }
`;

export const SectionTitle = styled.h3`
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 16px;
    letter-spacing: -0.01em;
`;

export const TimeTableWrap = styled.div`
    overflow-x: auto;
    border-radius: 14px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    margin-bottom: 32px;
`;

export const TimeTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    min-width: 700px;
`;

export const TTh = styled.th`
    background: ${({ theme }) => theme.colors.bg};
    padding: 11px 14px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSecondary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
    &:first-child { text-align: left; min-width: 80px; }
    &:last-child {
        position: sticky;
        right: 0;
        z-index: 2;
        background: ${({ theme }) => theme.colors.bg};
        border-left: 1px solid ${({ theme }) => theme.colors.border};
    }
`;

export const TTd = styled.td`
    padding: 10px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    text-align: center;
    vertical-align: middle;
    font-size: 13px;
    background: ${({ theme }) => theme.colors.surface};
    tr:last-child & { border-bottom: none; }
    &:first-child { text-align: left; font-weight: 600; color: ${({ theme }) => theme.colors.text}; }
    &:last-child {
        position: sticky;
        right: 0;
        z-index: 1;
        background: ${({ theme }) => theme.colors.surface};
        border-left: 1px soild ${({ theme }) => theme.colors.border};
    }
`;

export const ShiftCell = styled.div`
    background: ${p => {
        if (p.$status === '承認') return '#D1FAE5';
        if (p.$status === '断り') return '#FEE2E2';
        if (p.$status === '待機中') return '#FEF3C7';
        if (p.$isFull) return '#F3F4F6';
        return '#DBEAFE';
    }};
    color: ${p => {
        if (p.$status === '承認') return '#065F46';
        if (p.$status === '断り') return '#991B1B';
        if (p.$status === '待機中') return '#92400E';
        if (p.$isFull) return '#9CA3AF';
        return '#1D4ED8';
    }};
    border-radius: 7px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 600;
    cursor: ${p => (!p.$isFull && !p.$status) ? 'pointer' : 'default'};
    transition: filter 0.15s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    &:hover { filter: ${p => (!p.$isFull && !p.$status) ? 'brightness(0.95)' : 'none'}; }
`;

export const ShiftGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 18px;
`;

export const ShiftCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    padding: 22px;
    border-radius: 14px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    transition: box-shadow 0.18s;
    &:hover { box-shadow: ${({ theme }) => theme.shadow.md}; }
    .date { font-size: 17px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.02em; color: ${({ theme }) => theme.colors.text}; }
    .time { font-size: 14px; color: ${({ theme }) => theme.colors.textSecondary}; margin-bottom: 8px; }
    .info { font-size: 12px; color: ${({ theme }) => theme.colors.textMuted}; margin-bottom: 18px; }
    .actions {
        display: flex;
        gap: 8px;
        button { flex: 1; padding: 9px; border-radius: 8px; font-weight: 600; font-size: 13px; border: none; cursor: pointer; transition: all 0.18s; }
        .apply-btn { background: #0F0F0F; color: #fff; &:disabled { background: #D1D5DB; cursor: not-allowed; } }
    }
`;

export const StatusWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .cancel-text {
        background: none; border: none; color: #EF4444;
        font-size: 12px; font-weight: 600; text-decoration: underline; cursor: pointer; padding: 0;
    }
`;

export const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    ${p => {
        const s = p.$status;
        if (s === '承認' || s === 'APPROVED') return `background:#D1FAE5; color:#065F46;`;
        if (s === '断り' || s === 'REJECTED') return `background:#FEE2E2; color:#991B1B;`;
        if (s === '待機中' || s === 'PENDING') return `background:#FEF3C7; color:#92400E;`;
        return `background:#F3F4F6; color:#374151;`;
    }}
`;

export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
`;

export const ModalCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    padding: 36px;
    border-radius: 20px;
    width: 100%;
    max-width: 420px;
    box-shadow: ${({ theme }) => theme.shadow.lg};
    h3 { font-size: 20px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 24px; color: ${({ theme }) => theme.colors.text}; }
`;

export const ModalLabel = styled.label`
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
`;

export const ModalInput = styled.input`
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 9px;
    font-size: 14px;
    margin-bottom: 18px;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    transition: border-color 0.18s;
    &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
    color-scheme: ${({ theme }) => theme.isDark ? 'dark' : 'light'};
`;

export const ModalRow = styled.div`
    display: flex;
    gap: 14px;
`;

export const ModalBtnGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 8px;
    button { flex: 1; padding: 13px; border-radius: 10px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: all 0.18s; }
    .save   { 
        background: ${({ theme }) => theme.colors.primary}; 
        color: ${({ theme }) => theme.isDark ? '#0F1117' : '#fff'}; 
        &:hover { opacity: 0.85; } 
    }
    .cancel { background: ${({ theme }) => theme.colors.borderLight}; color: ${({ theme }) => theme.colors.textSecondary}; &:hover { background: ${({ theme }) => theme.colors.border}; } }
`;

export const Msg = styled.div`
    text-align: center;
    padding: 60px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 15px;
`;