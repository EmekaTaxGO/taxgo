import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
class Divider extends Component {


    render() {
        const newStyle = {
            ...styles.divider,
            ...this.props.style
        }
        return (
            <View style={newStyle} />
        )
    }
}
const styles = StyleSheet.create({
    divider: {
        height: 1,
        // backgroundColor: '#f3f3f5',
        backgroundColor: 'lightgray'
    }
})
export default Divider;