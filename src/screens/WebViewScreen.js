import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
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
    }

    render() {
        const { params } = this.props.route;
        return <WebView
            source={{ uri: params.url }} />
    }
}
export default WebViewScreen;