import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet, Picker, FlatList, Text } from 'react-native';
import AppTab from '../components/AppTab';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { DATE_FORMAT } from '../constants/appConstant';
import { setFieldValue } from '../helpers/TextFieldHelpers'
import CardView from 'react-native-cardview';
import CheckBox from '@react-native-community/checkbox';
import { colorAccent, colorWhite, colorPrimary, errorColor } from '../theme/Color';
import { connect } from 'react-redux';
import * as taxActions from '../redux/actions/taxActions';
import { bindActionCreators } from 'redux';
import { isFloat, toFloat } from '../helpers/Utils';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Snackbar from 'react-native-snackbar';
import Menu, { MenuItem } from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppTextField from '../components/AppTextField';

class OtherReceiptScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 'customer',
            payMethod: ['Select Paid Method', 'Cash', 'Current', 'Electronic', 'Credit/Debit Card', 'Paypal'],
            payMethodIndex: 0,
            receivedDate: new Date(),
            showReceivedDate: false,
            taxes: ['Select Tax Rates'],
            data: [{ ...this.ledgerItem }]
        }
    }

    ledgerItem = {
        ledger: '',
        details: '',
        amount: '',
        taxAmt: '',
        taxIndex: 0,
        includevat: '0',
        // taxAmtRef: React.createRef(),
        // totalRef: React.createRef()
    }

    customerRef = React.createRef();
    paidIntoRef = React.createRef();
    dateReceivedRef = React.createRef();
    amountReceivedRef = React.createRef();
    referenceRef = React.createRef();
    _menuRef = React.createRef()


    _customer;
    _bank;
    _amount = 0;
    _reference;


    componentDidMount() {
        this.fetchTaxList();
        this.configHeader()
    }

    showMenu = () => {
        this._menuRef.current.show();
    }
    hideMenu = () => {
        this._menuRef.current.hide();
    }
    onCustomerReceiptPress = () => {
        this.hideMenu()
        this.props.navigation.replace('CustomerReceiptScreen')
    }
    onSupplierRefundPress = () => {
        this.hideMenu()
        this.props.navigation.replace('SupplierRefundScreen')
    }
    configHeader = () => {
        this.props.navigation.setOptions({
            headerRight: () => {
                return <Menu
                    ref={this._menuRef}
                    button={
                        <TouchableOpacity style={{ paddingRight: 12 }} onPress={this.showMenu}>
                            <MaterialIcons name='more-vert' size={30} color='white' />
                        </TouchableOpacity>
                    }>
                    <MenuItem onPress={this.onCustomerReceiptPress}>Customer Receipt</MenuItem>
                    <MenuItem onPress={this.onSupplierRefundPress}>Supplier Refund</MenuItem>
                </Menu>
            }
        })
    }

    fetchTaxList = () => {
        const { taxActions } = this.props
        taxActions.getTaxList()
    }
    UNSAFE_componentWillUpdate(newProps, newState) {
        const { tax: oldTax } = this.props
        const { tax: newTax } = newProps;
        if (oldTax.fetchingTaxList && !newTax.fetchingTaxList
            && newTax.fetchTaxListError === undefined) {
            this.prepareTaxList(newTax.taxList);
        }
    }
    prepareTaxList = (taxList) => {
        const taxes = ['Select Tax Rates']
        taxList.forEach((value) => {
            taxes.push(`${value.taxtype}-${value.percentage}%`)
        })
        this.setState({ taxes: taxes })
    }
    selectTab = tab => {
        this.setState({ tab })
    }

    renderTabs = () => {
        const { tab } = this.state;
        return <View style={{ width: '100%', flexDirection: 'row' }}>

            <AppTab title='Customer'
                icon='user-circle'
                iconType='FontAwesome5Icon'
                selected={tab === 'customer'}
                onTabPress={() => this.selectTab('customer')} />

            <AppTab title='Ledger'
                icon='open-book'
                iconType='EntypoIcon'
                selected={tab === 'ledger'}
                onTabPress={() => this.selectTab('ledger')} />
        </View>
    }
    onCustomerPress = () => {
        this.props.navigation.push('SelectCustomerScreen', {
            onCustomerSelected: item => {
                setFieldValue(this.customerRef, item.name);
                this._customer = item.name
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

    renderCustomer = () => {
        const { payMethod, payMethodIndex, receivedDate } = this.state;
        return <ScrollView style={{ flex: 1 }}>
            <View style={{
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
            </View>
        </ScrollView>

    }
    onTaxChange = (itemIndex, taxIndex) => {
        const newItem = {
            ...this.state.data[itemIndex],
            taxIndex
        }
        const newItems = [...this.state.data]
        newItems.splice(itemIndex, 1, newItem)
        this.setState({ data: newItems }, () => this.onAmountChange(itemIndex))
    }

    onIncludeVatChange = (itemIndex, enabled) => {
        const newItem = {
            ...this.state.data[itemIndex],
            includevat: enabled ? '1' : '0'
        }
        const newItems = [...this.state.data]
        newItems.splice(itemIndex, 1, newItem)
        this.setState({ data: newItems },
            () => this.onAmountChange(itemIndex))
    }

    onAmountChange = (index) => {
        const item = this.state.data[index]
        const taxAmt = `${this.ledgerTaxAmt(index)}`
        setFieldValue(item.taxAmtRef, taxAmt)
        setFieldValue(item.totalRef, `${this.ledgerTotal(index)}`)
    }

    onLedgerAmountChange = (index, amount) => {
        const newItem = {
            ...this.state.data[index],
            amount
        }
        const newItems = [...this.state.data]
        newItems.splice(index, 1, newItem)
        this.setState({ data: newItems }, () => this.onAmountChange(index))
    }
    renderItem = ({ item, index }) => {
        const { taxes } = this.state;
        const size = this.state.data.length;
        const isLast = index + 1 === size;

        if (!item.taxAmtRef) {
            item.taxAmtRef = React.createRef()
        }
        if (!item.totalRef) {
            item.totalRef = React.createRef()
        }
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.card, { marginBottom: isLast ? 24 : 0 }]}>
            <View style={{
                flexDirection: 'column',
                paddingHorizontal: 16,
                paddingVertical: 24
            }}>
                <AppTextField
                    label='Ledger'
                    keyboardType='default'
                    lineWidth={1}
                    title='*required'
                    value={item.ledger}
                    onChangeText={text => item.ledger = text} />
                <AppTextField
                    containerStyle={{ marginTop: 12 }}
                    label='Details'
                    keyboardType='default'
                    lineWidth={1}
                    title='*required'
                    value={item.details}
                    onChangeText={text => item.details = text} />
                <View style={{ flexDirection: 'row', paddingTop: 12 }}>

                    <AppTextField
                        containerStyle={{ flex: 1, marginRight: 8 }}
                        label='Amount'
                        keyboardType='default'
                        lineWidth={1}
                        title='*required'
                        value={item.amount}
                        onChangeText={text => this.onLedgerAmountChange(index, text)} />
                    <AppTextField
                        containerStyle={{ flex: 1, marginLeft: 8 }}
                        label='Vat (Amt)'
                        keyboardType='default'
                        lineWidth={1}
                        title='*required'
                        fieldRef={item.taxAmtRef}
                        value={`${this.ledgerTaxAmt(index)}`}
                        disabled={true} />

                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                        borderWidth: 1,
                        borderRadius: 12,
                        borderColor: 'lightgray',
                        marginTop: 10,
                        flex: 1
                    }}>
                        <Picker
                            selectedValue={taxes[item.taxIndex]}
                            mode='dropdown'
                            onValueChange={(itemValue, itemIndex) => this.onTaxChange(index, itemIndex)}>
                            {taxes.map((value, index) => <Picker.Item
                                label={value} value={value} key={`${index}`} />)}
                        </Picker>
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingStart: 20
                    }}>
                        <Text style={{ fontSize: 15 }}>Include Vat</Text>
                        <CheckBox
                            style={{ color: colorAccent }}
                            value={item.includevat === '1'}
                            tintColors={{ true: colorAccent, false: 'gray' }}
                            label='Include Tax'
                            onValueChange={checked => this.onIncludeVatChange(index, checked)} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 }}>
                    <AppTextField
                        containerStyle={{ flex: 1, marginRight: 8 }}
                        label='Total'
                        keyboardType='default'
                        lineWidth={1}
                        title='*required'
                        disabled={true}
                        fieldRef={item.totalRef}
                        value={`${this.ledgerTotal(index)}`} />
                    {isLast ? <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                        {/* Add Button */}
                        <TouchableOpacity onPress={this.addLedgerPress} style={{ padding: 4 }}>
                            <Ionicons size={34} name='add-circle' color='green' />
                        </TouchableOpacity>

                        {/* Delete Button */}
                        {index > 0 ? <TouchableOpacity onPress={() => this.deleteLedger(index)}
                            style={{ padding: 4 }}>
                            <MaterialCommunityIcons size={34} name='delete-circle' color={errorColor} />
                        </TouchableOpacity> : null}
                    </View> : null}
                </View>
            </View>
        </CardView>
    }

    deleteLedger = (index) => {
        let newItems = [...this.state.data];
        newItems.splice(index, 1)
        this.setState({ data: newItems }, () => {
            Snackbar.show({
                text: 'Ledger Deleted.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: errorColor,
                action: {
                    text: 'OK',
                    textColor: colorWhite,
                    onPress: () => { }
                }
            })
        })
    }

    addLedgerPress = () => {
        const newItems = [...this.state.data, this.ledgerItem]
        this.setState({ data: newItems }, () => {
            this.setState({ data: newItems }, () => {
                Snackbar.show({
                    text: 'Ledger Added successfully.',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'black',
                    action: {
                        text: 'OK',
                        textColor: colorWhite,
                        onPress: () => { }
                    }
                })
            })
        })

    }

    ledgerAmount = (index) => {
        const item = this.state.data[index];
        if (isFloat(item.amount)) {
            return toFloat(item.amount)
        } else {
            return 0
        }
    }

    taxPercentage = (index) => {
        const item = this.state.data[index];
        const taxIndex = item.taxIndex
        if (taxIndex === 0) {
            return 0
        }
        const currentTax = this.props.tax.taxList[taxIndex - 1];

        if (isFloat(currentTax.percentage)) {
            return currentTax.percentage
        } else {
            return 0;
        }
    }

    ledgerTaxAmt = (index) => {
        const item = this.state.data[index];
        const includeVat = item.includevat === '1';
        const amount = this.ledgerAmount(index);
        const taxPercentage = this.taxPercentage(index);

        let taxAmt = 0.0;
        if (includeVat) {
            const principal = (amount * 100) / (100 + taxPercentage);
            taxAmt = amount - principal;
        } else {
            taxAmt = (taxPercentage * amount) / 100;
        }
        taxAmt = toFloat(taxAmt.toFixed(2));
        return taxAmt;
    }

    ledgerTotal = (index) => {
        const item = this.state.data[index]
        const includeVat = item.includevat === '1'
        const amount = this.ledgerAmount(index)
        if (includeVat) {
            return amount
        } else {
            return amount + this.taxPercentage(index)
        }
    }

    renderLedger = () => {
        return <FlatList
            style={{ flex: 1 }}
            data={this.state.data}
            keyExtractor={(item, index) => `${index}`}
            renderItem={this.renderItem} />
    }
    renderBotttomStrip = grand => {
        return <View style={{
            flexDirection: 'row',
            backgroundColor: colorPrimary,
            paddingVertical: 12
        }}>
            <Text style={styles.priceLabel}>Total Amount: {grand.amount}</Text>
            <Text style={styles.priceLabel}>Total Tax: {grand.tax}</Text>
            <Text style={[styles.priceLabel, { paddingRight: 12 }]}>Total: {grand.total}</Text>
        </View>
    }

    calculateGrand = () => {
        let amount = 0
        let tax = 0
        let total = 0
        this.state.data.forEach((value, index) => {
            amount += this.ledgerAmount(index)
            tax += this.ledgerTaxAmt(index)
            total += this.ledgerTotal(index)
        })
        return { amount, tax, total }
    }


    render() {
        const { tab } = this.state;
        const grand = this.calculateGrand()
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {this.renderTabs()}
                    {tab === 'customer' ? this.renderCustomer() : null}
                    {tab === 'ledger' ? this.renderLedger() : null}
                </View>
                {this.renderBotttomStrip(grand)}
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    fieldStyle: {
        marginTop: 4
    },
    card: {
        marginHorizontal: 16,
        marginTop: 16,
        flex: 1
    },
    priceLabel: {
        flex: 1,
        fontSize: 14,
        textAlign: 'center',
        paddingLeft: 12
    }
})
export default connect(
    state => ({
        tax: state.tax
    }),
    dispatch => ({
        taxActions: bindActionCreators(taxActions, dispatch)
    })
)(OtherReceiptScreen);