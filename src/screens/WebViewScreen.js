import React, { Component } from 'react';
import { View, Text } from 'react-native';
class WebViewScreen extends Component {

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
        console.log('url: ', this.props.route.params.url);
    }

    render() {
        return <View style={{ flex: 1 }}>
            <Text>Web View Screen</Text>
        </View>
    }
}
export default WebViewScreen;