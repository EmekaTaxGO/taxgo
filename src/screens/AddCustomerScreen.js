import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
class AddCustomerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contact: ''
        }
    }

    componentDidMount() {
        const contact = this.props.route.params.contact;
        const title = contact === 'customer' ? 'Add Customer' : 'Add Supplier';
        this.setState({ contact });
        this.props.navigation.setOptions({ title });
    }

    render() {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{this.state.contact}</Text>
        </View>
    }
}
const styles = StyleSheet.create({

});
export default AddCustomerScreen;