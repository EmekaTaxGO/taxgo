import React, { Component } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../AppButton';
import AppDatePicker from '../AppDatePicker';
import AppTextField from '../AppTextField';
import ImagePickerView from '../ImagePickerView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { get, isEmpty, method } from 'lodash';
import { showError, showSuccess } from '../../helpers/Utils';
import ProgressDialog from '../ProgressDialog';
import { getFieldValue } from '../../helpers/TextFieldHelpers';
import Store from '../../redux/Store';
import { showToast } from '../Logger';
import FormData from 'form-data';
import Api from '../../services/api';
import { BASE_URL } from '../../constants/appConstant';

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

    updateProfileImage = async (uri) => {

        const fileName = uri.substring(uri.lastIndexOf('/') + 1);
        const fileType = uri.substring(uri.lastIndexOf('.') + 1);

        const userid = get(Store.getState().auth, 'authData.id');
        const form = new FormData();
        form.append('userid', `${userid}`);
        const file = {
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            type: 'image/jpg',
            name: fileName
        }
        form.append('file', file);
        return Api.post('/user/updateProfilePicture', form, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => response.data.data.location);
    }

    onChangeProfile = async (uri) => {
        this.setState({ uploading: true });
        try {
            const remoteUrl = await this.updateProfileImage(uri);
            const profile = {
                ...this.state.profile,
                bimage: remoteUrl
            };
            this.setState({ profile: profile, uploading: false });
            setTimeout(() => {
                showSuccess('Profile picture updated successfully.')
            }, 300);
        } catch (error) {
            showToast('Error updating profile picture!');
            console.log('Error updating profile picture', error);
            this.setState({ uploading: false });
        }
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