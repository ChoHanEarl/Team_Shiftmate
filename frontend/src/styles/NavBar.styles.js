import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Nav = styled.nav`
    position: sticky;
    top: 0;
    z-index: 100;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    background: ${({ theme }) => theme.isDark ? 'rgba(26,29,39,0.95)' : 'rgba(255,255,255,0.92)'};
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadow.sm};
`;

export const LogoLink = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: opacity 0.18s;
    &:hover { opacity: 0.75; }
`;

export const Right = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textSecondary};
`;

export const RoleBadge = styled.span`
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    background: ${p => p.$isOwner ? '#EDE9FE' : '#DBEAFE'};
    color: ${p => p.$isOwner ? '#6D28D9' : '#1D4ED8'};
`;

export const NavLink = styled(Link)`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: 6px 12px;
    border-radius: 8px;
    transition: all 0.18s;
    &:hover {
        background: ${({ theme }) => theme.colors.borderLight};
        color: ${({ theme }) => theme.colors.text};
    }
`;

export const LogoutBtn = styled.button`
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMuted};
    padding: 6px 12px;
    border-radius: 8px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    background: transparent;
    transition: all 0.18s;
    &:hover { background: #FEF2F2; color: #EF4444; border-color: #FCA5A5; }
`;

export const DarkToggleBtn = styled.button`
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
    &:hover {
        border-color: ${({ theme }) => theme.colors.accent};
        transform: rotate(20deg) scale(1.1);
    }
`;
