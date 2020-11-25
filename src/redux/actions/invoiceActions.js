import { SEARCH_QUERY } from "../../constants"

export const onQueryChange = (type, query) => {
    return (dispatch) => {
        dispatch({
            type: SEARCH_QUERY,
            payload: {
                type: type,
                query: query
            }
        })
    }
}