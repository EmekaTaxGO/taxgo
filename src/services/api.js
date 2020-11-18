
import axios from 'axios';
import { BASE_URL } from '../constants/appConstant';
import Store from '../redux/Store';

const AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 100000,
    // params:{

    // }
});
AxiosInstance.interceptors.request.use(config => {
    const state = Store.getState();
    const newConfig = { ...config };

    //Adding Common headers
    // newConfig.headers.common['Content-Type'] = 'application/json';

    //Adding common Query params
    newConfig.params = {
        ...config.params,
        'lang_code': 'en'
    }

    if (__DEV__) {
        console.log('Api Request:', JSON.stringify(newConfig));
    }
    return newConfig;
});
export default AxiosInstance;