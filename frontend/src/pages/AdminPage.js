import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import * as employeeApi from '../api/storeEmployeeApi';
import * as shiftApi from '../api/shiftRequestApi';
import * as userApi from '../api/userApi';
import { storeApi } from '../api/storeApi';
import { useNavigate } from 'react-router-dom';

import {
    Container, Header, PageTitle, StoreInfo,
    TabContainer, TabButton, ContentCard, SectionTitle, DashboardButton,
    List, ListItem, ItemInfo, ButtonGroup, ActionButton, StoreSelect, SaveButtonWrapper,
    TableContainer, Table, Th, Td, StatusBadge, NameGroup, StoreInfoWrapper, 
    InputGroup, Label, Input, SearchBox, Hr, EmptyMsg, CheckboxWrapper
} from '../styles/AdminPage.styles';

const AdminPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('employee');

    const [storeNumber, setStoreNumber] = useState(null);
    const [myStores, setMyStores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyStore = async () => {
            if (!user) return;
            try {
                const res = await storeApi.getOwnerStores();
                const relations = res.data.stores;

                if (relations && relations.length > 0) {
                    setMyStores(relations);
                    setStoreNumber(relations[0].storeNumber);
                    console.log("店舗情報の読み込みに成功しました。", relations[0]);
                } else {
                    alert("管理する店舗が見つかりません。");
                }
            } catch (err) {
                console.error("店舗情報の読み込みに失敗しました:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyStore();
    }, [user]);

    if (!user) return <Container>ログインが必要です。</Container>;
    if (isLoading) return <Container>店舗情報を読み込み中...</Container>;
    if (!storeNumber) return <Container>店舗情報がありません。</Container>;

    return (
        <Container>
            <Header>
                <div>
                    <PageTitle>管理者ページ</PageTitle>
                    <StoreInfo>店長: {user.name}様 
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
                <DashboardButton onClick={() => navigate('/dashboard')}>
                    🏠 ダッシュボード
                </DashboardButton>
            </Header>

            <TabContainer>
                <TabButton $active={activeTab === 'employee'} onClick={() => setActiveTab('employee')}>
                    スタッフ管理
                </TabButton>
                <TabButton $active={activeTab === 'shift'} onClick={() => setActiveTab('shift')}>
                    シフト管理
                </TabButton>
                <TabButton $active={activeTab === 'store'} onClick={() => setActiveTab('store')}>
                    店舗情報修正
                </TabButton>
                <TabButton $active={activeTab === 'search'} onClick={() => setActiveTab('search')}>
                    ユーザー検索
                </TabButton>
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

const EmployeeTab = ({ storeNumber, ownerId }) => {
    const [employees, setEmployees] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
   
    const loadData = useCallback(async () => {
        try {
            const [empRes, pendingRes] = await Promise.all([
                employeeApi.getStoreEmployees(storeNumber),
                employeeApi.getPendingRequests(storeNumber)
            ]);
            const attachNames = async (list = []) => {
                return Promise.all(list.map(async (item) => {
                    try {
                        const res = await userApi.getUserInfo(item.userNumber);
                        return { ...item, userName: res.data.user.name };
                    } catch {
                        return { ...item, userName: '名前なし' };
                    }
                }));
            };

            setEmployees(await attachNames(empRes.data.employees));
            setPendingRequests(await attachNames(pendingRes.data.requests));
        } catch (err) {
            console.error("スタッフデータの読み込みに失敗しました", err);
        }
    }, [storeNumber]);

    useEffect(() => { 
        loadData(); 
    }, [loadData]);
   
    const handleProcess = async (relationNumber, isApprove) => {      
        const statusToSend = isApprove ? "承認" : "断り"; 
        
        if(!window.confirm(`${statusToSend}しますか？`)) return;

        try {
            await employeeApi.processEmployeeRequest(relationNumber, statusToSend);
            alert("処理が完了しました。");
            console.log(`スタッフ申請処理完了: ${statusToSend}`);
            loadData();
        } catch (err) {
            console.error("処理エラー:", err);
            alert("処理に失敗しました。");
        }
    };

    const handleFire = async (relationNumber) => {
        if(!window.confirm("本当にこのスタッフを解雇しますか？")) return;
        try {
            await employeeApi.fireEmployee(relationNumber, ownerId);
            alert("解雇しました。");
            console.log(`スタッフ解雇完了: relationNumber=${relationNumber}`);
            loadData();
        } catch (err) {
            console.error("解雇エラー:", err);
            alert("解雇に失敗しました。(権限を確認してください)");
        }
    };

    return (
      <div>
            <SectionTitle>📝 承認待ちリスト</SectionTitle>
            {pendingRequests.length === 0 ? <EmptyMsg>承認待ちの申請はありません。</EmptyMsg> : (
                <List>
                    {pendingRequests.map(req => (
                        <ListItem key={req.relationNumber}>
                            <ItemInfo>
                                <NameGroup>
                                    <strong>{req.userName}</strong> 
                                    <span>(ID: {req.userNumber})</span>
                                </NameGroup>
                                <small>申請日: {req.requestDate || '-'}</small>
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
                        <ActionButton $variant="danger" onClick={() => handleFire(emp.relationNumber)}>解雇</ActionButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

const ShiftTab = ({ storeNumber }) => {
    const [requests, setRequests] = useState([]);

    const loadShifts = useCallback(async () => {
        try {
            const res = await shiftApi.getStoreRequests(storeNumber);
            const rawData = res.data.request;
            const shiftArray = Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []);
            const sortedData = [...shiftArray].sort((a, b) => 
	            a.requestNumber - b.requestNumber);
            const attachNames = async (list) => {
                return Promise.all(list.map(async (item) => {
                    try {
                        const userRes = await userApi.getUserInfo(item.userNumber);
                        return { ...item, userName: userRes.data.user.name };
                    } catch {
                        return { ...item, userName: '名前なし' };
                    }
                }));
            };

            const dataWithNames = await attachNames(sortedData);
            setRequests(dataWithNames);
        } catch (err) {
            console.error("シフト情報の読み込みに失敗しました", err);
        }
    }, [storeNumber]);

    useEffect(() => { 
        loadShifts(); 
    }, [loadShifts]);

    const handleShiftProcess = async (reqNumber, isApprove) => {
        const statusToSend = isApprove ? "承認" : "断り";
        const displayMsg = isApprove ? "承認" : "断り";

        try {
            await shiftApi.processRequest(reqNumber, statusToSend);
            alert(`シフトが${displayMsg}されました。`);
            console.log(`シフト処理完了: ${statusToSend}`);
            loadShifts();
        } catch (err) {
            console.error("シフト処理エラー", err);
            alert("エラーが発生しました。");
        }
    };

    const handleEmergencyDelete = async (reqNumber) => {
        if(!window.confirm("管理者権限で削除しますか？ (復元不可)")) return;
        try {
            await shiftApi.emergencyDelete(reqNumber);
            alert("削除しました。");
            console.log(`シフト強制削除完了: requestNumber=${reqNumber}`);
            loadShifts();
        } catch (err) {
            console.error("削除エラー", err);
            alert("削除に失敗しました。");
        }
    };

    const displayStatus = (status) => {
        if (status === '承認') return '承認済み';
        if (status === '断り') return '断り';
        if (status === '待機中') return '承認待機';
        return status;
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
                            <Th>スタッフ番号</Th>
                            <Th>シフト番号</Th>
                            <Th>ステータス</Th>
                            <Th>操作</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.requestNumber}>
                                <Td>{req.requestNumber}</Td>
                                <Td>{req.userName}</Td>
                                <Td><strong>{req.userNumber}</strong></Td>
                                <Td>{req.shiftNumber}</Td>
                                <Td>
                                    <StatusBadge $status={req.status}>
                                        {displayStatus(req.status)}
                                    </StatusBadge>
                                </Td>
                                <Td>
                                    <ButtonGroup>
                                        {(req.status === '待機中') && (
                                            <>
                                                <ActionButton onClick={() => handleShiftProcess(req.requestNumber, true)}>承認</ActionButton>
                                                <ActionButton $variant="danger" onClick={() => handleShiftProcess(req.requestNumber, false)}>断り</ActionButton>
                                            </>
                                            )}
                                        {(req.status === '承認') && (
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

const StoreInfoTab = ({ storeNumber }) => {
    const [formData, setFormData] = useState({
        storeName: '',
        storeAddress: '',
        category: '',
        autoApprove: false
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!storeNumber) return;
        
        const fetchStoreInfo = async () => {
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
            } catch (err) {
                console.error("店舗情報のロード失敗:", err);
                alert("店舗情報の読み込みに失敗しました。");
            } finally {
                setLoading(false);
            }
        };

        fetchStoreInfo();
    }, [storeNumber]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSave = async () => {
        if (!formData.storeName || !formData.storeAddress) {
            alert("店舗名と住所は必須です");
            return;
        }
        if (!window.confirm("店舗情報を修正しますか？")) return;

        try {
            await storeApi.updateStores(storeNumber, formData);
            alert("店舗情報が更新されました。");
        } catch (err) {
            console.error("Update Error:", err);
            alert("更新に失敗しました。");
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
                <label htmlFor="autoApprove">シフト自動承認機能を使用する</label>
            </CheckboxWrapper>

            <SaveButtonWrapper>
                <ActionButton onClick={handleSave}>保存</ActionButton>
            </SaveButtonWrapper>
        </StoreInfoWrapper>
    );
};

const UserSearchTab = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if(!keyword.trim()) return;
        try {
            let combinedResults = [];
            try {
                const res = await userApi.searchUsers(keyword);
                const data = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
                setResults(data);
                setHasSearched(true);
                console.log(`ユーザー検索結果: ${data.length}件`);
            } catch (err) {
                console.error(err);
                alert("検索中にエラーが発生しました。");
            }
            if (/^\d+$/.test(keyword)) {
                try {
                    const infoRes = await userApi.getUserInfo(keyword);
                    
                    const userInfo = infoRes.data.user; 

                    if (userInfo && userInfo.userNumber) {
                        const isDuplicate = combinedResults.some(u => u.userNumber === userInfo.userNumber);
                        
                        if (!isDuplicate) {
                            combinedResults.push(userInfo);
                        }
                    }
                } catch (err) {
                    console.error(err);
                    alert("該当するユーザー番号が見つかりませんでした。");
                }
            }
            setResults(combinedResults);
            setHasSearched(true);
            console.log(`ユーザー検索結果: ${combinedResults.length}件`);

        } catch (err) {
            console.error("検索システム全体のエラー:", err);
            alert("検索中にエラーが発生しました。");
        }
    };
    return (
       <div>
            <SectionTitle>🔍 ユーザー検索</SectionTitle>
            <SearchBox>
                <Input 
                    value={keyword} 
                    onChange={(e) => setKeyword(e.target.value)} 
                    placeholder="名前、ID、またはユーザー番号を入力" 
                />
                <ActionButton onClick={handleSearch}>検索</ActionButton>
            </SearchBox>
            
            <List>
                {results.length > 0 ? (
                    results.map((user) => (
                        <ListItem key={user.userNumber}>
                            <ItemInfo>
                                <strong>{user.name}</strong>
                                <small>ユーザー番号: {user.userNumber}</small>
                                <small>タイプ: {user.userType}</small>
                                <small>📧 メール: {user.email || '-'}</small>
                                <small>📞 電話番号: {user.phoneNumber || '-'}</small>
                                <small>🎂 生年月日: {user.birthDate || '-'}</small>
                            </ItemInfo>
                        </ListItem>
                    ))
                ) : (
                   hasSearched && <EmptyMsg>該当するユーザーが見つかりません。</EmptyMsg>
                )}
            </List>
        </div>
    );
};


export default AdminPage;