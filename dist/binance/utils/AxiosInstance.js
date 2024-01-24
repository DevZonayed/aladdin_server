"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const AXIOS_PROXY_URL = 'https://aladdinai.io';
function axios() {
    let axiosInstance = axios_1.default.create();
    axiosInstance.interceptors.request.use(config => {
        config.url = `${AXIOS_PROXY_URL}?url=${encodeURIComponent(config.url)}`;
        return config;
    });
    return axiosInstance;
}
exports.default = axios;
//# sourceMappingURL=AxiosInstance.js.map