import { TAX_LIST, saveToLocal } from "../../services/UserStorage"
import {
    TAX_LIST_REQUEST,
    TAX_LIST_SUCCESS,
    TAX_LIST_FAIL
} from "../../constants";
import Api from '../../services/api';
import { log } from "../../components/Logger";
import Store from "../Store";

export const getTaxList = (productId) => {
    return (dispatch) => {
        dispatch({ type: TAX_LIST_REQUEST });
        const { authData } = Store.getState().auth;
        const apiList = [Api.get(`/default/taxList/${authData.country}`)];
        if (productId) {
            apiList.push(Api.get(`/product/getProductById/${productId}`));
            apiList.push(Api.get(`/ledger/listLedger/${authData.id}`));
            apiList.push(Api.get(`/ledger/listpurchaseledger/${authData.id}`));
            apiList.push(Api.get(`/contact/supplierlist/${authData.id}`));
        }
        return Promise.all(apiList)
            .then(async (results) => {
                const taxList = results[0].data.data;
                const productInfo = productId ? results[1].data.data : undefined;
                const salesLedgers = productId ? results[2].data.data : undefined;
                const purchaseLedgers = productId ? results[3].data.data : undefined;
                const suppliers = productId ? results[4].data.data : undefined;
                await saveToLocal(TAX_LIST, taxList);
                dispatch({
                    type: TAX_LIST_SUCCESS,
                    payload: {
                        taxList: taxList,
                        productInfo: productInfo,
                        salesLedgers: salesLedgers,
                        purchaseLedgers: purchaseLedgers,
                        suppliers: suppliers
                    }
                });
            })
            .catch(err => {
                log('Error fetching Tax List', err);
                dispatch({ type: TAX_LIST_FAIL });
            })
    }
}