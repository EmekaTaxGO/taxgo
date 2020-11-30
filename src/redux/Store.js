import authReducer from "./reducer/authReducer";
import invoiceReducer from "./reducer/invoiceReducer";
import productReducer from "./reducer/productReducer";
import contactReducer from "./reducer/contactReducer";

const { combineReducers, createStore, applyMiddleware } = require("redux");
const { default: thunk } = require("redux-thunk");


const appReducers = combineReducers({
    auth: authReducer,
    invoice: invoiceReducer,
    product: productReducer,
    contact: contactReducer
});

const Store = createStore(appReducers, applyMiddleware(thunk));

export default Store;