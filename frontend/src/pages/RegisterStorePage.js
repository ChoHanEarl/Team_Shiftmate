import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { storeApi } from '../api/storeApi';

const RegisterStorePage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        storeName: '',
        storeAddress: '',
        category: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await storeApi.registerStore(form);
            alert("店舗登録が完了しました！");
            navigate('/dashboard');
        } catch (err) {
            alert("登録に失敗しました。");
        }
    };

    return (
        <Container>
            <Card>
                <h2>新規店舗登録</h2>
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
                            <option value={"true"}>true</option>
                            <option value={"false"}>false</option>
                        </select>
                    </InputGroup>

                    <SubmitBtn type="submit">登録する</SubmitBtn>
                </form>
            </Card>
        </Container>
    );
};

export default RegisterStorePage;

// --- 간단한 스타일 ---
const Container = styled.div` display: flex; justify-content: center; padding: 50px; `;
const Card = styled.div` background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 400px; `;
const InputGroup = styled.div` margin-bottom: 20px; label { display: block; margin-bottom: 8px; font-weight: bold; } input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; } `;
const SubmitBtn = styled.button` width: 100%; padding: 12px; background: #000; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; `;