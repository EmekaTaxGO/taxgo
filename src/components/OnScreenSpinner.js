import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colorAccent, colorPrimary } from '../theme/Color';

const OnScreenSpinner = () => {
    return <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }}>
        <ActivityIndicator color={colorPrimary} size='large' />
    </View>
}
export default OnScreenSpinner;