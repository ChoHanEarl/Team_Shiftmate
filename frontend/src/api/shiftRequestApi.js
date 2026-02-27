import axiosInstance from "./axiosInstance"

export const applyShift = (shiftNumber) => 
    axiosInstance.post(`/api/shift-requests/apply`, {shiftNumber});

export const updateShiftRequest = (requestNumber, newShiftNumber) => 
    axiosInstance.patch(`/api/shift-requests/update`, {requestNumber, newShiftNumber});

export const deleteShiftRequest = (requestNumber) =>
    axiosInstance.delete(`/api/shift-requests/delete/${requestNumber}`);

export const processRequest = (requestNumber, status) => 
    axiosInstance.patch(`/api/shift-requests/process`, {requestNumber, status});

export const emergencyDelete = (requestNumber) =>
    axiosInstance.delete(`/api/shift-requests/manager/emergency/${requestNumber}`);

export const getRequestsByShift = (shiftNumber) =>
    axiosInstance.get(`/api/shift-requests/shift/${shiftNumber}`);

export const getMyRequests = () =>
    axiosInstance.get(`/api/shift-requests/user`);

export const getStoreRequests = (storeNumber) =>
    axiosInstance.get(`/api/shift-requests/shift/store/${storeNumber}`);