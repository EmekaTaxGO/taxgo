const { isEmpty } = require("lodash");
import { ActionSheetIOS, Alert, Linking, Platform } from 'react-native';
// const { default: Deeplink } = require("./Deeplink");
import Deeplink from '../deeplink/Deeplink';
import { clearAll } from '../services/UserStorage';
import DeviceInfo from 'react-native-device-info';
import { showError } from '../helpers/Utils';
import { colorAccent } from '../theme/Color';

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
    const bundleId = DeviceInfo.getBundleId();
    const deeplink = Platform.select({
        ios: 'itms-apps://itunes.apple.com/us/app/apple-store/id1156521749?mt=8',
        android: `market://details?id=${bundleId}`
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
            navigation.push('EditProfileV2', { tab: 'Security' });
            break;
        case Deeplink.EDIT_PROFILE:
            navigation.push('EditProfileV2');
            break;
        case Deeplink.MANAGE_ACCOUNTS:
            navigation.push('MerchantAccountScreen');
            break;
        case Deeplink.SUBSCRIPTIONS:
            navigation.push('EditProfileV2', { tab: 'Subscription' });
            break;
        case Deeplink.SIGN_OUT:
            signOutUser(navigation);
            break;
        case Deeplink.RATE_US:
            navigateToRateUS();
            break;
        case Deeplink.INVOICE_SETTINGS:
            navigation.push('EditProfileV2', { tab: 'Customize' });
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