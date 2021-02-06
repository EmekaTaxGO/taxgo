import Api from '../../services/api';
import { FETCH_VAT_REPORT_REQUEST, FETCH_VAT_REPORT_SUCCESS, FETCH_VAT_REPORT_FAIL, FETCH_NOMINAL_TAX_LIST_REQUEST, FETCH_NOMINAL_TAX_LIST_SUCCESS, FETCH_NOMINAL_TAX_LIST_FAIL } from '../../constants';
import { log } from '../../components/Logger';
import { getApiErrorMsg, toFloat } from '../../helpers/Utils';
import Store from '../Store';

export const fetchVatReport = (startDate, endDate) => {
    return (dispatch) => {
        dispatch({ type: FETCH_VAT_REPORT_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get('https://taxgoglobal.com/newrestapi/reporting/overAllVatReport', {
            params: {
                userid: authData.id,
                fdate: startDate, //Format - YYYY-MM-DD
                ldate: endDate
            }
        })
            .then(async (response) => {
                const reports = await sanetizeVatReport(response.data.data.vatRate);
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
        return Api.get('https://taxgoglobal.com/newrestapi/reporting/vatnominallist', {
            params: {
                userid: authData.id,
                fdate: startDate, //Format - YYYY-MM-DD
                ldate: endDate,
                id
            }
        })
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
export const fetchNominalTaxReturn = (id, startDate, endDate) => {
    return (dispatch) => {
        dispatch({ type: FETCH_NOMINAL_TAX_LIST_REQUEST })
        const { authData } = Store.getState().auth;
        return Api.get('https://taxgoglobal.com/newrestapi/reporting/vatnominallist', {
            params: {
                userid: authData.id,
                fdate: startDate, //Format - YYYY-MM-DD
                ldate: endDate,
                id
            }
        })
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