import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_FAIL,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_BY_ID_REQUEST,
    PRODUCT_BY_ID_FAIL,
    PRODUCT_BY_ID_SUCCESS,
    PRODUCT_LEDGER_LIST_REQUEST,
    PRODUCT_LEDGER_LIST_FAIL,
    PRODUCT_LEDGER_LIST_SUCCESS,
    UPDATE_SUPPLIER_REQUEST,
    UPDATE_PRODUCT_FAIL,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_REQUEST
} from "../../constants";
import { API_ERROR_MESSAGE } from "../../constants/appConstant";


const initialState = {
    fetchingProductList: false,
    productListError: undefined,
    productList: [],


    fetchingProductInfo: false,
    fetchProductInfoError: undefined,
    productInfo: undefined,

    fetchingProductLedger: false,
    fetchProductLedgerError: undefined,
    productLedgers: [],

    updatingProduct: false
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            return {
                ...state,
                productListError: undefined,
                fetchingProductList: true
            };
        case PRODUCT_LIST_FAIL:
            return {
                ...state,
                productListError: API_ERROR_MESSAGE,
                fetchingProductList: false
            };
        case PRODUCT_LIST_SUCCESS:
            return {
                ...state,
                fetchingProductList: false,
                productList: [...action.payload]
            };
        case PRODUCT_BY_ID_REQUEST:
            return {
                ...state,
                fetchingProductInfo: true,
                fetchProductInfoError: undefined
            };
        case PRODUCT_BY_ID_FAIL:
            return {
                ...state,
                fetchingProductInfo: false,
                fetchProductInfoError: API_ERROR_MESSAGE
            };
        case PRODUCT_BY_ID_SUCCESS:
            return {
                ...state,
                fetchingProductInfo: false,
                productInfo: action.payload
            };
        case PRODUCT_LEDGER_LIST_REQUEST:
            return {
                ...state,
                fetchingProductLedger: true,
                fetchProductLedgerError: undefined
            };
        case PRODUCT_LEDGER_LIST_FAIL:
            return {
                ...state,
                fetchingProductLedger: false,
                fetchProductLedgerError: API_ERROR_MESSAGE
            };
        case PRODUCT_LEDGER_LIST_SUCCESS:
            return {
                ...state,
                fetchingProductLedger: false,
                productLedgers: [...action.payload]
            };
        case UPDATE_PRODUCT_REQUEST:
            return { ...state, updatingProduct: true };
        case UPDATE_PRODUCT_FAIL:
        case UPDATE_PRODUCT_SUCCESS:
            return { ...state, updatingProduct: false };
        default:
            return state;
    }
};
export default productReducer;