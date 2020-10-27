import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

class ContactTabItem extends Component {

    constructor(props) {
        super(props);
        console.log('Name:', props.route.name);
    }
    render() {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Contact Tab Item Name: {this.props.route.name}
            </Text>
        </View>
    }
}
const styles = StyleSheet.create({

});
export default ContactTabItem;