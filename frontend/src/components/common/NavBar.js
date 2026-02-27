import { useNavigate } from 'react-router-dom';
import useAuthStore from "../../store/authStore";
import { Nav, Logo, Right, UserInfo, Badge, NavLink, LogoutBtn } from '../../styles/NavBar.styles';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("ログアウトしますか？")) {
            logout();
            navigate('/login');
        }
    }

    return (
        <Nav>
            <Logo to={user ? "/dashboard" : "/"}>ShiftMate</Logo>
            
            <Right>
                {user ? (
                    <>
                        <UserInfo>
                            {user.name} 様
                            <Badge $isOwner={user.userType === '店長' || user.userType === 'OWNER'}>
                                {user.userType === '店長' || user.userType === 'OWNER' ? '管理者' : '従業員'}
                            </Badge>
                        </UserInfo>
                        <NavLink to="/mypage">マイページ</NavLink>
                        <LogoutBtn onClick={handleLogout}>ログアウト</LogoutBtn>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">ログイン</NavLink>
                        <NavLink to="/signup">新規登録</NavLink>
                    </>
                )}
            </Right>
        </Nav>
    )
}