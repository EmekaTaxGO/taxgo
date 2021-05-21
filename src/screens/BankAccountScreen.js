import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, Text, Picker, View, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';

import * as bankActions from '../redux/actions/bankActions';
import { bindActionCreators } from 'redux';
import { focusField, getFieldValue, setFieldValue } from '../helpers/TextFieldHelpers';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import ProgressDialog from '../components/ProgressDialog';
import { isEmpty, showError, isInteger, isFloat, getApiErrorMsg } from '../helpers/Utils';
import { API_ERROR_MESSAGE } from '../constants/appConstant';
import Store from '../redux/Store';
import moment from 'moment';
import bankHelper from '../helpers/BankHelper';
import AppTextField from '../components/AppTextField';
import AppPicker from '../components/AppPicker';
import AppButton from '../components/AppButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


class BankAccountScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accTypeIndex: 0,
            accTypes: bankHelper.getAccTypeArray()
        }
    }

    showAccInfo = true

    accNameRef = React.createRef();
    accNumRef = React.createRef();
    openingBalRef = React.createRef();
    nominalCodeRef = React.createRef();
    ibanNumRef = React.createRef();
    swiftCodeRef = React.createRef();
    sortCode1Ref = React.createRef();
    sortCode2Ref = React.createRef();
    sortCode3Ref = React.createRef();
    ccRef = React.createRef();

    accountData = () => {
        const { account } = this.props.route.params;
        return account
    }

    isEditMode = () => {
        return this.accountData() !== undefined;
    }


    componentDidMount() {
        this.setTitle();

        if (this.showAccInfo) {

        }
    }

    UNSAFE_componentWillMount() {
        if (this.isEditMode()) {
            this.setAllFields()
        }
    }
    setAllFields = () => {
        const account = this.accountData()
        const accTypeIndex = this.getAccTypeIndex(account.acctype)

        this.setState({ accTypeIndex }, () => {

            // setFieldValue(this.accNumRef, account.accnum)
            // setFieldValue(this.openingBalRef, `${account.opening}`)
            // setFieldValue(this.nominalCodeRef, account.nominalcode)
            // setFieldValue(this.ibanNumRef, account.ibannum)
            // setFieldValue(this.swiftCodeRef, account.bicnum)
        })
    }

    getAccTypeIndex = accType => {
        switch (accType) {
            case 'savings':
                return 1;
            case 'card':
                return 2;
            case 'cash':
                return 3;
            case 'loan':
                return 4;
            case 'other':
                return 5
            default:
                return 0;
        }
    }
    getAccType = index => {
        switch (index) {
            case 1:
                return 'savings'
            case 2:
                return 'card'
            case 3:
                return 'cash'
            case 4:
                return 'loan'
            case 5:
                return 'other'
            default:
                return 'current'
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { bank: oldBank } = prevProps
        const { bank: newBank } = this.props
        if (oldBank.updatingBankDetail && !newBank.updatingBankDetail) {
            if (newBank.updateBankDetailError) {
                //Case of error
                setTimeout(() => {
                    showError(newBank.updateBankDetailError)
                }, 400)
            } else {
                this.showBankUpdatedMessage(newBank.updateBankData.message)
            }
        }
    }

    showBankUpdatedMessage = (message) => {
        Alert.alert('Alert', message, [
            {
                style: 'default',
                text: 'OK',
                onPress: () => {
                    this.props.route.params.onBankUpdated()
                    this.props.navigation.goBack()
                }
            }
        ], { cancelable: false })
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

        } else if (isEmpty(getFieldValue(this.nominalCodeRef))) {
            showError('Please enter nominal code.');

        } else {
            this.updateBankAccount();
        }
        // else if (isEmpty(getFieldValue(this.accNumRef))) {
        //     showError('Please enter a/c number.');

        // } else if (!isInteger(getFieldValue(this.accNumRef))) {
        //     showError('Please enter valid a/c number.');

        // } else if (isEmpty(getFieldValue(this.openingBalRef))) {
        //     showError('Please enter opening balance.');

        // } else if (!isFloat(getFieldValue(this.openingBalRef))) {
        //     showError('Please enter valid opening balance');

        // }  else if (isEmpty(getFieldValue(this.ibanNumRef))) {
        //     showError('Please enter IBAN no.');

        // } else if (isEmpty(getFieldValue(this.swiftCodeRef))) {
        //     showError('Please enter SWIFT code.');

        // }
    }

    updateBankAccount = () => {
        const { bankActions } = this.props;
        const { authData } = Store.getState().auth
        const { accTypeIndex } = this.state
        const showAccNum = this.showAccNum()
        const account = this.accountData()
        const date = moment().format('MM-DD-YY')
        const body = {
            id: account ? account.id : undefined,
            type: account ? '2' : '1',
            userid: `${authData.id}`,
            acctype: this.getAccType(accTypeIndex),
            laccount: getFieldValue(this.accNameRef),
            accnum: showAccNum ? getFieldValue(this.accNumRef) : '',
            cardnum: this.showCreditCard() ? getFieldValue(this.ccRef) : '',
            nominalcode: getFieldValue(this.nominalCodeRef),
            sortcode1: showAccNum ? getFieldValue(this.sortCode1Ref) : undefined,
            sortcode2: showAccNum ? getFieldValue(this.sortCode2Ref) : undefined,
            sortcode3: showAccNum ? getFieldValue(this.sortCode3Ref) : undefined,
            ibannum: showAccNum ? getFieldValue(this.ibanNumRef) : undefined,
            bicnum: showAccNum ? getFieldValue(this.swiftCodeRef) : undefined,
            opening: getFieldValue(this.openingBalRef),
            adminid: "",
            logintype: "user",
            sdate: date,
            userdate: date
        }
        // console.log('Prepared Data', JSON.stringify(body));
        bankActions.updateBankDetails(body);
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

    showAccNum = () => {
        const { accTypeIndex } = this.state
        return accTypeIndex === 0
            || accTypeIndex === 1
            || accTypeIndex === 4
    }

    showCreditCard = () => {
        const { accTypeIndex } = this.state
        return accTypeIndex === 2
    }

    render() {
        const { accTypes, accTypeIndex } = this.state;
        const { updatingBankDetail } = this.props.bank
        const account = this.accountData()
        const showAccNum = this.showAccNum()
        const editMode = this.isEditMode()
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAwareScrollView style={{ flex: 1 }}>
                <Text style={{
                    paddingLeft: 15,
                    paddingTop: 14,
                    fontSize: 14
                }}>A/C Type*</Text>

                <AppPicker
                    style={styles.picker}
                    selectedValue={accTypes[accTypeIndex].label}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ accTypeIndex: itemIndex })}>

                    {accTypes.map((value, index) => <Picker.Item
                        label={value.label} value={value.label} key={`${value.id}`} />)}
                </AppPicker>
                <View style={{ paddingHorizontal: 16 }}>
                    <AppTextField
                        containerStyle={{ marginTop: 20 }}
                        label='A/c Name'
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        title='*required'
                        value={account ? account.laccount : ''}
                        fieldRef={this.accNameRef} />
                    {showAccNum ? <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='A/c Number'
                        keyboardType='number-pad'
                        returnKeyType='done'
                        lineWidth={1}
                        title='*required'
                        fieldRef={this.accNumRef}
                        value={account ? account.accnum : ''} /> : null}
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Opening Bal'
                        keyboardType='numeric'
                        returnKeyType='done'
                        lineWidth={1}
                        title='*required'
                        fieldRef={this.openingBalRef}
                        value={account ? `${account.opening}` : ''} />
                    <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Nominal Code'
                        keyboardType='numeric'
                        returnKeyType='done'
                        lineWidth={1}
                        title='*required'
                        fieldRef={this.nominalCodeRef}
                        disabled={editMode}
                        value={account ? account.nominalcode : ''} />
                    {this.showCreditCard() ? <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Credit Card Last 4 digit No.'
                        keyboardType='numeric'
                        returnKeyType='done'
                        lineWidth={1}
                        title='*required'
                        fieldRef={this.ccRef}
                        value={account ? account.cardnum : ''} /> : null}

                    {showAccNum ? <AppTextField
                        containerStyle={styles.fieldStyle}
                        keyboardType='default'
                        label='IBAN No.'
                        returnKeyType='done'
                        lineWidth={1}
                        title='*required'
                        fieldRef={this.ibanNumRef}
                        value={account ? account.ibannum : ''} /> : null}
                    {showAccNum ? <AppTextField
                        containerStyle={styles.fieldStyle}
                        label='Bic/Swift'
                        returnKeyType='done'
                        keyboardType='default'
                        lineWidth={1}
                        title='*required'
                        value={account ? account.bicnum : ''}
                        fieldRef={this.swiftCodeRef}
                    /> : null}
                    {showAccNum ? <View style={{ flexDirection: 'row', marginTop: 12 }}>
                        <AppTextField
                            containerStyle={{ flex: 1, marginRight: 8 }}
                            label='Sort Code 1'
                            returnKeyType='done'
                            lineWidth={1}
                            value={account ? account.sortcode1 : ''}
                            fieldRef={this.sortCode1Ref}
                        />
                        <AppTextField
                            containerStyle={{ flex: 1, marginRight: 8 }}
                            label='Sort Code 2'
                            returnKeyType='done'
                            lineWidth={1}
                            value={account ? account.sortcode2 : ''}
                            fieldRef={this.sortCode2Ref}
                        />
                        <AppTextField
                            containerStyle={{ flex: 1 }}
                            label='Sort Code 3'
                            returnKeyType='done'
                            lineWidth={1}
                            value={account ? account.sortcode3 : ''}
                            fieldRef={this.sortCode3Ref}
                        />
                    </View> : null}
                    {/* <RaisedTextButton
                            containerStyle={styles.fieldStyle}
                            title={editMode ? 'Update' : 'Save'}
                            color={colorAccent}
                            titleColor='white'
                            style={styles.materialBtn}
                            onPress={this.validateAndUpdate} /> */}
                    <AppButton
                        title={editMode ? 'Update' : 'Save'}
                        onPress={this.validateAndUpdate}
                    />
                </View>
                <ProgressDialog visible={updatingBankDetail} />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    }
};
const styles = StyleSheet.create({
    materialBtn: {
        padding: 26,
        marginTop: 15,
        marginBottom: 40,
        fontSize: 50
    },
    fieldStyle: {
        marginTop: 16
    },
    picker: {
        marginHorizontal: 14,
        marginTop: 10,
        marginBottom: 10
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