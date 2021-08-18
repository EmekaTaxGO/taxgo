/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { SAVE_AUTH } from './src/constants';
import ReduxApp from './src/redux/ReduxApp';
import Store from './src/redux/Store';
import { AUTH_DATA, getSavedData } from './src/services/UserStorage';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', JSON.stringify(remoteMessage));
});

AppRegistry.registerRunnable(appName, async initialProps => {
    const authData = await getSavedData(AUTH_DATA)
    if (authData != null) {
        Store.dispatch({ type: SAVE_AUTH, payload: authData })
    }
    AppRegistry.registerComponent(appName, () => ReduxApp);
    AppRegistry.runApplication(appName, initialProps)
})
