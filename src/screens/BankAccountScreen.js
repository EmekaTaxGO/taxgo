import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, Text, Picker, View, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';

import * as bankActions from '../redux/actions/bankActions';
import { bindActionCreators } from 'redux';
import { TextField } from 'react-native-material-textfield';
import { focusField, getFieldValue } from '../helpers/TextFieldHelpers';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import ProgressDialog from '../components/ProgressDialog';
import { isEmpty, showError, isInteger, isFloat, getApiErrorMsg } from '../helpers/Utils';


class BankAccountScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accTypeIndex: 0,
            accTypes: this.createAccountTypes()
        }
    }

    accNameRef = React.createRef();
    accNumRef = React.createRef();
    openingBalRef = React.createRef();
    nominalCodeRef = React.createRef();
    ibanNumRef = React.createRef();
    swiftCodeRef = React.createRef();

    createAccountTypes = () => {
        return [
            {
                id: '1',
                label: 'Current'
            },
            {
                id: '2',
                label: 'Savings'
            },
            {
                id: '3',
                label: 'Credit Card'
            },
            {
                id: '4',
                label: 'Cash in Hand'
            },
            {
                id: '5',
                label: 'Loan'
            },
            {
                id: '6',
                label: 'Others'
            }
        ]
    }

    isEditMode = () => {
        const { account } = this.props.route.params;
        return account !== undefined;
    }


    componentDidMount() {
        this.setTitle();
    }

    setTitle = () => {
        const prefix = this.isEditMode() ? 'Edit' : 'Add';
        this.props.navigation.setOptions({
            title: `${prefix} Bank Account`
        });
    }

    validateAndUpdate = () => {
        Keyboard.dismiss();
        if (isEmpty(getFieldValue(this.accNameRef))) {
            showError('Please enter a/c name.');

        } else if (isEmpty(getFieldValue(this.accNumRef))) {
            showError('Please enter a/c number.');

        } else if (!isInteger(getFieldValue(this.accNumRef))) {
            showError('Please enter valid a/c number.');

        } else if (isEmpty(getFieldValue(this.openingBalRef))) {
            showError('Please enter opening balance.');

        } else if (!isFloat(getFieldValue(this.openingBalRef))) {
            showError('Please enter valid opening balance');

        } else if (isEmpty(getFieldValue(this.nominalCodeRef))) {
            showError('Please enter nominal code.');

        } else if (isEmpty(getFieldValue(this.ibanNumRef))) {
            showError('Please enter IBAN no.');

        } else if (isEmpty(getFieldValue(this.swiftCodeRef))) {
            showError('Please enter SWIFT code.');

        } else {
            this.updateBankAccount();
        }
    }

    updateBankAccount = () => {
        const { bankActions } = this.props;
        const body = {};
        bankActions.updateBankDetails(body, this.onUpdateSuccess, this.onUpdateError);
    }

    onUpdateSuccess = data => {
        Alert.alert('Alert', data.message, [
            {
                style: 'default',
                onPress: () => this.props.navigation.goBack(),
                text: 'OK'
            }
        ], { cancelable: false });
    }
    onUpdateError = err => {
        setTimeout(() => {
            showError(getApiErrorMsg(err));
        }, 200);
    }

    render() {
        const { accTypes, accTypeIndex } = this.state;
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <Text style={{
                        paddingLeft: 14,
                        paddingTop: 14,
                        fontSize: 14
                    }}>A/C Type*</Text>
                    <Picker
                        style={{ marginHorizontal: 6 }}
                        selectedValue={accTypes[accTypeIndex].label}
                        mode='dropdown'
                        onValueChange={(itemValue, itemIndex) => this.setState({ accTypeIndex: itemIndex })}>

                        {accTypes.map((value, index) => <Picker.Item
                            label={value.label} value={value.label} key={`${value.id}`} />)}
                    </Picker>
                    <View style={{ paddingHorizontal: 16 }}>
                        <TextField
                            label='A/c Name'
                            keyboardType='name-phone-pad'
                            returnKeyType='next'
                            lineWidth={1}
                            title='*required'
                            ref={this.accNameRef}
                            onSubmitEditing={() => focusField(this.accNumRef)} />
                        <TextField
                            label='A/c Number'
                            keyboardType='number-pad'
                            returnKeyType='next'
                            lineWidth={1}
                            title='*required'
                            ref={this.accNumRef}
                            onSubmitEditing={() => focusField(this.openingBalRef)} />
                        <TextField
                            label='Opening Bal'
                            keyboardType='numeric'
                            returnKeyType='next'
                            lineWidth={1}
                            title='*required'
                            ref={this.openingBalRef}
                            onSubmitEditing={() => focusField(this.nominalCodeRef)} />
                        <TextField
                            label='Nominal Code'
                            keyboardType='numeric'
                            returnKeyType='next'
                            lineWidth={1}
                            title='*required'
                            ref={this.nominalCodeRef}
                            onSubmitEditing={() => focusField(this.ibanNumRef)} />
                        <TextField
                            label='IBAN No.'
                            returnKeyType='next'
                            lineWidth={1}
                            title='*required'
                            ref={this.ibanNumRef}
                            onSubmitEditing={() => focusField(this.swiftCodeRef)} />
                        <TextField
                            label='Bic/Swift'
                            returnKeyType='done'
                            lineWidth={1}
                            title='*required'
                            ref={this.swiftCodeRef}
                        />
                        <RaisedTextButton
                            title='Sign Up'
                            color={colorAccent}
                            titleColor='white'
                            style={styles.materialBtn}
                            onPress={this.validateAndUpdate} />
                    </View>
                    <ProgressDialog visible={false} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
};
const styles = StyleSheet.create({
    materialBtn: {
        padding: 26,
        marginTop: 15,
        marginBottom: 40,
        fontSize: 50
    }
});
export default connect(
    state => ({
        bank: state.bank
    }),
    dispatch => ({
        bankActions: bindActionCreators(bankActions, dispatch)
    })
)(BankAccountScreen);