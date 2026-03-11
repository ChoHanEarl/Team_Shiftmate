import { React, useState, useEffect, useCallback } from 'react';
import * as employeeApi from '../api/storeEmployeeApi';
import * as shiftRequestApi from '../api/shiftRequestApi';
import { shiftApi } from '../api/shiftApi';
import { storeApi } from '../api/storeApi';
import { useNavigate } from 'react-router-dom';

import {
    Container, Header, PageTitle, SubTitle, Section, SectionTitle,
    StoreGrid, StoreCard, StoreIcon, DashboardButton,
    StoreName, StoreRole, TableContainer, Table, BadgeWrapper,
    Th, Td, StatusBadge, ButtonGroup, StoreAddress,
    ActionButton, DisabledText, EmptyMsg, EmptyTd,
    ModalOverlay, ModalBox, ModalTitle, ModalSubTitle,
    ShiftList, ShiftItem, ShiftItemInfo, ShiftDate, ShiftTime,
    ShiftSlots, ModalCloseBtn, ModalEmpty
} from '../styles/MyPage.styles';

const MyPage = () => {
    const navigate = useNavigate();
    const [myStores, setMyStores] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [changeModal, setChangeModal] = useState(null);
    const [availableShifts, setAvailableShifts] = useState([]);
    const [shiftsLoading, setShiftsLoading] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [relationRes, requestRes] = await Promise.all([
                employeeApi.getUserStoreRelations(),
                shiftRequestApi.getMyRequests()
            ]);

            const rawData = relationRes.data.relations;
            const relations = Array.isArray(rawData) ? rawData : [];

            const storePromises = relations
                .filter(r => r.status !== '断り')
                .map(async (r) => {
                const storeId = r.storeNumber;
                if (!storeId) return null;
                try {
                    const storeDetailRes = await storeApi.getStoreByNumber(storeId);
                    const storeData = storeDetailRes.data.store;
                    return {
                        storeNumber: storeId,
                        storeName: storeData?.storeName || `店舗 No.${storeId}`,
                        storeAddress: storeData?.storeAddress || '住所情報なし',
                        role: '従業員',
                        status: r.status
                    };
                } catch {
                    return null;
                }
            });

            const detailedStores = (await Promise.all(storePromises)).filter(Boolean);
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
                            storeName: matchedStore?.storeName || '店舗情報なし',
                            storeNumber: targetStoreNum,
                            shiftDate: shiftData.shiftDate,
                            startTime: shiftData.startTime,
                            endTime: shiftData.endTime
                        };
                    } catch {
                        return { ...req, storeName: '店舗情報なし', shiftDate: '情報なし', startTime: '-', endTime: '-' };
                    }
                })
            );
            setRequests(enrichedRequests);
        } catch (err) {
            console.error('情報の読み込みに失敗しました:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    useEffect(() => {
        const handler = () => loadData();
        window.addEventListener('shiftProcessed', handler);
        window.addEventListener('employeeProcessed', handler);
        return () => {
            window.removeEventListener('shiftProcessed', handler);
            window.removeEventListener('employeeProcessed', handler);
        };
    }, [loadData]);

    const handleCancel = async (requestNumber) => {
        if (!window.confirm('本当にこのシフト申請を取り消しますか？')) return;
        try {
            await shiftRequestApi.deleteShiftRequest(requestNumber);
            alert('申請を取り消しました。');
            loadData();
        } catch {
            alert('取り消しに失敗しました。');
        }
    };

    const handleChange = async (requestNumber, storeNumber) => {
        setChangeModal({ requestNumber, storeNumber });
        setShiftsLoading(true);
        try {
            const res = await shiftApi.getStoreShifts(storeNumber);
            const allShifts = res.data.shifts || [];
            const today = new Date().toISOString().split('T')[0];
            const available = allShifts.filter(s =>
                s.shiftDate >= today &&
                s.currentEmployees < s.maxEmployees
            );
            setAvailableShifts(available);
        } catch {
            alert('シフト情報の取得に失敗しました。');
            setChangeModal(null);
        } finally {
            setShiftsLoading(false);
        }
    };

    const handleSelectShift = async (newShiftNumber) => {
        if (!changeModal) return;
        try {
            await shiftRequestApi.updateShiftRequest(changeModal.requestNumber, newShiftNumber);
            alert('シフトを変更しました。');
            setChangeModal(null);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || '変更に失敗しました。');
        }
    }

    if (loading) return <Container><Header><PageTitle>読み込み中...</PageTitle></Header></Container>;

    return (
        <Container>
            <Header>
                <div>
                    <PageTitle>マイページ</PageTitle>
                    <SubTitle>所属店舗とシフト申請状況を確認・管理します。</SubTitle>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <DashboardButton
                        style={{ background: '#fff', color: '#374151', border: '1.5px solid #E5E7EB' }}
                        onClick={() => navigate('/profile')}
                    >
                        ⚙️ プロフィール設定
                    </DashboardButton>
                    <DashboardButton onClick={() => navigate('/dashboard')}>
                        🏠 ダッシュボード
                    </DashboardButton>
                </div>
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
                                    <StatusBadge $status={store.status}>{store.status}</StatusBadge>
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
                                <tr><EmptyTd colSpan="6">申請履歴がありません。</EmptyTd></tr>
                            ) : requests.map(req => (
                                <tr key={req.requestNumber}>
                                    <Td><strong>{req.storeName}</strong></Td>
                                    <Td>{req.shiftDate}</Td>
                                    <Td>{req.startTime} ~ {req.endTime}</Td>
                                    <Td>
                                        <StatusBadge $status={req.status}>{req.status}</StatusBadge>
                                    </Td>
                                    <Td>{req.appliedAt ? req.appliedAt.split('T')[0] : '-'}</Td>
                                    <Td>
                                        {(req.status === '待機中' || req.status === '断り') ? (
                                            <ButtonGroup>
                                                <ActionButton onClick={() => handleChange(req.requestNumber, req.storeNumber)}>変更</ActionButton>
                                                <ActionButton $variant="danger" onClick={() => handleCancel(req.requestNumber)}>取消</ActionButton>
                                            </ButtonGroup>
                                        ) : (
                                            <DisabledText>操作不可</DisabledText>
                                        )}
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </Section>
            {changeModal && (
            <ModalOverlay>
                <ModalBox>
                    <ModalTitle>シフト変更</ModalTitle>
                    <ModalSubTitle>変更先のシフトを選択してください</ModalSubTitle>

                    {shiftsLoading ? (
                        <ModalEmpty>読み込み中...</ModalEmpty>
                    ) : availableShifts.length === 0 ? (
                        <ModalEmpty>申請可能なシフトがありません</ModalEmpty>
                    ) : (
                        <ShiftList>
                            {availableShifts.map(shift => (
                                <ShiftItem
                                    key={shift.shiftNumber}
                                    onClick={() => handleSelectShift(shift.shiftNumber)}
                                >
                                    <ShiftItemInfo>
                                        <ShiftDate>📅 {shift.shiftDate}</ShiftDate>
                                        <ShiftTime>🕐 {shift.startTime}時 〜 {shift.endTime}時</ShiftTime>
                                    </ShiftItemInfo>
                                    <ShiftSlots>残り {shift.maxEmployees - shift.currentEmployees}名</ShiftSlots>
                                </ShiftItem>
                            ))}
                        </ShiftList>
                    )}

                    <ModalCloseBtn onClick={() => setChangeModal(null)}>閉じる</ModalCloseBtn>
                </ModalBox>
            </ModalOverlay>
        )}
        </Container>
    );
};

export default MyPage;