import { getSavedData, TAX_LIST, saveToLocal } from "../../services/UserStorage"
import {
    TAX_LIST_REQUEST,
    TAX_LIST_SUCCESS,
    TAX_LIST_FAIL
} from "../../constants";
import Api from '../../services/api';
import { log } from "../../components/Logger";
import Store from "../Store";
import moment from 'moment';

export const getTaxList = (productId) => {
    return (dispatch) => {
        dispatch({ type: TAX_LIST_REQUEST });
        const apiList = [Api.get(`/default/taxList/16`)];
        if (productId) {
            const { authData } = Store.getState().auth;
            const startDate = defaultStartDate();
            const endDate = defaultEndDate();
            apiList.push(Api.get(`/product/productView/${authData.id}/${productId}/${startDate}/${endDate}`));
        }
        return Promise.all(apiList)
            .then(async (results) => {
                const taxList = results[0].data.data;
                const productInfo = productId ? results[1].data : undefined;
                await saveToLocal(TAX_LIST, taxList);
                dispatch({
                    type: TAX_LIST_SUCCESS,
                    payload: {
                        taxList: taxList,
                        productInfo: productInfo
                    }
                });
            })
            .catch(err => {
                log('Error fetching Tax List', err);
                dispatch({ type: TAX_LIST_FAIL });
            })
    }
}
const defaultStartDate = () => {
    const startDate = moment();
    startDate.set('date', 1);

    return moment(startDate.toDate()).format('YYYY-MM-DD');
}

const defaultEndDate = () => {
    const endDate = moment();
    endDate.set('date', endDate.daysInMonth());

    return moment(endDate.toDate()).format('YYYY-MM-DD');
}