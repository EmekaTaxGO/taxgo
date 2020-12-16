
import Api from '../../services/api';
import Store from '../Store';
import {
    JOURNAL_LIST_REQUEST,
    JOURNAL_LIST_SUCCESS,
    JOURNAL_LIST_FAIL
} from '../../constants';

export const getMyJournals = () => {
    return (dispatch) => {
        dispatch({ type: JOURNAL_LIST_REQUEST });
        const { authData } = Store.getState().auth;
        return Api.get(`/journal/getMyJournals/${authData.id}`)
            .then(response => {
                dispatch({
                    type: JOURNAL_LIST_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(err => {
                log('Error fetching Journals', err);
                dispatch({ type: JOURNAL_LIST_FAIL });
            })
    }
}