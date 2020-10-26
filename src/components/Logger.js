import Toast from 'react-native-simple-toast';
import { UI_ALERT_CONTROLLER } from '../constants/appConstant';

export const log = (message, optionalParams) => {
    if (__DEV__) {
        console.log(message, optionalParams);
    }
}
export const showToast = (message, duration = Toast.SHORT) => {
    Toast.show(message, duration, [UI_ALERT_CONTROLLER])
}