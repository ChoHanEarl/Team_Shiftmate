import axiosInstance from "./axiosInstance";

export const checkDuplicate = (userId) =>
    axiosInstance.get('/api/users/check-duplicate', { params: { userId }})

export const register = (data) =>
    axiosInstance.post('/api/users/register', data)

export const login = (data) =>
    axiosInstance.post('/api/users/login', data)

export const getUsersByType = (type) =>
    axiosInstance.get('/api/users/type', { params: { type } })

export const searchUsers = (keyword) =>
    axiosInstance.get('/api/users/search', { params: { keyword } })

export const searchUsersById = (keyword) =>
    axiosInstance.get('/api/users/search/id', { params: { keyword } })

export const getUserInfo = (userNumber) =>
    axiosInstance.get(`/api/users/${userNumber}`)

export const updateName = (userNumber, name) =>
    axiosInstance.patch(`/api/users/${userNumber}/name`, {name});

export const updatePhoneNumber = (userNumber, phoneNumber) =>
    axiosInstance.patch(`/api/users/${userNumber}/phone`, {phoneNumber});

export const updatePassword = (userNumber, currentPassword, newPassword) =>
    axiosInstance.patch(`/api/users/${userNumber}/password`, {currentPassword, newPassword});

export const deleteUser = (userNumber) =>
    axiosInstance.delete(`/api/users/${userNumber}`);