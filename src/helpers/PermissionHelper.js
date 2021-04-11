import { Alert, Linking, PermissionsAndroid, Platform } from "react-native"


const showDialogForSetting = title => {
    Alert.alert('Permission Required!', `Enable ${title} Permission from settings`,
        [
            {
                style: 'default',
                text: 'Cancel',
                onPress: () => { }
            },
            {
                style: 'default',
                text: 'Settings',
                onPress: () => { Linking.openSettings() }
            }
        ]);
}

export const isWritePermitted = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message: 'App needs to access storage data to use this feature'
                }
            )
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.log('Write Permission error', err);
            alert('Alert', 'Error occured for write permission');
            return false;
        }
    } else {
        return true;
    }
}
export const hasCameraAccess = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission Required',
                    message: 'App needs to access Permission for camera to use this feature.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                showDialogForSetting();
            }
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.log('Write Permission error', err);
            alert('Alert', 'Error occured for camera permission');
            return false;
        }
    } else {
        return true;
    }
}

export default {
    isWritePermitted,
    hasCameraAccess
}