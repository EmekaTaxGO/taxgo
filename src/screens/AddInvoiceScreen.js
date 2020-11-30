import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
class AddInvoiceScreen extends Component {
    constructor(props) {
        super();
        this.state = {

        }
    }

    componentDidMount() {
        const { info } = this.props.route.params;
        console.log('Info: ', info);
    }
    render() {
        return <View style={{ flex: 1 }}>
            <Text>Add Invoice Screen</Text>
        </View>
    }
};
const styles = StyleSheet.create({

});
export default AddInvoiceScreen;