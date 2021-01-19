
import Api from '../../services/api';
import { log } from '../../components/Logger';

import {
    CUSTOMER_PAYMENT_REQUEST,
    CUSTOMER_PAYMENT_FAIL,
    CUSTOMER_PAYMENT_SUCCESS,
    SUPPLIER_PAYMENT_REQUEST,
    SUPPLIER_PAYMENT_FAIL,
    SUPPLIER_PAYMENT_SUCCESS
} from '../../constants';
import Store from '../Store';

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