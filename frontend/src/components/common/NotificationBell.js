import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as notificationApi from '../../api/notificationApi';
import * as employeeApi from '../../api/storeEmployeeApi';
import * as shiftRequestApi from '../../api/shiftRequestApi';
import useAuthStore from '../../store/authStore';
import {
    BellBtn, Badge, Dropdown, DropdownHeader, HeaderActions,
    TextBtn, List, Item, Dot, ItemContent, Message, Time, Empty,
    ActionRow, ApproveBtn, RejectBtn, LinkBtn
} from '../../styles/Notification.styles';

const formatTime = (createdAt) => {
    if (!createdAt) return '';
    const now = new Date();
    const created = new Date(createdAt);
    const diffMin = Math.floor((now - created) / 60000);
    if (diffMin < 1)  return 'たった今';
    if (diffMin < 60) return `${diffMin}分前`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}時間前`;
    return `${Math.floor(diffHour / 24)}日前`;
};

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [processing, setProcessing] = useState({}); // { notificationNumber: true }
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await notificationApi.getMyNotifications();
            setNotifications(res.data.notifications || []);
            const unread = (res.data.notifications || []).filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error('通知の取得に失敗しました:', err);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(async () => {
            try {
                const res = await notificationApi.getUnreadCount();
                setUnreadCount(res.data.count || 0);
            } catch {}
        }, 10000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!open) fetchNotifications();
        setOpen(prev => !prev);
    };

    const handleRead = async (n) => {
        if (!n.isRead) {
            try {
                await notificationApi.markAsRead(n.notificationNumber);
                setNotifications(prev =>
                    prev.map(item =>
                        item.notificationNumber === n.notificationNumber
                            ? { ...item, isRead: true }
                            : item
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch {}
        }
    };

    const handleReadAll = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch {}
    };

    const handleDeleteRead = async () => {
        try {
            await notificationApi.deleteReadNotifications();
            setNotifications(prev => prev.filter(n => !n.isRead));
        } catch {}
    };

    const handleEmployeeProcess = async (n, approve) => {
        if (!n.relatedId) return;
        setProcessing(prev => ({ ...prev, [n.notificationNumber]: true }));
        try {
            await employeeApi.processEmployeeRequest(n.relatedId, approve ? '承認' : '断り');
            await notificationApi.markAsRead(n.notificationNumber);
            setNotifications(prev => prev.filter(item => item.notificationNumber !== n.notificationNumber));
            setUnreadCount(prev => Math.max(0, prev - 1));
            window.dispatchEvent(new CustomEvent('employeeProcessed'));
            alert(approve ? '承認しました。' : '断りました。');
        } catch (err) {
            alert(err.response?.data?.message || '処理に失敗しました。');
        } finally {
            setProcessing(prev => ({ ...prev, [n.notificationNumber]: false }));
        }
    };

    const handleShiftProcess = async (n, approve) => {
        if (!n.relatedId) return;
        setProcessing(prev => ({ ...prev, [n.notificationNumber]: true }));
        try {
            await shiftRequestApi.processRequest(n.relatedId, approve ? '承認' : '断り');
            await notificationApi.markAsRead(n.notificationNumber);
            setNotifications(prev => prev.filter(item => item.notificationNumber !== n.notificationNumber));
            setUnreadCount(prev => Math.max(0, prev - 1));
            window.dispatchEvent(new CustomEvent('shiftProcessed'));
            alert(approve ? '承認しました。' : '断りました。');
        } catch (err) {
            alert(err.response?.data?.message || '処理に失敗しました。');
        } finally {
            setProcessing(prev => ({ ...prev, [n.notificationNumber]: false }));
        }
    };

    const renderActions = (n) => {
        const isProcessing = processing[n.notificationNumber];

        switch (n.notificationType) {
            case 'EMPLOYEE_REQUEST':
                return (
                    <ActionRow onClick={e => e.stopPropagation()}>
                        <ApproveBtn
                            disabled={isProcessing}
                            onClick={() => handleEmployeeProcess(n, true)}
                        >
                            承認
                        </ApproveBtn>
                        <RejectBtn
                            disabled={isProcessing}
                            onClick={() => handleEmployeeProcess(n, false)}
                        >
                            断り
                        </RejectBtn>
                    </ActionRow>
                );

            case 'SHIFT_REQUEST':
                return (
                    <ActionRow onClick={e => e.stopPropagation()}>
                        <ApproveBtn
                            disabled={isProcessing}
                            onClick={() => handleShiftProcess(n, true)}
                        >
                            承認
                        </ApproveBtn>
                        <RejectBtn
                            disabled={isProcessing}
                            onClick={() => handleShiftProcess(n, false)}
                        >
                            断り
                        </RejectBtn>
                    </ActionRow>
                );

            case 'EMPLOYEE_RESULT':
                return (
                    <ActionRow onClick={e => e.stopPropagation()}>
                        <LinkBtn onClick={() => { setOpen(false); navigate('/mypage'); }}>
                            マイページへ →
                        </LinkBtn>
                    </ActionRow>
                );

            case 'SHIFT_RESULT':
            case 'SHIFT_EMERGENCY':
                return (
                    <ActionRow onClick={e => e.stopPropagation()}>
                        <LinkBtn onClick={() => { 
                            setOpen(false); 
                            handleRead(n);
                            const isOwner = user?.userType === '店長' || user?.userType === 'OWNER';
                            if (isOwner) {
                                navigate('/admin');  
                            } else {
                                navigate('/mypage');
                            }
                        }}>
                            {user?.userType === '店長' ? '管理者ページへ →' : 'マイページへ →'}
                        </LinkBtn>
                    </ActionRow>
                );
            case 'STORE_FIRED':
                return (
                    <ActionRow onClick={e => e.stopPropagation()}>
                        <LinkBtn onClick={() => {setOpen(false); handleRead(n); navigate('/mypage');}}>
                            マイページへ　→
                        </LinkBtn>
                    </ActionRow>
                );
            case 'STORE_CLOSED':
                return (
                    <ActionRow onClick={e => e.stopPropagation()}>
                        <LinkBtn onClick={() => { setOpen(false); handleRead(n); navigate('/dashboard'); }}>
                            ダッシュボードへ →
                        </LinkBtn>
                    </ActionRow>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <BellBtn onClick={handleToggle} title="通知">
                🔔
                {unreadCount > 0 && (
                    <Badge>{unreadCount > 99 ? '99+' : unreadCount}</Badge>
                )}
            </BellBtn>

            {open && (
                <Dropdown>
                    <DropdownHeader>
                        🔔 通知
                        <HeaderActions>
                            {unreadCount > 0 && (
                                <TextBtn onClick={handleReadAll}>全て既読</TextBtn>
                            )}
                            <TextBtn onClick={handleDeleteRead}>既読削除</TextBtn>
                        </HeaderActions>
                    </DropdownHeader>

                    <List>
                        {notifications.length === 0 ? (
                            <Empty>通知がありません</Empty>
                        ) : (
                            notifications.map(n => (
                                <Item
                                    key={n.notificationNumber}
                                    $unread={!n.isRead}
                                    onClick={() => handleRead(n)}
                                >
                                    <Dot $unread={!n.isRead} />
                                    <ItemContent>
                                        <Message>{n.message}</Message>
                                        <Time>{formatTime(n.createdAt)}</Time>
                                        {/* ★ 액션 버튼 */}
                                        {renderActions(n)}
                                    </ItemContent>
                                </Item>
                            ))
                        )}
                    </List>
                </Dropdown>
            )}
        </div>
    );
}