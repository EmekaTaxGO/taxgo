import React, { Component } from 'react';
import { findNodeHandle, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppButton from '../AppButton';
import AppTextField from '../AppTextField';

class BusinessTab extends Component {

    componentDidMount() {
        console.log('Screen: ', 'Business Tab');
    }
    onChangeText = (key, value) => {
        const { profile, onChange } = this.props;
        const newProfile = {
            ...profile,
            [key]: value
        };
        onChange(newProfile);
    }

    scrollView = React.createRef();

    onAddressFocus = event => {
        this.scrollView.current.scrollToFocusedInput(findNodeHandle(event.target));
    }

    render() {
        const { profile, onSubmit } = this.props;
        return <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                innerRef={ref => {
                    this.scrollView = ref;
                }}>
                <AppTextField
                    label='Business Name'
                    containerStyle={styles.textField}
                    value={profile.bname}
                    onChangeText={text => this.onChangeText('bname', text)}
                />
                <AppTextField
                    label='Registration Number'
                    containerStyle={styles.textField}
                    value={profile.registerno}
                    onChangeText={text => this.onChangeText('registerno', text)}
                />
                <AppTextField
                    label='Website'
                    containerStyle={styles.textField}
                    value={profile.website}
                    onChangeText={text => this.onChangeText('website', text)}
                />
                <AppTextField
                    label='Business Email'
                    containerStyle={styles.textField}
                    value={profile.cemail}
                    keyboardType='email-address'
                    onChangeText={text => this.onChangeText('cemail', text)}
                />
                <AppTextField
                    label='Business Phone'
                    containerStyle={styles.textField}
                    value={profile.cphoneno}
                    keyboardType='phone-pad'
                    onChangeText={text => this.onChangeText('cphoneno', text)}
                />

                <AppTextField
                    label='Contact Person'
                    containerStyle={styles.textField}
                    value={profile.cperson}
                    onChangeText={text => this.onChangeText('cperson', text)}
                />
                <AppTextField
                    label='TAX/VAT Number'
                    containerStyle={styles.textField}
                    value={profile.taxregno}
                    keyboardType='numeric'
                    onChangeText={text => this.onChangeText('taxregno', text)}
                />
                <AppTextField
                    label='Business Address'
                    containerStyle={styles.textField}
                    value={profile.fullAddress}
                    multiline={true}
                    numberOfLines={3}
                    onChangeText={text => this.onChangeText('fullAddress', text)}
                />

                <AppButton
                    onPress={onSubmit}
                    containerStyle={styles.btnStyle}
                    title='Update' />

            </KeyboardAwareScrollView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    textField: {
        marginHorizontal: 16,
        marginTop: 20
    },

    btnStyle: {
        marginHorizontal: 16,
        marginTop: 30
    }
})
export default BusinessTab;