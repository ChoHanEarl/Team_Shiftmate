import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useAuthStore from "../store/authStore"; 
import { storeApi } from '../api/storeApi'; 

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore(); 
    
    // 権限判定 (userTypeが '店長' または 'OWNER' の場合を管理者とする)
    const isOwner = user?.userType === '店長' || user?.userType === 'OWNER';

    const [myStores, setMyStores] = useState([]);    // 店長: 管理店舗 / 店員: 所属済みの店舗
    const [allStores, setAllStores] = useState([]);  // 店員のみ: 検索用の全店舗リスト
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('my'); // 'my'(所属・管理) または 'all'(検索)

    // 店舗番号から店舗名を取得 (店員用: relationsには名前が含まれない場合があるため)
    const getStoreName = (num) => {
        const store = allStores.find(s => s.storeNumber === num);
        return store ? store.storeName : `店舗 #${num}`;
    };

    // データの取得
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (isOwner) {
                // 【店長】自分がオーナーの店舗だけを取得 (/api/stores/owner)
                const res = await storeApi.getOwnerStores();
                if (res.data?.success) {
                    setMyStores(res.data.stores || []);
                }
            } else {
                // 【店員】
                // 1. 申請可能な全店舗リストを取得
                const resAll = await storeApi.getAllStore();
                if (resAll.data?.success) setAllStores(resAll.data.stores || []);

                // 2. 自分が所属（申請中含む）している店舗リストを取得
                const resMy = await storeApi.getUserStoreRelations();
                if (resMy.data?.success) {
                    setMyStores(resMy.data.relations || []);
                }
            }
        } catch (err) {
            console.error("データロード失敗:", err);
        } finally {
            setLoading(false);
        }
    }, [isOwner]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 店舗削除 (店長専用)
    const handleDeleteStore = async (storeNumber, storeName) => {
        if (!window.confirm(`「${storeName}」を削除しますか？\n関連するシフトやスタッフデータもすべて削除されます。`)) {
            return;
        }

        try {
            const res = await storeApi.deleteStore(storeNumber);
            if (res.data.success) {
                alert("店舗が正常に削除されました。");
                // 画面上のリストから削除
                setMyStores(prev => prev.filter(store => store.storeNumber !== storeNumber));
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "削除に失敗しました。";
            alert(errorMsg);
        }
    };

    // 所属申請 (店員専用)
    const handleApply = async (storeNumber, storeName) => {
        if (!window.confirm(`「${storeName}」に所属申請を送りますか？`)) return;
        try {
            const res = await storeApi.applyToStore(storeNumber);
            if (res.data?.success) {
                alert(res.data.message || "申請を送信しました！");
                fetchData(); // リスト更新
            }
        } catch (err) {
            alert(err.response?.data?.message || "既に申請済みか、失敗しました。");
        }
    };

    if (loading) return <Msg>読み込み中...</Msg>;

    // ==========================================
    // 1. 【店長用表示】自分が管理する店だけが見える
    // ==========================================
    if (isOwner) {
        return (
            <Container>
                <Header>
                    <h1>管理者ダッシュボード</h1>
                    <button className="register-btn" onClick={() => navigate('/register-store')}>
                        ＋ 新規店舗登録
                    </button>
                </Header>

                <Section>
                    <SectionTitle>🏢 管理中の店舗一覧</SectionTitle>
                    <Grid>
                        {myStores.length > 0 ? myStores.map((store) => (
                            <StoreCard key={store.storeNumber} $isOwner={true}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Badge>{store.category || '店舗'}</Badge>
                                    <DeleteIconButton onClick={() => handleDeleteStore(store.storeNumber, store.storeName)}>
                                        削除
                                    </DeleteIconButton>
                                </div>
                                <h3>{store.storeName}</h3>
                                <p className="address">📍 {store.storeAddress}</p>
                                <CardActions>
                                    <button className="main-btn" onClick={() => navigate(`/shifts/${store.storeNumber}`)}>
                                        シフト管理
                                    </button>
                                    <button className="staff-btn" onClick={() => navigate(`/admin/`)}>
                                        店員・申請管理
                                    </button>
                                    <button className="outline-btn" onClick={() => navigate(`/edit-store/${store.storeNumber}`)}>
                                        店舗情報修正
                                    </button>
                                </CardActions>
                            </StoreCard>
                        )) : (
                            <EmptyMsg>
                                <p>登録された店舗がありません。</p>
                                <button onClick={() => navigate('/register-store')}>最初の店舗を登録する</button>
                            </EmptyMsg>
                        )}
                    </Grid>
                </Section>
            </Container>
        );
    }

    // ==========================================
    // 2. 【店員用表示】所属店と検索タブ
    // ==========================================
    return (
        <Container>
            <Header>
                <h1>店舗マイページ</h1>
                <button 
                    className="mypage-btn" 
                    onClick={() => navigate('/mypage')}
                >
                    👤 マイページ
                </button>
            </Header>

            <TabGroup>
                <Tab $active={viewMode === 'my'} onClick={() => setViewMode('my')}>所属店舗</Tab>
                <Tab $active={viewMode === 'all'} onClick={() => setViewMode('all')}>店舗を探す</Tab>
            </TabGroup>

            <Section>
                <Grid>
                    {viewMode === 'my' ? (
                        myStores.length > 0 ? myStores.map((relation) => (
                            <StoreCard key={relation.relationNumber}>
                                <Badge $status={relation.status}>
                                    {relation.status === '承認' ? '所属中' : '承認待機中'}
                                </Badge>
                                <h3>{getStoreName(relation.storeNumber)}</h3>            
                                <p className="address">
                                    {relation.status === '承認'                   
                                    ? 'シフトの確認と申請が可能です。' 
                                    : '店長が承認すると利用可能になります。'}
                                </p>
                                <CardActions>
                                    {relation.status === '承認' ? (
                                        <button className="main-btn" onClick={() => navigate(`/shifts/${relation.storeNumber}`)}>
                                            シフト確認・申請
                                        </button>
                                    ) : (
                                        <button className="outline-btn" disabled>承認待機中</button>
                                    )}
                                </CardActions>
                            </StoreCard>
                        )) : (
                            <EmptyMsg>
                                <p>所属している店舗がありません。</p>
                                <button onClick={() => setViewMode('all')}>店舗を探しに行く</button>
                            </EmptyMsg>
                        )
                    ) : (
                        allStores.map((store) => (
                            <StoreCard key={store.storeNumber}>
                                <Badge>{store.category}</Badge>
                                <h3>{store.storeName}</h3>
                                <p className="address">📍 {store.storeAddress}</p>
                                <CardActions>
                                    <button className="apply-btn" onClick={() => handleApply(store.storeNumber, store.storeName)}>
                                        所属申請を送る
                                    </button>
                                </CardActions>
                            </StoreCard>
                        ))
                    )}
                </Grid>
            </Section>
        </Container>
    );
};

