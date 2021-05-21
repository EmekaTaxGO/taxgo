
import Api from '../../services/api';
import { log } from '../../components/Logger';

import {
    CUSTOMER_RECEIPT_LIST_REQUEST,
    CUSTOMER_RECEIPT_LIST_FAIL,
    CUSTOMER_RECEIPT_LIST_SUCCESS,
    SUPPLIER_PAYMENT_RECEIPT_REQUEST,
    SUPPLIER_PAYMENT_RECEIPT_FAIL,
    SUPPLIER_PAYMENT_RECEIPT_SUCCESS,
    SUPPLIER_REFUND_RECEIPT_REQUEST,
    SUPPLIER_REFUND_RECEIPT_SUCCESS,
    SUPPLIER_REFUND_RECEIPT_FAIL,
    SAVE_CUSTOMER_RECEIPT_REQUEST,
    SAVE_CUSTOMER_RECEIPT_SUCCESS,
    SAVE_CUSTOMER_RECEIPT_FAIL,
    SAVE_OTHER_RECEIPT_REQUEST,
    SAVE_OTHER_RECEIPT_SUCCESS,
    SAVE_OTHER_RECEIPT_FAIL,
    SAVE_SUPPLIER_REFUND_REQUEST,
    SAVE_SUPPLIER_REFUND_SUCCESS,
    SAVE_SUPPLIER_REFUND_FAIL,
    SAVE_SUPPLIER_PAYMENT_REQUEST,
    SAVE_SUPPLIER_PAYMENT_SUCCESS,
    SAVE_SUPPLIER_PAYMENT_FAIL,
    SAVE_OTHER_PAYMENT_REQUEST,
    SAVE_OTHER_PAYMENT_SUCCESS,
    SAVE_OTHER_PAYMENT_FAIL,
    SAVE_CUSTOMER_REFUND_REQUEST,
    SAVE_CUSTOMER_REFUND_SUCCESS,
    SAVE_CUSTOMER_REFUND_FAIL,
    CUSTOMER_REFUND_LIST_REQUEST,
    CUSTOMER_REFUND_LIST_SUCCESS,
    CUSTOMER_REFUND_LIST_FAIL
} from '../../constants';
import Store from '../Store';
import { getApiErrorMsg } from '../../helpers/Utils';

