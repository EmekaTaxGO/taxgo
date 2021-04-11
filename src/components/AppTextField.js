import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { OutlinedTextField } from 'react-native-material-textfield';
import { appFont, appFontBold } from '../helpers/ViewHelper';
import { colorAccent, colorPrimary } from '../theme/Color';
class AppTextField extends Component {


    render() {
        const { fieldRef } = this.props;
        return (
            <OutlinedTextField
                ref={fieldRef}
                tintColor='black'
                baseColor='gray'
                titleTextStyle={styles.text}
                labelTextStyle={styles.label}
                fontSize={18}
                fontFamily={appFont}
                autoCorrect={false}
                {...this.props}
            />
        )
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily: appFontBold,
        color: 'black'
    },
    label: {
        color: 'black',
        fontFamily: appFont
    }
})
export default AppTextField;