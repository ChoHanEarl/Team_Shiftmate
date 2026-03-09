import { useNavigate } from 'react-router-dom';
import useAuthStore from "../../store/authStore";
import useThemeStore from '../../store/themeStore';
import ShiftMateLogo from './ShiftMateLogo';
import NotificationBell from './NotificationBell';
import { Nav, LogoLink, Right, UserInfo, RoleBadge, NavLink, LogoutBtn, DarkToggleBtn } from '../../styles/NavBar.styles';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const { isDark, toggleDark } = useThemeStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("ログアウトしますか？")) {
            logout();
            navigate('/');
        }
    }

    const isOwner = user?.userType === '店長' || user?.userType === 'OWNER';

    return (
        <Nav>
            <LogoLink to={user ? '/dashboard' : '/'}>
                <ShiftMateLogo size="sm" />
            </LogoLink>
            <Right>
                {user ? (
                    <>
                        <UserInfo>
                            {user.name} 様
                            <RoleBadge $isOwner={isOwner}>
                                {isOwner ? '管理者' : '従業員'}
                            </RoleBadge>
                        </UserInfo>
                        {!isOwner && <NavLink to="/mypage">マイページ</NavLink>}
                        {isOwner && <NavLink to="/admin">管理者ページ</NavLink>}
                        <NotificationBell />
                        <DarkToggleBtn onClick={toggleDark} title={isDark ? 'ライトモード' : 'ダークモード'}>
                            {isDark ? '☀️' : '🌙'}
                        </DarkToggleBtn>
                        <LogoutBtn onClick={handleLogout}>ログアウト</LogoutBtn>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">ログイン</NavLink>
                        <NavLink to="/register">新規登録</NavLink>
                    </>
                )}
            </Right>
        </Nav>
    )
}