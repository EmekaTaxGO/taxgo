import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { appFontBold } from '../helpers/ViewHelper';
import AppText from './AppText';

const FormCheckBox = props => {

    return (
        <View style={{
            flexDirection: 'row',
            marginTop: 24,
            alignItems: 'center',
            paddingHorizontal: 16
        }}>

            <CheckBox
                value={props.checked}
                onValueChange={props.onValueChange}
            />
            <AppText style={styles.title}>{props.title}</AppText>
        </View>
    )
}
const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        paddingStart: 12,
        fontFamily: appFontBold
    }
})

export default FormCheckBox;