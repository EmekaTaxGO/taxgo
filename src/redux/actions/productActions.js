
import Api from '../../services/api';
import Store from '../Store';
import { log } from '../../components/Logger';
import { PRODUCT_LIST_SUCCESS, PRODUCT_LIST_REQUEST, PRODUCT_LIST_FAIL, UPDATE_PRODUCT_REQUEST, UPDATE_PRODUCT_FAIL, PRODUCT_BY_ID_REQUEST, PRODUCT_BY_ID_SUCCESS, PRODUCT_BY_ID_FAIL } from '../../constants';

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

export const createProduct = (navigation, body) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });
        const { authData } = Store.getState().auth;
        return Promise.all([
            Api.get(`/product/checkexistingitem/${authData.id}/${body.icode}`),   //Checking Product already exist with same icode
            Api.get(`/product/checkexistingbarcode/${body.barcode}`)              //Check for existing barcode
        ])
            .then(response => {
                //hit api to create product
            })
            .catch(err => {
                log('Error Checking for Product Creation', err);
                dispatch({ type: UPDATE_PRODUCT_FAIL });
            })
    }
}
