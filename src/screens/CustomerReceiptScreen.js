const { Component } = require("react");
import React from 'react';
import {
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DATE_FORMAT } from '../constants/appConstant';
import { setFieldValue, getFieldValue } from '../helpers/TextFieldHelpers';
import moment from 'moment';
import { connect } from 'react-redux';
import * as paymentActions from '../redux/actions/paymentActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner'
import FullScreenError from '../components/FullScreenError'
import EmptyView from '../components/EmptyView';
import { isFloat, toFloat, showError, toNum } from '../helpers/Utils'
import CustomerReceiptItem from '../components/payment/CustomerReceiptItem';
import PaymentDetailCard from '../components/payment/PaymentDetailCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu, { MenuItem } from 'react-native-material-menu';
import paymentHelper from '../helpers/PaymentHelper';
import Store from '../redux/Store';
import bankHelper from '../helpers/BankHelper';
import ProgressDialog from '../components/ProgressDialog';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import AppPicker2 from '../components/AppPicker2';
class CustomerReceiptScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            receivedDate: new Date(),
            showReceivedDate: false,
            payMethod: ['Select Paid Method', 'Cash', 'Current', 'Electronic', 'Credit/Debit Card', 'Paypal'],
            payMethodIndex: 0,
            receipts: [],
            showPaymentDetail: false,
            paymentDetail: {},
            disableAmountReceived: false
        }
    }

    _menuRef = React.createRef()
    _customer;
    _bank;
    _amount = 0;
    _reference;

    componentDidMount() {
        this.configHeader()
    }

    componentDidUpdate(oldProps, oldState) {
        const { payment: oldPayment } = oldProps;
        const { payment: newPayment } = this.props;

        if (!newPayment.savingCustomerReceipt && oldPayment.savingCustomerReceipt) {

            if (newPayment.saveCustomerReceiptError) {
                setTimeout(() => {
                    showError(newPayment.saveCustomerReceiptError);
                }, 500);
            } else {
                this.showUpdateSuccessAlert(newPayment.savedCustomerReceipt.message)
            }
        }
    }

    showUpdateSuccessAlert = (message) => {
        Alert.alert('Alert', message, [
            {
                style: 'default',
                text: 'OK',
                onPress: () => { this.props.navigation.goBack() }
            }
        ], { cancelable: false })
    }

    onOtherReceiptPress = () => {
        this.hideMenu()
        this.props.navigation.replace('OtherReceiptScreen')
    }
    onSupplierRefundPress = () => {
        this.hideMenu()
        this.props.navigation.replace('SupplierRefundScreen')
    }
    hideMenu = () => {
        this._menuRef.current.hide();
    }
    showMenu = () => {
        this._menuRef.current.show();
    }

    configHeader = () => {
        this.props.navigation.setOptions({
            headerRight: () => {
                return <Menu
                    ref={this._menuRef}
                    button={
                        <TouchableOpacity style={{ paddingRight: 12 }} onPress={this.showMenu}>
                            <Icon name='more-vert' size={30} color='white' />
                        </TouchableOpacity>
                    }>
                    <MenuItem onPress={this.onOtherReceiptPress}>Other Receipt</MenuItem>
                    <MenuItem onPress={this.onSupplierRefundPress}>Supplier Refund</MenuItem>
                </Menu>
            }
        })
    }
    UNSAFE_componentWillUpdate(newProps, nextState) {
        const { payment: newPayment } = newProps;
        const { payment: oldPayment } = this.props;
        if (!newPayment.fetchingCustomerPayment && oldPayment.fetchingCustomerPayment
            && newPayment.fetchCustomerPaymentError === undefined) {
            this.setState({ receipts: [...newPayment.customerPayments] });
        }
    }

    fetchCustomerPayment = () => {
        const { paymentActions } = this.props;
        paymentActions.getCustomerPayment(this._customer.id);
    }


    customerRef = React.createRef();
    paidIntoRef = React.createRef();
    dateReceivedRef = React.createRef();
    amountReceivedRef = React.createRef();
    referenceRef = React.createRef();

    onCustomerPress = () => {
        this.props.navigation.push('SelectCustomerScreen', {
            onCustomerSelected: item => {
                setFieldValue(this.customerRef, item.name);
                this._customer = item
                this.fetchCustomerPayment();
            }
        });
    }
    onPaidIntoPress = () => {
        this.props.navigation.push('SelectBankScreen', {
            onBankSelected: bank => {
                this._bank = { ...bank };
                setFieldValue(this.paidIntoRef, this.bankName(bank))
            }
        })
    }
    bankName = bank => {
        if (bank === undefined) {
            return '';
        }
        const bankTitle = `${bank.nominalcode}-${bank.laccount}`;
        return bankTitle;
    }

    onReceiveDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.receivedDate;
        this.setState({
            receivedDate: currentDate,
            showReceivedDate: false
        }, () => {
            setFieldValue(this.dateReceivedRef, this.formattedDate(currentDate));
        });
    }

    formattedDate = date => {
        return date ? moment(date).format(DATE_FORMAT) : '';
    }

    onCheckChange = (checked, index) => {
        const { receipts } = this.state;
        const oldReceipt = receipts[index];
        const newReceipt = {
            ...oldReceipt,
            checked: checked ? '1' : '0',
            amountpaid: checked ? oldReceipt.outstanding : 0,
            outstanding: checked ? 0 : oldReceipt.amountpaid
        };

        const newReceipts = [...receipts];
        newReceipts.splice(index, 1, newReceipt);


        let disableAmountReceived = false;
        let total = 0;
        for (let idx = 0; idx < newReceipts.length; idx++) {
            if (newReceipts[idx].checked === '1') {
                disableAmountReceived = true;
            }
            total += toNum(newReceipts[idx].amountpaid)
        }
        total = Math.abs(total)

        this.setState({ receipts: newReceipts, disableAmountReceived }, () => {

            if (disableAmountReceived) {
                this._amount = total
                setFieldValue(this.amountReceivedRef, '0.00')
            } else {
                this._amount = toNum(getFieldValue(this.amountReceivedRef))
            }
        });
    }

    onPressVisibility = (item) => {
        this.setState({
            showPaymentDetail: true,
            paymentDetail: { ...item }
        });
    }

    renderReceiptItem = ({ item, index }) => {
        return <CustomerReceiptItem
            item={item}
            index={index}
            onCheckChange={this.onCheckChange}
            onPressVisibility={this.onPressVisibility} />
    }

    render() {
        const { payment } = this.props;
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <KeyboardAwareFlatList
                    data={this.state.receipts}
                    keyExtractor={(item, index) => item.id}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    renderItem={this.renderReceiptItem}
                />
                <PaymentDetailCard
                    visible={this.state.showPaymentDetail}
                    payment={this.state.paymentDetail}
                    onCrossPress={() => this.setState({ showPaymentDetail: false })} />
                <ProgressDialog visible={payment.savingCustomerReceipt} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
    renderFooter = () => {
        if (this._customer === undefined) {
            return null;
        }
        const { payment } = this.props;
        if (payment.fetchingCustomerPayment) {
            return <View style={{ padding: 12 }}>
                <OnScreenSpinner />
            </View>
        }
        if (payment.fetchCustomerPaymentError) {
            return <View style={{ padding: 24 }}>
                <FullScreenError tryAgainClick={this.fetchCustomerPayment} />
            </View>
        }
        if (this.state.receipts.length === 0) {
            return <EmptyView message='No Receipt Available' iconName='hail' />
        }
        return null
    }

    validateAndSave = () => {
        if (!this._customer) {
            showError('Select Customer!')
        }
        else if (!this._bank) {
            showError('Select Bank Paid Into!')
        }
        else if (this.state.payMethodIndex === 0) {
            showError('Select Paid Method')
        }
        else if (this._amount <= 0) {
            showError('Amount received cannot be zero')
        }
        else {
            this.saveCustomerReceipt();
        }
    }

    saveCustomerReceipt = () => {
        const selectedItems = paymentHelper.getSelectedReceipts(this.state.receipts);
        const receivedDate = moment(this.state.receivedDate).format('YYYY-MM-DD');
        const { authData } = Store.getState().auth;
        const body = {
            userid: authData.id,
            item: selectedItems,
            amount: toNum(this._amount).toFixed(2),
            cname: this._customer ? this._customer.id : '',
            paidto: this._bank ? this._bank.id : '',
            paidmethod: bankHelper.getPaidMethod(this.state.payMethodIndex),
            sdate: receivedDate,
            reference: getFieldValue(this.referenceRef),
            receipttype: "Customer Receipt",
            adminid: 0,
            logintype: "user"
        }
        const { paymentActions } = this.props;
        paymentActions.saveCustomerReceipt(body);
    }


    onChangeAmountReceivedText = text => {
        this._amount = toNum(text)
    }

    renderHeader = () => {
        const { payMethod, payMethodIndex, receivedDate } = this.state;
        return <View style={{
            flexDirection: 'column',
            paddingHorizontal: 16,
            borderBottomColor: 'lightgray',
            borderBottomWidth: this._customer ? 0 : 0,
            paddingBottom: 12
        }}>
            <TouchableOpacity
                onPress={this.onCustomerPress}
                style={{ marginTop: 20 }}>
                <AppTextField
                    containerStyle={styles.fieldStyle}
                    label='Customer'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this._customer ? this._customer.name : ''}
                    fieldRef={this.customerRef} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={this.onPaidIntoPress}
                style={{ marginTop: 20 }}>
                <AppTextField
                    containerStyle={styles.fieldStyle}
                    label='Paid Into'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this.bankName(this._bank)}
                    fieldRef={this.paidIntoRef} />
            </TouchableOpacity>
            {/* Select Method Picker */}
            <AppPicker2
                title={payMethod[payMethodIndex]}
                text='Payment Method'
                items={payMethod}
                containerStyle={styles.picker}
                onChange={idx => this.setState({ payMethodIndex: idx })} />
            <TouchableOpacity
                onPress={() => this.setState({ showReceivedDate: true })}
                style={{ marginTop: 20 }}>
                <AppTextField
                    containerStyle={styles.fieldStyle}
                    label='Date Received'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this.formattedDate(receivedDate)}
                    fieldRef={this.dateReceivedRef} />
            </TouchableOpacity>
            {this.state.showReceivedDate ? <DateTimePicker
                value={this.state.receivedDate ? this.state.receivedDate : new Date()}
                mode={'date'}
                display='default'
                maximumDate={new Date()}
                onChange={this.onReceiveDateChange}
            /> : null}
            <AppTextField
                containerStyle={{ marginTop: 20 }}
                label='Amount Received'
                keyboardType='number-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                disabled={this.state.disableAmountReceived}
                value={Math.abs(this._amount).toFixed(2)}
                fieldRef={this.amountReceivedRef}
                onChangeText={this.onChangeAmountReceivedText} />
            <AppTextField
                containerStyle={{ marginTop: 20 }}
                label='References'
                keyboardType='default'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                value={this._reference}
                fieldRef={this.referenceRef} />
            <AppButton
                title='Save'
                onPress={this.validateAndSave} />
        </View>

    }
}
const styles = StyleSheet.create({
    fieldStyle: {
        marginTop: 0
    },
    materialBtn: {
        padding: 26,
        marginTop: 16,
        fontSize: 50
    },
    picker: {
        marginTop: 12
    }
})
export default connect(
    state => ({
        payment: state.payment
    }),
    dispatch => ({
        paymentActions: bindActionCreators(paymentActions, dispatch)
    })
)(CustomerReceiptScreen);