import authReducer from "./reducer/authReducer";
import invoiceReducer from "./reducer/invoiceReducer";

const { combineReducers, createStore, applyMiddleware } = require("redux");
const { default: thunk } = require("redux-thunk");


const appReducers = combineReducers({
    auth: authReducer,
    invoice: invoiceReducer
});

const Store = createStore(appReducers, applyMiddleware(thunk));

export default Store;