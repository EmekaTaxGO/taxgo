
import Api from '../../services/api';
import { FETCH_COUNTRIES_REQUEST, FETCH_COUNTRIES_FAIL, FETCH_COUNTRIES_SUCCESS } from '../../constants';

export const fetchCountry = () => {
    return (dispatch) => {
        dispatch({ type: FETCH_COUNTRIES_REQUEST })
        return Api.get('/getCountries')
            .then(response => {
                console.log('Countries', JSON.stringify(response.data));
                dispatch({ type: FETCH_COUNTRIES_SUCCESS, payload: response.data });
            })
            .catch(err => {
                console.log('Api error', err);
                dispatch({ type: FETCH_COUNTRIES_FAIL, payload: err });
            })
    }

}