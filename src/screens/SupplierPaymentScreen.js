const { Component } = require("react");
import React from 'react';
import {
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Picker,
    FlatList,
    Text,
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
import { colorAccent } from '../theme/Color';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { isFloat, toFloat, showError } from '../helpers/Utils'
import CustomerReceiptItem from '../components/payment/CustomerReceiptItem';
import { RaisedTextButton } from 'react-native-material-buttons';
import PaymentDetailCard from '../components/payment/PaymentDetailCard';
import Menu, { MenuItem } from 'react-native-material-menu';
import bankHelper from '../helpers/BankHelper';
import Store from '../redux/Store';
import ProgressDialog from '../components/ProgressDialog';
import paymentHelper from '../helpers/PaymentHelper';
import AppTextField from '../components/AppTextField';

class SupplierPaymentScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            receivedDate: new Date(),
            showReceivedDate: false,
            payMethod: ['Select Paid Method', 'Cash', 'Current', 'Electronic', 'Credit/Debit Card', 'Paypal'],
            payMethodIndex: 0,
            receipts: [],
            showPaymentDetail: false,
            paymentDetail: {}
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
    UNSAFE_componentWillUpdate(newProps, nextState) {
        const { payment: newPayment } = newProps;
        const { payment: oldPayment } = this.props;
        if (!newPayment.fetchingSupplierPayment && oldPayment.fetchingSupplierPayment
            && newPayment.fetchSupplierPaymentError === undefined) {
            this.setState({ receipts: [...newPayment.supplierPayments] });
        }
    }
    componentDidUpdate(oldProps, oldState) {
        const { payment: oldPayment } = oldProps;
        const { payment: newPayment } = this.props;
        if (!newPayment.savingSupplierPayment && oldPayment.savingSupplierPayment) {

            if (newPayment.saveSupplierPaymentError) {
                setTimeout(() => {
                    showError(newPayment.saveSupplierPaymentError);
                }, 300);
            } else {
                this.showUpdateSuccessAlert(newPayment.supplierPaymentSaved.message)
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

    hideMenu = () => {
        this._menuRef.current.hide();
    }
    showMenu = () => {
        this._menuRef.current.show();
    }

    onOtherPaymentPress = () => {
        this.props.navigation.replace('OtherPaymentScreen')
    }
    onCustomerRefundPress = () => {
        this.props.navigation.replace('CustomerRefundScreen')
    }

    configHeader = () => {
        this.props.navigation.setOptions({
            headerRight: () => {
                return <Menu
                    ref={this._menuRef}
                    button={
                        <TouchableOpacity style={{ padding: 12 }} onPress={this.showMenu}>
                            <Icon name='more-vert' size={30} color='white' />
                        </TouchableOpacity>
                    }>
                    <MenuItem onPress={this.onOtherPaymentPress}>Other Payment</MenuItem>
                    <MenuItem onPress={this.onCustomerRefundPress}>Customer Refund</MenuItem>
                </Menu>
            }
        })
    }

    fetchSupplierPayment = () => {
        const { paymentActions } = this.props;
        paymentActions.getSupplierPayment(this._supplier.id);
    }


    supplierRef = React.createRef();
    paidIntoRef = React.createRef();
    dateReceivedRef = React.createRef();
    amountReceivedRef = React.createRef();
    referenceRef = React.createRef();

    onSupplierPress = () => {
        this.props.navigation.push('SelectSupplierScreen', {
            onSupplierSelected: item => {
                setFieldValue(this.supplierRef, item.name);
                this._supplier = { ...item }
                this.fetchSupplierPayment();
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
            amountpaid: checked ? oldReceipt.rout : 0,
            outstanding: checked ? 0 : oldReceipt.rout
        };

        const newReceipts = [...receipts];
        newReceipts.splice(index, 1, newReceipt);
        this.setState({ receipts: newReceipts }, () => {
            if (isFloat(newReceipt.rout)) {
                let amount = this._amount

                if (checked) {
                    amount += -1 * toFloat(newReceipt.rout);
                } else {
                    amount -= -1 * toFloat(newReceipt.rout);
                }
                this._amount = toFloat(amount.toFixed(2));
                setFieldValue(this.amountReceivedRef, `${this._amount}`);
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
                    keyExtractor={(item, index) => `${index}`}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    renderItem={this.renderReceiptItem}
                />
                <PaymentDetailCard
                    visible={this.state.showPaymentDetail}
                    payment={this.state.paymentDetail}
                    onCrossPress={() => this.setState({ showPaymentDetail: false })} />
                <ProgressDialog visible={payment.savingSupplierPayment} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
    renderFooter = () => {
        if (this._supplier === undefined) {
            return null;
        }
        const { payment } = this.props;
        if (payment.fetchingSupplierPayment) {
            return <View style={{ padding: 12 }}>
                <OnScreenSpinner />
            </View>
        }
        if (payment.fetchSupplierPaymentError) {
            return <View style={{ padding: 24 }}>
                <FullScreenError tryAgainClick={this.fetchSupplierPayment} />
            </View>
        }
        if (this.state.receipts.length === 0) {
            return <EmptyView message='No Receipt Available' iconName='hail' />
        }
        return null
    }

    validateAndSave = () => {
        if (!this._supplier) {
            showError('Select Supplier!')
        }
        else if (!this._bank) {
            showError('Select Bank Account!')
        }
        else if (this.state.payMethodIndex === 0) {
            showError('Select Pay Method!')
        }
        else if (!isFloat(getFieldValue(this.amountReceivedRef))
            || toFloat(getFieldValue(this.amountReceivedRef)) === 0) {
            showError('Amount Received cannot be 0')
        } else {
            this.saveSupplierPayment();
        }
    }

    saveSupplierPayment = () => {
        const selectedItems = paymentHelper.getSelectedReceipts(this.state.receipts);
        const recDate = moment(this.state.receivedDate).format('YYYY-MM-DD');
        const { authData } = Store.getState().auth;
        const body = {
            userid: authData.id,
            item: selectedItems,
            amount: getFieldValue(this.amountReceivedRef),
            sname: this._supplier ? this._supplier.id : '',
            paidto: this._bank ? this._bank.id : '',
            paidmethod: bankHelper.getPaidMethod(this.state.payMethodIndex),
            sdate: recDate,
            reference: getFieldValue(this.referenceRef),
            receipttype: "Supplier Receipt",
            adminid: 0,
            logintype: "user"
        }
        const { paymentActions } = this.props;
        paymentActions.saveSupplierPayment(body)
    }

    renderHeader = () => {
        const { payMethod, payMethodIndex, receivedDate } = this.state;
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
                    label='Supplier'
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
            <View style={{ borderWidth: 1, borderRadius: 12, borderColor: 'lightgray', marginTop: 10 }}>
                <Picker
                    selectedValue={payMethod[payMethodIndex]}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ payMethodIndex: itemIndex })}>
                    {payMethod.map((value, index) => <Picker.Item
                        label={value} value={value} key={`${index}`} />)}
                </Picker>
            </View>

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
                mode={'datetime'}
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
                editable={false}
                value={`${this._amount}`}
                fieldRef={this.amountReceivedRef} />
            <AppTextField
                containerStyle={{ marginTop: 20 }}
                label='References'
                keyboardType='default'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                value={this._reference}
                fieldRef={this.referenceRef} />
            <RaisedTextButton
                title='Save'
                color={colorAccent}
                titleColor='white'
                style={styles.materialBtn}
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
)(SupplierPaymentScreen);