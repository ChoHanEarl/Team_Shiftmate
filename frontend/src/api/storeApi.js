import axiosInstance from './axiosInstance'

export const registerStore = (data) =>
    axiosInstance.post('/api/stores/register', data)

export const getOwnerStores = () =>
    axiosInstance.get('/api/stores/owner')

export const getAllStores = () =>
    axiosInstance.get('/api/stores/all')

export const getStore = (storeNumber) =>
    axiosInstance.get(`api/stores/${storeNumber}`)

export const updateStore = (storeNumber, data) =>
    axiosInstance.put(`/api/stores/${storeNumber}`, data)

export const deleteStore = (storeNumber) =>
    axiosInstance.delete(`/api/stores/${storeNumber}`)