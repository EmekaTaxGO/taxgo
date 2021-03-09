import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native';
import { focusField, getFieldValue, setFieldValue } from '../helpers/TextFieldHelpers';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent, colorPrimary } from '../theme/Color';
import { isEmpty, BUSINESS_NAME_ERROR_MESSAGE, validateEmail, EMAIL_ERROR_MESSAGE } from '../helpers/Utils';

import * as contactActions from '../redux/actions/contactActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProgressDialog from '../components/ProgressDialog';
import Store from '../redux/Store';
import AppTextField from '../components/AppTextField';

class AddCustomerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contact: '',
            nameError: undefined,
            businessNameError: undefined,
            emailError: undefined,
            mobileError: undefined,
            telephoneError: undefined
        }
    }

    nameRef = React.createRef();
    businessRef = React.createRef();
    emailRef = React.createRef();
    mobileRef = React.createRef();
    telephoneRef = React.createRef();
    addressRef = React.createRef();
    townRef = React.createRef();
    postCodeRef = React.createRef();
    notesRef = React.createRef();
    referenceRef = React.createRef();

    componentDidMount() {
        const { params } = this.props.route;

        this.props.navigation.setOptions({ title: this.getTitle(params) });

        this.setFieldValues(params.contact);
    }

    getTitle = (params) => {
        const contactLabel = params.contactType === 'customer' ? 'Customer' : 'Supplier';
        if (params.mode === 'disabled') {
            return `${contactLabel} Details`;
        } else {
            const prefix = params.contact === null ? 'Add' : 'Edit';
            return `${prefix} ${contactLabel}`;
        }
    }

    setFieldValues = (contact) => {
        if (contact !== null) {
            setFieldValue(this.nameRef, contact.name);
            setFieldValue(this.businessRef, contact.bname);
            setFieldValue(this.emailRef, contact.email);
            setFieldValue(this.mobileRef, contact.mobile);
            setFieldValue(this.telephoneRef, contact.telephone);
            setFieldValue(this.addressRef, contact.address);
            setFieldValue(this.townRef, contact.town);
            setFieldValue(this.postCodeRef, contact.post_code);
            setFieldValue(this.referenceRef, contact.reference);
            setFieldValue(this.notesRef, contact.notes);
        }
    }

    hasAnyError = () => {
        return this.state.nameError !== undefined
            || this.state.businessNameError !== undefined
            || this.state.emailError !== undefined
            || this.state.mobileError !== undefined
            || this.state.telephoneError !== undefined;
    }

    resetAllError = () => {
        if (this.hasAnyError()) {
            this.setState({
                nameError: undefined,
                businessNameError: undefined,
                emailError: undefined,
                mobileError: undefined,
                telephoneError: undefined
            })
        }
    }

    isEditMode = () => {
        return this.props.route.params.contact !== null;
    }

    isDisabled = () => {
        return this.props.route.params.mode === 'disabled';
    }

    isSupplier = () => {
        return this.props.route.params.contactType === 'supplier';
    }

    validateAndProcess = () => {
        const contactLabel = this.props.route.params.contactType;
        if (isEmpty(getFieldValue(this.nameRef))) {
            this.setState({ nameError: `Please enter ${contactLabel} name.` });

        } else if (isEmpty(getFieldValue(this.businessRef))) {
            this.setState({ businessNameError: BUSINESS_NAME_ERROR_MESSAGE });

        } else if (!validateEmail(getFieldValue(this.emailRef))) {
            this.setState({ emailError: EMAIL_ERROR_MESSAGE });

        } else {
            if (this.isSupplier()) {
                this.updateSupplier();
            } else {
                this.updateCustomer();
            }
        }
    }
    updateSupplier = () => {
        const body = {
            ...this.props.route.params.contact,
            ...this.getFilledInfo()
        }
        const { contactActions } = this.props;
        contactActions.updateSupplier(this.props.navigation, body, this.isEditMode() ? 2 : 1);
    }
    updateCustomer = () => {
        const body = {
            ...this.props.route.params.contact,
            ...this.getFilledInfo()
        };
        const { contactActions } = this.props;
        contactActions.updateCustomer(this.props.navigation, body, this.isEditMode() ? 2 : 1);
    }

    getFilledInfo = () => {
        const userid = Store.getState().auth.authData.id;
        return {
            name: getFieldValue(this.nameRef),
            bname: getFieldValue(this.businessRef),
            email: getFieldValue(this.emailRef),
            mobile: getFieldValue(this.mobileRef),
            telephone: getFieldValue(this.telephoneRef),
            address: getFieldValue(this.addressRef),
            town: getFieldValue(this.townRef),
            post_code: getFieldValue(this.postCodeRef),
            reference: getFieldValue(this.referenceRef),
            notes: getFieldValue(this.notesRef),
            userid: userid,
            adminid: userid
        }
    }

    isUpdating = () => {
        const { contact } = this.props;
        return this.isSupplier() ? contact.updatingSupplier : contact.updatingCustomer;
    }

    hasApiError = () => {

        const { contact } = this.props;
        return this.isSupplier() ? contact.updateSupplierError : contact.updateCustomerError;
    }

    render() {

        const isFormEditabled = !this.isDisabled();
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 16, flex: 1 }}>
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Name'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        fieldRef={this.nameRef}
                        editable={isFormEditabled}
                        error={this.state.nameError}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.businessRef)} />
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Business Name'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        fieldRef={this.businessRef}
                        error={this.state.businessNameError}
                        editable={isFormEditabled}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.emailRef)} />
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Email'
                        keyboardType='email-address'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        fieldRef={this.emailRef}
                        error={this.state.emailError}
                        onChange={event => this.resetAllError()}
                        editable={isFormEditabled}
                        onSubmitEditing={() => focusField(this.mobileRef)} />
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Mobile'
                        keyboardType='numeric'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.mobileRef}
                        error={this.state.mobileError}
                        onChange={event => this.resetAllError()}
                        editable={isFormEditabled}
                        onSubmitEditing={() => focusField(this.telephoneRef)} />
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Telephone'
                        keyboardType='numeric'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.telephoneRef}
                        error={this.state.telephoneError}
                        onChange={event => this.resetAllError()}
                        editable={isFormEditabled}
                        onSubmitEditing={() => focusField(this.addressRef)} />
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Address'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.addressRef}
                        onChange={event => this.resetAllError()}
                        editable={isFormEditabled}
                        onSubmitEditing={() => focusField(this.townRef)} />
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Town/City'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.townRef}
                        onChange={event => this.resetAllError()}
                        editable={isFormEditabled}
                        onSubmitEditing={() => focusField(this.postCodeRef)} />
                    <AppTextField
                        containerStyle={styles.fieldStyle} eld
                        label='Postal Code'
                        keyboardType='numeric'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.postCodeRef}
                        onChange={event => this.resetAllError()}
                        editable={isFormEditabled}
                        onSubmitEditing={() => focusField(this.notesRef)} />
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Notes'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.notesRef}
                        onChange={event => this.resetAllError()}
                        editable={isFormEditabled}
                        onSubmitEditing={() => focusField(this.referenceRef)} />
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Reference'
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        fieldRef={this.referenceRef}
                        editable={isFormEditabled}
                        onChange={event => this.resetAllError()} />
                    {this.hasAnyError() ? <Text style={{
                        color: 'red',
                        paddingVertical: 6
                    }}>Resolve All Error.</Text> : null}

                    {isFormEditabled ? <RaisedTextButton
                        title={this.isEditMode() ? 'Update' : 'Create'}
                        color={colorAccent}
                        titleColor='white'
                        style={styles.materialBtn}
                        onPress={this.validateAndProcess} /> : null}

                    <ProgressDialog visible={this.isUpdating()} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    materialBtn: {
        padding: 26,
        marginBottom: 15,
        marginTop: 12,
        fontSize: 50
    },
    fieldStyle: {
        marginTop: 20
    }
});
export default connect(
    state => ({
        contact: state.contact
    }),
    dispatch => ({
        contactActions: bindActionCreators(contactActions, dispatch)
    })
)(AddCustomerScreen);