import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';

class AppText extends Component {


    render() {
        return (
            <Text>{this.props.children}</Text>
        )
    }
}
const styles = StyleSheet.create({

})
export default AppText;