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
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between; 
  align-items: flex-start;
`

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: ${theme.colors.gray800};
  letter-spacing: -0.5px;

  ${media.sm} {
    font-size: 1.75rem;
  }
`

export const StoreInfo = styled.p`
  color: ${theme.colors.gray500};
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background: ${theme.colors.primary};
    border-radius: 50%;
  }
`

export const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`

export const TabButton = styled.button`
  padding: 10px 20px;
  border-radius: ${theme.radius.md};
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
  
  /* Active 상태일 때와 아닐 때 스타일 분기 */
  background: ${({ $active }) => $active ? theme.colors.primary : 'white'};
  color: ${({ $active }) => $active ? 'white' : theme.colors.gray500};
  box-shadow: ${({ $active }) => $active ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none'};
  border: 1px solid ${({ $active }) => $active ? theme.colors.primary : 'transparent'};

  &:hover {
    background: ${({ $active }) => $active ? theme.colors.primaryDark : theme.colors.gray100};
    transform: translateY(-1px);
  }

  ${media.sm} {
    flex: 1;
    text-align: center;
    padding: 10px 12px;
    font-size: 0.85rem;
    white-space: nowrap;
  }
`

export const ContentCard = styled.div`
  background: white;
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadow};
  padding: 32px;
  border: 1px solid ${theme.colors.gray100};

  ${media.sm} {
    padding: 20px;
  }
`

export const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${theme.colors.gray800};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: ${theme.colors.gray100};
  border-radius: ${theme.radius.md};
  transition: background 0.2s;

  &:hover {
    background: #EEF2FF; 
  }

  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: row; 
  align-items: center; 
  gap: 12px;
  padding-left: 8px;

  strong {
    font-size: 1.1rem;
    color: ${theme.colors.gray800};
  }

  small {
    font-weight: 400;
    color: ${theme.colors.gray400};
    font-size: 0.85rem;
    margin-top: 0; 
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  
  ${media.sm} {
    width: 100%;
    justify-content: flex-end;
  }
`

export const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: ${theme.radius.sm};
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  

  background: ${({ $variant }) => 
    $variant === 'danger' ? theme.colors.danger : 
    $variant === 'secondary' ? theme.colors.gray200 : 
    theme.colors.primary};
    
  color: ${({ $variant }) => 
    $variant === 'secondary' ? theme.colors.gray700 : 'white'};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.gray200};
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; 
`

export const Th = styled.th`
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray500};
  font-weight: 600;
  font-size: 0.9rem;
  text-align: left;
  padding: 14px 16px;
  border-bottom: 2px solid ${theme.colors.gray200};
`

export const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid ${theme.colors.gray200};
  color: ${theme.colors.gray700};
  font-size: 0.95rem;

  tr:last-child & {
    border-bottom: none;
  }
`

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  
  ${({ $status }) => {
    if ( $status === '承認' || $status === '承認済み') {
        return `background: ${theme.colors.successLight}; color: ${theme.colors.success};`
    }
    if ($status === '断り') {
        return `background: ${theme.colors.dangerLight}; color: ${theme.colors.danger};`
    }
    return `background: ${theme.colors.warningLight}; color: ${theme.colors.warning};`
  }}
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.gray700};
`

export const Input = styled.input`
  border: 1.5px solid ${theme.colors.gray200};
  border-radius: ${theme.radius.md};
  padding: 10px 14px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`

export const SearchBox = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`

export const Hr = styled.hr`
  border: 0;
  height: 1px;
  background: ${theme.colors.gray200};
  margin: 24px 0;
`

export const EmptyMsg = styled.p`
  text-align: center;
  color: ${theme.colors.gray400};
  padding: 20px 0;
`

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    accent-color: ${theme.colors.primary};
    cursor: pointer;
  }

  label {
    cursor: pointer;
    font-size: 0.95rem;
    color: ${theme.colors.gray700};
  }
`
export const NameGroup = styled.div`
  display: flex;
  align-items: baseline; 
  gap: 6px;

  strong {
    font-size: 1.05rem;
    color: ${theme.colors.gray800};
  }

  span {
    font-size: 0.85rem;
    color: ${theme.colors.gray500};
  }
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
export const StoreSelect = styled.select`
  margin-left: 12px;
  padding: 6px 12px;
  border-radius: ${theme.radius.md};
  border: 1.5px solid ${theme.colors.gray200};
  font-size: 0.95rem;
  color: ${theme.colors.gray700};
  background-color: white;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &:hover {
    border-color: ${theme.colors.gray400};
  }
`
export const StoreInfoWrapper = styled.div`
  max-width: 500px;
`;

export const SaveButtonWrapper = styled.div`
  margin-top: 24px;

  button {
    width: 100%;
  }
`