import { JOURNAL_LIST_REQUEST, JOURNAL_LIST_FAIL, JOURNAL_LIST_SUCCESS } from "../../constants";
import { API_ERROR_MESSAGE } from "../../constants/appConstant";


const initialState = {
    fetchingMyJournal: false,
    fetchMyJournalError: undefined,
    myJournalList: []
};

const journalReducer = (state = initialState, action) => {
    switch (action.type) {
        case JOURNAL_LIST_REQUEST:
            return {
                ...state,
                fetchingMyJournal: true,
                fetchMyJournalError: undefined
            };
        case JOURNAL_LIST_FAIL:
            return {
                ...state,
                fetchingMyJournal: false,
                fetchMyJournalError: API_ERROR_MESSAGE
            };
        case JOURNAL_LIST_SUCCESS:
            return {
                ...state,
                fetchingMyJournal: false,
                myJournalList: [...action.payload]
            };
        default:
            return state;
    }
};
export default journalReducer;