import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { storeApi } from '../api/storeApi'; 

const EditStorePage = () => {
    const { storeNumber } = useParams();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        storeName: '',
        storeAddress: '',
        category: '',
        autoApprove: 'false' // 기본값 설정
    });
    const [loading, setLoading] = useState(true);

    // 1. 기존 점포 정보 불러오기
    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const res = await storeApi.getStoreByNumber(storeNumber);
                if (res.data) {
                    // 서버 응답 데이터 구조에 맞춰 매핑
                    setForm({
                        storeName: res.data.storeName || '',
                        storeAddress: res.data.storeAddress || '',
                        category: res.data.category || '',
                        autoApprove: String(res.data.autoApprove || 'false')
                    });
                }
            } catch (err) {
                alert("店舗情報の読み込みに失敗しました。");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchStoreData();
    }, [storeNumber, navigate]);

    // 2. 입력값 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 3. 수정 제출 핸들러
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // 전송용 데이터를 복사하여 타입 변환
        const submitData = {
            ...form,
            // 문자열 "true"를 실제 boolean true로 변환
            autoApprove: form.autoApprove === "true" 
        };

        console.log("보내는 데이터:", submitData); // 디버깅용

        // 수정한 데이터를 보냅니다.
        await storeApi.updateStores(storeNumber, submitData);
        
        alert("店舗情報の修正が完了しました！");
        navigate('/dashboard');
    } catch (err) {
        // 에러 발생 시 콘솔에 상세 내용을 찍어보세요.
        console.error("수정 실패 상세 원인:", err.response?.data || err.message);
        alert("修正に失敗しました。");
    }
};

    if (loading) return <Msg>読み込み中...</Msg>;

    return (
        <Container>
            <Card>
                <h2>店舗情報の修正</h2>
                <form onSubmit={handleSubmit}>
                    <InputGroup>
                        <label>店舗名</label>
                        <input 
                            name="storeName" 
                            value={form.storeName} 
                            placeholder="例: シフトメイト カフェ" 
                            onChange={handleChange} 
                            required 
                        />
                    </InputGroup>
                    
                    <InputGroup>
                        <label>住所</label>
                        <input 
                            name="storeAddress" 
                            value={form.storeAddress} 
                            placeholder="例: 東京都新宿区..." 
                            onChange={handleChange} 
                            required 
                        />
                    </InputGroup>
                    
                    <InputGroup>
                        <label>カテゴリー</label>
                        <input 
                            name="category" 
                            value={form.category} 
                            placeholder="例: 飲食店..." 
                            onChange={handleChange} 
                            required 
                        />
                    </InputGroup>

                    <InputGroup>
                        <label>自動承認</label>
                        <select 
                            name="autoApprove" 
                            value={form.autoApprove} 
                            onChange={handleChange}
                        >
                            <option value="true">true</option>
                            <option value="false">false</option>
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

// --- RegisterStorePage와 동일한 스타일 유지 ---
const Container = styled.div` display: flex; justify-content: center; padding: 50px; `;
const Card = styled.div` background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 400px; `;
const InputGroup = styled.div` margin-bottom: 20px; label { display: block; margin-bottom: 8px; font-weight: bold; } input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; } `;
const SubmitBtn = styled.button` width: 100%; padding: 12px; background: #000; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 10px; `;
const CancelBtn = styled.button` width: 100%; padding: 12px; background: #eee; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; `;
const Msg = styled.div` text-align: center; padding: 100px; color: #999; `;