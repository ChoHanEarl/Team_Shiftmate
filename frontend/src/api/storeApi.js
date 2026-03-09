import axiosInstance from "./axiosInstance";

export const storeApi = {
    // 店舗登録
    registerStore: (storeDTO) => axiosInstance.post('/api/stores/register', storeDTO),
    
    // 店長の店舗リスト照会
    getOwnerStores: () => axiosInstance.get('/api/stores/owner'),
    
    // 全ての店舗リスト照会
    getAllStore: () => axiosInstance.get('/api/stores/all'),
    
    // storeNumberで店舗照会
    getStoreByNumber: (storeNumber) => axiosInstance.get(`/api/stores/${storeNumber}`),
    // 店舗情報変更
    updateStores: (storeNumber, storeDTO) => axiosInstance.put(`/api/stores/${storeNumber}`, storeDTO),    
    // 店舗削除
    deleteStore: (storeNumber) => axiosInstance.delete(`/api/stores/${storeNumber}`),
    applyToStore: (storeNumber) => axiosInstance.post('/api/store-employees/request', { storeNumber }),
    getMyAppliedStores: () => axiosInstance.get('/api/stores/my-applications'),
    getUserStoreRelations: () => axiosInstance.get('/api/store-employees/user')
};