import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppText from './AppText';
import { showSingleSelectAlert } from './SingleSelectAlert';
class AppPicker2 extends Component {

    handleOnPress = () => {
        const { text, items, onChange } = this.props;
        showSingleSelectAlert(text, items, index => {
            onChange(index);
        })
    }
    render() {
        const { title, containerStyle, onPress } = this.props;
        const newContainerStyle = {
            ...styles.container,
            ...containerStyle
        }
        return (
            <TouchableOpacity onPress={() => {
                if (onPress) {
                    onPress()
                } else {
                    this.handleOnPress();
                }
            }}
                style={newContainerStyle}>
                <AppText style={styles.text}>{title}</AppText>
                <Icon name='arrow-drop-down' size={26} color='gray' />
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    text: {
        color: 'black',
        fontSize: 18,
        flex: 1
    }
})
export default AppPicker2;