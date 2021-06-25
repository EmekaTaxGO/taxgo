import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FormProgress from './FormProgress';
import allForms from '../data/taxForms/allForms';
import AppPicker2 from '../components/AppPicker2';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppText from './AppText';
import AppTextField from './AppTextField';
const TaxForm = props => {

    const countryId = props.route.params.countryId
    const [form, setForm] = useState(allForms[countryId])

    useEffect(() => {
        props.navigation.setOptions({ title: form.title })
    }, [])


    const onPickerItemChange = (fieldIdx, selected) => {
        const newField = { ...form.tabs[form.currentTab].fields[fieldIdx], selected }
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
            default:
                return null
        }
    }
    const onNextPress = () => {
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
                keyExtractor={(item, index) => item.label}
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
    }
})
export default TaxForm