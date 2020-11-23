import { Linking } from "react-native"
import { colorAccent } from "../theme/Color";
import { exp } from "react-native-reanimated";

export const openLink = (navigation, title, url) => {
    navigation.push('WebViewScreen', {
        title: title,
        url: url
    })
}

export const EMAIL_ERROR_MESSAGE = 'Please enter valid email.';
export const validateEmail = email => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email) === true;
}
export const FIRST_NAME_ERROR_MESSAGE = 'Please enter valid first name.';
export const validateFirstName = fName => {
    return fName !== undefined && fName.length > 1;
}

export const LAST_NAME_ERROR_MESSAGE = 'Please enter valid last name.';
export const validateLastName = lName => {
    return lName !== undefined && lName.length > 1;
}

export const PASSWORD_ERROR_MESSAGE = 'Please enter atleast 4 digit password.';

export const validatePass = pass => {
    return pass !== undefined && pass.length >= 4;
}

export const BUSINESS_NAME_ERROR_MESSAGE = 'Please enter valid business name.';
export const validateBusinessName = bName => {
    return bName !== undefined && bName.length > 1;
}

export const MOBILE_ERROR_MESSAGE = 'Please enter valid mobile number.';
export const validateMobile = mobile => {
    if (mobile === undefined || mobile.length === 0) {
        return true;
    } else {
        return Number.isSafeInteger(Number(mobile));
    }
}

export const DEFAULT_PICKER_OPTIONS = {
    mediaType: 'photo',
    quality: 0,
    allowsEditing: true,
    tintColor: colorAccent,
    storageOptions: { privateDirectory: true }
};

