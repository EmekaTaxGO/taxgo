import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    Switch,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { validateFirstName, FIRST_NAME_ERROR_MESSAGE, validateLastName, LAST_NAME_ERROR_MESSAGE, validateEmail, EMAIL_ERROR_MESSAGE, validateMobile, MOBILE_ERROR_MESSAGE, isEmpty } from '../helpers/Utils';
import { getFieldValue, focusField, setFieldValue } from '../helpers/TextFieldHelpers';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DATE_FORMAT } from '../constants/appConstant';
import moment from 'moment';
import { colorAccent } from '../theme/Color';
import { RaisedTextButton } from 'react-native-material-buttons';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';

class UpdateUserScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstNameError: undefined,
            lastNameError: undefined,
            emailError: undefined,
            phoneError: undefined,
            dateOfBirthError: undefined,
            empIdError: undefined,
            uniqueIdError: undefined,

            showDOBPicker: false,
            dob: new Date(),

            status: false,
            payroll: false,
            retailXpress: false
        }
    }

    firstNameRef = React.createRef();
    lastNameRef = React.createRef();
    emailRef = React.createRef();
    phoneRef = React.createRef();
    dateOfBirthRef = React.createRef();
    empIdRef = React.createRef();
    uniqueIdRef = React.createRef();
    firstNameRef = React.createRef();
    firstNameRef = React.createRef();
    componentDidMount() {
        const title = this.props.route.params.title;
        this.props.navigation.setOptions({
            title: title
        })
    }

    hasAnyError = () => {
        return this.state.firstNameError !== undefined
            || this.state.lastNameError !== undefined
            || this.state.emailError !== undefined
            || this.state.phoneError !== undefined
            || this.state.dateOfBirthError !== undefined
            || this.state.empIdError !== undefined
            || this.state.uniqueIdError !== undefined;
    }

    resetAllError = () => {
        if (this.hasAnyError()) {
            this.setState({
                firstNameError: undefined,
                lastNameError: undefined,
                emailError: undefined,
                phoneError: undefined,
                dateOfBirthError: undefined,
                empIdError: undefined,
                uniqueIdError: undefined
            });
        }
    }

    validateAndSubmitForm = () => {
        if (!validateFirstName(getFieldValue(this.firstNameRef))) {
            this.setState({ firstNameError: FIRST_NAME_ERROR_MESSAGE });

        } else if (!validateLastName(getFieldValue(this.lastNameRef))) {
            this.setState({ lastNameError: LAST_NAME_ERROR_MESSAGE });

        } else if (!validateEmail(getFieldValue(this.emailRef))) {
            this.setState({ emailError: EMAIL_ERROR_MESSAGE });

        } else if (!validateMobile(getFieldValue(this.phoneRef))) {
            this.setState({ phoneError: MOBILE_ERROR_MESSAGE });

        } else if (isEmpty(getFieldValue(this.dateOfBirthRef))) {
            this.setState({ dateOfBirthError: 'Please enter date of birth.' });

        } else if (isEmpty(getFieldValue(this.empIdRef))) {
            this.setState({ empIdError: 'Please enter employee id.' });

        } else if (isEmpty(getFieldValue(this.uniqueIdRef))) {
            this.setState({ uniqueIdError: 'Please enter unique id.' });

        } else {
            this.submitForm();
        }
    }

    submitForm = () => {
        console.log('Form Submitted!');
    }

    onDOBChanged = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.dob;
        this.setState({
            dob: currentDate,
            showDOBPicker: false
        }, () => {
            setFieldValue(this.dateOfBirthRef, moment(currentDate).format(DATE_FORMAT));
            this.resetAllError();
        })
    }

    createSwitch = (label, value, onValueChange) => {
        return <View style={{
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingVertical: 18,
            borderBottomColor: 'lightgray',
            borderBottomWidth: 1,
            alignItems: 'center'
        }}>
            <Text style={{
                flex: 1,
                paddingRight: 6,
                fontSize: 16,
                color: 'gray'
            }}>{label}</Text>
            <Switch
                thumbColor={value ? colorAccent : 'lightgray'}
                value={value}
                onValueChange={onValueChange}
            />
        </View>
    }

    render() {
        return <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{
                        paddingHorizontal: 16,
                        flexDirection: 'column'
                    }}>
                        <AppTextField
                            containerStyle={styles.fieldStyle}
                            label='First Name'
                            keyboardType='default'
                            returnKeyType='next'
                            lineWidth={1}
                            title='*required'
                            fieldRef={this.firstNameRef}
                            error={this.state.firstNameError}
                            onChange={event => this.resetAllError()}
                            onSubmitEditing={() => focusField(this.lastNameRef)} />

                        <AppTextField
                            containerStyle={styles.fieldStyle}
                            label='Last Name'
                            keyboardType='default'
                            returnKeyType='next'
                            lineWidth={1}
                            title='*required'
                            fieldRef={this.lastNameRef}
                            error={this.state.lastNameError}
                            onChange={event => this.resetAllError()}
                            onSubmitEditing={() => focusField(this.emailRef)} />

                        <AppTextField
                            containerStyle={styles.fieldStyle}
                            label='Email address'
                            keyboardType='email-address'
                            returnKeyType='next'
                            lineWidth={1}
                            title='*required'
                            fieldRef={this.emailRef}
                            error={this.state.emailError}
                            onChange={event => this.resetAllError()}
                            onSubmitEditing={() => focusField(this.phoneRef)} />

                        <AppTextField
                            containerStyle={styles.fieldStyle}
                            label='Phone'
                            keyboardType='numeric'
                            returnKeyType='done'
                            lineWidth={1}
                            title='*required'
                            fieldRef={this.phoneRef}
                            error={this.state.phoneError}
                            onChange={event => this.resetAllError()} />
                        <TouchableOpacity
                            onPress={() => this.setState({ showDOBPicker: true })}
                            style={styles.fieldStyle}>
                            <AppTextField
                                label='Date Of Birth'
                                keyboardType='default'
                                returnKeyType='done'
                                lineWidth={1}
                                editable={false}
                                title='*required'
                                fieldRef={this.dateOfBirthRef}
                                error={this.state.dateOfBirthError}
                                onChange={event => this.resetAllError()} />
                        </TouchableOpacity>
                        {this.state.showDOBPicker ? <DateTimePicker
                            value={this.state.dob}
                            mode={'datetime'}
                            display='default'
                            maximumDate={new Date()}
                            onChange={this.onDOBChanged}
                        /> : null}
                        <AppTextField
                            containerStyle={styles.fieldStyle}
                            label='Employee Id'
                            keyboardType='numeric'
                            returnKeyType='next'
                            lineWidth={1}
                            title='*required'
                            fieldRef={this.empIdRef}
                            error={this.state.empIdError}
                            onChange={event => this.resetAllError()}
                            onSubmitEditing={() => focusField(this.uniqueIdRef)} />
                        <AppTextField
                            containerStyle={styles.fieldStyle}
                            label='Unique ID/License No'
                            keyboardType='default'
                            returnKeyType='done'
                            lineWidth={1}
                            title='*required'
                            fieldRef={this.uniqueIdRef}
                            error={this.state.uniqueIdError}
                            onChange={event => this.resetAllError()} />

                    </View>
                    {this.createSwitch('Status', this.state.status, enabled => this.setState({ status: enabled }))}
                    {this.createSwitch('Payroll', this.state.payroll, enabled => this.setState({ payroll: enabled }))}
                    {this.createSwitch('Retail Xpress', this.state.retailXpress, enabled => this.setState({ retailXpress: enabled }))}

                    {this.hasAnyError() ? <Text style={{
                        color: 'red',
                        paddingHorizontal: 16,
                        paddingTop: 4,
                        fontSize: 14
                    }}>
                        Please resolve all errors.</Text> : null}
                    <AppButton
                        containerStyle={styles.appBtn}
                        title={'Update'}
                        onPress={this.validateAndSubmitForm} />


                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
};
const styles = StyleSheet.create({
    fieldStyle: {
        marginTop: 16
    },
    appBtn: {
        marginHorizontal: 12,
        marginTop: 30
    }
});
export default UpdateUserScreen;