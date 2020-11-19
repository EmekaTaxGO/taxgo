import { Linking } from "react-native"

export const openLink = (navigation, title, url) => {
    navigation.push('WebViewScreen', {
        title: title,
        url: url
    })
}