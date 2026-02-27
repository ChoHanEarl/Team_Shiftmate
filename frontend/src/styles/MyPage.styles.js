import styled from 'styled-components'
import { theme, media } from './theme'

export const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: 100vh;

  ${media.sm} {
    padding: 24px 16px;
  }
`

export const Header = styled.header`
  margin-bottom: 40px;
  border-bottom: 1px solid ${theme.colors.gray200};
  padding-bottom: 20px;

  display: flex;                  
  justify-content: space-between;  
  align-items: flex-start;
`

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: ${theme.colors.gray800};
  letter-spacing: -0.5px;
  margin-bottom: 8px;

  ${media.sm} {
    font-size: 1.75rem;
  }
`

export const SubTitle = styled.p`
  color: ${theme.colors.gray500};
  font-size: 1rem;
`

export const Section = styled.section`
  margin-bottom: 48px;
`

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.gray800};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 24px;
    background: ${theme.colors.primary};
    border-radius: 2px;
  }
`

export const StoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`

export const StoreCard = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  padding: 24px;
  box-shadow: ${theme.shadow};
  border: 1px solid ${theme.colors.gray100};
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    border-color: ${theme.colors.primaryLight};
  }
`

export const StoreIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${theme.colors.primaryLight};
  color: ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 4px;
`

export const StoreName = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.colors.gray800};
`

export const StoreRole = styled.span`
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray500};
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
`

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.gray200};
  background: white;
  box-shadow: ${theme.shadow};
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px; 
`

export const Th = styled.th`
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray500};
  font-weight: 600;
  font-size: 0.9rem;
  text-align: left;
  padding: 16px;
  border-bottom: 2px solid ${theme.colors.gray200};
  white-space: nowrap;
`

export const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid ${theme.colors.gray200};
  color: ${theme.colors.gray700};
  font-size: 0.95rem;
  vertical-align: middle;

  tr:last-child & {
    border-bottom: none;
  }
`
export const EmptyTd = styled(Td).attrs({
  colSpan: 5
})`
  text-align: center;
  color: ${theme.colors.gray400};
  padding: 40px 0; 
  font-size: 0.95rem;
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  min-width: 80px;
  
  ${({ $status }) => {
    if ($status === '承認' || $status === '承認済み') {
        return `background: ${theme.colors.successLight}; color: ${theme.colors.success};`
    }
    if ($status === '断り') {
        return `background: ${theme.colors.dangerLight}; color: ${theme.colors.danger};`
    }
    return `background: ${theme.colors.warningLight}; color: ${theme.colors.warning};`
  }}
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

export const ActionButton = styled.button`
  padding: 8px 14px;
  border-radius: ${theme.radius.sm};
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  border: 1px solid transparent;

  ${({ $variant }) => 
    $variant === 'danger' ? `
      background: ${theme.colors.dangerLight}; 
      color: ${theme.colors.danger};
      &:hover { background: ${theme.colors.danger}; color: white; }
    ` : 
    $variant === 'secondary' ? `
      background: white; 
      border-color: ${theme.colors.gray200};
      color: ${theme.colors.gray700};
      &:hover { background: ${theme.colors.gray100}; border-color: ${theme.colors.gray400}; }
    ` : `
      background: ${theme.colors.primaryLight}; 
      color: ${theme.colors.primary};
      &:hover { background: ${theme.colors.primary}; color: white; }
    `
  };
`

export const DisabledText = styled.span`
  font-size: 0.85rem;
  color: ${theme.colors.gray400};
  font-style: italic;
`

export const EmptyMsg = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${theme.colors.gray400};
  background: ${theme.colors.gray100};
  border-radius: ${theme.radius.md};
  font-size: 0.95rem;
`
export const StoreAddress = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.gray500};
  margin: 4px 0 8px 0;
  line-height: 1.4;
  word-break: keep-all; 
`
export const BadgeWrapper = styled.div`
  margin-top: 12px; 
  display: flex;
  justify-content: center;
  width: 100%;
`
export const DashboardButton = styled.button`
    background: #000; 
    color: #fff; 
    padding: 14px 24px; 
    border-radius: 8px; 
    border: none; 
    cursor: pointer; 
    font-weight: bold; 
    font-size: 15px; 
    display: flex;
    align-items: center;
    gap: 6px; 
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8; 
    }
`