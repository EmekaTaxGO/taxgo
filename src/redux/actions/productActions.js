
import Api from '../../services/api';
import Store from '../Store';
import { log } from '../../components/Logger';
import { PRODUCT_LIST_SUCCESS, PRODUCT_LIST_REQUEST, PRODUCT_LIST_FAIL } from '../../constants';

export const getProductList = () => {
    return (dispatch) => {
        dispatch({ type: PRODUCT_LIST_REQUEST });
        const { auth } = Store.getState();
        return Api.get(`/product/getProductList/${auth.authData.id}`)
            .then(response => {
                dispatch({
                    type: PRODUCT_LIST_SUCCESS,
                    payload: response.data.data
                })
            })
            .catch(err => {
                dispatch({ type: PRODUCT_LIST_FAIL });
                log('Error in Product Listing:', err);
            })
    }
}