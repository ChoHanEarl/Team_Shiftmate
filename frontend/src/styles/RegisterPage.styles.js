import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Page = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.bg};
    padding: 24px;
`;

export const Card = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 20px;
    padding: 44px 40px;
    width: 100%;
    max-width: 440px;
    box-shadow: ${({ theme }) => theme.shadow.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h1`
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 28px;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

export const Row = styled.div`
    display: flex;
    gap: 10px;
`;

export const Input = styled.input`
    flex: 1;
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    font-size: 14px;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    transition: border-color 0.18s;
    &:focus { border-color: ${({ theme }) => theme.colors.accent}; background: ${({ theme }) => theme.colors.surface}; }
    &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
    color-scheme: ${({ theme }) => theme.isDark?'dark':'light'}
`;

export const Select = styled.select`
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    font-size: 14px;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    transition: border-color 0.18s;
    cursor: pointer;
    &:focus { border-color: ${({ theme }) => theme.colors.accent}; background: ${({ theme }) => theme.colors.surface}; }
`;

export const DupBtn = styled.button`
    padding: 0 16px;
    background: ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.textSecondary};
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    cursor: pointer;
    transition: all 0.18s;
    &:hover { background: ${({ theme }) => theme.colors.primary}; color: #fff; border-color: transparent; }
`;

export const DupMsg = styled.p`
    font-size: 12px;
    font-weight: 600;
    color: ${p => p.$ok ? '#10B981' : '#EF4444'};
    padding: 6px 12px;
    border-radius: 6px;
    background: ${p => p.$ok ? '#D1FAE5' : '#FEE2E2'};
`;

export const SubmitBtn = styled.button`
    width: 100%;
    padding: 13px;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme}) => theme.isDark ? '#0F1117' : '#fff'};
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    margin-top: 6px;
    border: none;
    cursor: pointer;
    transition: opacity 0.18s;
    &:hover { opacity: 0.85; }
`;

export const ErrorMsg = styled.p`
    font-size: 13px;
    color: #EF4444;
    background: #FEF2F2;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #FECACA;
`;

export const Footer = styled.div`
    margin-top: 24px;
    text-align: center;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textMuted};
`;

export const StyledLink = styled(Link)`
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
    &:hover { text-decoration: underline; }
`;