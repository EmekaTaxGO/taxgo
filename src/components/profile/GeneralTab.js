import React, { Component } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../AppButton';
import AppDatePicker from '../AppDatePicker';
import AppTextField from '../AppTextField';
import ImagePickerView from '../ImagePickerView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isEmpty } from 'lodash';
import { showError } from '../../helpers/Utils';

class GeneralTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDobDialog: false,
            profile: props.profile
        }
    }

    dobRef = React.createRef();
    scrollRef = React.createRef();


    componentDidMount() {


    }

    onChangeProfile = uri => {
        const { profile } = this.state;
        const newProfile = {
            ...profile,
            localUri: uri
        };
        this.setState({ profile: newProfile });
    }

    onChangeText = (key, value) => {
        const { profile } = this.state;
        const newProfile = {
            ...profile,
            [key]: value
        };
        this.setState({ profile: newProfile });
    }

    onChangeDob = (show, date) => {
        const { profile } = this.state;
        const newProfile = {
            ...profile,
            dob: date
        };
        this.setState({ showDobDialog: show, profile: newProfile });
    }

    validateForm = () => {
        const { profile } = this.state;
        const { onSubmit } = this.props;
        if (isEmpty(profile.firstname)) {
            showError('Enter first name.')
        }
        else if (isEmpty(profile.lastname)) {
            showError('Enter last name.')
        }
        else {
            onSubmit(profile);
        }
    }
    render() {
        const { onSubmit } = this.props;
        const { profile } = this.state;
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
                    onPress={this.validateForm}
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