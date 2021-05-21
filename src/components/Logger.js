import SimpleToast from 'react-native-simple-toast';
import Toast from 'react-native-simple-toast';
import { UI_ALERT_CONTROLLER } from '../constants/appConstant';

export const log = (message, optionalParams) => {
    if (__DEV__) {
        console.log(message, optionalParams);
    }
}
export const showToast = (message, duration = Toast.SHORT, gravity = SimpleToast.BOTTOM) => {
    Toast.showWithGravity(message, duration, gravity, [UI_ALERT_CONTROLLER])
}