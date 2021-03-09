
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { appFont, appFontBold } from '../helpers/ViewHelper';
import { colorAccent, colorPrimary } from '../theme/Color';
class AppButton extends Component {


    render() {
        const { onPress, textStyle, containerStyle, title } = this.props;

        const newTextStyle = {
            ...styles.text,
            ...textStyle
        }
        const newContainerStyle = {
            ...styles.container,
            ...containerStyle
        }
        return (
            <TouchableOpacity
                onPress={onPress}
                style={newContainerStyle}>
                <Text style={newTextStyle}>
                    {title}
                </Text>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: colorPrimary,
        paddingVertical: 15,
        marginBottom: 12,
        marginTop: 12
    },
    text: {
        fontFamily: appFontBold,
        fontSize: 17,
        color: 'white',
        textTransform: 'capitalize'
    }
})
export default AppButton;