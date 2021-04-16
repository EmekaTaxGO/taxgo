import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { appFont } from '../helpers/ViewHelper';
class AppText extends Component {

    render() {

        return (
            <Text
                style={[styles.textStyle, this.props.style]}
            >{this.props.children}</Text >
        )
    }
}
const styles = StyleSheet.create({
    textStyle: {
        fontFamily: appFont
    }
})
export default AppText;