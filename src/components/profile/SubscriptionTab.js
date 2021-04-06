import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
class SubscriptionTab extends Component {

    componentDidMount() {

        console.log('Screen: ', 'Subscription Tab');
    }
    render() {
        return <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>

            </ScrollView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({

})
export default SubscriptionTab;