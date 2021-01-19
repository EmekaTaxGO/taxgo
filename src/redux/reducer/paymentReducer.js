import {
    CUSTOMER_PAYMENT_REQUEST,
    CUSTOMER_PAYMENT_FAIL,
    CUSTOMER_PAYMENT_SUCCESS,
    SUPPLIER_PAYMENT_REQUEST,
    SUPPLIER_PAYMENT_FAIL,
    SUPPLIER_PAYMENT_SUCCESS
} from '../../constants'
import { API_ERROR_MESSAGE } from '../../constants/appConstant';

const initialState = {
    fetchingCustomerPayment: false,
    fetchCustomerPaymentError: undefined,
    customerPayments: [],

    fetchingSupplierPayment: false,
    fetchSupplierPaymentError: undefined,
    supplierPayments: []
}

const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
        case CUSTOMER_PAYMENT_REQUEST:
            return {
                ...state,
                fetchingCustomerPayment: true,
                fetchCustomerPaymentError: undefined
            };
        case CUSTOMER_PAYMENT_SUCCESS:
            return {
                ...state,
                fetchingCustomerPayment: false,
                customerPayments: [...action.payload]
            };
        case CUSTOMER_PAYMENT_FAIL:
            return {
                ...state,
                fetchingCustomerPayment: false,
                fetchCustomerPaymentError: API_ERROR_MESSAGE
            };


        case SUPPLIER_PAYMENT_REQUEST:
            return {
                ...state,
                fetchingSupplierPayment: true,
                fetchSupplierPaymentError: undefined
            };
        case SUPPLIER_PAYMENT_SUCCESS:
            return {
                ...state,
                fetchingSupplierPayment: false,
                supplierPayments: [...action.payload]
            };
        case SUPPLIER_PAYMENT_FAIL:
            return {
                ...state,
                fetchingSupplierPayment: false,
                fetchSupplierPaymentError: API_ERROR_MESSAGE
            };
        default:
            return state;
    }
}
export default paymentReducer;