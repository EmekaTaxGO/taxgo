import React, { Component } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { appFont } from '../helpers/ViewHelper';
import AppText from './AppText';

class MultiLineTextField extends Component {
    render() {
        const { containerStyle, labelStyle, inputStyle, label, value } = this.props;
        const newContainerStyle = {
            ...styles.container,
            ...containerStyle
        };
        const newLabelStyle = {
            ...styles.label,
            ...labelStyle
        };
        const newInputStyle = {
            ...styles.input,
            ...inputStyle
        };

        return (
            <View style={newContainerStyle}>
                <AppText style={newLabelStyle}>{label}</AppText>
                <TextInput
                    placeholderTextColor='gray'
                    returnKeyType='next'
                    {...this.props}
                    style={newInputStyle}
                    multiline={true}
                />
            </View>

        )
    }
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'gray',
        marginTop: 6,
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontFamily: appFont,
        fontSize: 18,
        height: 100,
        color: 'black',
        textAlignVertical: 'top'
    },
    container: {
        flexDirection: 'column'
    },
    label: {
        color:'black',
        fontSize:17
    }
})
export default MultiLineTextField;