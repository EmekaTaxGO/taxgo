
import Api from '../../services/api';
import {
    SIGN_UP_DETAILS_REQUEST,
    SIGN_UP_DETAILS_FAIL,
    SIGN_UP_DETAILS_SUCCESS
} from '../../constants';

export const fetchSignupDetails = () => {
    return (dispatch) => {
        dispatch({ type: SIGN_UP_DETAILS_REQUEST })
        return Promise.all([
            Api.get('/getCountries'),
            Api.get('/getBusinessCategories')
        ])
            .then(result => {
                const countries = result[0];
                const businesses = result[1];
                dispatch({
                    type: SIGN_UP_DETAILS_SUCCESS,
                    payload: {
                        countries: countries.data,
                        businesses: businesses.data
                    }
                })
            })
            .catch(err => {
                console.log('Api error', err);
                dispatch({ type: SIGN_UP_DETAILS_FAIL, payload: err });
            })
    }

}