import React from 'react';
import { Provider } from 'react-redux';
import Store from './Store';
import App from '../../App';

const ReduxApp = () => {
    return <Provider store={Store}>
        <App />
    </Provider>
}
export default ReduxApp;