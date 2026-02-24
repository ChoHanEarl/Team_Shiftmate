import { useNavigate } from 'react-router-dom'
import useAuthStore from "../../store/authStore";
import { Nav, Logo, Right, UserInfo, Badge, NavLink, LogoutBtn } from '../../styles/NavBar.styles';


export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <Nav>
            <Logo to ="/dashboard">ShiftMate</Logo>
            <Right>
                {user && (
                    <>
                        <UserInfo>
                            {user.name}
                            <Badge>{user.userType === '店長' ? '店長' : '従業員'}</Badge>
                        </UserInfo>
                        <NavLink to="/mypage">マイページ</NavLink>
                        <LogoutBtn onClick={handleLogout}>ログアウト</LogoutBtn>
                    </>
                )}
            </Right>
        </Nav>
    )
}