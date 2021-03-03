import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';

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
        fontFamily: 'Nunito-Regular'
    }
})
export default AppText;