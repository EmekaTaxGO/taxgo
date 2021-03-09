import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { appFontBold } from '../../helpers/ViewHelper';
class Title extends Component {

    render() {
        const newStyle = {
            ...styles.text,
            ...this.props.style
        }
        return (
            <Text
                {...this.props}
                style={newStyle}>{this.props.children}</Text>
        )
    }

}
const styles = StyleSheet.create({
    text: {
        fontFamily: appFontBold,
        fontSize: 16,
        color: 'black'
    }
})
export default Title;