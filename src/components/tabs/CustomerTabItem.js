import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

class CustomerTabItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
                Customer Tab Items.
            </Text>
        </View>
    }
}
const styles = StyleSheet.create({

});
export default CustomerTabItem;