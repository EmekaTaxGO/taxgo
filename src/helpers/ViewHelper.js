import React from 'react';
import HeaderProgressbar from "../components/HeaderProgressbar"

export const showHeaderProgress = (navigation, show) => {
    navigation.setOptions({
        headerRight: () => show ? <HeaderProgressbar /> : null
    })
}
export const appFont = ''
export const appFontBold = ''
export default {
    showHeaderProgress,
    appFont,
    appFontBold
};