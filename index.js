/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import ReduxApp from './src/redux/ReduxApp';

AppRegistry.registerComponent(appName, () => ReduxApp);
