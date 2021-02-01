import Api from '../../services/api';
import { FETCH_MERCHANT_REQUEST, FETCH_MERCHANT_SUCCESS, SAVE_MERCHANT_REQUEST, SAVE_MERCHANT_SUCCESS, SAVE_MERCHANT_FAIL } from "../../constants";
import Store from '../Store';
import { getApiErrorMsg } from '../../helpers/Utils';



export const fetchMerchants = () => {
    return (dispatch) => {
        dispatch({ type: FETCH_MERCHANT_REQUEST })
        const { authData } = Store.getState().auth
        return Api.get(`/merchant/getMerchantAccount/${authData.id}`)
            .then(result => {
                dispatch({
                    type: FETCH_MERCHANT_SUCCESS,
                    payload: result.data.data
                })
            })
            .catch(err => {
                console.log('Error fetching Merchants', err);
                dispatch({
                    type: SIGN_UP_DETAILS_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}

export const saveOrUpdateMerchant = (body) => {
    return (dispatch) => {
        dispatch({ type: SAVE_MERCHANT_REQUEST })
        return Api.post('//TO-DO', body)
            .then(result => {
                dispatch({
                    type: SAVE_MERCHANT_SUCCESS,
                    payload: result.data.data
                })
            })
            .catch(err => {
                console.log('Error Saving Merchants', err);
                dispatch({
                    type: SAVE_MERCHANT_FAIL,
                    payload: getApiErrorMsg(err)
                });
            })
    }

}
