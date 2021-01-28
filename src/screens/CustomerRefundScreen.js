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
import { setFieldValue, getFieldValue } from '../helpers/TextFieldHelpers';
import moment from 'moment';
import { connect } from 'react-redux';
import * as paymentActions from '../redux/actions/paymentActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner'
import FullScreenError from '../components/FullScreenError'
import EmptyView from '../components/EmptyView';
import CheckBox from '@react-native-community/checkbox';
import { colorAccent, colorWhite } from '../theme/Color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { isFloat, toFloat } from '../helpers/Utils'
import CustomerReceiptItem from '../components/payment/CustomerReceiptItem';
import { RaisedTextButton } from 'react-native-material-buttons';
import PaymentDetailCard from '../components/payment/PaymentDetailCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu, { MenuItem } from 'react-native-material-menu';
import Snackbar from 'react-native-snackbar';

class CustomerRefundScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            paidDate: new Date(),
            showPaidDate: false,
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

    onSupplierPaymentPress = () => {
        this.hideMenu()
        this.props.navigation.replace('SupplierPaymentScreen')
    }
    onOtherPaymentPress = () => {
        this.hideMenu()
        this.props.navigation.replace('OtherPaymentScreen')
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
                        <TouchableOpacity style={{ padding: 12 }} onPress={this.showMenu}>
                            <Icon name='more-vert' size={30} color='white' />
                        </TouchableOpacity>
                    }>
                    <MenuItem onPress={this.onSupplierPaymentPress}>Supplier Payment</MenuItem>
                    <MenuItem onPress={this.onOtherPaymentPress}>Other Payment</MenuItem>
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

    fetchRefundPayment = () => {
        const { paymentActions } = this.props;
        paymentActions.getSupplierRefund(this._supplier.id);
    }


    supplierRef = React.createRef();
    paidIntoRef = React.createRef();
    datePaidRef = React.createRef();
    amountPaidRef = React.createRef();
    referenceRef = React.createRef();

    onCustomerPress = () => {
        this.props.navigation.push('SelectSupplierScreen', {
            onSupplierSelected: item => {
                setFieldValue(this.supplierRef, item.name);
                this._supplier = item.name
                this.fetchRefundPayment();
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
                    amount += -1 * toFloat(newReceipt.total);
                } else {
                    amount -= -1 * toFloat(newReceipt.total);
                }
                this._amount = amount;
                setFieldValue(this.amountPaidRef, `${this._amount}`);
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
                <FullScreenError tryAgainClick={this.fetchRefundPayment} />
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
        else if (!isFloat(getFieldValue(this.amountPaidRef)) || toFloat(getFieldValue(this.amountPaidRef))) {
            this.showError('Refund Amount cannot be 0')
        }
        else {
            this.refundSupplier()
        }
    }

    refundSupplier = () => {

    }

    showError = message => {
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
            action: {
                text: 'OK',
                textColor: colorWhite,
                onPress: () => { }
            }
        });
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
                onPress={this.onCustomerPress}
                style={{ marginTop: 20 }}>
                <OutlinedTextField
                    containerStyle={styles.fieldStyle}
                    label='Supplier Name'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this._supplier ? this._supplier.name : ''}
                    ref={this.supplierRef} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={this.onPaidIntoPress}
                style={{ marginTop: 20 }}>
                <OutlinedTextField
                    containerStyle={styles.fieldStyle}
                    label='Paid Into Bank Account'
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
                onPress={() => this.setState({ showPaidDate: true })}
                style={{ marginTop: 20 }}>
                <OutlinedTextField
                    containerStyle={styles.fieldStyle}
                    label='Date Paid'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this.formattedDate(paidDate)}
                    ref={this.datePaidRef} />
            </TouchableOpacity>
            {this.state.showPaidDate ? <DateTimePicker
                value={this.state.paidDate ? this.state.paidDate : new Date()}
                mode={'datetime'}
                display='default'
                maximumDate={new Date()}
                onChange={this.onPaidDateChange}
            /> : null}
            <OutlinedTextField
                containerStyle={{ marginTop: 20 }}
                label='Amount Refunded'
                keyboardType='number-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                value={`${this._amount}`}
                ref={this.amountPaidRef} />
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
)(CustomerRefundScreen);