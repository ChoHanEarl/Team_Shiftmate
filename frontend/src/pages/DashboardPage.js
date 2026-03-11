import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { storeApi } from '../api/storeApi';

import {
    Container, Header, HeaderBtn, MypageBtn,
    Section, SectionTitle, Grid, StoreCard, CardTopRow,
    Badge, DeleteBtn, CardActions,
    TabGroup, Tab, EmptyMsg, Msg
} from '../styles/Dashboard.styles';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const isOwner = user?.userType === '店長' || user?.userType === 'OWNER';

    const [myStores, setMyStores] = useState([]);
    const [allStores, setAllStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('my');

    const getStoreName = (num) => {
        const store = allStores.find(s => s.storeNumber === num);
        return store ? store.storeName : `店舗 #${num}`;
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (isOwner) {
                const res = await storeApi.getOwnerStores();
                if (res.data?.success) setMyStores(res.data.stores || []);
            } else {
                const resAll = await storeApi.getAllStore();
                if (resAll.data?.success) setAllStores(resAll.data.stores || []);

                const resMy = await storeApi.getUserStoreRelations();
                if (resMy.data?.success) {
                    const filtered = (resMy.data.relations || []).filter(r => r.status !== '断り');
                    setMyStores(filtered);
                }
            }
        } catch (err) {
            console.error('データロード失敗:', err);
        } finally {
            setLoading(false);
        }
    }, [isOwner]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDeleteStore = async (storeNumber, storeName) => {
        if (!window.confirm(`「${storeName}」を削除しますか？\n関連データもすべて削除されます。`)) return;
        try {
            const res = await storeApi.deleteStore(storeNumber);
            if (res.data.success) {
                alert('店舗が正常に削除されました。');
                setMyStores(prev => prev.filter(s => s.storeNumber !== storeNumber));
            }
        } catch (err) {
            alert(err.response?.data?.message || '削除に失敗しました。');
        }
    };

    const handleApply = async (storeNumber, storeName) => {
        if (!window.confirm(`「${storeName}」に所属申請を送りますか？`)) return;
        try {
            const res = await storeApi.applyToStore(storeNumber);
            if (res.data?.success) {
                alert(res.data.message || '申請を送信しました！');
                fetchData();
            }
        } catch (err) {
            alert(err.response?.data?.message || '既に申請済みか、失敗しました。');
        }
    };

    if (loading) return <Msg>読み込み中...</Msg>;

    if (isOwner) {
        return (
            <Container>
                <Header>
                    <h1>管理者ダッシュボード</h1>
                    <HeaderBtn onClick={() => navigate('/register-store')}>
                        ＋ 新規店舗登録
                    </HeaderBtn>
                </Header>

                <Section>
                    <SectionTitle>管理中の店舗一覧</SectionTitle>
                    <Grid>
                        {myStores.length > 0 ? myStores.map((store) => (
                            <StoreCard key={store.storeNumber}>
                                <CardTopRow>
                                    <Badge>{store.category || '店舗'}</Badge>
                                    <DeleteBtn onClick={() => handleDeleteStore(store.storeNumber, store.storeName)}>
                                        削除
                                    </DeleteBtn>
                                </CardTopRow>
                                <h3>{store.storeName}</h3>
                                <p className="address">📍 {store.storeAddress}</p>
                                <CardActions>
                                    <button className="main-btn" onClick={() => navigate(`/shifts/${store.storeNumber}`)}>
                                        シフト管理
                                    </button>
                                    <button className="staff-btn" onClick={() => navigate(`/admin?storeNumber=${store.storeNumber}`)}>
                                        スタッフ・申請管理
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

    return (
        <Container>
            <Header>
                <h1>ダッシュボード</h1>
                <MypageBtn onClick={() => navigate('/mypage')}>
                    👤 マイページ
                </MypageBtn>
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