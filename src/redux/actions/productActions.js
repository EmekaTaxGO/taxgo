
import Api from '../../services/api';
import Store from '../Store';
import { log } from '../../components/Logger';
import {
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_FAIL,
    PRODUCT_BY_ID_REQUEST,
    PRODUCT_BY_ID_SUCCESS,
    PRODUCT_BY_ID_FAIL,
    PRODUCT_LEDGER_LIST_REQUEST,
    PRODUCT_LEDGER_LIST_SUCCESS,
    PRODUCT_LEDGER_LIST_FAIL,
    UPDATE_PRODUCT_SUCCESS
} from '../../constants';
import { API_ERROR_MESSAGE } from '../../constants/appConstant';

export const getProductList = () => {
    return (dispatch) => {
        dispatch({ type: PRODUCT_LIST_REQUEST });
        const { auth } = Store.getState();
        return Api.get(`/product/getProductList/${auth.authData.id}`)
            .then(response => {
                dispatch({
                    type: PRODUCT_LIST_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                dispatch({ type: PRODUCT_LIST_FAIL });
                log('Error in Product Listing:', err);
            })
    }
}

export const getProductById = (id) => {
    return (dispatch) => {
        dispatch({ type: PRODUCT_BY_ID_REQUEST });
        return Api.get(`/product/getProductById/${id}`)
            .then(response => {
                dispatch({
                    type: PRODUCT_BY_ID_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                log('Error Retriving Product', err);
                dispatch({ type: PRODUCT_BY_ID_FAIL });
            })
    }
}

export const getProductByBarcode = (barcode) => {
    return (dispatch) => {
        return Api.get(`/product/getProductByBarcode/${barcode}`)
            .then(response => {

            })
            .catch(err => {
                log('Error Retriving Product From barcode:', err);
            })
    }
}

export const checkForPreUpdate = (body, onSuccess, onError) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });
        const { authData } = Store.getState().auth;
        const hit = [Api.get(`/product/checkexistingitem/${authData.id}/${body.icode}`)];

        if (body.barcode !== undefined && body.barcode.length > 0) {
            hit.push(Api.get(`/product/checkexistingbarcode/${body.barcode}`));
        }
        return Promise.all(hit)
            .then(results => {
                dispatch({ type: UPDATE_PRODUCT_SUCCESS });
                if (!results[0].data.status) {
                    onError(results[0].data.message);

                } else if (results.length > 1 && !results[1].data.status) {
                    onError(results[1].data.message);
                } else {
                    updateProduct(body, onSuccess, onError)(dispatch);
                }

            })
            .catch(err => {
                log('Error Checking for Product Creation', err);
                dispatch({ type: UPDATE_PRODUCT_FAIL });
                onError(API_ERROR_MESSAGE);
            })
    }
}

export const updateProduct = (body, onSuccess, onError) => {
    return (dispatch) => {
        return Api.post('/product/addUpdateProduct', body)
            .then(response => {
                onSuccess(response.data);
            })
            .catch(err => {
                log('Error Updating Product', err);
                dispatch({ type: UPDATE_PRODUCT_FAIL });
                onError(API_ERROR_MESSAGE);
            })
    }
}

export const getProductLedger = () => {
    return (dispatch) => {
        dispatch({ type: PRODUCT_LEDGER_LIST_REQUEST });
        return Api.get('/default/getDefaultLedgers')
            .then(response => {
                dispatch({
                    type: PRODUCT_LEDGER_LIST_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                log('Error fetching Product Ledgers', err);
                dispatch({ type: PRODUCT_LEDGER_LIST_FAIL });
            })
    }
}
