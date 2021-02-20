import { FETCH_VAT_REPORT_REQUEST, FETCH_VAT_REPORT_SUCCESS, FETCH_VAT_REPORT_FAIL, FETCH_NOMINAL_TAX_LIST_REQUEST, FETCH_NOMINAL_TAX_LIST_FAIL, FETCH_NOMINAL_TAX_LIST_SUCCESS, FETCH_NOMINAL_TAX_RETURN_REQUEST, FETCH_NOMINAL_TAX_RETURN_SUCCESS, FETCH_NOMINAL_TAX_RETURN_FAIL, FETCH_AGE_DEBTORS_REQUEST, FETCH_AGE_DEBTORS_SUCCESS, FETCH_AGE_DEBTORS_FAIL, FETCH_AGED_DEBTOR_BREAKDOWN_REQUEST, FETCH_AGED_DEBTOR_BREAKDOWN_SUCCESS, FETCH_AGED_DEBTOR_BREAKDOWN_FAIL, FETCH_AGE_CREDITOR_REQUEST, FETCH_AGE_CREDITOR_SUCCESS, FETCH_AGE_CREDITOR_FAIL, FETCH_AGED_CREDITOR_BREAKDOWN_REQUEST, FETCH_AGED_CREDITOR_BREAKDOWN_SUCCESS, FETCH_AGED_CREDITOR_BREAKDOWN_FAIL, FETCH_BALANCE_SHEET_REQUEST, FETCH_BALANCE_SHEET_FAIL, FETCH_BALANCE_SHEET_SUCCESS, FETCH_TRIAL_BALANCE_REQUEST, FETCH_TRIAL_BALANCE_SUCCESS, FETCH_TRIAL_BALANCE_FAIL } from "../../constants";

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
    taxReturns: [],

    //Age Debtors
    fetchingAgeDebtors: false,
    fetchAgeDebtorsError: undefined,
    ageDebtors: [],

    //Age Creditor
    fetchingAgeCreditor: false,
    fetchAgeCreditorError: undefined,
    ageCreditor: [],

    fetchingAgedDebtorBreakdown: false,
    fetchAgedDebtorBreakdownError: undefined,
    agedDebtorBreakdown: [],

    fetchingAgedCreditorBreakdown: false,
    fetchAgedCreditorBreakdownError: undefined,
    agedCreditorBreakdown: [],

    fetchingBalanceSheet: false,
    fetchBalanceSheetError: undefined,
    balanceSheet: [],

    fetchingTrialBalance: false,
    fetchTrialBalanceError: undefined,
    trialBalance: []
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
        case FETCH_AGE_DEBTORS_REQUEST:
            return {
                ...state,
                fetchingAgeDebtors: true,
                fetchAgeDebtorsError: undefined
            };
        case FETCH_AGE_DEBTORS_SUCCESS:
            return {
                ...state,
                fetchingAgeDebtors: false,
                ageDebtors: action.payload
            };
        case FETCH_AGE_DEBTORS_FAIL:
            return {
                ...state,
                fetchingAgeDebtors: false,
                fetchAgeDebtorsError: action.payload
            };
        case FETCH_AGE_CREDITOR_REQUEST:
            return {
                ...state,
                fetchingAgeCreditor: true,
                fetchAgeCreditorError: undefined
            };
        case FETCH_AGE_CREDITOR_SUCCESS:
            return {
                ...state,
                fetchingAgeCreditor: false,
                ageCreditor: action.payload
            };
        case FETCH_AGE_CREDITOR_FAIL:
            return {
                ...state,
                fetchingAgeCreditor: false,
                fetchAgeCreditorError: action.payload
            };
        case FETCH_AGED_DEBTOR_BREAKDOWN_REQUEST:
            return {
                ...state,
                fetchingAgedDebtorBreakdown: true,
                fetchAgedDebtorBreakdownError: undefined
            };
        case FETCH_AGED_DEBTOR_BREAKDOWN_SUCCESS:
            return {
                ...state,
                fetchingAgedDebtorBreakdown: false,
                agedDebtorBreakdown: action.payload
            };
        case FETCH_AGED_DEBTOR_BREAKDOWN_FAIL:
            return {
                ...state,
                fetchingAgedDebtorBreakdown: false,
                fetchAgedDebtorBreakdownError: action.payload
            };
        case FETCH_AGED_CREDITOR_BREAKDOWN_REQUEST:
            return {
                ...state,
                fetchingAgedCreditorBreakdown: true,
                fetchAgedCreditorBreakdownError: undefined
            };
        case FETCH_AGED_CREDITOR_BREAKDOWN_SUCCESS:
            return {
                ...state,
                fetchingAgedCreditorBreakdown: false,
                agedCreditorBreakdown: action.payload
            };
        case FETCH_AGED_CREDITOR_BREAKDOWN_FAIL:
            return {
                ...state,
                fetchingAgedCreditorBreakdown: false,
                fetchAgedCreditorBreakdownError: action.payload
            };
        case FETCH_BALANCE_SHEET_REQUEST:
            return {
                ...state,
                fetchingBalanceSheet: true,
                fetchBalanceSheetError: undefined
            };
        case FETCH_BALANCE_SHEET_FAIL:
            return {
                ...state,
                fetchingBalanceSheet: false,
                fetchBalanceSheetError: action.payload
            };
        case FETCH_BALANCE_SHEET_SUCCESS:
            return {
                ...state,
                fetchingBalanceSheet: false,
                balanceSheet: action.payload
            };
        case FETCH_TRIAL_BALANCE_REQUEST:
            return {
                ...state,
                fetchingTrialBalance: true,
                fetchTrialBalanceError: undefined
            };
        case FETCH_TRIAL_BALANCE_SUCCESS:
            return {
                ...state,
                fetchingTrialBalance: false,
                trialBalance: action.payload
            };
        case FETCH_TRIAL_BALANCE_FAIL:
            return {
                ...state,
                fetchingTrialBalance: false,
                fetchTrialBalanceError: action.payload
            };
        default:
            return state;
    }
}

export default reportReducer;