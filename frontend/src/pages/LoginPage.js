import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import { login } from '../api/userApi'
import { Page, Card, Title, Subtitle, Form, Input, SubmitBtn, ErrorMsg, Footer, StyledLink } from '../styles/LoginPage.styles.js';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login: storeLogin } = useAuthStore();
    const [form, setForm] = useState({ userId: '', password: ''});
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(form);
            storeLogin(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'ログイン失敗')
        }
    }

    return (
        <Page>
            <Card>
                <Title>ShiftMate</Title>
                <Subtitle>シフト管理サービス</Subtitle>
                <Form onSubmit={handleSubmit}>
                    <Input name="userId" placeholder="ID" value={form.userId} onChange={handleChange} />
                    <Input name="password" type="password" placeholder="パスワード" value={form.password} onChange={handleChange} />
                    {error && <ErrorMsg>{error}</ErrorMsg>}
                    <SubmitBtn type="submit">ログイン</SubmitBtn>
                </Form>
                <Footer>
                    会員登録はこちら <StyledLink to="/register">会員登録</StyledLink>
                </Footer>
            </Card>
        </Page>
    )
}
