import { FETCH_VAT_REPORT_REQUEST, FETCH_VAT_REPORT_SUCCESS, FETCH_VAT_REPORT_FAIL } from "../../constants";

const { State } = require("react-native-gesture-handler")


const initialState = {
    fetchingTaxReport: false,
    fetchTaxReportError: undefined,
    taxReports: []
}
const reportReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_VAT_REPORT_REQUEST:
            return {
                ...state,
                fetchingTaxReport: true,
                fetchTaxReportError: undefined
            };
        case FETCH_VAT_REPORT_SUCCESS:
            return {
                ...state,
                fetchingTaxReport: false,
                taxReports: action.payload
            };
        case FETCH_VAT_REPORT_FAIL:
            return {
                ...state,
                fetchingTaxReport: false,
                fetchTaxReportError: action.payload
            };
        default:
            return state;
    }
}

export default reportReducer;