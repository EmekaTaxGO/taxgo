
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
    CHANGE_PASSWORD_FAIL,
    PROFILE_REQUEST,
    PROFILE_FAIL,
    PROFILE_SUCCESS
} from '../../constants';
import {
    API_ERROR_MESSAGE,
    NO_INTERNET_ERROR
} from '../../constants/appConstant';
import { log } from '../../components/Logger';
import { Alert } from 'react-native';
import { isClientError } from '../../helpers/Utils';
import { saveToLocal, AUTH_DATA, getSavedData, PROFILE_DATA } from '../../services/UserStorage';
import Store from '../Store';

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
                navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
            })
            .catch(err => {
                setTimeout(() => {
                    if (err.response) {
                        if (isClientError(err)) {
                            Alert.alert('Alert', 'Incorrect Email or Password.');
                        } else {

                            Alert.alert('Alert', API_ERROR_MESSAGE);
                        }
                    } else {
                        Alert.alert('Alert', NO_INTERNET_ERROR);
                    }
                }, 300);
                log('login Error', err);
                dispatch({ type: LOGIN_FAIL });
            })
    }
}

export const fetchAuthdata = () => {
    return async (dispatch) => {
        const data = await getSavedData(AUTH_DATA);
        dispatch({
            type: SAVE_AUTH,
            payload: data
        });
    }
}

export const signUp = (props, body) => {
    return (dispatch) => {
        dispatch({ type: SIGN_UP_REQUEST });

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
export const getProfile = () => {
    return async (dispatch) => {
        dispatch({ type: PROFILE_REQUEST });
        const profile = await getSavedData(PROFILE_DATA);
        if (profile !== null) {
            dispatch({
                type: PROFILE_SUCCESS,
                payload: profile
            });
        }
        fetchProfileFromRemote()(dispatch);
    }
}

export const fetchProfileFromRemote = () => {
    return (dispatch) => {
        const { authData } = Store.getState().auth;
        return Api.get(`/user/viewProfile/${authData.id}`)
            .then(async (response) => {
                await saveToLocal(PROFILE_DATA, response.data.data);
                dispatch({
                    type: PROFILE_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching profile', err);
                dispatch({ type: PROFILE_FAIL });
            })
    }

}