import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { shiftApi } from '../api/shiftApi';
import * as shiftRequestApi from '../api/shiftRequestApi';

import DatePicker, { registerLocale } from 'react-datepicker';
import ja from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';

import {
    Container, Header, RoleBadge, FilterArea, SectionTitle,
    TimeTableWrap, TimeTable, TTh, TTd, ShiftCell,
    ShiftGrid, ShiftCard, StatusWrapper, StatusBadge,
    ModalOverlay, ModalCard, ModalLabel, ModalInput, ModalRow, ModalBtnGroup,
    Msg
} from '../styles/ShiftPage.styles';

registerLocale('ja', ja);

// 시간대 배열 생성 (0~23시)
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const ShiftPage = () => {
    const { storeNumber } = useParams();
    const { user } = useAuthStore();
    const [shifts, setShifts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rangeStart, setRangeStart] = useState(() => new Date());
    const [rangeEnd, setRangeEnd] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d;
    });
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

            const res = await shiftApi.getStoreShiftsByDateRange(
                storeNumber,
                format(rangeStart, 'yyyy-MM-dd'),
                format(rangeEnd, 'yyyy-MM-dd')
            );

            if (res.data.success) setShifts(res.data.shifts || []);

            const reqRes = isOwner
                ? await shiftRequestApi.getStoreRequests(storeNumber)
                : await shiftRequestApi.getMyRequests();

            if (reqRes.data.success) {
                setRequests(reqRes.data.request || reqRes.data.requests || []);
            }
        } catch (err) {
            console.error('データロード失敗:', err);
        } finally {
            setLoading(false);
        }
    }, [storeNumber, isOwner, rangeStart, rangeEnd]);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        const handler = () => fetchData();
        window.addEventListener('shiftProcessed', handler);
        return () => window.removeEventListener('shiftProcessed', handler);
    }, [fetchData]);

    useEffect(() => {
        const interval = setInterval(() => fetchData(), 10000);
        return () => clearInterval(interval);
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
                alert(isEditing ? '修正が完了しました。' : 'シフトを登録しました。');
                setShowModal(false);
                setIsEditing(false);
                fetchData();
            }
        } catch { alert('操作に失敗しました。'); }
    };

    const handleDelete = async (num) => {
        if (!window.confirm('このシフト枠を削除しますか？')) return;
        try {
            await shiftApi.deleteShift(num);
            fetchData();
        } catch { alert('削除に失敗しました。'); }
    };

    const handleApply = async (shiftNumber) => {
        try {
            await shiftRequestApi.applyShift(shiftNumber);
            alert('シフトの申し込みが完了しました。');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || '申請に失敗しました。');
        }
    };

    const handleCancel = async (requestNumber) => {
        if (!window.confirm('この申請を取り消しますか？')) return;
        try {
            await shiftRequestApi.deleteShiftRequest(requestNumber);
            alert('取り消されました。');
            fetchData();
        } catch { alert('キャンセルに失敗しました。'); }
    };

    const getMyRequest = (shiftNumber) =>
        requests.find(r => r.shiftNumber === shiftNumber) || null;

    const uniqueDates = [...new Set(shifts.map(s => s.shiftDate))].sort();

    const getStatusLabel = (status) => {
        if (status === '承認' || status === 'APPROVED') return '承認済み';
        if (status === '断り' || status === 'REJECTED') return '却下';
        if (status === '待機中' || status === 'PENDING') return '待機中';
        return status;
    };

    return (
        <Container>
            <Header>
                <div>
                    <h1>シフト管理</h1>
                    <p className="store-info">店舗番号: No.{storeNumber}</p>
                </div>
                <RoleBadge $isOwner={isOwner}>
                    {isOwner ? '管理者モード' : '従業員モード'}
                </RoleBadge>
            </Header>

            <FilterArea>
                {!isOwner ? (
                    <div className="date-filter">
                        <label>📅 日付選択:</label>
                        <DatePicker
                            locale="ja"
                            selected={rangeStart}
                            onChange={(date) => setRangeStart(date)}
                            dateFormat="yyyy年 MM月 dd日"
                            className="jp-datepicker"
                        />
                        <span style={{ margin: '0 6px' }}>～</span>
                        <DatePicker
                            locale="ja"
                            selected={rangeEnd}
                            onChange={(date) => setRangeEnd(date)}
                            dateFormat="yyyy年MM月dd日"
                            className="jp-datepicker"
                        />
                    </div>
                ) : (
                    <>
                        <div className="date-filter">
                            <label>📅 期間:</label>
                            <input
                                type="date"
                                value={format(rangeStart, 'yyyy-MM-dd')}
                                onChange={e => setRangeStart(new Date(e.target.value))}
                                style={{ padding: '7px 10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14 }}
                            />
                            <span style={{ color: '#9CA3AF', fontWeight: 600 }}>〜</span>
                            <input
                                type="date"
                                value={format(rangeEnd, 'yyyy-MM-dd')}
                                onChange={e => setRangeEnd(new Date(e.target.value))}
                                style={{ padding: '7px 10px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14 }}
                            />
                        </div>
                        <button className="add-btn" onClick={() => { setIsEditing(false); setShowModal(true); }}>
                            ＋ 新規シフト登録
                        </button>
                    </>
                )}
            </FilterArea>

            {loading ? <Msg>読み込み中...</Msg> : (
                <>
                    <SectionTitle>
                        {isOwner
                        ? '📋 シフト時間表'
                        : `📅 ${format(rangeStart, 'MM月dd日')} 〜 ${format(rangeEnd, 'MM月dd日')} の募集リスト`}
                    </SectionTitle>

                    {/* ─── 시간표 뷰 ─── */}
                    {shifts.length > 0 ? (
                        <TimeTableWrap>
                            <TimeTable>
                                <thead>
                                    <tr>
                                        <TTh>日付</TTh>
                                        {HOURS.map(h => (
                                            <TTh key={h}>{h}時</TTh>
                                        ))}
                                        {isOwner && <TTh>操作</TTh>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {uniqueDates.map(date => {
                                        // 날짜별로 시프트가 있는지 확인
                                        const dayShifts = shifts.filter(s => s.shiftDate === date);
                                        if (dayShifts.length === 0) return null;

                                        return dayShifts.map((shift, idx) => {
                                            const myReq = getMyRequest(shift.shiftNumber);
                                            const isFull = shift.currentEmployees >= shift.maxEmployees;

                                            return (
                                                <tr key={shift.shiftNumber}>
                                                    {idx === 0 ? (
                                                        <TTd rowSpan={dayShifts.length} style={{ fontWeight: 700 }}>
                                                            {date}
                                                        </TTd>
                                                    ) : null}
                                                    {HOURS.map(hour => {
                                                        const inRange = shift.startTime <= hour && shift.endTime > hour;
                                                        const isStart = shift.startTime === hour;
                                                        const spanWidth = shift.endTime - shift.startTime;
                                                        if (!inRange) return <TTd key={hour} />;
                                                        if (!isStart) return null;
                                                        return (
                                                            <TTd
                                                                key={hour}
                                                                colSpan={spanWidth}
                                                                style={{ padding: '6px 8px' }}
                                                            >
                                                                <ShiftCell
                                                                    $status={myReq?.status}
                                                                    $isFull={isFull && !myReq}
                                                                    onClick={() => {
                                                                        if (!isOwner && !myReq && !isFull) {
                                                                            handleApply(shift.shiftNumber);
                                                                        }
                                                                    }}
                                                                >
                                                                    <span style={{ fontWeight: 700 }}>
                                                                        {shift.startTime}:00〜{shift.endTime}:00
                                                                    </span>
                                                                    <span style={{ fontSize: '11px', opacity: 0.8 }}>
                                                                        {myReq
                                                                            ? getStatusLabel(myReq.status)
                                                                            : isFull
                                                                                ? '満員'
                                                                                : `${shift.currentEmployees}/${shift.maxEmployees}名`
                                                                        }
                                                                    </span>
                                                                </ShiftCell>
                                                            </TTd>
                                                        );
                                                    })}
                                                    {isOwner && (
                                                        <TTd>
                                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                                <button
                                                                    style={{ padding: '5px 10px', borderRadius: '6px', border: '1.5px solid #E5E7EB', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                                                    onClick={() => {
                                                                        setEditingId(shift.shiftNumber);
                                                                        setNewShift({ ...shift });
                                                                        setIsEditing(true);
                                                                        setShowModal(true);
                                                                    }}
                                                                >
                                                                    修正
                                                                </button>
                                                                <button
                                                                    style={{ padding: '5px 10px', borderRadius: '6px', border: '1.5px solid #FECACA', background: '#FEF2F2', color: '#EF4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                                                    onClick={() => handleDelete(shift.shiftNumber)}
                                                                >
                                                                    削除
                                                                </button>
                                                            </div>
                                                        </TTd>
                                                    )}
                                                </tr>
                                            );
                                        });
                                    })}
                                </tbody>
                            </TimeTable>
                        </TimeTableWrap>
                    ) : (
                        <Msg>表示できるシフトがありません。</Msg>
                    )}

                    {!isOwner && shifts.length > 0 && (
                        <>
                            <SectionTitle style={{ marginTop: 32 }}>📝 申請状況</SectionTitle>
                            <ShiftGrid>
                                {shifts.map(shift => {
                                    const myReq = getMyRequest(shift.shiftNumber);
                                    const isFull = shift.currentEmployees >= shift.maxEmployees;
                                    return (
                                        <ShiftCard key={shift.shiftNumber}>
                                            <div className="date">{shift.shiftDate}</div>
                                            <div className="time">{shift.startTime}:00 - {shift.endTime}:00</div>
                                            <div className="info">
                                                現在: {shift.currentEmployees || 0} / {shift.maxEmployees}名
                                            </div>
                                            <div className="actions">
                                                {myReq ? (
                                                    <StatusWrapper>
                                                        <StatusBadge $status={myReq.status}>
                                                            {getStatusLabel(myReq.status)}
                                                        </StatusBadge>
                                                        {(myReq.status === '待機中' || myReq.status === 'PENDING') && (
                                                            <button className="cancel-text" onClick={() => handleCancel(myReq.requestNumber)}>
                                                                取消
                                                            </button>
                                                        )}
                                                    </StatusWrapper>
                                                ) : (
                                                    <button
                                                        className="apply-btn"
                                                        disabled={isFull}
                                                        onClick={() => handleApply(shift.shiftNumber)}
                                                    >
                                                        {isFull ? '満員' : '申請する'}
                                                    </button>
                                                )}
                                            </div>
                                        </ShiftCard>
                                    );
                                })}
                            </ShiftGrid>
                        </>
                    )}
                </>
            )}

            {showModal && (
                <ModalOverlay onClick={() => setShowModal(false)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <h3>{isEditing ? 'シフトの修正' : '新規シフトの登録'}</h3>
                        <form onSubmit={handleCreateSubmit}>
                            <ModalLabel>日付</ModalLabel>
                            <DatePicker
                                locale="ja"
                                selected={newShift.shiftDate ? parseISO(newShift.shiftDate) : new Date()}
                                onChange={(date) => setNewShift({ ...newShift, shiftDate: format(date, 'yyyy-MM-dd') })}
                                dateFormat="yyyy年MM月dd日"
                                className="jp-datepicker"
                                required
                            />
                            <ModalRow>
                                <div style={{ flex: 1 }}>
                                    <ModalLabel>開始時間</ModalLabel>
                                    <ModalInput
                                        type="number" min="0" max="23"
                                        value={newShift.startTime}
                                        onChange={e => setNewShift({ ...newShift, startTime: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <ModalLabel>終了時間</ModalLabel>
                                    <ModalInput
                                        type="number" min="1" max="24"
                                        value={newShift.endTime}
                                        onChange={e => setNewShift({ ...newShift, endTime: e.target.value })}
                                    />
                                </div>
                            </ModalRow>
                            <ModalLabel>募集人数 (名)</ModalLabel>
                            <ModalInput
                                type="number" min="1"
                                value={newShift.maxEmployees}
                                onChange={e => setNewShift({ ...newShift, maxEmployees: e.target.value })}
                            />
                            <ModalBtnGroup>
                                <button type="submit" className="save">保存する</button>
                                <button type="button" className="cancel" onClick={() => setShowModal(false)}>閉じる</button>
                            </ModalBtnGroup>
                        </form>
                    </ModalCard>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default ShiftPage;