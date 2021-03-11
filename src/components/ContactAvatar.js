import { get } from 'lodash';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import { appFont } from '../helpers/ViewHelper';
class ContactAvatar extends Component {


    render() {
        const { style, color } = this.props;
        const radius = get(this.props, 'radius', 30);
        const text = get(this.props, 'text', '');
        const newContainerStyle = {
            ...style,
            ...styles.container,
            width: 2 * radius,
            height: 2 * radius,
            borderRadius: radius,
            backgroundColor: color
        };
        return (
            <View style={newContainerStyle}>
                <AppText style={styles.text}>
                    {text.toUpperCase()}
                </AppText>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 30,
        color: 'white',
        fontFamily: appFont
    }
})
export default ContactAvatar;