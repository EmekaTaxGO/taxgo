import Api from '../../services/api';
import {
    DEFAULT_LEDGER_REQUEST,
    DEFAULT_LEDGER_FAIL,
    DEFAULT_LEDGER_SUCCESS,
    SALES_LEDGER_REQUEST,
    SALES_LEDGER_SUCCESS,
    SALES_LEDGER_FAIL,
    PURCHASE_LEDGER_REQUEST,
    PURCHASE_LEDGER_SUCCESS,
    PURCHASE_LEDGER_FAIL,
    MY_LEDGER_REQUEST,
    MY_LEDGER_SUCCESS,
    MY_LEDGER_FAIL,
    UPDATE_LEDGER_REQUEST,
    UPDATE_LEDGER_SUCCESS,
    UPDATE_LEDGER_FAIL,
    LEDGER_CATEGORY_REQUEST,
    LEDGER_CATEGORY_FAIL,
    LEDGER_CATEGORY_SUCCESS
} from '../../constants';
import { log } from '../../components/Logger';
import Store from '../Store';

export const getLedgerCategory = () => {
    return (dispatch) => {
        dispatch({ type: LEDGER_CATEGORY_REQUEST });
        return Api.get('/default/defaultLedgerCategory/all')
            .then(response => {
                dispatch({
                    type: LEDGER_CATEGORY_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error Fetching Ledger Category', err);
                dispatch({ type: LEDGER_CATEGORY_FAIL });
            })
    }
}
export const getDefaultLedger = () => {
    return (dispatch) => {
        dispatch({ type: DEFAULT_LEDGER_REQUEST });
        return Api.get('/default/getDefaultLedgers')
            .then(response => {
                dispatch({
                    type: DEFAULT_LEDGER_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching Ledger', err);
                dispatch({ type: DEFAULT_LEDGER_FAIL });
            })
    }
}

export const getSaleLedger = () => {
    return (dispatch) => {
        dispatch({ type: SALES_LEDGER_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/ledger/listLedger/${authData.id}`)
            .then(response => {
                dispatch({
                    type: SALES_LEDGER_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching Ledger', err);
                dispatch({ type: SALES_LEDGER_FAIL });
            })
    }
}

export const getPurchaseLedger = () => {
    return (dispatch) => {
        dispatch({ type: PURCHASE_LEDGER_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/ledger/listpurchaseledger/${authData.id}`)
            .then(response => {
                dispatch({
                    type: PURCHASE_LEDGER_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching Ledger', err);
                dispatch({ type: PURCHASE_LEDGER_FAIL });
            })
    }
}

export const getMyLedger = () => {
    return (dispatch) => {
        dispatch({ type: MY_LEDGER_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/ledger/getMyLedgers/${authData.id}`)
            .then(response => {
                dispatch({
                    type: MY_LEDGER_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching Ledger', err);
                dispatch({ type: MY_LEDGER_FAIL });
            })
    }
}

//For adding & updating Ledgers
export const updateLedger = (body, onLedgerUpdated, onError) => {
    return (dispatch) => {
        console.log('Body', body);
        dispatch({ type: UPDATE_LEDGER_REQUEST });
        return Api.post('/ledger/addUpdateLedger', body)
            .then(response => {
                dispatch({
                    type: UPDATE_LEDGER_SUCCESS,
                    payload: response.data.data
                });
                onLedgerUpdated(response.data);
            })
            .catch(err => {
                log('Error updating Ledger', err);
                dispatch({ type: UPDATE_LEDGER_FAIL });
                onError();
            })
    }
}

//Add OR Update ledger
// curl --location --request POST 'http://localhost:3002/taxgo/ledger/addUpdateLedger' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "laccount": "Test Account",
//    "category": "2",
//    "categorygroup": "assets",
//    "nominalcode": "3311",
//    "userid": "1062",
//    "type": "2",
//    "adminid": "",
//    "logintype": "user",
//    "id": "22033"
// }'