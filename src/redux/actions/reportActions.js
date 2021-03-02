import Api from '../../services/api';
import {
    FETCH_VAT_REPORT_REQUEST,
    FETCH_VAT_REPORT_SUCCESS,
    FETCH_VAT_REPORT_FAIL,
    FETCH_NOMINAL_TAX_LIST_REQUEST,
    FETCH_NOMINAL_TAX_LIST_SUCCESS,
    FETCH_NOMINAL_TAX_LIST_FAIL,
    FETCH_NOMINAL_TAX_RETURN_REQUEST,
    FETCH_NOMINAL_TAX_RETURN_SUCCESS,
    FETCH_NOMINAL_TAX_RETURN_FAIL,
    FETCH_AGE_DEBTORS_REQUEST,
    FETCH_AGE_DEBTORS_SUCCESS,
    FETCH_AGE_DEBTORS_FAIL,
    FETCH_AGED_DEBTOR_BREAKDOWN_REQUEST,
    FETCH_AGED_DEBTOR_BREAKDOWN_SUCCESS,
    FETCH_AGED_DEBTOR_BREAKDOWN_FAIL,
    FETCH_AGE_CREDITOR_REQUEST,
    FETCH_AGE_CREDITOR_SUCCESS,
    FETCH_AGE_CREDITOR_FAIL,
    FETCH_AGED_CREDITOR_BREAKDOWN_REQUEST,
    FETCH_AGED_CREDITOR_BREAKDOWN_SUCCESS,
    FETCH_AGED_CREDITOR_BREAKDOWN_FAIL,
    FETCH_BALANCE_SHEET_SUCCESS,
    FETCH_BALANCE_SHEET_REQUEST,
    FETCH_BALANCE_SHEET_FAIL,
    FETCH_TRIAL_BALANCE_REQUEST,
    FETCH_TRIAL_BALANCE_SUCCESS,
    FETCH_TRIAL_BALANCE_FAIL,
    FETCH_PROFIT_LOSS_REPORT_REQUEST,
    FETCH_PROFIT_LOSS_REPORT_SUCCESS,
    FETCH_PROFIT_LOSS_REPORT_FAIL
} from '../../constants';
import { log } from '../../components/Logger';
import { getApiErrorMsg, toFloat, isEmpty } from '../../helpers/Utils';
import Store from '../Store';
import BalanceSheetHelper from '../../helpers/BalanceSheetHelper';
import { get } from 'lodash';
import {
    BALANCE_SHEET,
    saveToLocal,
    PROFIT_LOSS_REPORT,
    getSavedData,
    TRIAL_BALANCE_REPORT,
    TAX_RETURN_REPORT,
    AGE_DEBTOR_REPORT,
    AGE_CREDITOR_REPORT,
    AGE_DEBTOR_BREAKDOWN,
    AGE_CREDITOR_BREAKDOWN
} from '../../services/UserStorage';

