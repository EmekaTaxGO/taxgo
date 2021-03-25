import { PermissionsAndroid, Platform } from "react-native"


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

export default {
    isWritePermitted
}