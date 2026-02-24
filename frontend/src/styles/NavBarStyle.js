import styled from "styled-components";
import { Link } from "react-router-dom";
import { theme } from '../../styles/theme';

export const Nav = styled.Nav`
    background: ${theme.colors.primary};
    color: white;
    padding: 0 24px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`

export const Logo = styled(Link)`
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: white;
`

export const Right = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`

export const UserInfo = styled.span`
    font-size: 0.9rem;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 8px;
`

export const Badge = styled.span`
    background: rgba(255, 255, 255, 0.2);
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 20px;
`

export const NavLink = styled(Link)`
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.85);
    &:hover { color: white; }
`

export const LogoutBtn = styled.button`
    font-size: 0.875rem;
    background: rgba(0, 0, 0, 0.2);
    color: white;
    padding: 6px 14px;
    border-radius: ${theme.radius.sm};
    &&:hover { background: rgba(0, 0, 0, 0.35); }
`
