import React, { Component } from 'react';
import { View, Text } from 'react-native';
class UpdateUserScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        const title = this.props.route.params.title;
        this.props.navigation.setOptions({
            title: title
        })
    }
    render() {
        return <View style={{ flex: 1 }}>
            <Text>Update User Screen.</Text>
        </View>
    }
};
export default UpdateUserScreen;