import { useTheme } from 'styled-components';
import styled from 'styled-components';
import logoPng from '../../assets/ShiftMateLogo.png';

// ─── 다크모드용 SVG 텍스트 로고 ───
const Wrap = styled.div`
    display: flex;
    align-items: center;
    gap: ${p => p.$size === 'lg' ? '14px' : '9px'};
`;

const Text = styled.div`
    font-size: ${p => p.$size === 'lg' ? '56px' : '20px'};
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    display: flex;
    align-items: baseline;
`;

const Shift = styled.span`
    color: ${({ theme }) => theme.colors.logoShift};
`;

const Mate = styled.span`
    color: ${({ theme }) => theme.colors.logoMate};
`;

const SvgIcon = ({ size, mint, charcoal }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect x="2" y="2" width="26" height="26" rx="3" fill={mint} />
        <rect x="12" y="12" width="26" height="26" rx="3" fill={charcoal} />
        <rect x="16" y="17" width="4" height="4" rx="0.8" fill={mint} />
        <rect x="22" y="17" width="4" height="4" rx="0.8" fill={mint} />
        <rect x="28" y="17" width="4" height="4" rx="0.8" fill={mint} />
        <rect x="16" y="23" width="4" height="4" rx="0.8" fill={mint} />
        <rect x="22" y="23" width="4" height="4" rx="0.8" fill={mint} />
        <rect x="28" y="23" width="4" height="4" rx="0.8" fill={mint} />
    </svg>
);

// ─── 메인 컴포넌트 ───
// size: 'sm' → NavBar용, 'lg' → FirstPage용
export default function ShiftMateLogo({ size = 'sm' }) {
    const theme = useTheme();
    const iconSize = size === 'lg' ? 56 : 30;

    // 다크모드 → SVG + 텍스트 로고
    if (theme.isDark) {
        return (
            <Wrap $size={size}>
                <SvgIcon
                    size={iconSize}
                    mint={theme.colors.logoShift}
                    charcoal={theme.colors.logoMate}
                />
                <Text $size={size}>
                    <Shift>Shift</Shift>
                    <Mate>Mate</Mate>
                </Text>
            </Wrap>
        );
    }

    // 라이트모드 → PNG 이미지
    return (
        <img
            src={logoPng}
            alt="ShiftMate"
            height={size === 'lg' ? 80 : 36}
            style={{ 
                display: 'block', 
                objectFit: 'contain',
                marginLeft: size === 'sm' ? '20px' : '0',
             }}
        />
    );
}