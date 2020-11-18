import authReducer from "./reducer/authReducer";

const { combineReducers, createStore, applyMiddleware } = require("redux");
const { default: thunk } = require("redux-thunk");


const appReducers = combineReducers({
    auth: authReducer
});

const Store = createStore(appReducers, applyMiddleware(thunk));

export default Store;