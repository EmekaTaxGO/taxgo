import { FETCH_COUNTRIES_REQUEST, FETCH_COUNTRIES_FAIL, FETCH_COUNTRIES_SUCCESS } from "../../constants";


const initialState = {
    fetchingCountries: false,
    fetchCountryError: undefined,
    countries: []
}
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_COUNTRIES_REQUEST:
            return {
                ...state,
                fetchingCountries: true,
                fetchCountryError: undefined
            };
        case FETCH_COUNTRIES_FAIL:
            return {
                ...state,
                fetchingCountries: false,
                fetchCountryError: action.payload
            };
        case FETCH_COUNTRIES_SUCCESS:
            return {
                ...state,
                fetchingCountries: false,
                countries: [...action.payload.data]
            };
        default:
            return state;
    }
};
export default authReducer;