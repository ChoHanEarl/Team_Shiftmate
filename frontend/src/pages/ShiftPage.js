import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import useAuthStore from '../store/authStore';
import { shiftApi } from '../api/shiftApi';
import { shiftRequestApi } from '../api/shiftRequestApi';

// 日本語カレンダー設定
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja"; 
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

registerLocale("ja", ja);

const ShiftPage = () => {
    const { storeNumber } = useParams();
    const { user } = useAuthStore();
    const [shifts, setShifts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [startDate, setStartDate] = useState(new Date());

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newShift, setNewShift] = useState({
        shiftDate: format(new Date(), 'yyyy-MM-dd'),
        startTime: 9,
        endTime: 18,
        maxEmployees: 1
    });

    const isOwner = user?.userType === '店長' || user?.userType === 'OWNER';

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const dateStr = format(startDate, 'yyyy-MM-dd');
            
            const res = isOwner 
                ? await shiftApi.getStoreShifts(storeNumber)
                : await shiftApi.getStoreShiftsByDate(storeNumber, dateStr);
            
            if (res.data.success) setShifts(res.data.shifts || []);

            const reqRes = isOwner
                ? await shiftRequestApi.getStoreRequests(storeNumber)
                : await shiftRequestApi.getUserRequests();
            
            if (reqRes.data.success) {
                setRequests(reqRes.data.request || reqRes.data.requests || []);
            }
        } catch (err) {
            console.error("データロード失敗:", err);
        } finally {
            setLoading(false);
        }
    }, [storeNumber, isOwner, startDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                storeNumber: Number(storeNumber),
                ...newShift,
                startTime: Number(newShift.startTime),
                endTime: Number(newShift.endTime),
                maxEmployees: Number(newShift.maxEmployees)
            };
            const res = isEditing 
                ? await shiftApi.updateShift(editingId, payload)
                : await shiftApi.createShift(payload);

            if (res.data.success) {
                alert(isEditing ? "修正が完了しました。" : "シフトを登録しました。");
                setShowModal(false);
                setIsEditing(false);
                fetchData();
            }
        } catch (err) { alert("操作に失敗しました。"); }
    };

    const handleDelete = async (num) => {
        if (!window.confirm("このシフト枠を削除しますか？")) return;
        try {
            await shiftApi.deleteShift(num);
            fetchData();
        } catch (err) { alert("削除に失敗しました。"); }
    };

    const handleApply = async (shiftNumber) => {
        try {
            await shiftRequestApi.applyShift(shiftNumber);
            alert("シフトの申し込みが完了しました。");
            fetchData();
        } catch (err) { 
            alert(err.response?.data?.message || "申請に失敗しました。"); 
        }
    };

    const handleCancel = async (requestNumber) => {
        if (!window.confirm("この申請を取り消しますか？")) return;
        try {
            await shiftRequestApi.deleteShiftRequest(requestNumber);
            alert("取り消されました。");
            fetchData();
        } catch (err) { alert("キャンセルに失敗しました."); }
    };

    const getMyRequestStatus = (shiftNumber) => {
        return requests.find(r => r.shiftNumber === shiftNumber) || null;
    };

    return (
        <Container>
            <Header>
                <div>
                    <h1>シフト管理</h1>
                    <p className="store-info">店舗番号: No.{storeNumber}</p>
                </div>
                <RoleBadge $isOwner={isOwner}>{isOwner ? '管理者モード' : '従業員モード'}</RoleBadge>
            </Header>

            <FilterArea>
                {!isOwner ? (
                    <div className="date-filter">
                        <label>📅 日付選択:</label>
                        <DatePicker
                            locale="ja"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy年 MM月 dd日"
                            className="jp-datepicker"
                        />
                    </div>
                ) : (
                    <button className="add-btn" onClick={() => { setIsEditing(false); setShowModal(true); }}>
                        ＋ 新規シフト作成
                    </button>
                )}
            </FilterArea>

            {loading ? <Msg>読み込み中...</Msg> : (
                <>
                    <SectionTitle>{isOwner ? "登録済みの全シフト" : `${format(startDate, 'MM月dd日')}の募集リスト`}</SectionTitle>
                    <ShiftGrid>
                        {shifts.length > 0 ? shifts.map(shift => {
                            const myReq = getMyRequestStatus(shift.shiftNumber);
                            return (
                                <ShiftCard key={shift.shiftNumber}>
                                    <div className="date">{shift.shiftDate}</div>
                                    <div className="time">{shift.startTime}:00 - {shift.endTime}:00</div>
                                    <div className="info">現在の人数: {shift.currentEmployees || 0} / {shift.maxEmployees}名</div>
                                    <div className="actions">
                                        {isOwner ? (
                                            <>
                                                <button className="edit-btn" onClick={() => {
                                                    setEditingId(shift.shiftNumber);
                                                    setNewShift({...shift});
                                                    setIsEditing(true);
                                                    setShowModal(true);
                                                }}>修正</button>
                                                <button className="del-btn" onClick={() => handleDelete(shift.shiftNumber)}>削除</button>
                                            </>
                                        ) : (
                                            myReq ? (
                                                <StatusWrapper>
                                                    <StatusBadge $status={myReq.status}>
                                                        {myReq.status === 'PENDING' ? '待機中' : myReq.status === 'APPROVED' ? '承認済み' : '却下'}
                                                    </StatusBadge>
                                                    {myReq.status === 'PENDING' && (
                                                        <button className="cancel-text" onClick={() => handleCancel(myReq.requestNumber)}>取消</button>
                                                    )}
                                                </StatusWrapper>
                                            ) : (
                                                <button className="apply-btn" 
                                                    disabled={shift.currentEmployees >= shift.maxEmployees}
                                                    onClick={() => handleApply(shift.shiftNumber)}>
                                                    {shift.currentEmployees >= shift.maxEmployees ? '満員' : '申請する'}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </ShiftCard>
                            );
                        }) : <Msg>表示できるシフトがありません。</Msg>}
                    </ShiftGrid>
                </>
            )}

            {showModal && (
                <ModalOverlay onClick={() => setShowModal(false)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <h3>{isEditing ? "シフトの修正" : "新規シフトの登録"}</h3>
                        <form onSubmit={handleCreateSubmit}>
                            <Label>日付</Label>
                            <Input type="date" required value={newShift.shiftDate}
                                onChange={e => setNewShift({...newShift, shiftDate: e.target.value})} />
                            <Row>
                                <div style={{flex: 1}}>
                                    <Label>開始時間</Label>
                                    <Input type="number" min="0" max="23" value={newShift.startTime}
                                        onChange={e => setNewShift({...newShift, startTime: e.target.value})} />
                                </div>
                                <div style={{flex: 1}}>
                                    <Label>終了時間</Label>
                                    <Input type="number" min="1" max="24" value={newShift.endTime}
                                        onChange={e => setNewShift({...newShift, endTime: e.target.value})} />
                                </div>
                            </Row>
                            <Label>募集人数 (名)</Label>
                            <Input type="number" min="1" value={newShift.maxEmployees}
                                onChange={e => setNewShift({...newShift, maxEmployees: e.target.value})} />
                            <ButtonGroup>
                                <button type="submit" className="save">保存する</button>
                                <button type="button" className="cancel" onClick={() => setShowModal(false)}>閉じる</button>
                            </ButtonGroup>
                        </form>
                    </ModalCard>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default ShiftPage;

// --- Styled Components ---
const Container = styled.div` max-width: 1000px; margin: 0 auto; padding: 40px 20px; font-family: 'Helvetica Neue', Arial, sans-serif; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; h1 { font-size: 28px; font-weight: 800; margin: 0; } .store-info { color: #666; margin-top: 5px; } `;
const RoleBadge = styled.div` background: ${props => props.$isOwner ? '#000' : '#1890ff'}; color: #fff; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: bold; `;
const SectionTitle = styled.h3` margin: 40px 0 20px; font-size: 18px; font-weight: 700; color: #333; `;
const FilterArea = styled.div` background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; .date-filter { display: flex; align-items: center; gap: 15px; .jp-datepicker { padding: 10px 15px; border-radius: 8px; border: 1px solid #ddd; font-size: 15px; width: 180px; text-align: center; } } .add-btn { background: #000; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; } `;
const ShiftGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; `;
const ShiftCard = styled.div` background: #fff; padding: 25px; border-radius: 16px; border: 1px solid #eee; box-shadow: 0 4px 15px rgba(0,0,0,0.05); .date { font-size: 19px; font-weight: 800; margin-bottom: 10px; } .time { font-size: 15px; color: #555; margin-bottom: 15px; } .info { font-size: 13px; color: #999; margin-bottom: 20px; } .actions { display: flex; gap: 8px; button { flex: 1; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 13px; } .edit-btn { background: #fff; border: 1px solid #ddd; } .del-btn { color: #ff4d4f; border: 1px solid #ff4d4f; background: #fff; } .apply-btn { background: #000; color: #fff; border: none; &:disabled { background: #ccc; } } } `;
const StatusWrapper = styled.div` display: flex; justify-content: space-between; align-items: center; width: 100%; .cancel-text { background: none; border: none; color: #ff4d4f; font-size: 12px; text-decoration: underline; cursor: pointer; } `;
const StatusBadge = styled.span` padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; background: ${props => props.$status === 'APPROVED' ? '#e6f7ff' : props.$status === 'REJECTED' ? '#fff1f0' : '#fff7e6'}; color: ${props => props.$status === 'APPROVED' ? '#1890ff' : props.$status === 'REJECTED' ? '#ff4d4f' : '#faad14'}; `;
const ModalOverlay = styled.div` position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:2000; `;
const ModalCard = styled.div` background:#fff; padding:35px; border-radius:20px; width:100%; max-width:400px; `;
const Label = styled.label` display:block; margin-bottom:8px; font-size:13px; font-weight:bold; color:#666; `;
const Input = styled.input` width:100%; padding:12px; margin-bottom:20px; border:1px solid #ddd; border-radius:8px; `;
const Row = styled.div` display:flex; gap:15px; `;
const ButtonGroup = styled.div` display:flex; gap:10px; button { flex:1; padding:14px; border-radius:10px; font-weight:bold; border:none; cursor:pointer; } .save { background:#000; color:#fff; } .cancel { background:#eee; } `;
const Msg = styled.div` text-align:center; padding:40px; color:#999; `;