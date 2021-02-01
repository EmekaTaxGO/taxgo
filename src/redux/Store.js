import authReducer from "./reducer/authReducer";
import invoiceReducer from "./reducer/invoiceReducer";
import productReducer from "./reducer/productReducer";
import contactReducer from "./reducer/contactReducer";
import ledgerReducer from "./reducer/ledgerReducer";
import userReducer from "./reducer/userReducer";
import bankReducer from "./reducer/bankReducer";
import journalReduder from "./reducer/journalReducer";
import taxReducer from './reducer/taxReducer';
import profileReducer from "./reducer/profileReducer";
import paymentReducer from "./reducer/paymentReducer";
import merchantReducer from "./reducer/merchantReducer";

const { combineReducers, createStore, applyMiddleware } = require("redux");
const { default: thunk } = require("redux-thunk");


const appReducers = combineReducers({
    auth: authReducer,
    invoice: invoiceReducer,
    product: productReducer,
    contact: contactReducer,
    ledger: ledgerReducer,
    user: userReducer,
    bank: bankReducer,
    journal: journalReduder,
    tax: taxReducer,
    profile: profileReducer,
    payment: paymentReducer,
    merchant: merchantReducer
});

const Store = createStore(appReducers, applyMiddleware(thunk));

export default Store;