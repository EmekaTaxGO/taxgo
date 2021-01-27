
import {
    BANK_LIST_REQUEST,
    BANK_LIST_FAIL,
    BANK_LIST_SUCCESS,
    BANK_UPDATE_REQUEST,
    BANK_UPDATE_FAIL,
    BANK_UPDATE_SUCCESS,
    BANK_ACTIVITY_REQUEST,
    BANK_ACTIVITY_FAIL,
    BANK_ACTIVITY_SUCCESS,
    BANK_RECONCILE_REQUEST,
    BANK_RECONCILE_SUCCESS,
    BANK_RECONCILE_FAIL
} from '../../constants';
import { API_ERROR_MESSAGE } from '../../constants/appConstant';


const initialState = {
    fetchingBankList: false,
    fetchBankListError: undefined,
    bankList: [],

    updatingBankDetail: false,
    updateBankDetailError: undefined,
    updateBankData: undefined,

    fetchingBankActivity: false,
    fetchBankActivityError: undefined,
    bankActivities: [],

    fetchingBankReconcile: false,
    fetchBankReconcileError: undefined,
    bankReconciles: []
};

const bankReducer = (state = initialState, action) => {
    switch (action.type) {
        case BANK_LIST_REQUEST:
            return {
                ...state,
                fetchingBankList: true,
                fetchBankListError: undefined
            };
        case BANK_LIST_FAIL:
            return {
                ...state,
                fetchingBankList: false,
                fetchingBankList: API_ERROR_MESSAGE
            };
        case BANK_LIST_SUCCESS:
            return {
                ...state,
                fetchingBankList: false,
                bankList: [...action.payload]
            };
        case BANK_UPDATE_REQUEST:
            return {
                ...state,
                updatingBankDetail: true,
                updateBankDetailError: undefined
            };
        case BANK_UPDATE_SUCCESS:
            return {
                ...state,
                updatingBankDetail: false,
                updateBankData: action.payload
            };
        case BANK_UPDATE_FAIL:
            return {
                ...state,
                updatingBankDetail: false,
                updateBankDetailError: action.payload
            };
        case BANK_ACTIVITY_REQUEST:
            return {
                ...state,
                fetchingBankActivity: true,
                fetchBankActivityError: undefined
            };
        case BANK_ACTIVITY_SUCCESS:
            return {
                ...state,
                fetchingBankActivity: false,
                bankActivities: [...action.payload]
            };
        case BANK_ACTIVITY_FAIL:
            return {
                ...state,
                fetchingBankActivity: false,
                fetchBankActivityError: API_ERROR_MESSAGE
            };
        case BANK_RECONCILE_REQUEST:
            return {
                ...state,
                fetchingBankReconcile: true,
                fetchBankReconcileError: undefined
            };
        case BANK_RECONCILE_SUCCESS:
            return {
                ...state,
                fetchingBankReconcile: false,
                bankReconciles: [...action.payload]
            };
        case BANK_RECONCILE_FAIL:
            return {
                ...state,
                fetchingBankReconcile: false,
                fetchBankReconcileError: API_ERROR_MESSAGE
            };
        default:
            return state;
    }
};
export default bankReducer;