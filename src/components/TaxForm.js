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
const TaxForm = props => {

    const countryId = props.route.params.countryId
    const [form, setForm] = useState(allForms[countryId])

    useEffect(() => {
        props.navigation.setOptions({ title: form.title })
    }, [])


    const onPickerItemChange = (fieldIdx, selected) => {
        const oldField = form.tabs[form.currentTab].fields[fieldIdx]
        const newField = { ...oldField, selected }
        const newFields = [...form.tabs[form.currentTab].fields]
        newFields.splice(fieldIdx, 1, newField)
        if (newField.subFields) {
            if (oldField.selected < 0 && selected >= 0) {
                newFields.push(...newField.subFields)
            }
        }
        const tab = {
            ...form.tabs[form.currentTab],
            fields: newFields
        }
        const tabs = [...form.tabs]
        tabs.splice(form.currentTab, 1, tab)
        const newForm = { ...form, tabs }
        setForm(newForm)
    }

    const onTextChange = (fieldIdx, value) => {
        const newField = { ...form.tabs[form.currentTab].fields[fieldIdx], value }
        const newFields = [...form.tabs[form.currentTab].fields]
        newFields.splice(fieldIdx, 1, newField)

        const tab = {
            ...form.tabs[form.currentTab],
            fields: newFields
        }
        const tabs = [...form.tabs]
        tabs.splice(form.currentTab, 1, tab)
        const newForm = { ...form, tabs }
        setForm(newForm)
    }
    const onRadioItemChange = (groups, fieldIdx) => {
        const newField = { ...form.tabs[form.currentTab].fields[fieldIdx], groups }
        let newFields = [...form.tabs[form.currentTab].fields]
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
            ...form.tabs[form.currentTab],
            fields: newFields
        }
        const tabs = [...form.tabs]
        tabs.splice(form.currentTab, 1, tab)
        const newForm = { ...form, tabs }
        setForm(newForm)
    }

    const onCheckChange = (checked, fieldIdx) => {
        const newField = { ...form.tabs[form.currentTab].fields[fieldIdx], checked }
        const newFields = [...form.tabs[form.currentTab].fields]
        newFields.splice(fieldIdx, 1, newField)

        const tab = {
            ...form.tabs[form.currentTab],
            fields: newFields
        }
        const tabs = [...form.tabs]
        tabs.splice(form.currentTab, 1, tab)
        const newForm = { ...form, tabs }
        setForm(newForm)
    }
    const onDateChange = (date, fieldIdx) => {
        const newField = { ...form.tabs[form.currentTab].fields[fieldIdx], date }
        const newFields = [...form.tabs[form.currentTab].fields]
        newFields.splice(fieldIdx, 1, newField)

        const tab = {
            ...form.tabs[form.currentTab],
            fields: newFields
        }
        const tabs = [...form.tabs]
        tabs.splice(form.currentTab, 1, tab)
        const newForm = { ...form, tabs }
        setForm(newForm)
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
        const current = form.tabs[form.currentTab]
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
                    } else if (element.validationRegex && !element.validationRegex.test(element.value)) {
                        error = element.regexError
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
        if (form.currentTab + 1 == form.tabs.length) {
            Alert.alert('Are you sure?', 'Do you want to submit form')
        } else {
            setForm({ ...form, currentTab: form.currentTab + 1 })
        }

    }
    const onPrevPress = () => {

        setForm({ ...form, currentTab: form.currentTab - 1 })
    }
    const renderBottomNav = () => {
        const isFirst = form.currentTab == 0
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
    return (
        <SafeAreaView style={{ flexDirection: 'column', flex: 1 }}>
            <FormProgress
                data={form.tabs}
                currPosition={form.currentTab}
            />
            <AppText style={styles.pageTitle}>{form.tabs[form.currentTab].name}</AppText>
            <FlatList
                style={{ flex: 1, marginTop: 6 }}
                data={form.tabs[form.currentTab].fields}
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