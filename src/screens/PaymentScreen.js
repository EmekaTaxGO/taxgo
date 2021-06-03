import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppTextField from '../components/AppTextField';
import bankHelper from '../helpers/BankHelper';
import timeHelper from '../helpers/TimeHelper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CUSTOMER_PURCHASE_PAYMENT, CUSTOMER_SALES_PAYMENT, DATE_FORMAT, H_DATE_FORMAT } from '../constants/appConstant';
import { getFieldValue, setFieldValue } from '../helpers/TextFieldHelpers';
import { CreditCardInput } from 'react-native-credit-card-input';
import AppButton from '../components/AppButton';
import { isNaN, toNumber } from 'lodash';
import ProgressDialog from '../components/ProgressDialog';
import Api from '../services/api';
import { getApiErrorMsg, toFloat } from '../helpers/Utils';
import Store from '../redux/Store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppPicker2 from '../components/AppPicker2';

class PaymentScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            paymentMode: ['Select Payment', 'Live Payment', 'Record payment'],
            paymentIndex: 2,
            payMethod: bankHelper.getPaidMethodArray(),
            payMethodIndex: 0,
            payDate: new Date(),
            showPayDateDialog: false,
            paying: false,
            enableBtn: false
        }
    }

    _bank = undefined;
    bankRef = React.createRef();
    accNameRef = React.createRef();
    accNumRef = React.createRef();
    accTypeRef = React.createRef();
    swiftCodeRef = React.createRef();
    ibanNumRef = React.createRef();
    amtPaidRef = React.createRef();
    outAmtRef = React.createRef();
    payDateRef = React.createRef();
    // bankRef = React.createRef();
    // bankRef = React.createRef();
    // bankRef = React.createRef();


    componentDidMount() {

        this.setTextFieldValue();
    }

    setTextFieldValue = () => {
        setTimeout(() => {
            const { payload } = this.props.route.params;
            setFieldValue(this.outAmtRef, payload.outstanding);
        }, 500);
    }
    onPayDateChange = (event, selectedDate) => {
        if (event.type !== 'set') {
            this.setState({ showPayDateDialog: false });
            return;
        }
        const currentDate = selectedDate || this.state.payDate;
        this.setState({
            payDate: currentDate,
            showPayDateDialog: false
        }, () => {
            setFieldValue(this.payDateRef, timeHelper.format(currentDate, DATE_FORMAT));
        });
    }
    setAllBankFields = () => {
        const bank = this._bank;
        setFieldValue(this.bankRef, bankHelper.getBankName(bank));
        setFieldValue(this.accNameRef, bank.laccount);
        setFieldValue(this.accNumRef, bank.accnum);

        setFieldValue(this.accTypeRef, bank.acctype);
        setFieldValue(this.swiftCodeRef, bank.bicnum);
        setFieldValue(this.ibanNumRef, bank.ibannum);
    }

    onBankPress = () => {
        this.props.navigation.push('SelectBankScreen', {
            onBankSelected: bank => {
                this._bank = { ...bank };
                const payMethodIndex = bankHelper.getPayMethodIndex(bank.paidmethod);
                this.setState({
                    payMethodIndex: payMethodIndex,
                    enableBtn: this.enableBtn()
                }, () => {
                    this.setAllBankFields();
                })

            }
        })
    }

    onChangeAmtToPay = text => {
        const { payload } = this.props.route.params;
        let num = toNumber(text);
        let outstanding = toNumber(payload.outstanding);
        if (!isNaN(num)) {
            const leftOutstanding = outstanding - num;
            setFieldValue(this.outAmtRef, leftOutstanding.toFixed(2));
        } else {
            setFieldValue(this.outAmtRef, outstanding.toFixed(2));
        }
        setTimeout(() => {
            this.setState({ enableBtn: this.enableBtn() });
        }, 200);


    }

    enableBtn = () => {

        const amtPaid = toNumber(getFieldValue(this.amtPaidRef));
        const enableBtn = (this._bank && !isNaN(amtPaid) && amtPaid > 0);
        return enableBtn;
    }

    renderRecordPayment = () => {
        const bank = this._bank;
        const { payMethod, payMethodIndex } = this.state;
        // const isCreditNote = this.isCreditNote();
        return <View style={{
            flexDirection: 'column',
            paddingBottom: 12
        }}>
            <TouchableOpacity onPress={this.onBankPress}>
                <AppTextField
                    containerStyle={styles.textField}
                    label='Bank'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    lineWidth={1}
                    value={bankHelper.getBankName(bank)}
                    title='*required'
                    editable={false}
                    fieldRef={this.bankRef} />

            </TouchableOpacity>
            <AppTextField
                containerStyle={styles.textField}
                label='A/c Name'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                fieldRef={this.accNameRef}
                value={bank ? bank.laccount : ''} />
            <AppTextField
                containerStyle={styles.textField}
                label='A/c No.'
                keyboardType='number-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                fieldRef={this.accNumRef}
                value={bank ? bank.accnum : ''} />
            <AppTextField
                containerStyle={styles.textField}
                label='A/c Type'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                value={bank ? bank.acctype : ''}
                fieldRef={this.accTypeRef} />
            <AppTextField
                containerStyle={styles.textField}
                label='BIC/Swift'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                editable={false}
                title='*required'
                value={bank ? bank.bicnum : ''}
                fieldRef={this.swiftCodeRef} />

            <AppTextField
                containerStyle={styles.textField}
                label='IBAN No'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                editable={false}
                value={bank ? bank.ibannum : ''}
                fieldRef={this.ibanNumRef} />

            {/* {isCreditNote ? <AppTextField
                containerStyle={styles.textField}
                label='Reference'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                fieldRef={this.refNumRef}
                value={this._reference}
                onChangeText={text => this._reference = text} /> : null} */}

            <AppTextField
                containerStyle={styles.textField}
                label='Amount to be Paid'
                keyboardType='number-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                fieldRef={this.amtPaidRef}
                onChangeText={this.onChangeAmtToPay} />
            <AppTextField
                containerStyle={styles.textField}
                label='Out. Amount'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                fieldRef={this.outAmtRef} />
            {/* Select Method Picker */}
            <View style={styles.pickerBox}>
                <AppPicker2
                    containerStyle={{ marginHorizontal: 16, marginTop: 12 }}
                    title={payMethod[payMethodIndex]}
                    items={payMethod}
                    onChange={idx => this.setState({ payMethodIndex: idx })}
                    text='Select Pay Method' />
            </View>

            <TouchableOpacity
                style={{ marginTop: 12 }}
                onPress={() => this.setState({ showPayDateDialog: true })}>
                <AppTextField
                    containerStyle={styles.textField}
                    label='Pay Date'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={timeHelper.format(this.state.payDate, DATE_FORMAT)}
                    fieldRef={this.payDateRef} />
            </TouchableOpacity>
            {this.state.showPayDateDialog ? <DateTimePicker
                value={this.state.payDate}
                mode={'date'}
                display='default'
                minimumDate={new Date()}
                onChange={this.onPayDateChange}
            /> : null}
        </View>
    }

    onCreditCardInfoChange = form => {
        log('Card Info', form);
    }

    renderCardInfo = () => {
        return <View style={{
            flexDirection: 'column',
            paddingHorizontal: 12,
            paddingVertical: 16
        }}>
            <CreditCardInput
                onChange={this.onCreditCardInfoChange}
            />
        </View>

    }

    buildRequest = payload => {
        const { authData } = Store.getState().auth;
        const amtNum = Number(getFieldValue(this.amtPaidRef));
        const outstanding = toFloat(getFieldValue(this.outAmtRef));
        if (payload.source === CUSTOMER_SALES_PAYMENT) {
            return {
                adminid: 0,
                bankid: this._bank.id,
                date: timeHelper.format(this.state.payDate, H_DATE_FORMAT),
                logintype: "usertype",
                outstanding: outstanding < 0 ? 0 : outstanding,
                paidmethod: bankHelper.getPaidMethod(this.state.payMethodIndex),
                type: 'Customer Payment',
                userid: authData.id,
                amount: `${amtNum}`,
                status: outstanding > 0 ? 1 : 2,
                ...payload.payment_request
            }
        }
        else if (payload.source === CUSTOMER_PURCHASE_PAYMENT) {
            return {
                adminid: 0,
                bankid: this._bank.id,
                date: timeHelper.format(this.state.payDate, H_DATE_FORMAT),
                logintype: "usertype",
                outstanding: outstanding < 0 ? 0 : outstanding,
                paidmethod: bankHelper.getPaidMethod(this.state.payMethodIndex),
                type: 'Supplier Payment',
                userid: authData.id,
                amount: `${amtNum}`,
                status: amtNum < outstanding ? 1 : 2,
                ...payload.payment_request
            }
        }
    }

    onPayPress = () => {
        const { payload, onSuccess } = this.props.route.params;
        const body = this.buildRequest(payload);

        this.setState({ paying: true });
        Api.post(payload.url, body)
            .then(response => {
                this.setState({ paying: false }, () => {
                    onSuccess(response.data);
                    this.props.navigation.goBack();
                })
            })
            .catch(err => {
                console.log('Error in paying', err);
                showError(getApiErrorMsg(err));
            })

    }

    renderPaymentChooser = () => {
        return (
            <AppPicker2
                containerStyle={{ marginHorizontal: 16, marginTop: 16 }}
                title={this.state.paymentMode[this.state.paymentIndex]}
                items={this.state.paymentMode}
                onChange={idx => this.setState({ paymentIndex: idx })}
                text='Select Payment Mode' />
        )
    }

    render() {
        const { payload } = this.props.route.params;

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <KeyboardAwareScrollView style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'column' }}>
                            {payload.showPaymentChooser ? this.renderPaymentChooser() : null}
                            {this.state.paymentIndex === 2 ? this.renderRecordPayment() : null}
                            {this.state.paymentIndex === 1 ? this.renderCardInfo() : null}
                        </View>

                    </KeyboardAwareScrollView>
                </View>
                <AppButton
                    disabled={!this.state.enableBtn}
                    containerStyle={styles.btnStyle}
                    title='Pay'
                    onPress={this.onPayPress}
                />
                <ProgressDialog visible={this.state.paying} />
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    textField: {
        marginTop: 18,
        marginHorizontal: 16
    },
    btnStyle: {
        marginHorizontal: 16
    }
})
export default PaymentScreen;