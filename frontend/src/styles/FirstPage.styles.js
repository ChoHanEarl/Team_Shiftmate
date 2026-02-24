import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { theme, media } from './theme'

export const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(160deg, #f0f4ff 0%, #e8eeff 50%, #f5f0ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%);
    top: -80px;
    left: -60px;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
    bottom: -60px;
    right: -60px;
    pointer-events: none;
  }

  ${media.sm} {
    padding: 40px 16px;
  }
`

export const Hero = styled.div`
  text-align: center;
  margin-bottom: 56px;
  position: relative;
  z-index: 1;

  ${media.sm} {
    margin-bottom: 36px;
  }
`

export const Logo = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 14px;
  color: ${theme.colors.primary};

  ${media.sm} {
    font-size: 2.4rem;
  }
`

export const Tagline = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.gray500};
  letter-spacing: 0.3px;

  ${media.sm} {
    font-size: 0.95rem;
  }
`

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 880px;
  width: 100%;
  margin-bottom: 52px;
  position: relative;
  z-index: 1;

  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.sm} {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 36px;
  }
`

export const FeatureCard = styled.div`
  background: white;
  border: 1px solid rgba(79, 70, 229, 0.1);
  border-radius: 16px;
  padding: 28px 22px;
  text-align: center;
  box-shadow: 0 2px 16px rgba(79, 70, 229, 0.06);
  transition: box-shadow 0.25s, transform 0.25s;

  &:hover {
    box-shadow: 0 8px 28px rgba(79, 70, 229, 0.13);
    transform: translateY(-3px);
  }

  ${media.sm} {
    padding: 20px 16px;
  }
`

export const FeatureIcon = styled.div`
  font-size: 1.9rem;
  margin-bottom: 14px;
`

export const FeatureTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${theme.colors.gray800};
  margin-bottom: 8px;
`

export const FeatureDesc = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.gray500};
  line-height: 1.6;
`

export const BtnGroup = styled.div`
  display: flex;
  gap: 14px;
  position: relative;
  z-index: 1;

  ${media.sm} {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    gap: 10px;
  }
`

export const LoginBtn = styled(Link)`
  background: ${theme.colors.primary};
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 14px 52px;
  border-radius: 10px;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background: ${theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(79, 70, 229, 0.4);
  }

  ${media.sm} {
    text-align: center;
    padding: 13px;
  }
`

export const RegisterBtn = styled(Link)`
  background: white;
  color: ${theme.colors.primary};
  font-size: 0.95rem;
  font-weight: 600;
  padding: 14px 52px;
  border-radius: 10px;
  border: 1.5px solid ${theme.colors.primary};
  letter-spacing: 0.3px;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: ${theme.colors.primaryLight};
    transform: translateY(-1px);
  }

  ${media.sm} {
    text-align: center;
    padding: 13px;
  }
`