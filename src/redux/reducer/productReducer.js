import { PRODUCT_LIST_REQUEST, PRODUCT_LIST_FAIL, PRODUCT_LIST_SUCCESS, PRODUCT_BY_ID_REQUEST, PRODUCT_BY_ID_FAIL, PRODUCT_BY_ID_SUCCESS } from "../../constants";
import { API_ERROR_MESSAGE } from "../../constants/appConstant";


const initialState = {
    fetchingProductList: false,
    productListError: undefined,
    productList: [],


    fetchingProductInfo: false,
    fetchProductInfoError: undefined,
    productInfo: undefined
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
        default:
            return state;
    }
};
export default productReducer;