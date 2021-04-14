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

class GeneralTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDobDialog: false,
            profile: props.profile,
            uploading: false
        }
    }

    dobRef = React.createRef();
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
            localUri: newUrl
        };
        console.log('Everything Happened');
        this.setState({
            profile: newProfile,
            uploading: false
        });
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
        const { profile } = this.state;
        return <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
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