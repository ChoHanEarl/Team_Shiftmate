import styled from 'styled-components';

export const Container = styled.div`
    max-width: 560px;
    margin: 0 auto;
    padding: 40px 24px;
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 32px;
`;

export const BackBtn = styled.button`
    padding: 8px 16px;
    background: ${({ theme }) => theme.colors.borderLight};
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    transition: all 0.18s;
    &:hover { background: ${({ theme }) => theme.colors.border}; }
`;

export const PageTitle = styled.h1`
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.colors.text};
`;

export const Card = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 16px;
    padding: 28px;
    box-shadow: ${({ theme }) => theme.shadow.sm};
    margin-bottom: 20px;
`;

export const CardTitle = styled.h2`
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

export const FieldRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    gap: 12px;
    &:last-child { border-bottom: none; }
`;

export const FieldLabel = styled.span`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 500;
    min-width: 90px;
    flex-shrink: 0;
`;

export const FieldValue = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    flex: 1;
`;

export const FieldInput = styled.input`
    flex: 1;
    padding: 8px 12px;
    border: 1.5px solid ${({ theme }) => theme.colors.accent};
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    background: ${({ theme }) => theme.isDark ? '#1e2d45' : '#EFF6FF'};
    color: ${({ theme }) => theme.colors.text};
    transition: border-color 0.18s;
    &:focus { border-color: ${({ theme }) => theme.colors.accentHover}; }
`;

export const EditBtn = styled.button`
    padding: 6px 14px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
    &:hover { border-color: ${({ theme }) => theme.colors.accent}; color: ${({ theme }) => theme.colors.accent}; }
`;

export const SaveBtn = styled.button`
    padding: 6px 14px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    border: none;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    cursor: pointer;
    transition: opacity 0.18s;
    white-space: nowrap;
    &:hover { opacity: 0.85; }
`;

export const CancelBtn = styled.button`
    padding: 6px 12px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    transition: all 0.18s;
    &:hover { background: ${({ theme }) => theme.colors.borderLight}; }
`;

export const BtnGroup = styled.div` display: flex; gap: 6px; `;

export const PasswordForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const PwInput = styled.input`
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 9px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    transition: border-color 0.18s;
    &:focus { border-color: ${({ theme }) => theme.colors.accent}; background: ${({ theme }) => theme.colors.surface}; }
    &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const PwSaveBtn = styled.button`
    padding: 11px;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 700;
    border: none;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.isDark ? '#0F1117' : '#fff'};
    cursor: pointer;
    transition: opacity 0.18s;
    &:hover { opacity: 0.85; }
`;

export const DangerCard = styled.div`
    background: #FFF5F5;
    border: 1px solid #FECACA;
    border-radius: 16px;
    padding: 24px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
`;

export const DangerText = styled.div`
    h3 { font-size: 15px; font-weight: 700; color: #991B1B; margin-bottom: 4px; }
    p  { font-size: 13px; color: #B91C1C; }
`;

export const DeleteBtn = styled.button`
    padding: 10px 20px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 700;
    border: none;
    background: #EF4444;
    color: #fff;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.18s;
    &:hover { background: #DC2626; }
`;

export const ErrorMsg = styled.p`
    font-size: 13px; color: #EF4444;
    background: #FEF2F2; padding: 9px 13px;
    border-radius: 7px; border: 1px solid #FECACA;
`;

export const SuccessMsg = styled.p`
    font-size: 13px; color: #065F46;
    background: #D1FAE5; padding: 9px 13px;
    border-radius: 7px; border: 1px solid #6EE7B7;
`;