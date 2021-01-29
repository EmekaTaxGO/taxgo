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
} from '../../constants'
import { API_ERROR_MESSAGE } from '../../constants/appConstant';

const initialState = {
    //List Apis for Bank
    fetchingCustomerPayment: false,
    fetchCustomerPaymentError: undefined,
    customerPayments: [],

    fetchingSupplierRefund: false,
    fetchSupplierRefundError: undefined,
    supplierRefunds: [],

    fetchingSupplierPayment: false,
    fetchSupplierPaymentError: undefined,
    supplierPayments: [],

    fetchingCustomerRefund: false,
    fetchCustomerRefundError: undefined,
    customerRefunds: [],

    //Bank Receipt
    savingCustomerReceipt: false,
    saveCustomerReceiptError: undefined,

    savingOtherReceipt: false,
    saveOtherReceiptError: undefined,

    savingSupplierRefund: false,
    saveSupplierRefundError: undefined,

    savingSupplierPayment: false,
    saveSupplierPaymentError: undefined,
    supplierPaymentSaved: undefined,

    savingOtherPayment: false,
    saveOtherPaymentError: undefined,

    savingCustomerRefund: false,
    saveCustomerRefundError: undefined
}

const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
        case CUSTOMER_RECEIPT_LIST_REQUEST:
            return {
                ...state,
                fetchingCustomerPayment: true,
                fetchCustomerPaymentError: undefined
            };
        case CUSTOMER_RECEIPT_LIST_SUCCESS:
            return {
                ...state,
                fetchingCustomerPayment: false,
                customerPayments: [...action.payload]
            };
        case CUSTOMER_RECEIPT_LIST_FAIL:
            return {
                ...state,
                fetchingCustomerPayment: false,
                fetchCustomerPaymentError: API_ERROR_MESSAGE
            };
        case SUPPLIER_PAYMENT_RECEIPT_REQUEST:
            return {
                ...state,
                fetchingSupplierPayment: true,
                fetchSupplierPaymentError: undefined
            };
        case SUPPLIER_PAYMENT_RECEIPT_SUCCESS:
            return {
                ...state,
                fetchingSupplierPayment: false,
                supplierPayments: [...action.payload]
            };
        case SUPPLIER_PAYMENT_RECEIPT_FAIL:
            return {
                ...state,
                fetchingSupplierPayment: false,
                fetchSupplierPaymentError: API_ERROR_MESSAGE
            };
        case CUSTOMER_REFUND_LIST_REQUEST:
            return {
                ...state,
                fetchingCustomerRefund: true,
                fetchCustomerRefundError: undefined
            };
        case CUSTOMER_REFUND_LIST_SUCCESS:
            return {
                ...state,
                fetchingCustomerRefund: false,
                customerRefunds: [...action.payload]
            };
        case CUSTOMER_REFUND_LIST_FAIL:
            return {
                ...state,
                fetchingCustomerRefund: false,
                fetchCustomerRefundError: API_ERROR_MESSAGE
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
        case SAVE_CUSTOMER_RECEIPT_REQUEST:
            return {
                ...state,
                savingCustomerReceipt: true,
                saveCustomerReceiptError: undefined
            };
        case SAVE_CUSTOMER_RECEIPT_SUCCESS:
            return {
                ...state,
                savingCustomerReceipt: false
            };
        case SAVE_CUSTOMER_RECEIPT_FAIL:
            return {
                ...state,
                saveCustomerReceiptError: action.payload,
                savingCustomerReceipt: false
            };
        case SAVE_OTHER_RECEIPT_REQUEST:
            return {
                ...state,
                savingOtherReceipt: true,
                saveOtherReceiptError: undefined
            };
        case SAVE_OTHER_RECEIPT_SUCCESS:
            return {
                ...state,
                savingOtherReceipt: false
            };
        case SAVE_OTHER_RECEIPT_FAIL:
            return {
                ...state,
                savingOtherReceipt: false,
                saveOtherReceiptError: action.payload
            };
        case SAVE_SUPPLIER_REFUND_REQUEST:
            return {
                ...state,
                savingSupplierRefund: true,
                saveSupplierRefundError: undefined
            };
        case SAVE_SUPPLIER_REFUND_SUCCESS:
            return {
                ...state,
                savingSupplierRefund: false
            };
        case SAVE_SUPPLIER_REFUND_FAIL:
            return {
                ...state,
                savingSupplierRefund: false,
                saveSupplierRefundError: action.payload
            };
        case SAVE_SUPPLIER_PAYMENT_REQUEST:
            return {
                ...state,
                savingSupplierPayment: true,
                saveSupplierPaymentError: undefined
            };
        case SAVE_SUPPLIER_PAYMENT_SUCCESS:
            return {
                ...state,
                savingSupplierPayment: false,
                supplierPaymentSaved: action.payload
            };
        case SAVE_SUPPLIER_PAYMENT_FAIL:
            return {
                ...state,
                savingSupplierPayment: false,
                saveSupplierPaymentError: action.payload
            };
        case SAVE_OTHER_PAYMENT_REQUEST:
            return {
                ...state,
                savingOtherPayment: true,
                saveOtherPaymentError: undefined
            };
        case SAVE_OTHER_PAYMENT_SUCCESS:
            return {
                ...state,
                savingOtherPayment: false
            };
        case SAVE_OTHER_PAYMENT_FAIL:
            return {
                ...state,
                savingOtherPayment: false,
                saveOtherPaymentError: action.payload
            };
        case SAVE_CUSTOMER_REFUND_REQUEST:
            return {
                ...state,
                savingCustomerRefund: true,
                saveCustomerRefundError: undefined
            };
        case SAVE_CUSTOMER_REFUND_SUCCESS:
            return {
                ...state,
                savingCustomerRefund: false
            };
        case SAVE_CUSTOMER_REFUND_FAIL:
            return {
                ...state,
                savingCustomerRefund: false,
                saveCustomerRefundError: action.payload
            };
        default:
            return state;
    }
}
export default paymentReducer;