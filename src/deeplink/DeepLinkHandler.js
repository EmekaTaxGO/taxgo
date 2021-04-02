const { isEmpty } = require("lodash");
import { Alert } from 'react-native';
// const { default: Deeplink } = require("./Deeplink");
import Deeplink from '../deeplink/Deeplink';
import { clearAll } from '../services/UserStorage';

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
        default:
            console.log('Unhandled Deeplink!');
            break;
    }
}
module.exports = {
    canHandle,
    handleDeepLink
}