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