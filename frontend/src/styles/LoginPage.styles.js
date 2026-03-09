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
    max-width: 400px;
    box-shadow: ${({ theme }) => theme.shadow.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h1`
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 4px;
`;

export const Subtitle = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 32px;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    font-size: 14px;
    transition: border-color 0.18s;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    &:focus { border-color: ${({ theme }) => theme.colors.accent}; background: ${({ theme }) => theme.colors.surface}; }
    &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const SubmitBtn = styled.button`
    width: 100%;
    padding: 13px;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.isDark ? '#0F1117' : '#fff'};
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