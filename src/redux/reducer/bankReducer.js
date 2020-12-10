
import {
    BANK_LIST_REQUEST,
    BANK_LIST_FAIL,
    BANK_LIST_SUCCESS,
    BANK_UPDATE_REQUEST,
    BANK_UPDATE_FAIL,
    BANK_UPDATE_SUCCESS,
    API_ERROR_MESSAGE
} from '../../constants';


const initialState = {
    fetchingBankList: false,
    fetchBankListError: undefined,
    bankList: [],

    updatingBankDetail: false
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
                updatingBankDetail: true
            };
        case BANK_UPDATE_SUCCESS:
        case BANK_UPDATE_FAIL:
            return {
                ...state,
                updatingBankDetail: false
            };
        default:
            return state;
    }
};
export default bankReducer;