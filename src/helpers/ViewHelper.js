import React from 'react';
import HeaderProgressbar from "../components/HeaderProgressbar"

export const showHeaderProgress = (navigation, show) => {
    navigation.setOptions({
        headerRight: () => show ? <HeaderProgressbar /> : null
    })
}
export const appFont = 'Nunito-Regular'
export const appFontBold = 'Nunito-Bold'

export default {
    showHeaderProgress,
    appFont,
    appFontBold
};