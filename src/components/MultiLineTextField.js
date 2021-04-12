import React, { Component } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { appFont } from '../helpers/ViewHelper';

class MultiLineTextField extends Component {
    render() {

        const newStyle = {
            ...styles.text,
            ...this.props.style
        }
        const newProps = { ...this.props };
        delete newProps.style
        return (
            <TextInput
                placeholderTextColor='gray'
                returnKeyType='next'
                style={newStyle}
                {...newProps}
                multiline={true}
            />
        )
    }
}
const styles = StyleSheet.create({
    text: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'gray',
        marginTop: 6,
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontFamily: appFont,
        fontSize: 18,
        height: 100,
        color: 'black'
    }
})
export default MultiLineTextField;