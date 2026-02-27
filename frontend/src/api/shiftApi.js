import axiosInstance from "./axiosInstance";

export const shiftApi = {
    // シフト生成
    createShift: (ShiftDTO) => axiosInstance.post('/api/shifts/create', ShiftDTO),

    // 店舗の全てのシフト照会 
    getStoreShifts: (storeNumber) => axiosInstance.get(`/api/shifts/store/${storeNumber}`),

    // 店舗の特定日付シフト照会
    getStoreShiftsByDate: (storeNumber, date) => axiosInstance.get(`/api/shifts/store/${storeNumber}/date/${date}`),

    // 店舗の期間別シフト照会
    getStoreShiftsByDateRange: (storeNumber, startDate, endDate) => axiosInstance.get(`/api/shifts/store/${storeNumber}/range`, {
        params: { startDate, endDate }
    }),

    // シフト番号から照会
    getShiftByNumber: (shiftNumber) => axiosInstance.get(`/api/shifts/${shiftNumber}`),

    cancelMyRequest: (requestNumber) => axiosInstance.delete(`/api/shift-requests/${requestNumber}`),

    // シフト情報更新 (PUT)
    updateShift: (shiftNumber, shiftDTO) => axiosInstance.put(`/api/shifts/${shiftNumber}`, shiftDTO),

    // シフト削除
    deleteShift: (shiftNumber) => axiosInstance.delete(`/api/shifts/${shiftNumber}`)    
};