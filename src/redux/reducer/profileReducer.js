import { PRE_EDIT_PROFILE_REQUEST, PRE_EDIT_PROFILE_FAIL, PRE_EDIT_PROFILE_SUCCESS, EDIT_PROFILE_REQUEST, EDIT_PROFILE_FAIL, EDIT_PROFILE_SUCCESS } from "../../constants";
import { API_ERROR_MESSAGE } from "../../constants/appConstant";

const initialState = {
    fetchingPreEditProfile: true,
    fetchPreEditProfileError: undefined,
    profile: null,
    countries: null,
    businesses: null,

    editProfileProgress: false,
    editProfileError: undefined
};
const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRE_EDIT_PROFILE_REQUEST:
            return {
                ...state,
                fetchPreEditProfileError: undefined,
                fetchingPreEditProfile: true
            };
        case PRE_EDIT_PROFILE_FAIL:
            return {
                ...state,
                fetchingPreEditProfile: false,
                fetchPreEditProfileError: API_ERROR_MESSAGE
            };
        case PRE_EDIT_PROFILE_SUCCESS:
            return {
                ...state,
                ...action.payload,
                fetchingPreEditProfile: false
            };
        case EDIT_PROFILE_REQUEST:
        case EDIT_PROFILE_SUCCESS:
            return {
                ...state,
                editProfileProgress: true,
                editProfileError: undefined
            };
        case EDIT_PROFILE_FAIL:
            return {
                ...state,
                editProfileProgress: false,
                editProfileError: API_ERROR_MESSAGE
            };
        default:
            return state;
    }
}
export default profileReducer;