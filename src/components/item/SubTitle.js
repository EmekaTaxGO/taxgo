import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { appFont } from '../../helpers/ViewHelper';
class SubTitle extends Component {

    render() {
        const newStyle = {
            ...styles.text,
            ...this.props.style
        }
        return (
            <Text style={newStyle}>{this.props.children}</Text>
        )
    }

}
const styles = StyleSheet.create({
    text: {
        fontFamily: appFont,
        color: '#777777',
        fontSize: 14,
    }
})
export default SubTitle;