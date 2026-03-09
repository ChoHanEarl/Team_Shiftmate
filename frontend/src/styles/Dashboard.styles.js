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
    margin-bottom: 40px;
    h1 {
        font-size: 26px;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: ${({ theme }) => theme.colors.text};
    }
`;

export const HeaderBtn = styled.button`
    padding: 11px 22px;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.isDark ? 'black' : '#fff'};
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    border: none;
    transition: opacity 0.18s;
    cursor: pointer;
    &:hover { opacity: 0.85; }
`;

export const MypageBtn = styled.button`
    padding: 11px 22px;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textSecondary};
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    transition: all 0.18s;
    cursor: pointer;
    &:hover { border-color: ${({ theme }) => theme.colors.accent}; color: ${({ theme }) => theme.colors.accent}; }
`;

export const Section = styled.div`
    margin-top: 8px;
`;

export const SectionTitle = styled.h2`
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 20px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
`;

export const StoreCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 16px;
    padding: 26px;
    box-shadow: ${({ theme }) => theme.shadow.sm};
    transition: box-shadow 0.18s, transform 0.18s;
    &:hover {
        box-shadow: ${({ theme }) => theme.shadow.md};
        transform: translateY(-2px);
    }
    h3 {
        margin: 14px 0 6px;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: ${({ theme }) => theme.colors.text};
    }
    .address {
        font-size: 13px;
        color: ${({ theme }) => theme.colors.textMuted};
        margin-bottom: 20px;
        min-height: 18px;
    }
`;

export const CardTopRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

export const Badge = styled.span`
    display: inline-block;
    padding: 4px 12px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    background: ${p => p.$status === '承認' ? '#DBEAFE' : '#F3F4F6'};
    color: ${p => p.$status === '承認' ? '#1D4ED8' : '#6B7280'};
`;

export const DeleteBtn = styled.button`
    background: none;
    border: 1px solid #FCA5A5;
    color: #EF4444;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    &:hover { background: #EF4444; color: #fff; }
`;

export const CardActions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    button {
        width: 100%;
        padding: 11px;
        border-radius: 9px;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.18s;
        border: none;
        cursor: pointer;
    }
    .main-btn  { background: #0F0F0F; color: #fff; &:hover { background: #374151; } }
    .staff-btn { background: #3B82F6; color: #fff; &:hover { background: #2563EB; } }
    .outline-btn {
        background: ${({ theme }) => theme.colors.surface};
        color: ${({ theme }) => theme.colors.textSecondary};
        border: 1.5px solid ${({ theme }) => theme.colors.border} !important;
        &:hover { border-color: #3B82F6 !important; color: #3B82F6; }
    }
    .apply-btn { background: #10B981; color: #fff; &:hover { background: #059669; } }
    button:disabled { cursor: not-allowed; opacity: 0.5; }
`;

export const TabGroup = styled.div`
    display: flex;
    margin-bottom: 28px;
    background: ${({ theme }) => theme.colors.borderLight};
    border-radius: 12px;
    padding: 4px;
    width: fit-content;
`;

export const Tab = styled.button`
    padding: 9px 22px;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    background: ${p => p.$active ? p.theme.colors.surface : 'transparent'};
    color: ${p => p.$active ? p.theme.colors.text : p.theme.colors.textMuted};
    box-shadow: ${p => p.$active ? p.theme.shadow.sm : 'none'};
    transition: all 0.18s;
    &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

export const EmptyMsg = styled.div`
    text-align: center;
    padding: 60px 24px;
    background: ${({ theme }) => theme.colors.bg};
    border-radius: 16px;
    grid-column: 1 / -1;
    border: 1px dashed ${({ theme }) => theme.colors.border};
    p { color: ${({ theme }) => theme.colors.textMuted}; margin-bottom: 16px; font-size: 15px; }
    button {
        padding: 10px 22px;
        border-radius: 9px;
        border: 1.5px solid ${({ theme }) => theme.colors.border};
        background: ${({ theme }) => theme.colors.surface};
        color: ${({ theme }) => theme.colors.textSecondary};
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.18s;
        &:hover { border-color: #3B82F6; color: #3B82F6; }
    }
`;

export const Msg = styled.div`
    text-align: center;
    padding: 100px;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textMuted};
`;