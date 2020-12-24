import { getSavedData, TAX_LIST, saveToLocal } from "../../services/UserStorage"
import {
    TAX_LIST_REQUEST,
    TAX_LIST_SUCCESS,
    TAX_LIST_FAIL
} from "../../constants";
import Api from '../../services/api';
import { log } from "../../components/Logger";

export const getTaxList = () => {
    return async (dispatch) => {
        dispatch({ type: TAX_LIST_REQUEST });
        const taxList = await getSavedData(TAX_LIST);
        if (taxList === null) {
            fetchTaxListFromRemote()(dispatch);
        } else {
            dispatch({
                type: TAX_LIST_SUCCESS,
                payload: taxList
            });
        }
    }
}
export const fetchTaxListFromRemote = () => {
    return (dispatch) => {

        return Api.get('/default/taxList/3')
            .then(async (response) => {
                await saveToLocal(TAX_LIST, response.data.data)
                dispatch({
                    type: TAX_LIST_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error Fetching tax list', err);
                dispatch({ type: TAX_LIST_FAIL });
            })
    }
}