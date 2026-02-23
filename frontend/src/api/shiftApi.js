import axiosInstance from './axiosInstance'

export const createShift = (data) =>
    axiosInstance.post('/api/shifts/create', data)

export const getStoreShifts = (storeNumber) =>
    axiosInstance.get(`api/shifts/store/${storeNumber}`)

export const getStoreShiftsByDate = (storeNumber, data) =>
    axiosInstance.get(`api/shifts/store/${storeNumber}/data/${date}`)

export const getStoreShiftsByDateRange = (storeNumber, startDate, endDate) =>
    axiosInstance.get(`/api/shifts/store/${storeNumber}/range`, {
        params: { startDate, endDate },
    })

export const getShift = (shiftNumber) => 
    axiosInstance.get(`api/shifts/${shiftNumber}`)

export const updateShift = (shiftNumber, data) =>
    axiosInstance.put(`api/shifts/${shiftNumber}`, data)

export const deleteShift = (shiftNumber) =>
    axiosInstance.delete(`/api/shifts/${shiftNumber}`)