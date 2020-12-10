
import Api from '../../services/api';
import {
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL
} from '../../constants';
import { log } from '../../components/Logger';

export const getUserList = () => {
    return (dispatch) => {
        dispatch({ type: USER_LIST_REQUEST });
        return Api.get('/user')
            .then(response => {
                dispatch({
                    type: USER_LIST_SUCCESS,
                    payload: response.data
                });
            })
            .catch(err => {
                log('Error Fetching User List', err);
                dispatch({ type: USER_LIST_FAIL });
            });
    }
}

export const updateUser = () => {
    return (dispatch) => {
        dispatch({ type: UPDATE_USER_REQUEST });
        return Api.post('/updateUser')
            .then(response => {
                dispatch({
                    type: UPDATE_USER_SUCCESS,
                    payload: response.data
                });
            })
            .catch(err => {
                log('Error Fetching User List', err);
                dispatch({ type: UPDATE_USER_FAIL });
            });
    }
} 