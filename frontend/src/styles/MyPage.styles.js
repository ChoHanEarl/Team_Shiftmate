import styled from 'styled-components';

export const Container = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 24px;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 36px;
`;

export const PageTitle = styled.h1`
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.04em;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.colors.text};
`;

export const SubTitle = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const DashboardButton = styled.button`
    padding: 10px 20px;
    background: ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.textSecondary};
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    transition: all 0.18s;
    cursor: pointer;
    &:hover { background: ${({ theme }) => theme.colors.primary}; color: #fff; border-color: transparent; }
`;

export const Section = styled.section`
    margin-bottom: 40px;
`;

export const SectionTitle = styled.h2`
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const StoreGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
`;

export const StoreCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 14px;
    padding: 22px;
    box-shadow: ${({ theme }) => theme.shadow.sm};
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: box-shadow 0.18s;
    &:hover { box-shadow: ${({ theme }) => theme.shadow.md}; }
`;

export const StoreIcon    = styled.div` font-size: 26px; margin-bottom: 4px; `;
export const StoreName    = styled.h3`  font-size: 16px; font-weight: 700; letter-spacing: -0.02em; color: ${({ theme }) => theme.colors.text}; `;
export const StoreAddress = styled.p`  font-size: 12px; color: ${({ theme }) => theme.colors.textMuted}; line-height: 1.5; `;
export const StoreRole    = styled.span` font-size: 12px; font-weight: 600; color: ${({ theme }) => theme.colors.textSecondary}; `;
export const BadgeWrapper = styled.div` margin-top: 4px; `;

export const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    ${p => {
        const s = p.$status;
        if (s === '承認' || s === '継承') return `background:#D1FAE5; color:#065F46;`;
        if (s === '断り')                  return `background:#FEE2E2; color:#991B1B;`;
        if (s === '待機中')                return `background:#FEF3C7; color:#92400E;`;
        return `background:#F3F4F6; color:#374151;`;
    }}
`;

export const TableContainer = styled.div`
    overflow-x: auto;
    border-radius: 14px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadow.sm};
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
    font-size: 11px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
`;

export const Td = styled.td`
    padding: 14px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    vertical-align: middle;
    color: ${({ theme }) => theme.colors.text};
    tr:last-child & { border-bottom: none; }
`;

export const ButtonGroup = styled.div` display: flex; gap: 8px; `;

export const ActionButton = styled.button`
    padding: 6px 12px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.18s;
    cursor: pointer;
    white-space: nowrap;
    ${p => p.$variant === 'danger' ? `
        background: #FEF2F2; color: #EF4444; border: 1.5px solid #FECACA;
        &:hover { background: #EF4444; color: #fff; }
    ` : `
        background: #F3F4F6; color: #374151; border: 1.5px solid #E5E7EB;
        &:hover { background: #0F0F0F; color: #fff; border-color: #0F0F0F; }
    `}
`;

export const DisabledText = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const EmptyMsg = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    background: ${({ theme }) => theme.colors.bg};
    border-radius: 12px;
    border: 1px dashed ${({ theme }) => theme.colors.border};
`;

export const EmptyTd = styled.td`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
`;

/* ─── シフト変更モーダル ─── */
export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

export const ModalBox = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 16px;
    padding: 28px 24px;
    width: 420px;
    max-height: 70vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

export const ModalTitle = styled.h3`
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 6px;
    color: ${({ theme }) => theme.colors.text};
`;

export const ModalSubTitle = styled.p`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 20px;
`;

export const ShiftList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const ShiftItem = styled.div`
    padding: 14px 16px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.15s;
    &:hover {
        border-color: ${({ theme }) => theme.colors.accent};
        background: ${({ theme }) => theme.isDark ? 'rgba(125,212,163,0.07)' : '#F0FDF4'};
    }
`;

export const ShiftItemInfo = styled.div``;

export const ShiftDate = styled.div`
    font-weight: 600;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
`;

export const ShiftTime = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 3px;
`;

export const ShiftSlots = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const ModalCloseBtn = styled.button`
    margin-top: 20px;
    width: 100%;
    padding: 11px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    cursor: pointer;
    background: transparent;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    transition: all 0.15s;
    &:hover { background: ${({ theme }) => theme.colors.borderLight}; }
`;

export const ModalEmpty = styled.p`
    text-align: center;
    color: ${({ theme }) => theme.colors.textMuted};
    padding: 30px 0;
    font-size: 14px;
`;