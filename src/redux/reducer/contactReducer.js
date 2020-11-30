import {
    CUSTOMER_LIST_REQUEST,
    CUSTOMER_LIST_SUCCESS,
    CUSTOMER_LIST_FAIL,
    SUPPLIER_LIST_REQUEST,
    SUPPLIER_LIST_SUCCESS,
    SUPPLIER_LIST_FAIL,
    UPDATE_CUSTOMER_REQUEST,
    UPDATE_CUSTOMER_SUCCESS,
    UPDATE_CUSTOMER_FAIL,
    UPDATE_SUPPLIER_REQUEST,
    UPDATE_SUPPLIER_SUCCESS,
    UPDATE_SUPPLIER_FAIL
} from "../../constants";

import { API_ERROR_MESSAGE } from '../../constants/appConstant';

const initialState = {
    fetchingCustomerList: false,
    customerListError: undefined,
    customerList: [],

    fetchingSupplierList: false,
    supplierListError: undefined,
    supplierList: [],

    updatingCustomer: false,
    updateCustomerError: undefined,

    updatingSupplier: false,
    updateSupplierError: undefined

};

const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case CUSTOMER_LIST_REQUEST:
            return {
                ...state,
                fetchingCustomerList: true,
                customerListError: undefined
            };
        case CUSTOMER_LIST_SUCCESS:
            return {
                ...state,
                fetchingCustomerList: false,
                customerList: [...action.payload]
            };
        case CUSTOMER_LIST_FAIL:
            return {
                ...state,
                fetchingCustomerList: false,
                customerListError: API_ERROR_MESSAGE
            };
        case SUPPLIER_LIST_REQUEST:
            return {
                ...state,
                fetchingSupplierList: true,
                supplierListError: undefined
            };
        case SUPPLIER_LIST_SUCCESS:
            return {
                ...state,
                fetchingSupplierList: false,
                supplierList: [...action.payload]
            };
        case SUPPLIER_LIST_FAIL:
            return {
                ...state,
                fetchingSupplierList: false,
                supplierListError: API_ERROR_MESSAGE
            };
        case UPDATE_CUSTOMER_REQUEST:
            return {
                ...state,
                updatingCustomer: true,
                updateCustomerError: undefined
            };
        case UPDATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                updatingCustomer: false
            };
        case UPDATE_CUSTOMER_FAIL:
            return {
                ...state,
                updatingCustomer: false,
                updateCustomerError: API_ERROR_MESSAGE
            };
        case UPDATE_SUPPLIER_REQUEST:
            return {
                ...state,
                updatingSupplier: true,
                updateSupplierError: undefined
            };
        case UPDATE_SUPPLIER_SUCCESS:
            return {
                ...state,
                updatingSupplier: false
            };
        case UPDATE_SUPPLIER_FAIL:
            return {
                ...state,
                updatingSupplier: false,
                updateSupplierError: API_ERROR_MESSAGE
            };
        default:
            return state;
    }
};
export default contactReducer;