
import Api from '../../services/api';
import { log } from '../../components/Logger';
import {
    PRE_EDIT_PROFILE_REQUEST,
    PRE_EDIT_PROFILE_FAIL,
    PRE_EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_REQUEST,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAIL,
} from '../../constants';
import Store from '../Store';

export const prefetchForEditProfile = () => {
    return (dispatch) => {
        dispatch({ type: PRE_EDIT_PROFILE_REQUEST });
        const { authData } = Store.getState().auth;
        const apiList = [
            Api.get(`/user/viewProfile/${authData.id}`),
            Api.get('/default/getCountries'),
            Api.get('/default/getBusinessCategories')
        ];
        return Promise.all(apiList)
            .then(results => {
                dispatch({
                    type: PRE_EDIT_PROFILE_SUCCESS,
                    payload: {
                        profile: results[0].data.data,
                        countries: results[1].data.data,
                        businesses: results[2].data.data
                    }
                })
            })
            .catch(err => {
                dispatch({ type: PRE_EDIT_PROFILE_FAIL });
                log('Error For Edit Profile Prefetch', err);
            })
    }
};

export const updateProfile = () => {
    return (dispatch) => {
        dispatch({ type: EDIT_PROFILE_REQUEST });
        return Api.post('/user/editProfile')
            .then(response => {
                dispatch({ type: EDIT_PROFILE_SUCCESS })
            })
            .catch(err => {
                log('Error updating Profile', err);
                dispatch({ type: EDIT_PROFILE_FAIL });
            })
    }
}