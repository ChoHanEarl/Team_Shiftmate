import styled from 'styled-components';

export const Container = styled.div`
    max-width: 480px;
    margin: 0 auto;
    padding: 60px 24px;
`;

export const Card = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 20px;
    padding: 40px;
    box-shadow: ${({ theme }) => theme.shadow.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h2`
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.04em;
    margin-bottom: 28px;
    color: ${({ theme }) => theme.colors.text};
`;

export const InputGroup = styled.div`
    margin-bottom: 18px;
    label {
        display: block;
        font-size: 12px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin-bottom: 7px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }
    input, select {
        width: 100%;
        padding: 11px 14px;
        border: 1.5px solid ${({ theme }) => theme.colors.border};
        border-radius: 9px;
        font-size: 14px;
        font-family: inherit;
        background: ${({ theme }) => theme.colors.bg};
        color: ${({ theme }) => theme.colors.text};
        transition: border-color 0.18s;
        &:focus { border-color: ${({ theme }) => theme.colors.accent}; background: ${({ theme }) => theme.colors.surface}; outline: none; }
        &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
    }
`;

export const SubmitBtn = styled.button`
    width: 100%;
    padding: 13px;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 10px;
    border: none;
    cursor: pointer;
    transition: opacity 0.18s;
    &:hover { opacity: 0.85; }
`;

export const CancelBtn = styled.button`
    width: 100%;
    padding: 13px;
    background: ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.textSecondary};
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: background 0.18s;
    &:hover { background: ${({ theme }) => theme.colors.border}; }
`;

export const Msg = styled.div`
    text-align: center;
    padding: 100px;
    color: ${({ theme }) => theme.colors.textMuted};
`;