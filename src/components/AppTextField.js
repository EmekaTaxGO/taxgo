import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { OutlinedTextField } from 'react-native-material-textfield';
import { appFont, appFontBold } from '../helpers/ViewHelper';
class AppTextField extends Component {


    render() {
        const { fieldRef } = this.props;
        return (
            <OutlinedTextField
                ref={fieldRef}
                tintColor='black'
                baseColor='gray'
                titleTextStyle={styles.text}
                fontSize={18}
                fontFamily={appFont}
                autoCorrect={false}
                lineWidth={1}
                {...this.props}
            />
        )
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily: appFontBold,
        color: 'black'
    }
})
export default AppTextField;