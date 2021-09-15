const { Component } = require("react");
import React from 'react';
import {
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
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
import { colorWhite, errorColor } from '../theme/Color';
import { isFloat, toFloat, showError, toNum } from '../helpers/Utils'
import CustomerReceiptItem from '../components/payment/CustomerReceiptItem';
import PaymentDetailCard from '../components/payment/PaymentDetailCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu, { MenuItem } from 'react-native-material-menu';
import Snackbar from 'react-native-snackbar';
import paymentHelper from '../helpers/PaymentHelper';
import bankHelper from '../helpers/BankHelper';
import Store from '../redux/Store';
import ProgressDialog from '../components/ProgressDialog';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import AppPicker2 from '../components/AppPicker2';
import { isNaN, toNumber } from 'lodash';

class SupplierRefundScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            paidDate: new Date(),
            showPaidDate: false,
            payMethod: ['Select Paid Method', 'Cash', 'Current', 'Electronic', 'Credit/Debit Card', 'Paypal'],
            payMethodIndex: 0,
            receipts: [],
            showPaymentDetail: false,
            paymentDetail: {},
            disableAmountRefunded: false
        }
    }

    _menuRef = React.createRef()
    _supplier;
    _bank;
    _amount = 0;
    _reference;

    componentDidMount() {
        this.configHeader()
    }
    componentDidUpdate(oldProps, oldState) {
        const { payment: oldPayment } = oldProps;
        const { payment: newPayment } = this.props;

        if (!newPayment.savingSupplierRefund && oldPayment.savingSupplierRefund) {
            if (newPayment.saveSupplierRefundError) {
                setTimeout(() => {
                    showError(newPayment.saveSupplierRefundError);
                }, 300);
            } else {
                this.showUpdateSuccessAlert(newPayment.supplierRefundSaved.message)
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

    onCustomerReceiptPress = () => {
        this.hideMenu()
        this.props.navigation.replace('CustomerReceiptScreen')
    }
    onOtherReceiptPress = () => {
        this.hideMenu()
        this.props.navigation.replace('OtherReceiptScreen')
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
                    <MenuItem onPress={this.onCustomerReceiptPress}>Customer Receipt</MenuItem>
                    <MenuItem onPress={this.onOtherReceiptPress}>Other Receipt</MenuItem>
                </Menu>
            }
        })
    }
    UNSAFE_componentWillUpdate(newProps, nextState) {
        const { payment: newPayment } = newProps;
        const { payment: oldPayment } = this.props;
        if (!newPayment.fetchingSupplierRefund && oldPayment.fetchingSupplierRefund
            && newPayment.fetchSupplierRefundError === undefined) {
            this.setState({ receipts: [...newPayment.supplierRefunds] });
        }
    }

    fetchSupplierRefund = () => {
        const { paymentActions } = this.props;
        paymentActions.getSupplierRefund(this._supplier.id);
    }


    supplierRef = React.createRef();
    paidIntoRef = React.createRef();
    datePaidRef = React.createRef();
    amountRefundedRef = React.createRef();
    referenceRef = React.createRef();

    onSupplierPress = () => {
        this.props.navigation.push('SelectSupplierScreen', {
            onSupplierSelected: item => {
                setFieldValue(this.supplierRef, item.name);
                this._supplier = item
                this.fetchSupplierRefund();
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

    onPaidDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.paidDate;
        this.setState({
            paidDate: currentDate,
            showPaidDate: false
        }, () => {
            setFieldValue(this.datePaidRef, this.formattedDate(currentDate));
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
        
        let disableAmountRefunded = false;
        let total = 0;
        for (let idx = 0; idx < newReceipts.length; idx++) {
            if (newReceipts[idx].checked === '1') {
                disableAmountRefunded = true;
            }
            total += toNum(newReceipts[idx].amountpaid)
        }
        total = Math.abs(total)
        this.setState({ receipts: newReceipts, disableAmountRefunded }, () => {

            if (disableAmountRefunded) {
                this._amount = total
                setFieldValue(this.amountRefundedRef, '0.00')
            } else {
                this._amount = toNum(getFieldValue(this.amountRefundedRef))
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
                <FlatList
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
                <ProgressDialog visible={payment.savingSupplierRefund} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
    renderFooter = () => {
        if (this._supplier === undefined) {
            return null;
        }

        const { payment } = this.props;
        if (payment.fetchingSupplierRefund) {
            return <View style={{ padding: 12 }}>
                <OnScreenSpinner />
            </View>
        }
        if (payment.fetchSupplierRefundError) {
            return <View style={{ padding: 24 }}>
                <FullScreenError tryAgainClick={this.fetchSupplierRefund} />
            </View>
        }
        if (this.state.receipts.length === 0) {
            return <EmptyView message='No Receipt Available' iconName='hail' />
        }
        return null
    }

    validateAndSave = () => {
        if (!this._supplier) {
            this.showError('Select Supplier!')
        }
        else if (!this._bank) {
            this.showError('Select Bank Account!')
        }
        else if (this.state.payMethodIndex === 0) {
            this.showError('Select Pay Method')
        }
        else if (this._amount <= 0) {
            this.showError('Refund Amount cannot be 0')
        }
        else {
            this.saveSupplierRefund()
        }
    }

    saveSupplierRefund = () => {
        const selectedItems = paymentHelper.getSelectedReceipts(this.state.receipts);
        const paidDate = moment(this.state.paidDate).format('YYYY-MM-DD');
        const { authData } = Store.getState().auth;
        const body = {
            userid: authData.id,
            item: selectedItems,
            amount: toNum(this._amount).toFixed(2),
            sname: this._supplier ? this._supplier.id : '',
            paidto: this._bank ? this._bank.id : '',
            paidmethod: bankHelper.getPaidMethod(this.state.payMethodIndex),
            sdate: paidDate,
            reference: getFieldValue(this.referenceRef),
            receipttype: "Supplier Refund",
            adminid: 0,
            logintype: "user"
        }
        const { paymentActions } = this.props;
        paymentActions.saveSupplierRefund(body)
    }

    showError = message => {
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: errorColor,
            action: {
                text: 'OK',
                textColor: colorWhite,
                onPress: () => { }
            }
        });
    }

    onChangeAmountRefundedText = text => {
        this._amount = toNum(text)
    }

    renderHeader = () => {
        const { payMethod, payMethodIndex, paidDate: paidDate } = this.state;
        return <View style={{
            flexDirection: 'column',
            paddingHorizontal: 16,
            borderBottomColor: 'lightgray',
            borderBottomWidth: this._supplier ? 0 : 0,
            paddingBottom: 12
        }}>
            <TouchableOpacity
                onPress={this.onSupplierPress}
                style={{ marginTop: 20 }}>
                <AppTextField
                    containerStyle={styles.fieldStyle}
                    label='Supplier Name'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this._supplier ? this._supplier.name : ''}
                    fieldRef={this.supplierRef} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={this.onPaidIntoPress}
                style={{ marginTop: 20 }}>
                <AppTextField
                    containerStyle={styles.fieldStyle}
                    label='Paid Into Bank Account'
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
                containerStyle={{ marginTop: 12 }}
                onChange={idx => this.setState({ payMethodIndex: idx })} />

            <TouchableOpacity
                onPress={() => this.setState({ showPaidDate: true })}
                style={{ marginTop: 20 }}>
                <AppTextField
                    containerStyle={styles.fieldStyle}
                    label='Date Paid'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this.formattedDate(paidDate)}
                    fieldRef={this.datePaidRef} />
            </TouchableOpacity>
            {this.state.showPaidDate ? <DateTimePicker
                value={this.state.paidDate ? this.state.paidDate : new Date()}
                mode={'datetime'}
                display='default'
                maximumDate={new Date()}
                onChange={this.onPaidDateChange}
            /> : null}
            <AppTextField
                containerStyle={{ marginTop: 20 }}
                label='Amount Refunded'
                keyboardType='number-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                disabled={this.state.disableAmountRefunded}
                value={Math.abs(this._amount).toFixed(2)}
                fieldRef={this.amountRefundedRef}
                onChangeText={this.onChangeAmountRefundedText} />
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
    }
})
export default connect(
    state => ({
        payment: state.payment
    }),
    dispatch => ({
        paymentActions: bindActionCreators(paymentActions, dispatch)
    })
)(SupplierRefundScreen);