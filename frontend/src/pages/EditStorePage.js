import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storeApi } from '../api/storeApi';
import { Container, Card, Title, InputGroup, SubmitBtn, CancelBtn, Msg } from '../styles/StorePage.styles';

const EditStorePage = () => {
    const { storeNumber } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ storeName: '', storeAddress: '', category: '', autoApprove: 'false' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const res = await storeApi.getStoreByNumber(storeNumber);
                // 버그 수정: res.data.store 로 올바르게 접근
                const data = res.data.store;
                if (data) {
                    setForm({
                        storeName: data.storeName || '',
                        storeAddress: data.storeAddress || '',
                        category: data.category || '',
                        autoApprove: String(data.autoApprove ?? false)
                    });
                }
            } catch {
                alert('店舗情報の読み込みに失敗しました。');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchStoreData();
    }, [storeNumber, navigate]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await storeApi.updateStores(storeNumber, { ...form, autoApprove: form.autoApprove === 'true' });
            alert('店舗情報の修正が完了しました！');
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert('修正に失敗しました。');
        }
    };

    if (loading) return <Msg>読み込み中...</Msg>;

    return (
        <Container>
            <Card>
                <Title>店舗情報の修正</Title>
                <form onSubmit={handleSubmit}>
                    <InputGroup>
                        <label>店舗名</label>
                        <input name="storeName" value={form.storeName} placeholder="例: シフトメイト カフェ" onChange={handleChange} required />
                    </InputGroup>
                    <InputGroup>
                        <label>住所</label>
                        <input name="storeAddress" value={form.storeAddress} placeholder="例: 東京都新宿区..." onChange={handleChange} required />
                    </InputGroup>
                    <InputGroup>
                        <label>カテゴリー</label>
                        <input name="category" value={form.category} placeholder="例: 飲食店..." onChange={handleChange} required />
                    </InputGroup>
                    <InputGroup>
                        <label>自動承認</label>
                        <select name="autoApprove" value={form.autoApprove} onChange={handleChange}>
                            <option value="false">無効</option>
                            <option value="true">有効</option>
                        </select>
                    </InputGroup>
                    <SubmitBtn type="submit">修正を保存する</SubmitBtn>
                    <CancelBtn type="button" onClick={() => navigate(-1)}>キャンセル</CancelBtn>
                </form>
            </Card>
        </Container>
    );
};

export default EditStorePage;