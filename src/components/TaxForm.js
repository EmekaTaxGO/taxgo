import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FormProgress from './FormProgress';
import allForms from '../data/taxForms/allForms';
import AppPicker2 from '../components/AppPicker2';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppText from './AppText';
import AppTextField from './AppTextField';
import { showError } from '../helpers/Utils'
import { isEmpty, toNumber } from 'lodash';
import FormRadioGroup from './FormRadioGroup';
import { showToast } from './Logger';
import FormCheckBox from './FormCheckbox';
import AppDatePicker from './AppDatePicker';
import { H_DATE_FORMAT } from '../constants/appConstant';
import Api from '../services/api';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
const TaxForm = props => {

    const countryId = props.route.params.countryId
    const [form, setForm] = useState({
        fetching: true,
        error: undefined,
        data: {}
    })

    useEffect(() => {
        props.navigation.setOptions({ title: 'Tax Form' })
        fetchCountryTaxForm()
    }, [])

    const fetchCountryTaxForm = () => {
        setForm({ ...form, fetching: true, error: undefined })
        Api.get(`https://taxgo-c47a9-default-rtdb.firebaseio.com/taxForms/${countryId}.json`)
            .then(response => {
                setForm({
                    ...form,
                    fetching: false,
                    error: undefined,
                    data: response.data
                })
                props.navigation.setOptions({ title: response.data.title })

            })
            .catch(err => {
                setForm({
                    ...form,
                    fetching: false,
                    error: 'Error fetching tax form'
                })
                console.log('Error fetching country tax form', err);
            })
    }


    const onPickerItemChange = (fieldIdx, selected) => {
        const oldField = form.data.tabs[form.data.currentTab].fields[fieldIdx]
        const newField = { ...oldField, selected }
        let newFields = [...form.data.tabs[form.data.currentTab].fields]
        newFields.splice(fieldIdx, 1, newField)

        if (!isEmpty(newField.subFields)) {
            newFields = newFields.filter(value => value.dependency_field_id != newField.id)
            const selected_objs = newField.subFields.filter(value => value.group_id == `${selected}`)
            if (!isEmpty(selected_objs)) {
                newFields.splice(fieldIdx + 1, 0, ...selected_objs)
            }
        }

        const tab = {
            ...form.data.tabs[form.data.currentTab],
            fields: newFields
        }
        const tabs = [...form.data.tabs]
        tabs.splice(form.data.currentTab, 1, tab)
        const data = { ...form.data, tabs }
        setForm({ ...form, data })
    }

    const onTextChange = (fieldIdx, value) => {
        const newField = { ...form.data.tabs[form.data.currentTab].fields[fieldIdx], value }
        const newFields = [...form.data.tabs[form.data.currentTab].fields]
        newFields.splice(fieldIdx, 1, newField)

        const tab = {
            ...form.data.tabs[form.data.currentTab],
            fields: newFields
        }
        const tabs = [...form.data.tabs]
        tabs.splice(form.data.currentTab, 1, tab)
        const data = { ...form.data, tabs }
        setForm({ ...form, data })
    }
    const onRadioItemChange = (groups, fieldIdx) => {
        const newField = { ...form.data.tabs[form.data.currentTab].fields[fieldIdx], groups }
        let newFields = [...form.data.tabs[form.data.currentTab].fields]
        newFields.splice(fieldIdx, 1, newField)

        if (!isEmpty(newField.subFields)) {
            newFields = newFields.filter(value => value.dependency_field_id != newField.id)
            const selected_grp = newField.groups.filter(value => value.selected == true)[0]
            const selected_objs = newField.subFields.filter(value => value.group_id == selected_grp.id)
            if (!isEmpty(selected_objs)) {
                newFields.splice(fieldIdx + 1, 0, ...selected_objs)
            }
        }
        const tab = {
            ...form.data.tabs[form.data.currentTab],
            fields: newFields
        }
        const tabs = [...form.data.tabs]
        tabs.splice(form.data.currentTab, 1, tab)
        const data = { ...form.data, tabs }
        setForm({ ...form, data })
    }

    const onCheckChange = (checked, fieldIdx) => {
        const newField = { ...form.data.tabs[form.data.currentTab].fields[fieldIdx], checked }
        const newFields = [...form.data.tabs[form.data.currentTab].fields]
        newFields.splice(fieldIdx, 1, newField)

        const tab = {
            ...form.data.tabs[form.data.currentTab],
            fields: newFields
        }
        const tabs = [...form.data.tabs]
        tabs.splice(form.data.currentTab, 1, tab)
        const data = { ...form.data, tabs }
        setForm({ ...form, data })
    }
    const onDateChange = (date, fieldIdx) => {
        const newField = { ...form.data.tabs[form.data.currentTab].fields[fieldIdx], date }
        const newFields = [...form.data.tabs[form.data.currentTab].fields]
        newFields.splice(fieldIdx, 1, newField)

        const tab = {
            ...form.data.tabs[form.data.currentTab],
            fields: newFields
        }
        const tabs = [...form.data.tabs]
        tabs.splice(form.data.currentTab, 1, tab)
        const data = { ...form.data, tabs }
        setForm({ ...form, data })
    }
    const renderItem = ({ item, index }) => {
        switch (item.type) {
            case 'picker':
                return <AppPicker2
                    title={item.selected > -1 ? item.options[item.selected] : item.text}
                    text={item.text}
                    items={item.options}
                    textStyle={{ color: item.selected < 0 ? 'gray' : 'black' }}
                    containerStyle={styles.pickerContainerStyle}
                    onChange={idx => onPickerItemChange(index, idx)} />
            case 'input':
                return <AppTextField
                    label={item.label}
                    containerStyle={styles.textField}
                    value={item.value}
                    onChangeText={text => onTextChange(index, text)}
                    {...item.textStyle}
                />
            case 'radio-group':
                return <FormRadioGroup
                    title={item.title}
                    options={item.groups}
                    onPress={data => onRadioItemChange(data, index)}
                />
            case 'check-box':
                return <FormCheckBox
                    title={item.title}
                    checked={item.checked}
                    onValueChange={checked => onCheckChange(checked, index)}
                />
            case 'date-picker':
                if (!item.fieldRef) {
                    item.fieldRef = React.createRef()
                }
                return <AppDatePicker
                    date={item.date}
                    containerStyle={styles.datePickerStyle}
                    textFieldProps={{
                        label: item.title,
                        fieldRef: item.fieldRef
                    }}
                    readFormat={H_DATE_FORMAT}
                    displayFormat='DD MMM YYYY'
                    onChange={date => onDateChange(date, index)}
                />
            default:
                return null
        }
    }
    const validateForm = () => {
        const current = form.data.tabs[form.data.currentTab]
        let error;
        for (let i = 0; i < current.fields.length; i++) {
            const element = current.fields[i];
            switch (element.type) {
                case 'picker':
                    if (element.selected < 0) {
                        error = element.error
                    }
                    break;
                case 'input':
                    if (isEmpty(element.value)) {
                        error = element.error
                    } else if (element.validationRegex) {
                        const regex = new RegExp(element.validationRegex)
                        if (!regex.test(element.value)) {
                            error = element.regexError
                        }

                    }
                    else if (element.minValue && toNumber(element.value) < element.minValue) {
                        error = element.minValueError
                    }
                    else if (element.maxValue && toNumber(element.value) > element.maxValue) {
                        error = element.maxValueError
                    }
                    break;
                default:
            }
            if (error) {
                break;
            }
        }

        if (error) {
            // showError(error)
            showToast(error)
            return false
        }
        return true;

    }
    const onNextPress = () => {
        if (!validateForm()) {
            return
        }
        if (form.data.currentTab + 1 == form.data.tabs.length) {
            Alert.alert('Are you sure?', 'Do you want to submit form')
        } else {
            const data = {
                ...form.data,
                currentTab: form.data.currentTab + 1
            }
            setForm({ ...form, data })
        }

    }
    const onPrevPress = () => {
        const data = { ...form.data, currentTab: form.data.currentTab + 1 }
        setForm({ ...form, data })
    }
    const renderBottomNav = () => {
        const isFirst = form.data.currentTab == 0
        return (
            <View style={{
                flexDirection: 'row',
                backgroundColor: 'lightgray'
            }}>
                {!isFirst ? <TouchableOpacity style={{
                    flexDirection: 'row',
                    padding: 16,
                    alignItems: 'center'
                }}
                    onPress={onPrevPress}>
                    <Icon name='chevron-left' size={30} />
                    <AppText style={styles.navText}>Prev</AppText>
                </TouchableOpacity> : null}

                <View style={{ flex: 1 }} />

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    padding: 16,
                    alignItems: 'center'
                }}
                    onPress={onNextPress}>
                    <AppText style={styles.navText}>Next</AppText>
                    <Icon name='chevron-right' size={30} />
                </TouchableOpacity>

            </View>
        )
    }

    if (form.fetching) {
        return <OnScreenSpinner />
    } else if (form.error) {
        return <FullScreenError tryAgainClick={fetchCountryTaxForm} />
    }
    return (
        <SafeAreaView style={{ flexDirection: 'column', flex: 1 }}>
            <FormProgress
                data={form.data.tabs}
                currPosition={form.data.currentTab}
            />
            <AppText style={styles.pageTitle}>{form.data.tabs[form.data.currentTab].name}</AppText>
            <FlatList
                style={{ flex: 1, marginTop: 6 }}
                data={form.data.tabs[form.data.currentTab].fields}
                keyExtractor={(item, index) => item.id}
                renderItem={renderItem}
            />
            {renderBottomNav()}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    pickerContainerStyle: {
        marginTop: 20,
        marginHorizontal: 16
    },
    navText: {
        fontSize: 20
    },
    pageTitle: {
        paddingHorizontal: 16,
        fontSize: 26,
        color: 'black',
        textAlign: 'center'
    },
    textField: {
        marginTop: 20,
        marginHorizontal: 16
    },
    datePickerStyle: {
        marginHorizontal: 16,
        marginTop: 20
    }
})
export default TaxForm