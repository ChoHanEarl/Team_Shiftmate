import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { theme, media } from './theme'

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.gray100};
  padding: 16px;
`

export const Card = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadow};
  padding: 40px 36px;
  width: 100%;
  max-width: 380px;

  ${media.sm} {
    padding: 28px 20px;
  }
`

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  text-align: center;

  ${media.sm} {
    font-size: 1.5rem;
  }
`

export const Subtitle = styled.p`
  text-align: center;
  color: ${theme.colors.gray400};
  font-size: 0.875rem;
  margin-bottom: 28px;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const Input = styled.input`
  border: 1.5px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.md};
  padding: 10px 14px;
  font-size: 0.95rem;
  outline: none;
  width: 100%;
  transition: border-color 0.2s;
  &:focus { border-color: ${theme.colors.primary}; }

  ${media.sm} {
    padding: 9px 12px;
    font-size: 0.9rem;
  }
`

export const SubmitBtn = styled.button`
  background: ${theme.colors.primary};
  color: white;
  padding: 11px;
  border-radius: ${theme.radius.md};
  font-size: 0.95rem;
  font-weight: 600;
  width: 100%;
  &:hover { background: ${theme.colors.primaryDark}; }

  ${media.sm} {
    padding: 10px;
  }
`

export const ErrorMsg = styled.p`
  color: ${theme.colors.danger};
  font-size: 0.85rem;
`

export const Footer = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${theme.colors.gray500};
  margin-top: 20px;
`

export const StyledLink = styled(Link)`
  color: ${theme.colors.primary};
  &:hover { text-decoration: underline; }
`