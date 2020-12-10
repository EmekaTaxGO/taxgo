
import Api from '../../services/api';
import {
    SIGN_UP_DETAILS_REQUEST,
    SIGN_UP_DETAILS_FAIL,
    SIGN_UP_DETAILS_SUCCESS,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAIL,
    LOGIN_REQUEST,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    SAVE_AUTH,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_FAIL
} from '../../constants';
import {
    API_ERROR_MESSAGE,
    NO_INTERNET_ERROR
} from '../../constants/appConstant';
import { log } from '../../components/Logger';
import { Alert } from 'react-native';
import { isClientError } from '../../helpers/Utils';
import { saveToLocal, AUTH_DATA, getSavedData } from '../../services/UserStorage';

export const fetchSignupDetails = () => {
    return (dispatch) => {
        dispatch({ type: SIGN_UP_DETAILS_REQUEST })
        return Promise.all([
            Api.get('/default/getCountries'),
            Api.get('/default/getBusinessCategories')
        ])
            .then(result => {
                const countries = result[0];
                const businesses = result[1];
                dispatch({
                    type: SIGN_UP_DETAILS_SUCCESS,
                    payload: {
                        countries: countries.data,
                        businesses: businesses.data
                    }
                })
            })
            .catch(err => {
                console.log('Api error', err);
                dispatch({ type: SIGN_UP_DETAILS_FAIL, payload: err });
            })
    }

}

export const login = (navigation, body) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_REQUEST });
        return Api.post('/auth/login', body)
            .then(async (response) => {
                await saveToLocal(AUTH_DATA, response.data.data);
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: response.data.data
                });
                navigation.replace('HomeScreen');
            })
            .catch(err => {
                if (err.response) {
                    if (isClientError(err)) {
                        Alert.alert('Alert', 'Incorrect Email or Password.');
                    } else {

                        Alert.alert('Alert', API_ERROR_MESSAGE);
                    }
                } else {
                    Alert.alert('Alert', NO_INTERNET_ERROR);
                }
                log('login Error', err);
                dispatch({ type: LOGIN_FAIL });

            })
    }
}

export const fetchAuthdata = () => {
    return async (dispatch) => {
        const data = await getSavedData(AUTH_DATA);
        dispatch({ type: SAVE_AUTH, payload: data });
    }
}

export const signUp = (props, body) => {
    return (dispatch) => {
        dispatch({ type: SIGN_UP_REQUEST });
        return Api.post('/user/register', body)
            .then(async (response) => {
                Alert.alert('Alert', 'Registration is successful, Please Login to use Taxgo Services.', [{
                    onPress: () => {
                        props.navigation.navigate('LoginScreen');
                    },
                    style: 'default',
                    text: 'OK'
                }], { cancelable: false })
                dispatch({ type: SIGN_UP_SUCCESS, payload: response.data });
            })
            .catch(err => {
                log('Error in Signup', err);
                dispatch({ type: SIGN_UP_FAIL });
                if (err.response) {
                    if (isClientError(err)) {
                        Alert.alert('Alert', err.response.data.message);
                    } else {
                        Alert.alert('Alert', API_ERROR_MESSAGE);
                    }
                } else {
                    Alert.alert('Alert', NO_INTERNET_ERROR);
                }

            })
    }
}

export const changePassword = (body, onSuccess, onError) => {
    return (dispatch) => {
        dispatch({ type: CHANGE_PASSWORD_REQUEST });
        Api.post('/user/changePassword', body)
            .then(response => {
                dispatch({ type: CHANGE_PASSWORD_SUCCESS });
                onSuccess(response.data);
            })
            .catch(err => {
                log('Error changing password', err);
                onError(err);
                dispatch({ type: CHANGE_PASSWORD_FAIL });
            })
    }
}