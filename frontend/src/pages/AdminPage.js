import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import * as employeeApi from '../api/storeEmployeeApi';
import * as shiftApi from '../api/shiftRequestApi';
import * as userApi from '../api/userApi';
import { storeApi } from '../api/storeApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { shiftApi as shiftInfoApi } from '../api/shiftApi';

import {
    Container, Header, PageTitle, StoreInfo, StoreSelect, DashboardButton,
    TabContainer, TabButton, ContentCard, SectionTitle,
    List, ListItem, ItemInfo, ButtonGroup, ActionButton, NameGroup,
    TableContainer, Table, Th, Td, StatusBadge,
    StoreInfoWrapper, InputGroup, Label, Input, SearchBox,
    Hr, EmptyMsg, CheckboxWrapper, SaveButtonWrapper
} from '../styles/AdminPage.styles';

const AdminPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('employee');
    const [storeNumber, setStoreNumber] = useState(null);
    const [myStores, setMyStores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyStore = async () => {
            if (!user) return;
            try {
                const res = await storeApi.getOwnerStores();
                const stores = res.data.stores;
                if (stores && stores.length > 0) {
                    setMyStores(stores);
                    const paramNum = searchParams.get('storeNumber');
                    const initNum = paramNum ? Number(paramNum) : stores[0].storeNumber;
                    setStoreNumber(initNum);
                } else {
                    setMyStores([]);
                }
            } catch (err) {
                console.error('店舗情報の読み込みに失敗しました:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyStore();
    }, [user]);

    if (!user) return <Container>ログインが必要です。</Container>;
    if (isLoading) return <Container>店舗情報を読み込み中...</Container>;
    if (myStores.length === 0) return (
        <Container>
            <Header>
                <div>
                    <PageTitle>管理者ページ</PageTitle>
                </div>
                <DashboardButton onClick={() => navigate('/dashboard')}>
                    🏠 ダッシュボード
                </DashboardButton>
            </Header>
            <ContentCard style={{ textAlign: 'center' , padding: '60px 20px' }}>
                <p style={{ fontSize: 16, marginBottom: 20 }}>
                    管理している店舗がありません。
                </p>
                <DashboardButton onClick={() => navigate('/register-store')}>
                    ＋ 新規店舗登録
                </DashboardButton>
            </ContentCard>
        </Container>
    )

    return (
        <Container>
            <Header>
                <div>
                    <PageTitle>管理者ページ</PageTitle>
                    <StoreInfo>
                        店長: {user.name} 様
                        {myStores.length > 1 && (
                            <StoreSelect
                                value={storeNumber}
                                onChange={(e) => setStoreNumber(Number(e.target.value))}
                            >
                                {myStores.map(store => (
                                    <option key={store.storeNumber} value={store.storeNumber}>
                                        {store.storeName} (ID: {store.storeNumber})
                                    </option>
                                ))}
                            </StoreSelect>
                        )}
                        {myStores.length === 1 && ` (店舗番号: ${storeNumber})`}
                    </StoreInfo>
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

            <TabContainer>
                {[
                    { key: 'employee', label: 'スタッフ管理' },
                    { key: 'shift', label: 'シフト管理' },
                    { key: 'store', label: '店舗情報修正' },
                    { key: 'search', label: 'ユーザー検索' },
                ].map(t => (
                    <TabButton key={t.key} $active={activeTab === t.key} onClick={() => setActiveTab(t.key)}>
                        {t.label}
                    </TabButton>
                ))}
            </TabContainer>

            <ContentCard>
                {activeTab === 'employee' && <EmployeeTab storeNumber={storeNumber} ownerId={user.userNumber} />}
                {activeTab === 'shift' && <ShiftTab storeNumber={storeNumber} />}
                {activeTab === 'store' && <StoreInfoTab storeNumber={storeNumber} />}
                {activeTab === 'search' && <UserSearchTab />}
            </ContentCard>
        </Container>
    );
};

/* ─── スタッフ管理タブ ─── */
const EmployeeTab = ({ storeNumber, ownerId }) => {
    const [employees, setEmployees] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    const loadData = useCallback(async () => {
        try {
            const [empRes, pendingRes] = await Promise.all([
                employeeApi.getStoreEmployees(storeNumber),
                employeeApi.getPendingRequests(storeNumber)
            ]);

            const attachNames = async (list = []) =>
                Promise.all(list.map(async (item) => {
                    try {
                        const res = await userApi.getUserInfo(item.userNumber);
                        return { ...item, userName: res.data.user.name };
                    } catch {
                        return { ...item, userName: '名前なし' };
                    }
                }));

            setEmployees(await attachNames(empRes.data.employees));
            setPendingRequests(await attachNames(pendingRes.data.requests));
        } catch (err) {
            console.error('スタッフデータの読み込みに失敗しました', err);
        }
    }, [storeNumber]);

    useEffect(() => { loadData(); }, [loadData]);

    useEffect(() => {
        const handler = () => loadData();
        window.addEventListener('employeeProcessed', handler);
        return () => window.removeEventListener('employeeProcessed', handler);
    }, [loadData]);

    const handleProcess = async (relationNumber, isApprove) => {
        const statusToSend = isApprove ? '承認' : '断り';
        if (!window.confirm(`${statusToSend}しますか？`)) return;
        try {
            await employeeApi.processEmployeeRequest(relationNumber, statusToSend);
            alert('処理が完了しました。');
            loadData();
        } catch {
            alert('処理に失敗しました。');
        }
    };

    const handleFire = async (relationNumber) => {
        if (!window.confirm('本当にこのスタッフを解雇しますか？')) return;
        try {
            await employeeApi.fireEmployee(relationNumber, ownerId);
            alert('解雇しました。');
            loadData();
        } catch {
            alert('解雇に失敗しました。(権限を確認してください)');
        }
    };

    return (
        <div>
            <SectionTitle>📝 承認待ちリスト</SectionTitle>
            {pendingRequests.length === 0 ? (
                <EmptyMsg>承認待ちの申請はありません。</EmptyMsg>
            ) : (
                <List>
                    {pendingRequests.map(req => (
                        <ListItem key={req.relationNumber}>
                            <ItemInfo>
                                <NameGroup>
                                    <strong>{req.userName}</strong>
                                    <span>(ID: {req.userNumber})</span>
                                </NameGroup>
                            </ItemInfo>
                            <ButtonGroup>
                                <ActionButton onClick={() => handleProcess(req.relationNumber, true)}>承認</ActionButton>
                                <ActionButton $variant="danger" onClick={() => handleProcess(req.relationNumber, false)}>断り</ActionButton>
                            </ButtonGroup>
                        </ListItem>
                    ))}
                </List>
            )}
            <Hr />
            <SectionTitle>👥 スタッフリスト</SectionTitle>
            {employees.length === 0 ? (
                <EmptyMsg>在籍スタッフがいません。</EmptyMsg>
            ) : (
                <List>
                    {employees.map(emp => (
                        <ListItem key={emp.relationNumber}>
                            <ItemInfo>
                                <NameGroup>
                                    <strong>{emp.userName}</strong>
                                    <span>(ID: {emp.userNumber})</span>
                                </NameGroup>
                                <StatusBadge $status={emp.status}>{emp.status}</StatusBadge>
                            </ItemInfo>
                            <ActionButton $variant="danger" onClick={() => handleFire(emp.relationNumber)}>
                                解雇
                            </ActionButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
};

/* ─── シフト管理タブ ─── */
const ShiftTab = ({ storeNumber }) => {
    const [requests, setRequests] = useState([]);

    const loadShifts = useCallback(async () => {
        try {
            const res = await shiftApi.getStoreRequests(storeNumber);
            const rawData = res.data.request;
            const shiftArray = Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []);
            const sorted = [...shiftArray].sort((a, b) => a.requestNumber - b.requestNumber);

            const withNames = await Promise.all(sorted.map(async (item) => {
                try {
                    const [userRes, shiftRes] = await Promise.all([
                        userApi.getUserInfo(item.userNumber),
                        shiftInfoApi.getShiftByNumber(item.shiftNumber)
                    ]);
                    const shift = shiftRes.data.shift;
                    return {
                        ...item,
                        userName: userRes.data.user.name,
                        shiftDate: shift?.shiftDate || '-',
                        startTime: shift?.startTime ?? '-',
                        endTime: shift?.endTime ?? '-',
                    };
                } catch {
                    return { ...item, userName: '名前なし', shiftDate: '-', startTime: '-', endTime: '-' };
                }
            }));
            setRequests(withNames);
        } catch (err) {
            console.error('シフト情報の読み込みに失敗しました', err);
        }
    }, [storeNumber]);

    useEffect(() => { loadShifts(); }, [loadShifts]);

    useEffect(() => {
        const handler = () => loadShifts();
        window.addEventListener('shiftProcessed', handler);
        return () => window.removeEventListener('shiftProcessed', handler);
    }, [loadShifts]);

    const handleShiftProcess = async (reqNumber, isApprove) => {
        const statusToSend = isApprove ? '承認' : '断り';
        try {
            await shiftApi.processRequest(reqNumber, statusToSend);
            alert(`シフトが${statusToSend}されました。`);
            loadShifts();
        } catch {
            alert('エラーが発生しました。');
        }
    };

    const handleEmergencyDelete = async (reqNumber) => {
        if (!window.confirm('管理者権限で削除しますか？ (復元不可)')) return;
        try {
            await shiftApi.emergencyDelete(reqNumber);
            alert('削除しました。');
            loadShifts();
        } catch {
            alert('削除に失敗しました。');
        }
    };

    const displayStatus = (s) => {
        if (s === '承認') return '承認済み';
        if (s === '断り') return '断り';
        if (s === '待機中') return '承認待機';
        return s;
    };

    return (
        <div>
            <SectionTitle>📅 シフト申請状況</SectionTitle>
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <Th>ID</Th>
                            <Th>スタッフ名</Th>
                            <Th>日付</Th>
                            <Th>時間</Th>
                            <Th>ステータス</Th>
                            <Th>操作</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr><Td colSpan={6} style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>申請データがありません。</Td></tr>
                        ) : requests.map(req => (
                            <tr key={req.requestNumber}>
                                <Td>{req.requestNumber}</Td>
                                <Td>{req.userName}</Td>
                                <Td>{req.shiftDate}</Td>
                                <Td>{req.startTime}時～{req.endTime}時</Td>
                                <Td>
                                    <StatusBadge $status={req.status}>
                                        {displayStatus(req.status)}
                                    </StatusBadge>
                                </Td>
                                <Td>
                                    <ButtonGroup>
                                        {req.status === '待機中' && (
                                            <>
                                                <ActionButton onClick={() => handleShiftProcess(req.requestNumber, true)}>承認</ActionButton>
                                                <ActionButton $variant="danger" onClick={() => handleShiftProcess(req.requestNumber, false)}>断り</ActionButton>
                                            </>
                                        )}
                                        {req.status === '承認' && (
                                            <ActionButton $variant="danger" onClick={() => handleEmergencyDelete(req.requestNumber)}>削除</ActionButton>
                                        )}
                                    </ButtonGroup>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
        </div>
    );
};

/* ─── 店舗情報修正タブ ─── */
const StoreInfoTab = ({ storeNumber }) => {
    const [formData, setFormData] = useState({ storeName: '', storeAddress: '', category: '', autoApprove: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!storeNumber) return;
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await storeApi.getStoreByNumber(storeNumber);
                const data = res.data.store;
                setFormData({
                    storeName: data.storeName || '',
                    storeAddress: data.storeAddress || '',
                    category: data.category || '',
                    autoApprove: data.autoApprove || false
                });
            } catch {
                alert('店舗情報の読み込みに失敗しました。');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [storeNumber]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async () => {
        if (!formData.storeName || !formData.storeAddress) {
            alert('店舗名と住所は必須です');
            return;
        }
        if (!window.confirm('店舗情報を修正しますか？')) return;
        try {
            await storeApi.updateStores(storeNumber, formData);
            alert('店舗情報が更新されました。');
        } catch {
            alert('更新に失敗しました。');
        }
    };

    if (loading) return <div>読み込み中...</div>;

    return (
        <StoreInfoWrapper>
            <SectionTitle>🏪 店舗情報修正</SectionTitle>
            <InputGroup>
                <Label>店舗名</Label>
                <Input name="storeName" value={formData.storeName} onChange={handleChange} placeholder="店舗名" />
            </InputGroup>
            <InputGroup>
                <Label>住所</Label>
                <Input name="storeAddress" value={formData.storeAddress} onChange={handleChange} placeholder="住所" />
            </InputGroup>
            <InputGroup>
                <Label>カテゴリー</Label>
                <Input name="category" value={formData.category} onChange={handleChange} placeholder="例: 居酒屋" />
            </InputGroup>
            <CheckboxWrapper>
                <input
                    type="checkbox"
                    id="autoApprove"
                    name="autoApprove"
                    checked={formData.autoApprove}
                    onChange={handleChange}
                />
                <label htmlFor="autoApprove">店舗登録自動承認機能を使用する</label>
            </CheckboxWrapper>
            <SaveButtonWrapper>
                <ActionButton onClick={handleSave}>保存</ActionButton>
            </SaveButtonWrapper>
        </StoreInfoWrapper>
    );
};

/* ─── ユーザー検索タブ ─── */
const UserSearchTab = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!keyword.trim()) return;
        try {
            let combinedResults = [];

            // 名前で検索
            try {
                const res = await userApi.searchUsers(keyword);
                const data = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
                combinedResults = [...data];
            } catch (err) {
                console.error('名前検索エラー:', err);
            }

            // 숫자인 경우 userNumber로 추가 검색
            if (/^\d+$/.test(keyword)) {
                try {
                    const infoRes = await userApi.getUserInfo(keyword);
                    const userInfo = infoRes.data.user;
                    if (userInfo && userInfo.userNumber) {
                        const isDuplicate = combinedResults.some(u => u.userNumber === userInfo.userNumber);
                        if (!isDuplicate) combinedResults.push(userInfo);
                    }
                } catch (err) {
                    console.error('番号検索エラー:', err);
                }
            }

            setResults(combinedResults);
            setHasSearched(true);
        } catch (err) {
            console.error('検索エラー:', err);
            alert('検索中にエラーが発生しました。');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div>
            <SectionTitle>🔍 ユーザー検索</SectionTitle>
            <SearchBox>
                <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="名前、ID、またはユーザー番号を入力"
                />
                <ActionButton onClick={handleSearch}>検索</ActionButton>
            </SearchBox>
            <List>
                {results.length > 0 ? results.map((u) => (
                    <ListItem key={u.userNumber}>
                        <ItemInfo>
                            <NameGroup>
                                <strong>{u.name}</strong>
                                <span>No.{u.userNumber}</span>
                            </NameGroup>
                            <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <span>タイプ: {u.userType}</span>
                                {u.email && <span>📧 {u.email}</span>}
                                {u.phoneNumber && <span>📞 {u.phoneNumber}</span>}
                                {u.birthDate && <span>🎂 {u.birthDate}</span>}
                            </div>
                        </ItemInfo>
                    </ListItem>
                )) : hasSearched && (
                    <EmptyMsg>該当するユーザーが見つかりません。</EmptyMsg>
                )}
            </List>
        </div>
    );
};

export default AdminPage;
