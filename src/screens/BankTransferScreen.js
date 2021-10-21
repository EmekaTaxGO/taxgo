const { Component } = require("react");
import { get } from 'lodash';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppPicker2 from '../components/AppPicker2';
import AppTextField from '../components/AppTextField';
import { getFieldValue, setFieldValue } from '../helpers/TextFieldHelpers';
import bankHelper from '../helpers/BankHelper';
import AppDatePicker from '../components/AppDatePicker';
import timeHelper from '../helpers/TimeHelper';
import moment from 'moment';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { showError, toNum } from '../helpers/Utils'

const paidIntoRef = React.createRef()
const transferDateRef = React.createRef()
const amountTransferredRef = React.createRef()
const referenceRef = React.createRef()
const descriptionRef = React.createRef()
const BankTransferScreen = (props) => {

    const [paidFrom, setPaidFrom] = useState(['Account', 'Credit Card', 'Debit Card'])
    const [paidFromIdx, setPaidFromIdx] = useState(-1)
    const [paidInto, setPaidInto] = useState(undefined)

    const _paidMethod = [...bankHelper.getPaidMethodArray()]
    _paidMethod.splice(0, 1)
    const [paidMethod, setPaidMethod] = useState(_paidMethod)
    const [paidMethodIdx, setPaidMethodIdx] = useState(-1);

    const [transferDate, setTransferDate] = useState(timeHelper.format(moment()))

    const [amountTransfered, setAmountTransfered] = useState('');


    const onPaidIntoPress = () => {
        props.navigation.navigate('SelectBankScreen', {
            onBankSelected: bank => {
                console.log('Bank Selected', bank);
                setPaidInto(bank)
                setTimeout(() => {
                    setFieldValue(paidIntoRef, get(bank, 'paidmethod'))
                }, 300)
            }
        })
    }
    const onSavePress = () => {
        const message = validate()
        if (message) {
            showError(message)
            return
        }


    }

    const validate = () => {
        if (paidFromIdx < 0) {
            return 'Please select Paid from A/c'
        } else if (paidInto === undefined) {
            return 'Please select Paid to A/c'
        } else if (paidMethodIdx < 0) {
            return 'Please select Paid method'
        } else if (toNum(getFieldValue(amountTransferredRef)) <= 0) {
            return 'Amount Transfered is invalid'
        } else {
            return undefined
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAwareScrollView style={{ flex: 1 }}>
                <AppText style={styles.labelStyle}>Paid From</AppText>
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

                <AppText style={styles.labelStyle}>Select Paid Method</AppText>
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
                <AppTextField
                    containerStyle={styles.textField}
                    fieldRef={amountTransferredRef}
                    label='Amount Transfered'
                    keyboardType='number-pad'
                    value={amountTransfered}
                />
                <AppTextField
                    containerStyle={styles.textField}
                    fieldRef={referenceRef}
                    label='Reference'
                />
                <AppTextField
                    containerStyle={styles.textField}
                    fieldRef={descriptionRef}
                    label='Description'
                />

            </KeyboardAwareScrollView>
            <AppButton
                containerStyle={styles.btnContainerStyle}
                textStyle={styles.btnTextStyle}
                title='Save'
                disabled={false}
                onPress={onSavePress}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    picker: {
        marginHorizontal: 16,
        marginTop: 4
    },
    textField: {
        marginHorizontal: 16,
        marginTop: 30
    },
    datePicker: {
        marginHorizontal: 16,
        marginTop: 28
    },
    labelStyle: {
        marginHorizontal: 16,
        fontSize: 18,
        marginTop: 20
    },
    btnContainerStyle: {
        marginHorizontal: 16
    },
    btnTextStyle: {

    }
})
export default BankTransferScreen;