import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Page = styled.div`
    min-height: 100vh;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 24px 60px;
    position: relative;
    overflow: hidden;
    &::before {
        content: '';
        position: absolute;
        top: -150px; right: -150px;
        width: 500px; height: 500px;
        background: radial-gradient(circle, #DBEAFE 0%, transparent 70%);
        z-index: 0;
    }
    &::after {
        content: '';
        position: absolute;
        bottom: -120px; left: -120px;
        width: 420px; height: 420px;
        background: radial-gradient(circle, #EDE9FE 0%, transparent 70%);
        z-index: 0;
    }
    > * { position: relative; z-index: 1; }
`;

export const Hero = styled.div`
    text-align: center;
    margin-bottom: 64px;
`;

export const Logo = styled.h1`
    font-size: clamp(44px, 8vw, 76px);
    font-weight: 800;
    letter-spacing: -0.05em;
    color: #0F0F0F;
    line-height: 1;
    margin-bottom: 16px;
`;

export const LogoAccent = styled.span`
    color: #3B82F6;
`;

export const Tagline = styled.p`
    font-size: 18px;
    color: #6B7280;
`;

export const FeatureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
    max-width: 900px;
    width: 100%;
    margin-bottom: 60px;
`;

export const FeatureCard = styled.div`
    background: #F9FAFB;
    border: 1px solid #F3F4F6;
    border-radius: 16px;
    padding: 26px;
    transition: all 0.2s;
    &:hover {
        background: #fff;
        border-color: #DBEAFE;
        box-shadow: 0 8px 24px rgba(59,130,246,0.08);
        transform: translateY(-2px);
    }
`;

export const FeatureIcon  = styled.div` font-size: 26px; margin-bottom: 12px; `;
export const FeatureTitle = styled.h3`  font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 8px; `;
export const FeatureDesc  = styled.p`  font-size: 13px; color: #9CA3AF; line-height: 1.65; `;

export const BtnGroup = styled.div`
    display: flex;
    gap: 14px;
`;

export const LoginBtn = styled(Link)`
    padding: 14px 40px;
    background: #0F0F0F;
    color: #fff;
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    transition: all 0.18s;
    &:hover { background: #374151; transform: translateY(-1px); }
`;

export const RegisterBtn = styled(Link)`
    padding: 14px 40px;
    background: #fff;
    color: #374151;
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    border: 1.5px solid #E5E7EB;
    transition: all 0.18s;
    &:hover { border-color: #3B82F6; color: #3B82F6; transform: translateY(-1px); }
`;