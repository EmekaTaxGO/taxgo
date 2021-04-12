import React, { Component } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../AppButton';
import AppDatePicker from '../AppDatePicker';
import AppTextField from '../AppTextField';
import ImagePickerView from '../ImagePickerView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class GeneralTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDobDialog: false
        }
    }

    dobRef = React.createRef();
    scrollRef = React.createRef();


    componentDidMount() {


    }

    onChangeProfile = uri => {
        const { onChange, profile } = this.props;
        const newProfile = {
            ...profile,
            localUri: uri
        };
        onChange(newProfile);
    }

    onChangeText = (key, value) => {
        const { profile, onChange } = this.props;
        const newProfile = {
            ...profile,
            [key]: value
        };
        onChange(newProfile);
    }

    onChangeDob = (show, date) => {
        this.setState({ showDobDialog: show }, () => {
            this.onChangeText('dob', date);
        });
    }
    render() {
        const { onSubmit, profile } = this.props;
        return <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                ref={this.scrollRef}>

                <ImagePickerView
                    url={profile.localUri}
                    onChange={this.onChangeProfile}
                />
                <AppTextField
                    label='First Name'
                    containerStyle={styles.textField}
                    value={profile.firstname}
                    onChangeText={text => this.onChangeText('firstname', text)}
                />
                <AppTextField
                    label='Last Name'
                    containerStyle={styles.textField}
                    value={profile.lastname}
                    onChangeText={text => this.onChangeText('lastname', text)}
                />
                <AppTextField
                    label='Email Address'
                    containerStyle={styles.textField}
                    value={profile.email}
                    disabled={true}
                    onChangeText={text => this.onChangeText('email', text)}
                />
                <AppDatePicker
                    showDialog={this.state.showDobDialog}
                    date={profile.dob}
                    containerStyle={styles.textField}
                    textFieldProps={{
                        label: 'Date Of Birth',
                        fieldRef: this.dobRef
                    }}
                    onChange={this.onChangeDob}
                />
                <AppTextField
                    label='Phone number'
                    containerStyle={styles.textField}
                    value={profile.phonenumber}
                    onChangeText={text => this.onChangeText('phonenumber', text)}
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
        marginTop: 16
    },
    btnStyle: {
        marginHorizontal: 16,
        marginTop: 30
    }
})
export default GeneralTab;