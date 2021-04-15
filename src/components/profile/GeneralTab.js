import React, { Component } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../AppButton';
import AppDatePicker from '../AppDatePicker';
import AppTextField from '../AppTextField';
import ImagePickerView from '../ImagePickerView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isEmpty, times } from 'lodash';
import { showError, uploadFile } from '../../helpers/Utils';
import ProgressDialog from '../ProgressDialog';
import { getFieldValue } from '../../helpers/TextFieldHelpers';

class GeneralTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDobDialog: false,
            profile: props.profile,
            uploading: false
        }
    }

    firstNameRef = React.createRef();
    lastNameRef = React.createRef();
    emailRef = React.createRef();
    dobRef = React.createRef();
    phoneRef = React.createRef();
    scrollRef = React.createRef();


    componentDidMount() {


    }

    onChangeProfile = async (uri) => {
        var newUrl;
        try {
            this.setState({ uploading: true });
            const millisec = new Date().getTime();
            const file = {
                uri,
                name: `TaxGO_ LOGO_${millisec}.jpg`,
                type: 'image/png'
            };
            const data = await uploadFile(file);
            console.log('Data Received: ', JSON.stringify(data, null, 2));
            newUrl = uri;
        } catch (error) {
            console.log('Error uploading Image', error);
            setTimeout(() => showError('Error Uploading Image!'), 300);
        }
        const { profile } = this.state;
        const newProfile = {
            ...profile,
            bimage: newUrl
        };
        this.setState({
            profile: newProfile,
            uploading: false
        });
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
        const newProfile = {
            ...this.state.profile,
            firstname: getFieldValue(this.firstNameRef),
            lastname: getFieldValue(this.lastNameRef),
            email: getFieldValue(this.emailRef),
            phonenumber: getFieldValue(this.phoneRef)
        }
        if (isEmpty(newProfile.firstname)) {
            showError('Enter first name.')
        }
        else if (isEmpty(newProfile.lastname)) {
            showError('Enter last name.')
        }
        else {
            this.props.onSubmit(newProfile);
        }
    }
    render() {
        const { profile } = this.state;
        return <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                ref={this.scrollRef}>

                <ImagePickerView
                    url={profile.bimage}
                    onChange={this.onChangeProfile}
                />
                <AppTextField
                    label='First Name'
                    fieldRef={this.firstNameRef}
                    containerStyle={styles.textField}
                    value={profile.firstname}
                />
                <AppTextField
                    label='Last Name'
                    fieldRef={this.lastNameRef}
                    containerStyle={styles.textField}
                    value={profile.lastname}
                />
                <AppTextField
                    label='Email Address'
                    fieldRef={this.emailRef}
                    containerStyle={styles.textField}
                    value={profile.email}
                    disabled={true}
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
                    keyboardType='phone-pad'
                    fieldRef={this.phoneRef}
                    containerStyle={styles.textField}
                    value={profile.phonenumber}
                />
                <AppButton
                    onPress={this.validateForm}
                    containerStyle={styles.btnStyle}
                    title='Update' />
            </KeyboardAwareScrollView>
            <ProgressDialog visible={this.state.uploading} />
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