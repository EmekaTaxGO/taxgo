import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
class BusinessTab extends Component {

    componentDidMount() {
        console.log('Screen: ','Business Tab');
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
export default BusinessTab;