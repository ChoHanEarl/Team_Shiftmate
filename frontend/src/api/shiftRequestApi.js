import axiosInstance from "./axiosInstance";

export const applyShift = (shiftNumber) =>
    axiosInstance.post('/api/shift-requests/apply', { shiftNumber })

export const updateShiftRequest = (requestNumber, newShiftNumber) =>
    axiosInstance.put('/api/shift-requests/apply', { shiftNumber })

export const deleteShiftRequest = (requestNumber) =>
    axiosInstance.delete('/api/shift-requests/delete', { data: { requestNumber }})

export const processRequest = (requestNumber, status) =>
    axiosInstance.post('api/shift-requests/process', { requestNumber, status })

export const emergencyDeleteShift = (requestNumber) =>
    axiosInstance.delete('/api/shift-requests/manager/emergency', {
        data: { requestNumber },
    })

export const getShiftRequests = (shiftNumber) =>
    axiosInstance.get(`/api/shift-requests/shift/${shiftNumber}`)

export const getUserRequests = () =>
    axiosInstance.get('/api/shift-requests/user')

export const getStoreRequests = (storeNumber) =>
    axiosInstance.get(`/api/shift-requests/shift/store/${storeNumber}`)