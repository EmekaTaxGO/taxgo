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
} from '../../constants'
import { API_ERROR_MESSAGE } from '../../constants/appConstant';

const initialState = {
    fetchingCustomerPayment: false,
    fetchCustomerPaymentError: undefined,
    customerPayments: [],

    fetchingSupplierPayment: false,
    fetchSupplierPaymentError: undefined,
    supplierPayments: [],

    fetchingSupplierRefund: true,
    fetchSupplierRefundError: undefined,
    supplierRefunds: []
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
        case SUPPLIER_REFUND_RECEIPT_REQUEST:
            return {
                ...state,
                fetchingSupplierRefund: true,
                fetchSupplierRefundError: undefined
            };
        case SUPPLIER_REFUND_RECEIPT_SUCCESS:
            return {
                ...state,
                fetchingSupplierRefund: false,
                supplierRefunds: [...action.payload]
            };
        case SUPPLIER_REFUND_RECEIPT_FAIL:
            return {
                ...state,
                fetchingSupplierRefund: false,
                fetchSupplierRefundError: action.payload
            };
        default:
            return state;
    }
}
export default paymentReducer;