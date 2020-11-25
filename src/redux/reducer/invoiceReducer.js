import { SEARCH_QUERY } from "../../constants";

const initialState = {
    salesQuery: '',
    salesList: [],

    purchaseQuery: '',
    purchaseList: []
};
const invoiceReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_QUERY:
            if (action.payload.type === 'sales') {
                return { ...state, salesQuery: action.payload.query };
            } else {
                return { ...state, purchaseQuery: action.payload.query };
            }
        default:
            return state;
    }
};
export default invoiceReducer;