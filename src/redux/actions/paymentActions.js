
import Api from '../../services/api';
import { log } from '../../components/Logger';

import {
    CUSTOMER_PAYMENT_REQUEST,
    CUSTOMER_PAYMENT_FAIL,
    CUSTOMER_PAYMENT_SUCCESS,
    SUPPLIER_PAYMENT_REQUEST,
    SUPPLIER_PAYMENT_FAIL,
    SUPPLIER_PAYMENT_SUCCESS,
    SUPPLIER_REFUND_RECEIPT_REQUEST,
    SUPPLIER_REFUND_RECEIPT_SUCCESS,
    SUPPLIER_REFUND_RECEIPT_FAIL
} from '../../constants';
import Store from '../Store';
import { getApiErrorMsg } from '../../helpers/Utils';

export const getCustomerPayment = (customerId = 21) => {
    return (dispatch) => {
        dispatch({ type: CUSTOMER_PAYMENT_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get('https://taxgoglobal.com/newrestapi/Banking/ListCustomerpay', {
            params: {
                id: customerId,
                userid: authData.id
            }
        })
            .then(response => {
                dispatch({
                    type: CUSTOMER_PAYMENT_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                log('Error fetching Customer Payments', err);
                dispatch({ type: CUSTOMER_PAYMENT_FAIL });
            })
    }
}

export const getSupplierPayment = (supplierId = 18) => {
    return (dispatch) => {
        dispatch({ type: SUPPLIER_PAYMENT_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get('https://taxgoglobal.com/newrestapi/Banking/Listsupplierpay', {
            params: {
                id: supplierId,
                userid: authData.id
            }
        })
            .then(response => {
                dispatch({
                    type: SUPPLIER_PAYMENT_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                log('Error fetching Supplier Payments', err);
                dispatch({ type: SUPPLIER_PAYMENT_FAIL });
            })
    }
}

export const getSupplierRefund = (supplierId = 86) => {
    return (dispatch) => {
        dispatch({ type: SUPPLIER_REFUND_RECEIPT_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get('https://taxgoglobal.com/newrestapi/Accounting/Listsupplierrefund', {
            params: {
                id: supplierId,
                userid: authData.id
            }
        })
            .then(response => {
                dispatch({
                    type: SUPPLIER_REFUND_RECEIPT_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                log('Error fetching Supplier Refund', err);
                dispatch({
                    type: SUPPLIER_REFUND_RECEIPT_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }
}