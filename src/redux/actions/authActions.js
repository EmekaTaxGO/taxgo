
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
    LOGIN_SUCCESS
} from '../../constants';
import {
    API_ERROR_MESSAGE,
    NO_INTERNET_ERROR
} from '../../constants/appConstant';
import { log } from '../../components/Logger';
import { Alert } from 'react-native';
import { isClientError } from '../../helpers/Utils';

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
            .then(response => {
                dispatch({ type: LOGIN_SUCCESS });
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

export const signUp = (navigation, body) => {
    return (dispatch) => {
        dispatch({ type: SIGN_UP_REQUEST });
        return Api.post('/user/register', body)
            .then(response => {
                dispatch({ type: SIGN_UP_SUCCESS, payload: response.data })
                navigation.navigate('HomeScreen');
            })
            .catch(err => {
                log('Error in Signup', err);
                dispatch({ type: SIGN_UP_FAIL });
                Alert.alert('Alert', API_ERROR_MESSAGE);
            })
    }
}