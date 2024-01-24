import axiosMain from "axios";

const AXIOS_PROXY_URL = 'https://aladdinai.io';

function axios() {
    let axiosInstance = axiosMain.create();
    axiosInstance.interceptors.request.use(config => {
        config.url = `${AXIOS_PROXY_URL}?url=${encodeURIComponent(config.url)}`;
        return config;
    });
    return axiosInstance;
}


export default axios