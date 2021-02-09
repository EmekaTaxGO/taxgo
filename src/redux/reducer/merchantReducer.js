import { FETCH_MERCHANT_REQUEST, FETCH_MERCHANT_SUCCESS, FETCH_MERCHANT_FAIL, SAVE_MERCHANT_REQUEST, SAVE_MERCHANT_SUCCESS, SAVE_MERCHANT_FAIL } from "../../constants";


const initialState = {
    fetchingMerchant: false,
    fetchMerchantError: undefined,
    merchants: [],

    savingMerchant: false,
    saveMerchantError: undefined,
    merchantSaved: undefined
}

const merchantReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MERCHANT_REQUEST:
            return {
                ...state,
                fetchingMerchant: true,
                fetchMerchantError: undefined
            };
        case FETCH_MERCHANT_SUCCESS:
            return {
                ...state,
                fetchingMerchant: false,
                merchants: action.payload
            };
        case FETCH_MERCHANT_FAIL:
            return {
                ...state,
                fetchingMerchant: false,
                fetchMerchantError: action.payload
            };
        case SAVE_MERCHANT_REQUEST:
            return {
                ...state,
                savingMerchant: true,
                saveMerchantError: undefined
            };
        case SAVE_MERCHANT_SUCCESS:
            return {
                ...state,
                savingMerchant: false,
                merchantSaved: action.payload
            };
        case SAVE_MERCHANT_FAIL:
            return {
                ...state,
                savingMerchant: false,
                saveMerchantError: action.payload
            }
        default:
            return state;
    }

}
export default merchantReducer;