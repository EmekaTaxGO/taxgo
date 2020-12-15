import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { tabSelectedColor, colorPrimary } from '../theme/Color'
import { TextField } from 'react-native-material-textfield';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { DATE_FORMAT } from '../constants/appConstant';
import { setFieldValue } from '../helpers/TextFieldHelpers';

class AddInvoiceScreen extends Component {
    constructor(props) {
        super();
        this.state = {
            selectedTab: 'supplier',
            showInvDatePicker: false,
            invDate: undefined,

            showDueDatePicker: false,
            dueDate: undefined
        }
    }
    _customer = '';

    customerRef = React.createRef();
    invoiceDateRef = React.createRef();
    dueDateRef = React.createRef();
    invoiceAddressRef = React.createRef();
    deliveryAddressRef = React.createRef();
    termsRef = React.createRef();


    componentDidMount() {
        const { info } = this.props.route.params;
        console.log('Info: ', info);
    }

    isEditMode = () => {
        return this.props.route.params.info.mode === 'update';
    }
    isCreditNote = () => {
        return this.props.route.params.info.credit_note === true;
    }
    isSalesInvoice = () => {
        const type = this.props.route.params.info.invoice_type;
        return type === 'sales';
    }

    getIcon = (icon, iconType, color) => {
        if (iconType === undefined) {
            return <MaterialIcon name={icon} size={24} color={color} />
        }
        switch (iconType) {
            case 'FontAwesome5Icon':
                return <FontAwesome5Icon name={icon} size={24} color={color} />;
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={icon} size={24} color={color} />;
            default:
                return <MaterialIcon name={icon} size={24} color={color} />;
        }

    }

    selectTab = (tabName) => {
        this.setState({ selectedTab: tabName });
    }

    tabComponent = (title, icon, iconType, selected, onPress) => {
        return <TouchableHighlight style={{
            flex: 1,
            backgroundColor: colorPrimary,
            paddingVertical: 6,
            borderBottomWidth: selected ? 2 : 0,
            borderBottomColor: tabSelectedColor,
        }}
            onPress={onPress}
            underlayColor={colorPrimary}>
            <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {this.getIcon(icon, iconType, selected ? tabSelectedColor : 'white')}
                <Text style={{
                    color: selected ? tabSelectedColor : 'white',
                    fontSize: 14
                }}>{title}</Text>
            </View>
        </TouchableHighlight>
    }

    formattedDate = date => {
        return date ? moment(date).format(DATE_FORMAT) : '';
    }

    onInvDateChanged = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.invDate;
        this.setState({
            invDate: currentDate,
            showInvDatePicker: false
        }, () => {
            setFieldValue(this.invoiceDateRef, this.formattedDate(currentDate));
        });
    }

    onDueDateChanged = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.dueDate;
        this.setState({
            dueDate: currentDate,
            showDueDatePicker: false
        }, () => {
            setFieldValue(this.dueDateRef, this.formattedDate(currentDate));
        });
    }

    renderSupplierContainer = () => {
        return <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ paddingHorizontal: 16 }}>
                <TextField
                    label='Customer'
                    keyboardType='default'
                    returnKeyType='done'
                    lineWidth={1}
                    ref={this.customerRef}
                    value={this._customer}
                    onChangeText={text => this._customer = text}
                    onSubmitEditing={() => { }} />
                <TouchableOpacity onPress={() => this.setState({ showInvDatePicker: true })}>
                    <TextField
                        label='Invoice Date'
                        keyboardType='default'
                        returnKeyType='done'
                        editable={false}
                        lineWidth={1}
                        ref={this.invoiceDateRef}
                        value={this.formattedDate(this.state.invDate)}
                        onSubmitEditing={() => { }} />
                </TouchableOpacity>
                {this.state.showInvDatePicker ? <DateTimePicker
                    value={this.state.invDate ? this.state.invDate : new Date()}
                    mode={'datetime'}
                    display='default'
                    maximumDate={new Date()}
                    onChange={this.onInvDateChanged}
                /> : null}

                {/* Due Date */}
                <TouchableOpacity onPress={() => this.setState({ showDueDatePicker: true })}>
                    <TextField
                        label='Due Date'
                        keyboardType='default'
                        returnKeyType='done'
                        editable={false}
                        lineWidth={1}
                        ref={this.dueDateRef}
                        value={this.formattedDate(this.state.dueDate)}
                        onSubmitEditing={() => { }} />
                </TouchableOpacity>
                {this.state.showDueDatePicker ? <DateTimePicker
                    value={this.state.dueDate ? this.state.dueDate : new Date()}
                    mode={'datetime'}
                    display='default'
                    maximumDate={new Date()}
                    onChange={this.onDueDateChanged}
                /> : null}

            </View>
        </ScrollView>
    }
    renderProductContainer = () => {
        return <View style={{ flex: 1, flexDirection: 'column' }}>

        </View>
    }

    renderTabs = () => {
        const selected = this.state.selectedTab;
        const customerLabel = this.isSalesInvoice() ? 'Supplier' : 'Customer';
        return <View style={{ width: '100%', flexDirection: 'row' }}>
            {this.tabComponent(customerLabel, 'user-circle', 'FontAwesome5Icon',
                selected === 'supplier', () => this.selectTab('supplier'))}

            {this.tabComponent('Product', 'local-offer', undefined,
                selected === 'product', () => this.selectTab('product'))}

            {this.tabComponent('Refund', 'cash-refund', 'MaterialCommunityIcons',
                selected === 'refund', () => this.selectTab('refund'))}
        </View>
    }
    render() {

        const selected = this.state.selectedTab;
        return <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {this.renderTabs()}
                    {selected === 'supplier' ? this.renderSupplierContainer() : null}
                    {selected === 'product' ? this.renderProductContainer() : null}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
};
const styles = StyleSheet.create({

});
export default AddInvoiceScreen;