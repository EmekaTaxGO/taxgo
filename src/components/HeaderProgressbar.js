import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
class HeaderProgressbar extends Component {

    render() {
        return (
            <ActivityIndicator
                color='white'
                style={styles.progress} />
        )
    }
}
const styles = StyleSheet.create({
    progress: {
        marginHorizontal: 12
    }
})
export default HeaderProgressbar;