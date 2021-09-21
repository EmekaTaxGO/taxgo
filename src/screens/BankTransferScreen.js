const { Component } = require("react");
import { get } from 'lodash';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppPicker2 from '../components/AppPicker2';
import AppTextField from '../components/AppTextField';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import bankHelper from '../helpers/BankHelper';
import AppDatePicker from '../components/AppDatePicker';
import timeHelper from '../helpers/TimeHelper';
import moment from 'moment';

const paidIntoRef = React.createRef()
const transferDateRef = React.createRef()
const BankTransferScreen = (props) => {

    const [paidFrom, setPaidFrom] = useState(['Account', 'Credit Card', 'Debit Card'])
    const [paidFromIdx, setPaidFromIdx] = useState(0)
    const [paidInto, setPaidInto] = useState({})

    const [paidMethod, setPaidMethod] = useState(bankHelper.getPaidMethodArray())
    const [paidMethodIdx, setPaidMethodIdx] = useState(0);

    const [transferDate, setTransferDate] = useState(timeHelper.format(moment()))


    const onPaidIntoPress = () => {
        props.navigation.navigate('SelectBankScreen', {
            onBankSelected: bank => {
                setPaidInto(bank)
                setTimeout(() => {
                    setFieldValue(paidIntoRef, get(paidInto, 'paidmethod'))
                }, 300)
            }
        })
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAwareScrollView style={{ flex: 1 }}>
                <AppPicker2
                    title={paidFrom[paidFromIdx]}
                    text='Paid From A/c'
                    items={paidFrom}
                    containerStyle={styles.picker}
                    onChange={idx => setPaidFromIdx(idx)} />

                <TouchableOpacity style={styles.textField}
                    onPress={onPaidIntoPress}>
                    <AppTextField
                        fieldRef={paidIntoRef}
                        label='Paid To'
                        editable={false}
                        value={get(paidInto, 'paidmethod', '')}
                    />
                </TouchableOpacity>
                <AppPicker2
                    title={paidMethod[paidMethodIdx]}
                    text='Paid Method'
                    items={paidMethod}
                    containerStyle={styles.picker}
                    onChange={idx => setPaidMethodIdx(idx)} />
                <AppDatePicker
                    date={transferDate}
                    containerStyle={styles.datePicker}
                    textFieldProps={{
                        label: 'Transfer Date',
                        fieldRef: transferDateRef
                    }}
                    onChange={date => setTransferDate(date)}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    picker: {
        marginHorizontal: 16,
        marginTop: 24
    },
    textField: {
        marginHorizontal: 16,
        marginTop: 22
    },
    datePicker:{
        marginHorizontal:16,
        marginTop:28
    }
})
export default BankTransferScreen;