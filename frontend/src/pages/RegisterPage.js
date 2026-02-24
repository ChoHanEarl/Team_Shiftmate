import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkDuplicate, register } from '../api/userApi';
import { Page, Card, Title, Form, Row, Input, Select, DupBtn, DupMsg, SubmitBtn, ErrorMsg, Footer, StyledLink } from '../styles/RegisterPage.styles';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ userId: '', password: '', name: '', userType: '従業員'});
    const [dupMsg, setDupMsg] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleCheckDuplicate = async () => {
        if (!form.userId) return;
        try {
            const res = await checkDuplicate(form.userId);
            setDupMsg(res.data.isDuplicate ? '既に使用中のIDです。' : '使用可能なIDです。');
        } catch {
            setDupMsg('確認失敗');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(form);
            navigate('/login');
        } catch(err) {
            setError(err.response?.data?.message || '会員登録失敗');
        }
    }

    return (
        <Page>
            <Card>
                <Title>会員登録</Title>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Input name="userId" placeholder="ID" value={form.userId} onChange={handleChange} />
                        <DupBtn type="button" onClick={handleCheckDuplicate}>重複確認</DupBtn>
                    </Row>
                    {dupMsg && (
                        <DupMsg $ok={dupMsg.includes('可能')}>{dupMsg}</DupMsg>
                    )}
                    <Input name="password" type="password" placeholder="パスワード(8文字以上、英数字)" value={form.password} onChange={handleChange} />
                    <Input name="name" placeholder="名前" value={form.name} onChange={handleChange} />
                    <Select name="userType" value={form.userType} onChange={handleChange}>
                        <option value="従業員">従業員</option>
                        <option value="店長">店長</option>
                    </Select>
                    {error && <ErrorMsg>{error}</ErrorMsg>}
                    <SubmitBtn type="submit">登録する</SubmitBtn>
                </Form>
                <Footer>
                    既にアカウントをお持ちですか？ <StyledLink to="/login">ログイン</StyledLink>
                </Footer>
            </Card>
        </Page>
    )
}