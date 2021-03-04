import { SEARCH_QUERY, SALES_INVOICE_LIST_REQUEST, SALES_INVOICE_LIST_SUCCESS, SALES_INVOICE_LIST_FAIL, SALES_CN_LIST_REQUEST, SALES_CN_LIST_SUCCESS, SALES_CN_LIST_FAIL, PURCHASE_INVOICE_LIST_REQUEST, PURCHASE_INVOICE_LIST_SUCCESS, PURCHASE_INVOICE_LIST_FAIL, PURCHASE_CN_LIST_REQUEST, PURCHASE_CN_LIST_SUCCESS, PURCHASE_CN_LIST_FAIL, FETCH_SALES_INVOICE_REQUEST, FETCH_SALES_INVOICE_FAIL, FETCH_SALES_INVOICE_SUCCESS } from "../../constants";
import { API_ERROR_MESSAGE } from "../../constants/appConstant";

const initialState = {

    //For Sales
    fetchingSalesInvoice: false,
    salesInvoiceList: [],
    fetchSalesInvoiceError: undefined,

    fetchingSalesCNInvoice: false,
    salesCNInvoiceList: [],
    fetchSalesCNInvoiceError: undefined,

    //For Purchase
    fetchingPurchaseInvoice: false,
    purchaseInvoiceList: [],
    fetchPurchaseInvoiceError: undefined,

    fetchingPurchaseCNInvoice: false,
    purchaseCNInvoiceList: [],
    fetchPurchaseCNInvoiceError: undefined,


    fetchingSalesInvoiceDetail: false,
    salesInvoiceDetail: undefined,
    fetchSalesInvoiceDetailError: undefined,
};
const invoiceReducer = (state = initialState, action) => {
    switch (action.type) {
        case SALES_INVOICE_LIST_REQUEST:
            return {
                ...state,
                fetchingSalesInvoice: true,
                fetchSalesInvoiceError: undefined
            };
        case SALES_INVOICE_LIST_SUCCESS:
            return {
                ...state,
                fetchingSalesInvoice: false,
                salesInvoiceList: [...action.payload]
            };
        case SALES_INVOICE_LIST_FAIL:
            return {
                ...state,
                fetchingSalesInvoice: false,
                fetchSalesInvoiceError: API_ERROR_MESSAGE
            };
        case SALES_CN_LIST_REQUEST:
            return {
                ...state,
                fetchingSalesCNInvoice: true,
                fetchSalesCNInvoiceError: undefined
            };
        case SALES_CN_LIST_SUCCESS:
            return {
                ...state,
                fetchingSalesCNInvoice: false,
                salesCNInvoiceList: [...action.payload]
            };
        case SALES_CN_LIST_FAIL:
            return {
                ...state,
                fetchingSalesCNInvoice: false,
                fetchSalesCNInvoiceError: API_ERROR_MESSAGE
            };




        case PURCHASE_INVOICE_LIST_REQUEST:
            return {
                ...state,
                fetchingPurchaseInvoice: true,
                fetchPurchaseInvoiceError: undefined
            };
        case PURCHASE_INVOICE_LIST_SUCCESS:
            return {
                ...state,
                fetchingPurchaseInvoice: false,
                purchaseInvoiceList: [...action.payload]
            };
        case PURCHASE_INVOICE_LIST_FAIL:
            return {
                ...state,
                fetchingPurchaseInvoice: false,
                fetchPurchaseInvoiceError: API_ERROR_MESSAGE
            };
        case PURCHASE_CN_LIST_REQUEST:
            return {
                ...state,
                fetchingPurchaseCNInvoice: true,
                fetchPurchaseCNInvoiceError: undefined
            };
        case PURCHASE_CN_LIST_SUCCESS:
            return {
                ...state,
                fetchingPurchaseCNInvoice: false,
                purchaseCNInvoiceList: [...action.payload]
            };
        case PURCHASE_CN_LIST_FAIL:
            return {
                ...state,
                fetchingPurchaseCNInvoice: false,
                fetchPurchaseCNInvoiceError: API_ERROR_MESSAGE
            };
        case FETCH_SALES_INVOICE_REQUEST:
            return {
                ...state,
                fetchingSalesInvoiceDetail: true,
                fetchSalesInvoiceDetailError: undefined
            };
        case FETCH_SALES_INVOICE_FAIL:
            return {
                ...state,
                fetchingSalesInvoiceDetail: false,
                fetchSalesInvoiceDetailError: action.payload
            };
        case FETCH_SALES_INVOICE_SUCCESS:
            return {
                ...state,
                fetchingSalesInvoiceDetail: false,
                salesInvoiceDetail: action.payload
            };
        default:
            return state;
    }
};
export default invoiceReducer;