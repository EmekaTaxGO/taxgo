import {
    DEFAULT_LEDGER_REQUEST,
    DEFAULT_LEDGER_SUCCESS,
    DEFAULT_LEDGER_FAIL,
    SALES_LEDGER_REQUEST,
    SALES_LEDGER_SUCCESS,
    SALES_LEDGER_FAIL,
    PURCHASE_LEDGER_REQUEST,
    PURCHASE_LEDGER_SUCCESS,
    PURCHASE_LEDGER_FAIL,
    MY_LEDGER_REQUEST,
    MY_LEDGER_SUCCESS,
    MY_LEDGER_FAIL,
    UPDATE_LEDGER_REQUEST,
    UPDATE_LEDGER_SUCCESS,
    UPDATE_LEDGER_FAIL,
    LEDGER_CATEGORY_REQUEST,
    LEDGER_CATEGORY_SUCCESS,
    LEDGER_CATEGORY_FAIL
} from "../../constants";
import { API_ERROR_MESSAGE } from '../../constants/appConstant';


const initialState = {
    fetchingDefaultLedger: false,
    fetchDefaultLedgerError: undefined,
    defaultLedgers: [],

    fetchingSaleLedger: false,
    fetchSaleLedgerError: undefined,
    saleLedgers: [],

    fetchingPurchaseLedger: false,
    fetchPurchaseLedgerError: undefined,
    purchaseLedgers: [],

    fetchingMyLedger: false,
    fetchMyLedgerError: undefined,
    myLedgers: [],

    updatingLedger: false,
    updateLedgerError: undefined,

    fetchingLedgerCategory: false,
    fetchLedgerCategoryError: undefined,
    ledgerCategories: []

};
const ledgerReducer = (state = initialState, action) => {
    switch (action.type) {
        case DEFAULT_LEDGER_REQUEST:
            return {
                ...state,
                fetchingDefaultLedger: true,
                fetchDefaultLedgerError: undefined
            };
        case DEFAULT_LEDGER_SUCCESS:
            return {
                ...state,
                fetchingDefaultLedger: false,
                defaultLedgers: [...action.payload]
            };
        case DEFAULT_LEDGER_FAIL:
            return {
                ...state,
                fetchingDefaultLedger: false,
                fetchDefaultLedgerError: API_ERROR_MESSAGE
            };
        case SALES_LEDGER_REQUEST:
            return {
                ...state,
                fetchingSaleLedger: true,
                fetchSaleLedgerError: undefined
            };
        case SALES_LEDGER_SUCCESS:
            return {
                ...state,
                fetchingSaleLedger: false,
                saleLedgers: [...action.payload]
            };
        case SALES_LEDGER_FAIL:
            return {
                ...state,
                fetchingSaleLedger: false,
                fetchSaleLedgerError: API_ERROR_MESSAGE
            };
        case PURCHASE_LEDGER_REQUEST:
            return {
                ...state,
                fetchingPurchaseLedger: true,
                fetchPurchaseLedgerError: undefined
            };
        case PURCHASE_LEDGER_SUCCESS:
            return {
                ...state,
                fetchingPurchaseLedger: false,
                purchaseLedgers: [...action.payload]
            };
        case PURCHASE_LEDGER_FAIL:
            return {
                ...state,
                fetchingPurchaseLedger: false,
                fetchPurchaseLedgerError: API_ERROR_MESSAGE
            };
        case MY_LEDGER_REQUEST:
            return {
                ...state,
                fetchingMyLedger: true,
                fetchMyLedgerError: undefined
            };
        case MY_LEDGER_SUCCESS:
            return {
                ...state,
                fetchingMyLedger: false,
                myLedgers: [...action.payload],
                fetchingMyLedger: false
            };
        case MY_LEDGER_FAIL:
            return {
                ...state,
                fetchingMyLedger: false,
                fetchMyLedgerError: API_ERROR_MESSAGE
            };
        case UPDATE_LEDGER_REQUEST:
            return {
                ...state,
                updatingLedger: true,
                updateLedgerError: undefined
            };
        case UPDATE_LEDGER_SUCCESS:
            return {
                ...state,
                updatingLedger: false
            };
        case UPDATE_LEDGER_FAIL:
            return {
                ...state,
                updatingLedger: false,
                updateLedgerError: API_ERROR_MESSAGE
            };
        case LEDGER_CATEGORY_REQUEST:
            return {
                ...state,
                fetchingLedgerCategory: true,
                fetchLedgerCategoryError: undefined
            };
        case LEDGER_CATEGORY_SUCCESS:
            return {
                ...state,
                fetchingLedgerCategory: false,
                ledgerCategories: [...action.payload]
            };
        case LEDGER_CATEGORY_FAIL:
            return {
                ...state,
                fetchingLedgerCategory: false,
                fetchLedgerCategoryError: API_ERROR_MESSAGE
            };
        default:
            return state;
    }
};
export default ledgerReducer;