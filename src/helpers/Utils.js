import { Linking } from "react-native"

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

export const PASSWORD_ERROR_MESSAGE = 'Please enter atleast 4 digit password.';

export const validatePass = pass => {
    return pass !== undefined && pass.length >= 4;
}