export const getCustomerPayment = (customerId = 21) => {
    return (dispatch) => {
        dispatch({ type: CUSTOMER_RECEIPT_LIST_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/bank/listCustomerPay/${customerId}/${authData.id}`)
            .then(async (response) => {
                const receipts = await sanetizeReceipts(response.data.data)
                dispatch({
                    type: CUSTOMER_RECEIPT_LIST_SUCCESS,
                    payload: receipts
                })
            })
            .catch(err => {
                log('Error fetching Customer Payments', err);
                dispatch({ type: CUSTOMER_RECEIPT_LIST_FAIL });
            })
    }
}


export const getSupplierRefund = (supplierId = 86) => {
    return (dispatch) => {
        dispatch({ type: SUPPLIER_REFUND_RECEIPT_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/bank/listSupplierRefund/${supplierId}/${authData.id}`)
            .then(async (response) => {
                const receipts = await sanetizeReceipts(response.data.data)
                dispatch({
                    type: SUPPLIER_REFUND_RECEIPT_SUCCESS,
                    payload: receipts
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

export const getSupplierPayment = (supplierId = 18) => {
    return (dispatch) => {
        dispatch({ type: SUPPLIER_PAYMENT_RECEIPT_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/bank/listSupplierPay/${supplierId}/${authData.id}`)
            .then(async (response) => {

                const receipts = await sanetizeReceipts(response.data.data)
                dispatch({
                    type: SUPPLIER_PAYMENT_RECEIPT_SUCCESS,
                    payload: receipts
                })
            })
            .catch(err => {
                log('Error fetching Supplier Payments', err);
                dispatch({ type: SUPPLIER_PAYMENT_RECEIPT_FAIL });
            })
    }
}

const sanetizeReceipts = receipts => {
    return new Promise(resolve => {
        const newReceipts = receipts.map(value => {
            return {
                ...value,
                amountpaid: 0,
                outstanding: value.rout
            }
        })
        resolve(newReceipts)
    })
}

export const getCustomerRefund = (supplierId = 18) => {
    return (dispatch) => {
        dispatch({ type: CUSTOMER_REFUND_LIST_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/bank/listCustomerRefund/${2}/${authData.id}`)
            .then(async (response) => {
                const receipts = await sanetizeReceipts(response.data.data)
                dispatch({
                    type: CUSTOMER_REFUND_LIST_SUCCESS,
                    payload: receipts
                })
            })
            .catch(err => {
                log('Error fetching Customer Refund', err);
                dispatch({ type: CUSTOMER_REFUND_LIST_FAIL });
            })
    }
}


//Update Apis
export const saveCustomerReceipt = body => {
    return (dispatch) => {
        dispatch({ type: SAVE_CUSTOMER_RECEIPT_REQUEST });
        return Api.post('//TO-DO', body)
            .then(response => {
                dispatch({
                    type: SAVE_CUSTOMER_RECEIPT_SUCCESS,
                    payload: response.data
                })
            })
            .catch(err => {
                log('Error saving customer receipt', err);
                dispatch({
                    type: SAVE_CUSTOMER_RECEIPT_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }
}

export const saveOtherReceipt = body => {
    return (dispatch) => {
        dispatch({ type: SAVE_OTHER_RECEIPT_REQUEST });
        return Api.post('//TO-DO', body)
            .then(response => {
                dispatch({
                    type: SAVE_OTHER_RECEIPT_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                log('Error saving other receipt', err);
                dispatch({
                    type: SAVE_OTHER_RECEIPT_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }
}

export const saveSupplierRefund = body => {
    return (dispatch) => {
        dispatch({ type: SAVE_SUPPLIER_REFUND_REQUEST });
        return Api.post('//TO-DO', body)
            .then(response => {
                dispatch({
                    type: SAVE_SUPPLIER_REFUND_SUCCESS,
                    payload: response.data
                })
            })
            .catch(err => {
                log('Error saving supplier refund', err);
                dispatch({
                    type: SAVE_SUPPLIER_REFUND_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }
}

export const saveSupplierPayment = body => {
    return (dispatch) => {
        dispatch({ type: SAVE_SUPPLIER_PAYMENT_REQUEST });
        return Api.post('/receipt/addSuppReceipt', body)
            .then(response => {
                dispatch({
                    type: SAVE_SUPPLIER_PAYMENT_SUCCESS,
                    payload: response.data
                })
            })
            .catch(err => {
                log('Error saving supplier payment', err);
                dispatch({
                    type: SAVE_SUPPLIER_PAYMENT_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }
}

// TO-DO (not used yet)
export const saveOtherPayment = body => {
    return (dispatch) => {
        dispatch({ type: SAVE_OTHER_PAYMENT_REQUEST });
        return Api.post('/receipt/addSupOtherReceipt', body)
            .then(response => {
                dispatch({
                    type: SAVE_OTHER_PAYMENT_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                log('Error saving other payment', err);
                dispatch({
                    type: SAVE_OTHER_PAYMENT_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }
}

export const saveCustomerRefund = body => {
    return (dispatch) => {
        dispatch({ type: SAVE_CUSTOMER_REFUND_REQUEST });
        return Api.post('/receipt/addCustRefund', body)
            .then(response => {
                dispatch({
                    type: SAVE_CUSTOMER_REFUND_SUCCESS,
                    payload: response.data
                })
            })
            .catch(err => {
                log('Error saving customer refund', err);
                dispatch({
                    type: SAVE_CUSTOMER_REFUND_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }
}