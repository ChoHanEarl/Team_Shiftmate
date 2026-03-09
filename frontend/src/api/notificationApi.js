import axiosInstance from './axiosInstance';

export const getMyNotifications = () =>
    axiosInstance.get('/api/notifications');

export const getUnreadCount = () =>
    axiosInstance.get('/api/notifications/unread-count');

export const markAsRead = (notificationNumber) =>
    axiosInstance.patch(`/api/notifications/${notificationNumber}/read`);

export const markAllAsRead = () =>
    axiosInstance.patch('/api/notifications/read-all');

export const deleteReadNotifications = () =>
    axiosInstance.delete('/api/notifications/read');