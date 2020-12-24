import {
    SIGN_UP_DETAILS_REQUEST,
    SIGN_UP_DETAILS_FAIL,
    SIGN_UP_DETAILS_SUCCESS,
    SIGN_UP_REQUEST, SIGN_UP_FAIL,
    SIGN_UP_SUCCESS, LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGIN_REQUEST,
    SAVE_AUTH,
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_FAIL,
    CHANGE_PASSWORD_SUCCESS
} from "../../constants";


const initialState = {
    fetchingSignupDetails: true,
    fetchSignupDetailsError: undefined,
    countries: [],
    businesses: [],

    loading: false,
    authData: null,//User Info

    updatingPassword: false,

    profile: null,

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
        case SIGN_UP_FAIL:
        case SIGN_UP_SUCCESS:
        case LOGIN_FAIL:
            return { ...state, loading: false };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                authData: action.payload
            }
        case SIGN_UP_REQUEST:
        case LOGIN_REQUEST:
            return { ...state, loading: true };
        case SAVE_AUTH:
            return {
                ...state, authData: action.payload
            };
        case CHANGE_PASSWORD_REQUEST:
            return {
                ...state,
                updatingPassword: true
            };
        case CHANGE_PASSWORD_FAIL:
        case CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                updatingPassword: false
            };
        default:
            return state;
    }
};
export default authReducer;