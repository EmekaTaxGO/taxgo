const { isEmpty } = require("lodash");
import { Alert, Linking, Platform } from 'react-native';
// const { default: Deeplink } = require("./Deeplink");
import Deeplink from '../deeplink/Deeplink';
import { clearAll } from '../services/UserStorage';
import DeviceInfo from 'react-native-device-info';
import { showError } from '../helpers/Utils';

const canHandle = deeplink => {
    const values = Object.values(Deeplink);
    return values.includes(deeplink);
}
const signOutUser = (nav) => {
    Alert.alert('Are you sure', 'Do you really want to Sign Out?', [
        {
            text: 'NO'
        },
        {
            text: 'YES',
            style: 'default',
            onPress: async () => {
                await clearAll();
                nav.replace('LoginScreen');
            }
        }
    ])
}
const navigateToRateUS = async () => {
    const packageName = await DeviceInfo.getInstallerPackageName();
    const deeplink = Platform.select({
        ios: 'itms-apps://itunes.apple.com/us/app/apple-store/id1513928912?mt=8',
        android: `market://details?id=com.app.sploot`
    });
    const canOpen = await Linking.canOpenURL(deeplink);
    if (canOpen) {
        Linking.openURL(deeplink);
    } else {
        showError('Unable to open store!');
    }

}
const handleDeepLink = (navigation, deeplink) => {
    if (isEmpty(deeplink)) {
        return;
    }
    switch (deeplink) {
        case Deeplink.CHANGE_PASSWORD:
            navigation.push('ChangePasswordScreen');
            break;
        case Deeplink.EDIT_PROFILE:
            navigation.push('EditProfileV2');
            break;
        case Deeplink.MANAGE_ACCOUNTS:
            navigation.push('MerchantAccountScreen');
            break;
        case Deeplink.SUBSCRIPTIONS:
            navigation.push('UpgradePlanScreen');
            break;
        case Deeplink.SIGN_OUT:
            signOutUser(navigation);
            break;
        case Deeplink.RATE_US:
            navigateToRateUS();
            break;
        default:
            console.log('Unhandled Deeplink!');
            break;
    }
}
module.exports = {
    canHandle,
    handleDeepLink
}