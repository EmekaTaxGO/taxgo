import { SEARCH_QUERY } from "../../constants";

const initialState = {
    salesQuery: '',
    salesList: [],

    purchaseQuery: '',
    purchaseList: []
};
const invoiceReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};
export default invoiceReducer;