export const fetchVatReport = (startDate, endDate) => {
    return (dispatch) => {
        dispatch({ type: FETCH_VAT_REPORT_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get(`/report/overallVatReport/${authData.id}/${startDate}/${endDate}`)
            .then(async (response) => {
                const reports = await sanetizeVatReport(response.data.data);
                await saveToLocal(TAX_RETURN_REPORT, reports);
                dispatch({
                    type: FETCH_VAT_REPORT_SUCCESS,
                    payload: reports
                })
            })
            .catch(err => {
                log('Error fetching tax Report', err);
                dispatch({
                    type: FETCH_VAT_REPORT_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}

export const fetchTaxNominalList = (id, startDate, endDate) => {
    return (dispatch) => {
        dispatch({ type: FETCH_NOMINAL_TAX_LIST_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get(`/report/getVatNominalList/${authData.id}/${id}/${startDate}/${endDate}`)
            .then(response => {
                dispatch({
                    type: FETCH_NOMINAL_TAX_LIST_SUCCESS,
                    payload: response.data.data.vatlist
                })
            })
            .catch(err => {
                log('Error fetching nominal tax list', err);
                dispatch({
                    type: FETCH_NOMINAL_TAX_LIST_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}
export const fetchNominalTaxReturn = (id, ledger, startDate, endDate) => {
    return (dispatch) => {
        dispatch({ type: FETCH_NOMINAL_TAX_RETURN_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get(`/report/getNominalVat/${authData.id}/${id}/${ledger}/${startDate}/${endDate}`)
            .then(response => {
                const payload = response.data.status === 'success' ? response.data.data : [];
                dispatch({
                    type: FETCH_NOMINAL_TAX_RETURN_SUCCESS,
                    payload
                })
            })
            .catch(err => {
                log('Error fetching nominal tax return', err);
                dispatch({
                    type: FETCH_NOMINAL_TAX_RETURN_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}
export const fetchAgeDebtors = (date) => {
    return (dispatch) => {
        dispatch({ type: FETCH_AGE_DEBTORS_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get(`/report/agedebtors/${authData.id}/${date}`)
            .then(async (response) => {
                const payload = response.data.status === true ? response.data.data : [];
                await saveToLocal(AGE_DEBTOR_REPORT, payload);
                dispatch({
                    type: FETCH_AGE_DEBTORS_SUCCESS,
                    payload
                })
            })
            .catch(err => {
                log('Error fetching Age Debtors', err);
                dispatch({
                    type: FETCH_AGE_DEBTORS_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}
export const fetchAgeCreditor = (date) => {
    return (dispatch) => {
        dispatch({ type: FETCH_AGE_CREDITOR_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get(`/report/agedcreditors/${authData.id}/${date}`)
            .then(async (response) => {
                const payload = response.data.status === true ? response.data.data : [];
                await saveToLocal(AGE_CREDITOR_REPORT, payload);
                dispatch({
                    type: FETCH_AGE_CREDITOR_SUCCESS,
                    payload
                })
            })
            .catch(err => {
                log('Error fetching Age Creditor', err);
                dispatch({
                    type: FETCH_AGE_CREDITOR_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}
export const fetchAgedDebtorBreakdown = (id, fDate) => {
    return (dispatch) => {
        dispatch({ type: FETCH_AGED_DEBTOR_BREAKDOWN_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get(`/report/nominalagedebtors/${authData.id}/${fDate}/${id}`)
            .then(async (response) => {
                const payload = await sanetizeBreakdown(response.data);
                await saveToLocal(AGE_DEBTOR_BREAKDOWN, payload);
                dispatch({
                    type: FETCH_AGED_DEBTOR_BREAKDOWN_SUCCESS,
                    payload
                })
            })
            .catch(err => {
                log('Error fetching Debtors Breakdown', err);
                dispatch({
                    type: FETCH_AGED_DEBTOR_BREAKDOWN_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}

export const fetchAgedCreditorBreakdown = (id, fDate) => {
    return (dispatch) => {
        dispatch({ type: FETCH_AGED_CREDITOR_BREAKDOWN_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get(`/report/nominalagecreditors/${authData.id}/${fDate}/${id}`)
            .then(async (response) => {
                const payload = await sanetizeBreakdown(response.data);
                await saveToLocal(AGE_CREDITOR_BREAKDOWN, payload);
                dispatch({
                    type: FETCH_AGED_CREDITOR_BREAKDOWN_SUCCESS,
                    payload
                })
            })
            .catch(err => {
                log('Error fetching Creditor Breakdown', err);
                dispatch({
                    type: FETCH_AGED_CREDITOR_BREAKDOWN_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}

export const fetchBalanceSheet = (date) => {
    return (dispatch) => {
        dispatch({ type: FETCH_BALANCE_SHEET_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/profit/balancesheet/${authData.id}/${date}`)
            .then(async (response) => {
                const payload = await BalanceSheetHelper.sanetizeBalanceSheet(response.data.data);
                await saveToLocal(BALANCE_SHEET, payload);
                dispatch({
                    type: FETCH_BALANCE_SHEET_SUCCESS,
                    payload
                })
                return payload;
            })
            .catch(err => {
                log('Error fetching Balance Sheet', err);
                dispatch({
                    type: FETCH_BALANCE_SHEET_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}

export const fetchTrialBalance = (sdate, ldate) => {
    return (dispatch) => {
        dispatch({ type: FETCH_TRIAL_BALANCE_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get(`/profit/trialBalance/${authData.id}/${sdate}/${ldate}`)
            .then(async (response) => {
                await saveToLocal(TRIAL_BALANCE_REPORT, response.data.data);
                dispatch({
                    type: FETCH_TRIAL_BALANCE_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                log('Error fetching Trial Balance', err);
                dispatch({
                    type: FETCH_TRIAL_BALANCE_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}
export const fetchProfitAndLossReport = (sdate, edate) => {
    return (dispatch) => {
        dispatch({ type: FETCH_PROFIT_LOSS_REPORT_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get('https://taxgoglobal.com/newrestapi/Profitcalc/profitandloss', {
            params: {
                userid: authData.id,
                sdate,
                edate
            }
        })
            .then(async (response) => {
                const data = await sanetizeProfitLossReport(response.data);
                await saveToLocal(PROFIT_LOSS_REPORT, data);
                dispatch({
                    type: FETCH_PROFIT_LOSS_REPORT_SUCCESS,
                    payload: data
                })
            })
            .catch(err => {
                log('Error fetching Profit Loss Report', err);
                dispatch({
                    type: FETCH_PROFIT_LOSS_REPORT_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}

const sanetizeProfitLossReport = async (data) => {
    return new Promise(resolve => {
        const entities = [];
        entities.push({
            label: 'SALES',
            total: data.totalsale,
            rows: get(data, 'sales', [])
        });

        entities.push({
            label: 'OTHER INCOME',
            total: data.totalother,
            rows: get(data, 'others', [])
        });

        entities.push({
            label: 'DIRECT EXPENSES',
            total: data.totaldirect,
            rows: get(data, 'directexpenses', [])
        });

        entities.push({
            label: 'OVER HEAD',
            total: data.totaloverhead,
            rows: get(data, 'overhead', [])
        });

        resolve({
            entities,
            gprofit: data.gprofit,
            nprofit: data.nprofit
        });
    })
}

const sanetizeBreakdown = async (data) => {
    return new Promise(resolve => {
        if (data.status === 'success' && data.data && data.data['0']) {
            resolve(data.data['0']);
        } else {
            resolve([]);
        }
    })
}

const sanetizeVatReport = reports => {
    return new Promise((resolve) => {
        const newReports = reports.map(report => {
            let totalTax = 0.0;
            report.vatRate.forEach(value => {
                totalTax += value.total;
            });
            return {
                ...report,
                totalTax
            }
        })
        resolve(newReports);
    })
}