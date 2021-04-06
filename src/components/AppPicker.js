import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-community/picker';
class AppPicker extends Component {


    render() {
        const newStyle = {
            ...styles.container,
            ...this.props.style
        }
        const newProps = { ...this.props };
        delete newProps.style;
        return (
            <View style={newStyle}>
                <Picker
                    {...newProps}
                    mode='dialog'>
                    {this.props.children}
                </Picker>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'gray',
        marginTop: 6,
        paddingVertical: 4
    }
})
export default AppPicker;