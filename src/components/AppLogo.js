import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { APP_LOGO } from '../constants/appConstant';
const AppLogo = () => {
    return <Image source={{ uri: APP_LOGO }}
        style={styles.logo} />
};
const styles = StyleSheet.create({
    logo: {
        width: '80%',
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 12
    }
});
export default AppLogo;