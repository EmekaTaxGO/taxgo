import { get } from 'lodash';
import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class AppImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPlaceholder: true
        }
    }

    onError = e => {
        console.log('On load Error');
        this.setState({ showPlaceholder: true })
    }

    onLoad = e => {
        console.log('On Load Success');
        this.setState({ showPlaceholder: false })
    }
    render() {
        console.log('Rendering AppImage');
        const placeholder = get(this.props, 'placeholder', 'camera-alt');
        const defaultPlaceholderSize = get(this.props, 'style.width', 60) / 2;
        const placeholderSize = get(this.props, 'placeholderSize', defaultPlaceholderSize);
        const placeholderColor = get(this.props, 'placeholderColor', '#000000');
        const url = get(this.props, 'url');
        const { showPlaceholder } = this.state;

        const newContainerStyle = {
            ...styles.container,
            ...this.props.containerStyle,
        }
        // delete imageProps["style"];
        return (
            <View style={newContainerStyle}>
                <Image
                    {...this.props}
                    source={{ uri: url }}
                    onError={this.onError}
                    onLoad={this.onLoad}
                />
                {showPlaceholder ?
                    <Icon
                        style={{ position: 'absolute' }}
                        name={placeholder}
                        size={placeholderSize}
                        color={placeholderColor} /> : null}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default AppImage;