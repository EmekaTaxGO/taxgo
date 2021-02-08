import { FETCH_VAT_REPORT_REQUEST, FETCH_VAT_REPORT_SUCCESS, FETCH_VAT_REPORT_FAIL, FETCH_NOMINAL_TAX_LIST_REQUEST, FETCH_NOMINAL_TAX_LIST_FAIL, FETCH_NOMINAL_TAX_LIST_SUCCESS, FETCH_NOMINAL_TAX_RETURN_REQUEST, FETCH_NOMINAL_TAX_RETURN_SUCCESS, FETCH_NOMINAL_TAX_RETURN_FAIL } from "../../constants";

const { State } = require("react-native-gesture-handler")


const initialState = {
    fetchingTaxReport: false,
    fetchTaxReportError: undefined,
    taxReports: [],

    fetchingNominalTaxList: false,
    fetchNominalTaxListError: undefined,
    nominalTaxList: [],

    fetchingTaxReturn: false,
    fetchTaxReturnError: undefined,
    taxReturns: []
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
        case FETCH_NOMINAL_TAX_LIST_REQUEST:
            return {
                ...state,
                fetchingNominalTaxList: true,
                fetchNominalTaxListError: undefined
            };
        case FETCH_NOMINAL_TAX_LIST_FAIL:
            return {
                ...state,
                fetchingNominalTaxList: false,
                fetchNominalTaxListError: action.payload
            };
        case FETCH_NOMINAL_TAX_LIST_SUCCESS:
            return {
                ...state,
                fetchingNominalTaxList: false,
                nominalTaxList: action.payload
            };
        case FETCH_NOMINAL_TAX_RETURN_REQUEST:
            return {
                ...state,
                fetchingTaxReturn: true,
                fetchTaxReturnError: undefined
            };
        case FETCH_NOMINAL_TAX_RETURN_SUCCESS:
            return {
                ...state,
                fetchingTaxReturn: false,
                taxReturns: action.payload
            };
        case FETCH_NOMINAL_TAX_RETURN_FAIL:
            return {
                ...state,
                fetchingTaxReturn: false,
                fetchTaxReturnError: action.payload
            };
        default:
            return state;
    }
}

export default reportReducer;