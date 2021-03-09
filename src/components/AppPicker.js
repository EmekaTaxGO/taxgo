import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-community/picker';
class AppPicker extends Component {


    render() {
        const newStyle = {
            ...styles.container,
            ...this.props.style
        }
        return (
            <View style={newStyle}>
                <Picker
                    {...this.props}>
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
        borderColor: 'lightgray',
        marginTop: 6
    }
})
export default AppPicker;