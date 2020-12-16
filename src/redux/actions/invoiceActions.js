
import Api from '../../services/api';
import {
    SALES_INVOICE_LIST_REQUEST,
    SALES_INVOICE_LIST_SUCCESS,
    SALES_INVOICE_LIST_FAIL,
    SALES_CN_LIST_REQUEST,
    SALES_CN_LIST_SUCCESS,
    SALES_CN_LIST_FAIL,
    PURCHASE_INVOICE_LIST_REQUEST,
    PURCHASE_INVOICE_LIST_SUCCESS,
    PURCHASE_INVOICE_LIST_FAIL,
    PURCHASE_CN_LIST_REQUEST,
    PURCHASE_CN_LIST_SUCCESS,
    PURCHASE_CN_LIST_FAIL
} from '../../constants';
import Store from '../Store';
import { log } from '../../components/Logger';

export const getSalesInvoiceList = () => {
    return (dispatch) => {
        dispatch({ type: SALES_INVOICE_LIST_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/sales/salesListByType/${authData.id}/sales`)
            .then(response => {
                dispatch({
                    type: SALES_INVOICE_LIST_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching Invoice..', err);
                dispatch({ type: SALES_INVOICE_LIST_FAIL });
            })
    }
}

export const getSalesCNInvoiceList = () => {
    return (dispatch) => {
        dispatch({ type: SALES_CN_LIST_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/sales/salesListByType/${authData.id}/scredit`)
            .then(response => {
                dispatch({
                    type: SALES_CN_LIST_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching Invoice..', err);
                dispatch({ type: SALES_CN_LIST_FAIL });
            })
    }
}

export const getPurchaseInvoiceList = () => {
    return (dispatch) => {
        dispatch({ type: PURCHASE_INVOICE_LIST_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/purchase/purchaseListByType/${authData.id}/purchase`)
            .then(response => {
                dispatch({
                    type: PURCHASE_INVOICE_LIST_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching Invoice..', err);
                dispatch({ type: PURCHASE_INVOICE_LIST_FAIL });
            })
    }
}

export const getPurchaseCNInvoiceList = () => {
    return (dispatch) => {
        dispatch({ type: PURCHASE_CN_LIST_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/purchase/purchaseListByType/${authData.id}/pcredit`)
            .then(response => {
                dispatch({
                    type: PURCHASE_CN_LIST_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching Invoice..', err);
                dispatch({ type: PURCHASE_CN_LIST_FAIL });
            })
    }
}