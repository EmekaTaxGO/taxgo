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
    Text
} from 'react-native';
import { OutlinedTextField, FilledTextField } from 'react-native-material-textfield';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DATE_FORMAT } from '../constants/appConstant';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import moment from 'moment';
import { connect } from 'react-redux';
import * as paymentActions from '../redux/actions/paymentActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner'
import FullScreenError from '../components/FullScreenError'
import EmptyView from '../components/EmptyView';
import CheckBox from '@react-native-community/checkbox';
import { colorAccent } from '../theme/Color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { isFloat, toFloat } from '../helpers/Utils'
import CustomerReceiptItem from '../components/payment/CustomerReceiptItem';
import { RaisedTextButton } from 'react-native-material-buttons';
import PaymentDetailCard from '../components/payment/PaymentDetailCard';

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
            paymentDetail: {}
        }
    }
    _customer;
    _bank;
    _amount = 0;
    _reference;

    componentDidMount() {

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
                this._customer = item.name
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
        const newReceipt = {
            ...receipts[index],
            checked: checked ? '1' : '0'
        };

        const newReceipts = [...receipts];
        newReceipts.splice(index, 1, newReceipt);
        this.setState({ receipts: newReceipts }, () => {
            if (isFloat(newReceipt.total)) {
                let amount = this._amount

                if (checked) {
                    amount += toFloat(newReceipt.total);
                } else {
                    amount -= toFloat(newReceipt.total);
                }
                this._amount = amount;
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
                <OutlinedTextField
                    containerStyle={styles.fieldStyle}
                    label='Customer'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this._customer ? this._customer.name : ''}
                    ref={this.customerRef} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={this.onPaidIntoPress}
                style={{ marginTop: 20 }}>
                <OutlinedTextField
                    containerStyle={styles.fieldStyle}
                    label='Paid Into'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this.bankName(this._bank)}
                    ref={this.paidIntoRef} />
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
                <OutlinedTextField
                    containerStyle={styles.fieldStyle}
                    label='Date Received'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this.formattedDate(receivedDate)}
                    ref={this.dateReceivedRef} />
            </TouchableOpacity>
            {this.state.showReceivedDate ? <DateTimePicker
                value={this.state.receivedDate ? this.state.receivedDate : new Date()}
                mode={'datetime'}
                display='default'
                maximumDate={new Date()}
                onChange={this.onReceiveDateChange}
            /> : null}
            <OutlinedTextField
                containerStyle={{ marginTop: 20 }}
                label='Amount Received'
                keyboardType='number-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                value={`${this._amount}`}
                ref={this.amountReceivedRef} />
            <OutlinedTextField
                containerStyle={{ marginTop: 20 }}
                label='References'
                keyboardType='default'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                value={this._reference}
                ref={this.referenceRef} />
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
)(CustomerReceiptScreen);