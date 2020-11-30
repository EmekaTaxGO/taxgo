import { PRODUCT_LIST_REQUEST, PRODUCT_LIST_FAIL, PRODUCT_LIST_SUCCESS } from "../../constants";
import { API_ERROR_MESSAGE } from "../../constants/appConstant";


const initialState = {
    fetchingProductList: false,
    productListError: undefined,
    productList: []
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
        default:
            return state;
    }
};
export default productReducer;