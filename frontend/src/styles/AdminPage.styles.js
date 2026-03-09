import styled from 'styled-components';

export const Container = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 24px;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.04em;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.colors.text};
`;

export const StoreInfo = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const StoreSelect = styled.select`
    padding: 5px 10px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
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

export const TabContainer = styled.div`
    display: flex;
    gap: 4px;
    background: ${({ theme }) => theme.colors.borderLight};
    padding: 4px;
    border-radius: 12px;
    margin-bottom: 28px;
    width: fit-content;
`;

export const TabButton = styled.button`
    padding: 9px 20px;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    background: ${p => p.$active ? p.theme.colors.surface : 'transparent'};
    color: ${p => p.$active ? p.theme.colors.text : p.theme.colors.textMuted};
    box-shadow: ${p => p.$active ? p.theme.shadow.sm : 'none'};
    transition: all 0.18s;
    cursor: pointer;
    &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

export const ContentCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 16px;
    padding: 32px;
    box-shadow: ${({ theme }) => theme.shadow.sm};
`;

export const SectionTitle = styled.h2`
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const Hr = styled.hr`
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
    margin: 28px 0;
`;

export const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const ListItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: ${({ theme }) => theme.colors.bg};
    border: 1px solid ${({ theme }) => theme.colors.borderLight};
    border-radius: 10px;
    transition: border-color 0.18s;
    &:hover { border-color: ${({ theme }) => theme.colors.border}; }
`;

export const ItemInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
`;

export const NameGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    strong { font-size: 15px; font-weight: 700; color: ${({ theme }) => theme.colors.text}; }
    span   { font-size: 13px; color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`;

export const ActionButton = styled.button`
    padding: 7px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.18s;
    cursor: pointer;
    white-space: nowrap;
    ${p => p.$variant === 'danger' ? `
        background: #FEF2F2;
        color: #EF4444;
        border: 1.5px solid #FECACA;
        &:hover { background: #EF4444; color: #fff; }
    ` : `
        background: #0F0F0F;
        color: #fff;
        border: 1.5px solid transparent;
        &:hover { background: #374151; }
    `}
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
        if (s === '承認' || s === '継承') return `background:#D1FAE5; color:#065F46;`;
        if (s === '断り')                  return `background:#FEE2E2; color:#991B1B;`;
        if (s === '待機中')                return `background:#FEF3C7; color:#92400E;`;
        return `background:#F3F4F6; color:#374151;`;
    }}
`;

export const TableContainer = styled.div`
    overflow-x: auto;
    border-radius: 12px;
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
    font-size: 11px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
`;

export const Td = styled.td`
    padding: 13px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    vertical-align: middle;
    color: ${({ theme }) => theme.colors.text};
    tr:last-child & { border-bottom: none; }
`;

export const StoreInfoWrapper = styled.div`
    max-width: 480px;
`;

export const InputGroup = styled.div`
    margin-bottom: 18px;
`;

export const Label = styled.label`
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 7px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
`;

export const Input = styled.input`
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 9px;
    font-size: 14px;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    transition: border-color 0.18s;
    &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
    &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const SearchBox = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
`;

export const SaveButtonWrapper = styled.div`
    margin-top: 24px;
`;

export const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: ${({ theme }) => theme.colors.bg};
    border-radius: 9px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    cursor: pointer;
    input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; accent-color: ${({ theme }) => theme.colors.accent}; }
    label { font-size: 14px; font-weight: 500; color: ${({ theme }) => theme.colors.text}; cursor: pointer; }
`;

export const EmptyMsg = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    background: ${({ theme }) => theme.colors.bg};
    border-radius: 10px;
    border: 1px dashed ${({ theme }) => theme.colors.border};
`;