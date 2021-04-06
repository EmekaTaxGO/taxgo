import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../AppButton';
import AppTextField from '../AppTextField';
class GeneralTab extends Component {

    componentDidMount() {
        console.log('Screen:', 'General Tab');
    }
    render() {
        const { onClick } = this.props;
        return <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <ScrollView style={{ flex: 1 }}>
                <AppTextField
                    label='First Name'
                    containerStyle={styles.textField}
                />
                <AppTextField
                    label='Last Name'
                    containerStyle={styles.textField}
                />
                <AppTextField
                    label='Email Address'
                    containerStyle={styles.textField}
                />
                <TouchableOpacity style={styles.textField}>
                    <AppTextField
                        label='Date Of Birth'
                        editable={false}
                    />
                </TouchableOpacity>
                <AppTextField
                    label='Phone number'
                    containerStyle={styles.textField}
                />
                <AppButton
                    onPress={onClick}
                    containerStyle={styles.btnStyle}
                    title='Update' />
            </ScrollView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    textField: {
        marginHorizontal: 16,
        marginTop: 16
    },
    btnStyle: {
        marginHorizontal: 16,
        marginTop: 30
    }
})
export default GeneralTab;