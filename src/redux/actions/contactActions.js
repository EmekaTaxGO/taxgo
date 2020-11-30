
import Api from '../../services/api';
import Store from '../Store';
import { CUSTOMER_LIST_REQUEST, CUSTOMER_LIST_SUCCESS, CUSTOMER_LIST_FAIL, SUPPLIER_LIST_REQUEST, SUPPLIER_LIST_SUCCESS, SUPPLIER_LIST_FAIL, UPDATE_CUSTOMER_REQUEST, UPDATE_CUSTOMER_SUCCESS, UPDATE_CUSTOMER_FAIL, UPDATE_SUPPLIER_REQUEST, UPDATE_SUPPLIER_SUCCESS, UPDATE_SUPPLIER_FAIL } from '../../constants';

import { log } from '../../components/Logger';
import { Alert } from 'react-native';

export const getCustomerList = () => {
    return (dispatch) => {
        dispatch({ type: CUSTOMER_LIST_REQUEST });
        const { auth } = Store.getState();
        return Api.get(`/contact/customerList/${auth.authData.id}`)
            .then(response => {
                dispatch({
                    type: CUSTOMER_LIST_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching customer:', err);
                dispatch({ type: CUSTOMER_LIST_FAIL });
            });
    }
}
export const getSupplierList = () => {
    return (dispatch) => {
        dispatch({ type: SUPPLIER_LIST_REQUEST });
        const { auth } = Store.getState();
        return Api.get(`/contact/supplierlist/${auth.authData.id}`)
            .then(response => {
                dispatch({
                    type: SUPPLIER_LIST_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching supplier:', err);
                dispatch({ type: SUPPLIER_LIST_FAIL });
            });
    }
}
export const updateCustomer = (navigation, body, type) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_CUSTOMER_REQUEST });
        return Api.post('contact/addUpdateCustomer', {
            ...body,
            type: type
        })
            .then(response => {
                dispatch({ type: UPDATE_CUSTOMER_SUCCESS });
                Alert.alert('Alert', response.data.message, [
                    {
                        style: 'default',
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack();
                            getCustomerList()(dispatch);
                        }
                    }
                ], { cancelable: false });

            })
            .catch(err => {
                log('Error Updating Customer: ', err);
                dispatch({ type: UPDATE_CUSTOMER_FAIL });
            })
    }
}
export const updateSupplier = (navigation, body, type) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_SUPPLIER_REQUEST });
        return Api.post('contact/addUpdateSupplier', {
            ...body,
            type: type
        })
            .then(response => {
                dispatch({ type: UPDATE_SUPPLIER_SUCCESS });
                Alert.alert('Alert', response.data.message, [
                    {
                        style: 'default',
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack();
                            getSupplierList()(dispatch);
                        }
                    }
                ], { cancelable: false });
            })
            .catch(err => {
                log('Error Updating Supplier: ', err);
                dispatch({ type: UPDATE_SUPPLIER_FAIL });
            })
    }
}