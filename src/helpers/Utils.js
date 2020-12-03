import { Linking } from "react-native"
import { colorAccent } from "../theme/Color";
import { exp } from "react-native-reanimated";
import _default from "react-native-image-picker";

export const openLink = (navigation, title, url) => {
    navigation.push('WebViewScreen', {
        title: title,
        url: url
    })
}

export const isEmpty = text => {
    return text === undefined || text.length === 0;
}
export const isFloat = text => {
    if (text === undefined || text === null || isEmpty(text)) {
        return false;
    }
    const number = Number(text);
    if (isNaN(number)) {
        return false;
    }
    return true;
}

export const isInteger = text => {
    if (text === undefined || text === null || isEmpty(text)) {
        return false;
    }
    const number = Number(text);
    if (isNaN(number)) {
        return false;
    }
    return Math.floor(number) === number;
}

export const toInteger = (text, _default = 0) => {
    if (isInteger(text)) {
        return parseInt(text);
    } else {
        return _default;
    }
}

export const toFloat = (text, _default = 0.0) => {
    if (isFloat(text)) {
        return parseFloat(text);
    } else {
        return _default;
    }
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
        console.log('Safe');
        return Number.isSafeInteger(Number(mobile));
    }
}

export const isClientError = err => {
    const { status } = err.response;
    console.log('Status: ', status);
    return status >= 400 && status < 500;
}
export const isServerError = err => {
    const { status } = err.response;
    return status >= 500;
}

export const DEFAULT_PICKER_OPTIONS = {
    mediaType: 'photo',
    quality: 0,
    allowsEditing: true,
    tintColor: colorAccent,
    storageOptions: { privateDirectory: true }
};

