
import axios from 'axios';
import { BASE_URL } from '../constants/appConstant';
import Store from '../redux/Store';

const PRINT_REQUEST = false;
const PRINT_RESPONSE = false;

const AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000
});
AxiosInstance.interceptors.request.use(config => {
    const { authData } = Store.getState().auth;
    const newConfig = { ...config };

    //Adding Common headers
    // newConfig.headers.common['Content-Type'] = 'application/json';

    //Adding common Query params
    newConfig.params = {
        ...config.params,
        'lang_code': 'en'
    }

    if (PRINT_REQUEST && __DEV__) {
        console.log('Api Request:', JSON.stringify(newConfig));
    }
    return newConfig;
});

AxiosInstance.interceptors.response.use(res => {
    if (PRINT_RESPONSE && __DEV__) {
        console.log('Api Response:', JSON.stringify(res.data));
    }
    return res;
})
export default AxiosInstance;