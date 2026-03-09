import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
`;

export const BellBtn = styled.button`
    position: relative;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.18s;
    &:hover { border-color: ${({ theme }) => theme.colors.accent}; }
`;

export const Badge = styled.span`
    position: absolute;
    top: -4px;
    right: -4px;
    background: #EF4444;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    border-radius: 99px;
    padding: 1px 5px;
    min-width: 16px;
    text-align: center;
    line-height: 14px;
`;

export const Dropdown = styled.div`
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 340px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 16px;
    box-shadow: ${({ theme }) => theme.shadow.lg};
    z-index: 500;
    animation: ${fadeIn} 0.18s ease;
    overflow: hidden;
`;

export const DropdownHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: 8px;
`;

export const TextBtn = styled.button`
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.accent};
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 5px;
    transition: background 0.15s;
    &:hover { background: ${({ theme }) => theme.colors.borderLight}; }
`;

export const List = styled.div`
    max-height: 360px;
    overflow-y: auto;
`;

export const Item = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 13px 18px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    background: ${p => p.$unread
        ? p.theme.isDark ? 'rgba(125,212,163,0.07)' : '#F0FDF4'
        : 'transparent'};
    cursor: pointer;
    transition: background 0.15s;
    &:last-child { border-bottom: none; }
    &:hover { background: ${({ theme }) => theme.colors.borderLight}; }
`;

export const Dot = styled.div`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${p => p.$unread ? '#10B981' : 'transparent'};
    margin-top: 5px;
    flex-shrink: 0;
`;

export const ItemContent = styled.div`
    flex: 1;
`;

export const Message = styled.p`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.55;
    margin-bottom: 3px;
`;

export const Time = styled.span`
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const Empty = styled.div`
    text-align: center;
    padding: 40px 20px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const ActionRow = styled.div`
    display: flex;
    gap: 6px;
    margin-top: 8px;
`;

export const ApproveBtn = styled.button`
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    background: #D1FAE5;
    color: #065F46;
    transition: all 0.15s;
    &:hover { background: #10B981; color: #fff; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const RejectBtn = styled.button`
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    background: #FEE2E2;
    color: #991B1B;
    transition: all 0.15s;
    &:hover { background: #EF4444; color: #fff; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const LinkBtn = styled.button`
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    cursor: pointer;
    background: transparent;
    color: ${({ theme }) => theme.colors.accent};
    transition: all 0.15s;
    &:hover { background: ${({ theme }) => theme.colors.borderLight}; }
`;