const { Component } = require("react");
import React from 'react';
import {
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Picker
} from 'react-native';
import { OutlinedTextField, FilledTextField } from 'react-native-material-textfield';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DATE_FORMAT } from '../constants/appConstant';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import moment from 'moment';

class CustomerReceiptScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            receivedDate: new Date(),
            showReceivedDate: false,
            payMethod: ['Select Paid Method', 'Cash', 'Current', 'Electronic', 'Credit/Debit Card', 'Paypal'],
            payMethodIndex: 0
        }
    }
    _customer;
    _bank;


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
        if (bank === null) {
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

    render() {

        const { payMethod, payMethodIndex } = this.state;
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
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
                        ref={this.amountReceivedRef} />
                    <OutlinedTextField
                        containerStyle={{ marginTop: 20 }}
                        label='References'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        title='*required'
                        ref={this.referenceRef} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    fieldStyle: {
        marginTop: 0
    }
})
export default CustomerReceiptScreen;