import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeApi } from '../api/storeApi';
import { Container, Card, Title, InputGroup, SubmitBtn } from '../styles/StorePage.styles';

const RegisterStorePage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ storeName: '', storeAddress: '', category: '', autoApprove: 'false' });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await storeApi.registerStore({ ...form, autoApprove: form.autoApprove === 'true' });
            alert('店舗登録が完了しました！');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('登録に失敗しました。');
        }
    };

    return (
        <Container>
            <Card>
                <Title>新規店舗登録</Title>
                <form onSubmit={handleSubmit}>
                    <InputGroup>
                        <label>店舗名</label>
                        <input name="storeName" placeholder="例: シフトメイト カフェ" onChange={handleChange} required />
                    </InputGroup>
                    <InputGroup>
                        <label>住所</label>
                        <input name="storeAddress" placeholder="例: 東京都新宿区..." onChange={handleChange} required />
                    </InputGroup>
                    <InputGroup>
                        <label>カテゴリー</label>
                        <input name="category" placeholder="例: 飲食店..." onChange={handleChange} required />
                    </InputGroup>
                    <InputGroup>
                        <label>自動承認</label>
                        <select name="autoApprove" onChange={handleChange}>
                            <option value="false">無効</option>
                            <option value="true">有効</option>
                        </select>
                    </InputGroup>
                    <SubmitBtn type="submit">登録する</SubmitBtn>
                </form>
            </Card>
        </Container>
    );
};

export default RegisterStorePage;