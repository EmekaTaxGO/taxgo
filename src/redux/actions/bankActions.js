import { API_ERROR_MESSAGE } from "../../constants/appConstant"
import Api from '../../services/api';
import { BANK_UPDATE_REQUEST, BANK_LIST_REQUEST, BANK_LIST_SUCCESS, BANK_UPDATE_SUCCESS, BANK_UPDATE_FAIL, BANK_ACTIVITY_REQUEST, BANK_ACTIVITY_FAIL, BANK_RECONCILE_REQUEST, BANK_ACTIVITY_SUCCESS, BANK_RECONCILE_SUCCESS, BANK_RECONCILE_FAIL } from "../../constants";
import Store from "../Store";
import { log } from "../../components/Logger";

export const getBankList = () => {
    return (dispatch) => {
        dispatch({ type: BANK_LIST_REQUEST });
        const userId = Store.getState().auth.authData.id;
        return Api.get(`/ledgerDetails/getBankList/${userId}`)
            .then(response => {
                dispatch({
                    type: BANK_LIST_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching Bank List', err);
            })
    }
}

export const updateBankDetails = (body, onSuccess, onError) => {
    return (dispatch) => {
        dispatch({ type: BANK_UPDATE_REQUEST });
        return Api.post('/ledgerDetails/updateAddBank', body)
            .then(response => {
                dispatch({
                    type: BANK_UPDATE_SUCCESS
                });
                onSuccess(response.data);
            })
            .catch(err => {
                log('Error Updating Bank Details', err);
                dispatch({ type: BANK_UPDATE_FAIL });
                onError(err);
            })
    }
}

export const getBankActivity = (bankId, startDate, endDate) => {
    return (dispatch) => {
        // yyyy-MM-dd
        dispatch({ type: BANK_ACTIVITY_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/bank/listBankActivity/${authData.id}/${bankId}/${startDate}/${endDate}`)
            .then(response => {
                dispatch({
                    type: BANK_ACTIVITY_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                log('Error fetching Bank Activity', err);
                dispatch({ type: BANK_ACTIVITY_FAIL });
            })
    }
}
export const getBankReconcile = (bankId, startDate, endDate) => {
    return (dispatch) => {
        dispatch({ type: BANK_RECONCILE_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/bank/listBankReconcile/${authData.id}/${bankId}/${startDate}/${endDate}`)
            .then(response => {
                dispatch({
                    type: BANK_RECONCILE_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error getting Bank Reconcile', err);
                dispatch({ type: BANK_RECONCILE_FAIL });
            })
    }
}