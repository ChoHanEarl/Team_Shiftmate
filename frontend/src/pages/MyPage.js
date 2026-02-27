import React, { useState, useEffect, useCallback } from 'react';
import * as employeeApi from '../api/storeEmployeeApi';
import * as shiftRequestApi from '../api/shiftRequestApi';
import { shiftApi } from '../api/shiftApi';
import { storeApi } from '../api/storeApi';
import { useNavigate } from 'react-router-dom';

import { 
    Container, Header, PageTitle, SubTitle, Section, 
    SectionTitle, StoreGrid, StoreCard, StoreIcon, DashboardButton,
    StoreName, StoreRole, TableContainer, Table, BadgeWrapper,
    Th, Td, StatusBadge, ButtonGroup, StoreAddress,
    ActionButton, DisabledText, EmptyMsg, EmptyTd, 
} from '../styles/MyPage.styles';

const MyPage = () => {
    const navigate = useNavigate();
    const [myStores, setMyStores] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);

            const [relationRes, requestRes] = await Promise.all([
                employeeApi.getUserStoreRelations(), 
                shiftRequestApi.getMyRequests()
            ]);

            const rawData = relationRes.data.relations; 
            const relations = Array.isArray(rawData) ? rawData : [];
            const storePromises = relations.map(async (r) => {
            const storeId = r.storeNumber; 
            if (!storeId) return null;
            try {
                const storeDetailRes = await storeApi.getStoreByNumber(storeId);
                const storeData = storeDetailRes.data.store;                
	        return {
                    storeNumber: storeId,
                    storeName: storeData ? storeData.storeName : `店舗 No.${storeId}`,
                    storeAddress: storeData ? storeData.storeAddress : "住所情報なし", 
                    role: '従業員', 
                    status: r.status
                };
            } catch (err) {
                console.error(`店舗情報の取得に失敗しました (ID: ${storeId}):`, err);
                return null;
            }
        });

        const detailedStores = (await Promise.all(storePromises)).filter(s => s !== null);
        setMyStores(detailedStores);
        
        const rawRequests = requestRes.data.request || requestRes.data || [];
        const requestList = Array.isArray(rawRequests) ? rawRequests : [rawRequests];

        const enrichedRequests = await Promise.all(
            requestList.map(async (req) => {
                try {
                    const shiftRes = await shiftApi.getShiftByNumber(req.shiftNumber); 
                    const shiftData = shiftRes.data.shift || shiftRes.data;

                    const targetStoreNum = req.storeNumber || shiftData.storeNumber;
                    const matchedStore = detailedStores.find(s => s.storeNumber === targetStoreNum);
                    
                    return {
                        ...req,
                        storeName: matchedStore ? matchedStore.storeName : '店舗情報なし',
                        shiftDate: shiftData.shiftDate,           
                        startTime: shiftData.startTime,      
                        endTime: shiftData.endTime           
                    };
                } catch (err) {
                    return { 
                        ...req, 
                        storeName: '店舗情報なし',
                        shiftDate: '情報なし', 
                        startTime: '-', 
                        endTime: '-' 
                    };
                }
            })
        );
        
        setRequests(enrichedRequests);

        } catch (err) {
            console.error("情報の読み込みに失敗しました:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCancel = async (requestNumber) => {
        if (!window.confirm("本当にこのシフト申請を取り消しますか？")) return;

        try {
            await shiftRequestApi.deleteShiftRequest(requestNumber);
            alert("申請を取り消しました。");
            loadData(); 
        } catch (err) {
            console.error(err);
            alert("取り消しに失敗しました。");
        }
    };

    const handleChange = async (requestNumber) => {
        const newShiftId = prompt("変更先の新しいシフト番号(ID)を入力してください。");
        if (!newShiftId) return;

        try {
            await shiftRequestApi.updateShiftRequest(requestNumber, parseInt(newShiftId));
            alert("シフトを変更しました。");
            loadData(); 
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "変更に失敗しました。";
            alert(msg);
        }
    };

    if (loading) return (
        <Container>
            <Header><PageTitle>読み込み中...</PageTitle></Header>
        </Container>
    );

    return (
        <Container>
            <Header>
                <div>
                    <PageTitle>マイページ</PageTitle>
                    <SubTitle>所属店舗とシフト申請状況を確認・管理します。</SubTitle>
                </div>

                <DashboardButton onClick={() => navigate('/dashboard')}>
                    🏠 ダッシュボード
                </DashboardButton>
            </Header>

            <Section>
                <SectionTitle>🏢 所属店舗リスト</SectionTitle>
                
                {myStores.length === 0 ? (
                    <EmptyMsg>所属している店舗がありません。</EmptyMsg>
                ) : (
                    <StoreGrid>
                        {myStores.map((store, index) => (
                            <StoreCard key={store.storeNumber || index}>
                                <StoreIcon>🏪</StoreIcon>
                                <StoreName>{store.storeName}</StoreName>
                                <StoreAddress>{store.storeAddress}</StoreAddress>
                                <StoreRole>{store.role}</StoreRole>
                                <BadgeWrapper>
                                    <StatusBadge $status={store.status}>
                                        {store.status}
                                    </StatusBadge>
                                </BadgeWrapper>
                            </StoreCard>
                        ))}
                    </StoreGrid>
                )}
            </Section>

            <Section>
                <SectionTitle>📅 シフト申請履歴</SectionTitle>
                
                <TableContainer>
                    <Table>
                        <thead>
                            <tr>
                                <Th>店舗名</Th>
                                <Th>シフト日付</Th>
                                <Th>時間</Th>
                                <Th>ステータス</Th>
                                <Th>申請日時</Th>
                                <Th>操作</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length === 0 ? (
                                <tr>
                                    <EmptyTd colSpan="6">
                                        申請履歴がありません。
                                    </EmptyTd>
                                </tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req.requestNumber}>
                                        <Td><strong>{req.storeName}</strong></Td>
                                        <Td>{req.shiftDate}</Td>
                                        <Td>{req.startTime} ~ {req.endTime}</Td>
                                        <Td>
                                            <StatusBadge $status={req.status}>
                                                {req.status}
                                            </StatusBadge>
                                        </Td>
                                        <Td>
                                            {req.appliedAt ? req.appliedAt.split('T')[0] : '-'}
                                        </Td>
                                        <Td>
                                            {(req.status === '待機中' || req.status === '断り') ? (
                                                <ButtonGroup>
                                                    <ActionButton onClick={() => handleChange(req.requestNumber)}>変更</ActionButton>
                                                    <ActionButton $variant="danger" onClick={() => handleCancel(req.requestNumber)}>取消</ActionButton>
                                                </ButtonGroup>
                                            ) : (
                                                <DisabledText>操作不可</DisabledText>
                                            )}
                                        </Td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </TableContainer>
            </Section>
        </Container>
    );
};

export default MyPage;