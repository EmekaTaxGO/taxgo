import { TAX_LIST_REQUEST, TAX_LIST_FAIL, TAX_LIST_SUCCESS } from "../../constants";
import { API_ERROR_MESSAGE } from "../../constants/appConstant";


const initialState = {
    fetchingTaxList: false,
    fetchTaxListError: undefined,
    taxList: [],
    
    productData: undefined,
    salesLedgers: [],
    purchaseLedgers: [],
    suppliers: []
};
const taxListReducer = (state = initialState, action) => {
    switch (action.type) {
        case TAX_LIST_REQUEST:
            return {
                ...state,
                fetchingTaxList: true,
                fetchTaxListError: undefined
            };
        case TAX_LIST_FAIL:
            return {
                ...state,
                fetchingTaxList: false,
                fetchTaxListError: API_ERROR_MESSAGE
            };
        case TAX_LIST_SUCCESS:
            return {
                ...state,
                fetchingTaxList: false,
                taxList: [...action.payload.taxList],
                productData: { ...action.payload.productInfo },
                salesLedgers: action.payload.salesLedgers,
                purchaseLedgers: action.payload.purchaseLedgers,
                suppliers: action.payload.suppliers
            };
        default:
            return state;
    }
};

export default taxListReducer;