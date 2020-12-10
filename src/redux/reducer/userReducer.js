import {
    USER_LIST_REQUEST,
    USER_LIST_FAIL,
    USER_LIST_SUCCESS,
    UPDATE_USER_REQUEST,
    UPDATE_USER_FAIL,
    UPDATE_CUSTOMER_SUCCESS
} from "../../constants";
import { API_ERROR_MESSAGE } from "../../constants/appConstant";

const initialState = {
    fetchingUsers: false,
    fetchUserError: undefined,
    users: [],

    updatingUser: false,
    updateUserError: undefined
};
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return {
                ...state,
                fetchingUsers: true,
                fetchUserError: undefined
            };
        case USER_LIST_FAIL:
            return {
                ...state,
                fetchingUsers: false,
                fetchUserError: API_ERROR_MESSAGE
            };
        case USER_LIST_SUCCESS:
            return {
                ...state,
                fetchingUsers: false,
                users: [...action.payload]
            };
        case UPDATE_USER_REQUEST:
            return {
                ...state,
                updatingUser: true,
                updateUserError: undefined
            };
        case UPDATE_USER_FAIL:
            return {
                ...state,
                updatingUser: false,
                updateUserError: API_ERROR_MESSAGE
            };
        case UPDATE_CUSTOMER_SUCCESS:
            return {
                ...state,
                updatingUser: false
            };
        default:
            return state;
    }
};
export default userReducer;