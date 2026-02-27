import axiosInstance from "./axiosInstance";

export const requestEmployeeApproval = (storeNumber) =>
    axiosInstance.post('/api/store-employees/request', { storeNumber });

export const processEmployeeRequest = (relationNumber, status) =>
    axiosInstance.post('/api/store-employees/process', { relationNumber, status });

export const getStoreEmployees = (storeNumber) =>
    axiosInstance.get(`/api/store-employees/store/${storeNumber}`);

export const getPendingRequests = (storeNumber) =>
    axiosInstance.get(`/api/store-employees/store/${storeNumber}/pending`);

export const getUserStoreRelations = () =>
    axiosInstance.get('/api/store-employees/user');

export const fireEmployee = (relationNumber, ownerUserNumber) =>
    axiosInstance.patch(`/api/store-employees/employees/${relationNumber}/fire`, null, {
        params: { ownerUserNumber }
    });