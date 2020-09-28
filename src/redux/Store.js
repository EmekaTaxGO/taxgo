import AuthReducer from "./reducer/AuthReducer";

const { combineReducers, createStore, applyMiddleware } = require("redux");
const { default: thunk } = require("redux-thunk");


const appReducers = combineReducers({
    auth: AuthReducer
});

const Store = createStore(appReducers, applyMiddleware(thunk));

export default Store;