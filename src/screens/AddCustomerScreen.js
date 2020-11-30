import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { focusField, getFieldValue, setFieldValue } from '../helpers/TextFieldHelpers';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import { isEmpty, BUSINESS_NAME_ERROR_MESSAGE, validateEmail, EMAIL_ERROR_MESSAGE } from '../helpers/Utils';

import * as contactActions from '../redux/actions/contactActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProgressDialog from '../components/ProgressDialog';
import Store from '../redux/Store';

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
        const prefix = params.contact === null ? 'Add' : 'Edit';
        const suffix = params.contactType === 'customer' ? 'Customer' : 'Supplier';
        const title = `${prefix} ${suffix}`;
        this.setState({ title });
        this.props.navigation.setOptions({ title });

        this.setFieldValues(params.contact);
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
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 16, flex: 1 }}>
                    <TextField
                        label='Name'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        ref={this.nameRef}
                        error={this.state.nameError}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.businessRef)} />
                    <TextField
                        label='Business Name'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        ref={this.businessRef}
                        error={this.state.businessNameError}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.emailRef)} />
                    <TextField
                        label='Email'
                        keyboardType='email-address'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        ref={this.emailRef}
                        error={this.state.emailError}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.mobileRef)} />
                    <TextField
                        label='Mobile'
                        keyboardType='numeric'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.mobileRef}
                        error={this.state.mobileError}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.telephoneRef)} />
                    <TextField
                        label='Telephone'
                        keyboardType='numeric'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.telephoneRef}
                        error={this.state.telephoneError}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.addressRef)} />
                    <TextField
                        label='Address'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.addressRef}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.townRef)} />
                    <TextField
                        label='Town/City'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.townRef}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.postCodeRef)} />
                    <TextField
                        label='Postal Code'
                        keyboardType='numeric'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.postCodeRef}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.notesRef)} />
                    <TextField
                        label='Notes'
                        keyboardType='default'
                        returnKeyType='default'
                        lineWidth={1}
                        ref={this.notesRef}
                        onChange={event => this.resetAllError()}
                        onSubmitEditing={() => focusField(this.referenceRef)} />
                    <TextField
                        label='Reference'
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        ref={this.referenceRef}
                        onChange={event => this.resetAllError()} />
                    {this.hasAnyError() ? <Text style={{
                        color: 'red',
                        paddingVertical: 6
                    }}>Resolve All Error.</Text> : null}
                    <RaisedTextButton
                        title={this.isEditMode() ? 'Update' : 'Create'}
                        color={colorAccent}
                        titleColor='white'
                        style={styles.materialBtn}
                        onPress={this.validateAndProcess} />
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