export default DashboardPage;

// --- Styled Components (デザイン維持) ---
const Container = styled.div` max-width: 1100px; margin: 0 auto; padding: 40px 20px; `;
const Header = styled.div` 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;
    h1 { font-size: 26px; font-weight: 800; color: #1a1a1a; }
    .register-btn { background: #000; color: #fff; padding: 14px 24px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; font-size: 15px; }
`;
const Section = styled.div` margin-top: 20px; `;
const SectionTitle = styled.h2` font-size: 18px; margin-bottom: 25px; color: #444; display: flex; align-items: center; gap: 8px; `;
const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; `;

const StoreCard = styled.div` 
    background: #fff; padding: 30px; border-radius: 16px; border: 1px solid #eee; 
    box-shadow: ${props => props.$isOwner ? '0 10px 20px rgba(0,0,0,0.05)' : '0 4px 10px rgba(0,0,0,0.03)'};
    h3 { margin: 15px 0 8px; font-size: 20px; font-weight: 700; }
    .address { font-size: 14px; color: #777; margin-bottom: 20px; min-height: 20px; }
`;

const DeleteIconButton = styled.button`
    background: none; border: 1px solid #ff4d4f; color: #ff4d4f;
    padding: 4px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;
    &:hover { background: #fff1f0; }
`;

const Badge = styled.span` 
    background: ${props => props.$status === '承認' ? '#e6f7ff' : '#f0f2f5'}; 
    color: ${props => props.$status === '承認' ? '#1890ff' : '#666'}; 
    padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; 
`;

const CardActions = styled.div` 
    display: flex; flex-direction: column; gap: 10px; 
    button { width: 100%; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; transition: 0.2s; }
    .main-btn { background: #000; color: #fff; border: none; }
    .staff-btn { background: #1890ff; color: #fff; border: none; }
    .outline-btn { background: #fff; color: #555; border: 1px solid #ddd; }
    .apply-btn { background: #52c41a; color: #fff; border: none; }
    button:disabled { cursor: not-allowed; opacity: 0.6; }
`;

const TabGroup = styled.div` display: flex; gap: 30px; margin-bottom: 30px; border-bottom: 2px solid #eee; `;
const Tab = styled.div` padding: 12px 10px; cursor: pointer; font-weight: bold; color: ${props => props.$active ? '#1890ff' : '#999'}; border-bottom: ${props => props.$active ? '3px solid #1890ff' : '3px solid transparent'}; `;
const EmptyMsg = styled.div` text-align: center; padding: 60px; background: #fafafa; border-radius: 20px; grid-column: 1/-1; p { color: #999; } button { margin-top: 15px; padding: 10px 20px; border-radius: 8px; border: 1px solid #ddd; background: #fff; cursor: pointer; } `;
const Msg = styled.div` text-align: center; padding: 100px; font-size: 18px; color: #999; `;