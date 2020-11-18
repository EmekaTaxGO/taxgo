import { SIGN_UP_DETAILS_REQUEST, SIGN_UP_DETAILS_FAIL, SIGN_UP_DETAILS_SUCCESS } from "../../constants";


const initialState = {
    fetchingSignupDetails: true,
    fetchSignupDetailsError: undefined,
    countries: [],
    businesses: []
}
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_UP_DETAILS_REQUEST:
            return {
                ...state,
                fetchingSignupDetails: true,
                fetchSignupDetailsError: undefined
            };
        case SIGN_UP_DETAILS_FAIL:
            return {
                ...state,
                fetchingSignupDetails: false,
                fetchSignupDetailsError: action.payload
            };
        case SIGN_UP_DETAILS_SUCCESS:
            return {
                ...state,
                fetchingSignupDetails: false,
                countries: action.payload.countries.data.filter(value => value.country_code),
                businesses: [...action.payload.businesses.data]
            };
        default:
            return state;
    }
};
export default authReducer;