import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableOpacity, Picker, TextInput, FlatList } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { tabSelectedColor, colorPrimary } from '../theme/Color'
import { TextField } from 'react-native-material-textfield';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { DATE_FORMAT } from '../constants/appConstant';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import { isFloat, isInteger } from '../helpers/Utils';

class AddInvoiceScreen extends Component {
    constructor(props) {
        super();
        this.state = {
            selectedTab: 'supplier',
            showInvDatePicker: false,
            invDate: undefined,

            showDueDatePicker: false,
            dueDate: undefined,

            issuedcats: ['Issued', 'Yes', 'No'],
            selectedIssuedCatIndex: 0,

            invoiceAddress: '',
            deliveryAddress: '',
            termsCondition: '',
            notes: '',

            products: [{
                product_name: '',
                ledger_account: '',
                rate: '',
                quantity: '',
                vat: '0',
                includeVat: false
            }]
        }
    }
    _customer = '';
    _invoiceAddress = '';

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

    onCustomerPress = () => {
        const screen = this.isSalesInvoice() ? 'SelectCustomerScreen' : 'SelectSupplierScreen';
        this.props.navigation.push(screen, {
            onCustomerSelected: item => {
                this.setState({
                    invoiceAddress: item.address,
                    deliveryAddress: item.address
                }, () => {
                    setFieldValue(this.customerRef, item.name);
                })
            },
            onSupplierSelected: item => {
                this.setState({ notes: item.notes }, () => {
                    setFieldValue(this.customerRef, item.name);
                })
            }
        });
    }

    renderSupplierContainer = () => {

        const issuedCat = this.state.issuedcats[this.state.selectedIssuedCatIndex];
        const isSaleInvoice = this.isSalesInvoice();
        return <ScrollView style={{
            flex: 1,
            flexDirection: 'column'
        }}>
            <View style={{ paddingHorizontal: 16 }}>
                <TouchableOpacity onPress={this.onCustomerPress}>
                    <TextField
                        label={isSaleInvoice ? 'Customer' : 'Supplier'}
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        ref={this.customerRef}
                        value={this._customer}
                        editable={false}
                        onChangeText={text => this._customer = text}
                        onSubmitEditing={() => { }} />
                </TouchableOpacity>

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
            {isSaleInvoice ? <View style={{ flexDirection: 'column' }}>
                <Text style={{
                    color: 'gray',
                    fontSize: 16,
                    paddingLeft: 16,
                    paddingTop: 20
                }}>Status</Text>
                <Picker
                    style={{ marginHorizontal: 12 }}
                    selectedValue={issuedCat}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ selectedIssuedCatIndex: itemIndex })}>
                    {this.state.issuedcats.map((value, index) => <Picker.Item
                        label={value} value={value} key={`${index}`} />)}
                </Picker>
            </View> : null}

            {isSaleInvoice ? <View style={{
                paddingHorizontal: 16,
                flexDirection: 'column',
                paddingBottom: 16
            }}>
                <Text style={styles.textAreaLabel}>Invoice Address</Text>
                <TextInput
                    style={[styles.textAreaStyle, { marginTop: 12 }]}
                    multiline={true}
                    numberOfLines={4}
                    value={this.state.invoiceAddress}
                    onChangeText={text => this.setState({ invoiceAddress: text })}
                />

                <Text style={[styles.textAreaLabel, { marginTop: 40 }]}>Delivery Address</Text>
                <TextInput
                    style={[styles.textAreaStyle, { marginTop: 12 }]}
                    multiline={true}
                    numberOfLines={4}
                    value={this.state.deliveryAddress}
                    onChangeText={text => this.setState({ deliveryAddress: text })}
                />

                <Text style={[styles.textAreaLabel, { marginTop: 40 }]}>{'Terms & Conditions'}</Text>
                <TextInput
                    style={[styles.textAreaStyle, { marginTop: 12 }]}
                    multiline={true}
                    numberOfLines={4}
                    value={this.state.termsCondition}
                    onChangeText={text => this.setState({ termsCondition: text })}
                />
            </View> : null}
        </ScrollView>
    }

    onProductNamePress = (index) => {
        this.props.navigation.push('SelectProductScreen', {
            onProductSelected: item => {
                const newProduct = {
                    ...this.state.products[index],
                    ...item,
                    label: `${item.icode}-${item.idescription}`
                };

                const newProducts = [...this.state.products];
                newProducts.splice(index, 1, newProduct);
                this.setState({ products: newProducts });
            }
        })
    }

    onLedgerPress = (index) => {
        this.props.navigation.push('SaleLedgerScreen', {
            onLedgerSelected: item => {
                const newProduct = {
                    ...this.state.products[index],
                    ...item,
                    ledger: `${item.category}-${item.categorygroup}`
                };

                const newProducts = [...this.state.products];
                newProducts.splice(index, 1, newProduct);
                this.setState({ products: newProducts });
            }
        })
    }

    onPriceChange = (text, index) => {
        const newProduct = {
            ...this.state.products[index],
            sp_price: text
        };

        const newProducts = [...this.state.products];
        newProducts.splice(index, 1, newProduct);
        this.setState({ products: newProducts });
    }

    onQuantityChange = (text, index) => {
        const newProduct = {
            ...this.state.products[index],
            quantity: text
        };

        const newProducts = [...this.state.products];
        newProducts.splice(index, 1, newProduct);
        this.setState({ products: newProducts });
    }

    getVatAmount = item => {
        if (!isFloat(item.sp_price) || !isInteger(item.quantity) || !isFloat(item.vat)) {
            return '0.00';
        }
        if (item.includevat === 1) {

        }

    }

    renderProductItem = ({ item, index }) => {
        return <View style={{ flexDirection: 'column' }}>

            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                paddingTop: 10
            }}>
                {/* Product */}
                <View style={{
                    flexDirection: 'column',
                    flex: 1
                }}>
                    <Text style={styles.title}>Product({index + 1})</Text>
                    <TouchableOpacity style={{ marginTop: 6 }}
                        onPress={() => this.onProductNamePress(index)}>
                        <TextInput
                            style={styles.textInput}
                            value={item.label}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            editable={false}
                        />
                    </TouchableOpacity>

                </View>

                {/* Ledger Account */}
                <View style={{ flexDirection: 'column', flex: 1, marginLeft: 12 }}>
                    <Text style={styles.title}>Ledger Account</Text>
                    <TouchableOpacity style={{ marginTop: 6 }}
                        onPress={() => this.onLedgerPress(index)}>
                        <TextInput
                            style={styles.textInput}
                            value={item.ledger}
                            placeholder='Ledger Account'
                            editable={false}
                            placeholderTextColor='gray'
                            onChangeText={text => this.onProductNamePress(text, index)}
                        />
                    </TouchableOpacity>

                </View>

            </View>
            <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                marginVertical: 12
            }} />
            <View style={{ flexDirection: 'column', paddingHorizontal: 16 }}>

                <Text style={styles.title}>Price And Tax</Text>
                <View style={{ flexDirection: 'row' }}>
                    {/* Price/Rate */}
                    <View style={{
                        flexDirection: 'column',
                        marginTop: 14,
                        flex: 2
                    }}>
                        <Text style={styles.subtitle}>Price/Rate</Text>
                        <TextInput
                            style={[styles.textInput, { marginTop: 6 }]}
                            value={item.sp_price}
                            onChangeText={text => this.onPriceChange(text, index)}
                        />
                    </View>

                    {/* Quantity */}
                    <View style={{
                        flexDirection: 'column',
                        marginTop: 14,
                        flex: 1,
                        marginLeft: 12
                    }}>
                        <Text style={styles.subtitle}>Quantity</Text>
                        <TextInput
                            value={item.quantity}
                            style={[styles.textInput, { marginTop: 6 }]}
                            onChangeText={text => this.onQuantityChange(text, index)}
                        />
                    </View>

                    {/* Vat Amt */}
                    <View style={{
                        flexDirection: 'column',
                        marginTop: 14,
                        flex: 1,
                        marginLeft: 12
                    }}>
                        <Text style={styles.subtitle}>Vat (Amt)</Text>
                        <TextInput
                            value={this.getVatAmount(item)}
                            style={[styles.textInput, { marginTop: 6 }]}
                            editable={false}
                        />
                    </View>
                </View>
            </View>
        </View>
    }

    renderProductContainer = () => {
        return <FlatList
            data={this.state.products}
            keyExtractor={(item, index) => `${index}`}
            renderItem={this.renderProductItem}
        />
    }

    renderTabs = () => {
        const selected = this.state.selectedTab;
        const customerLabel = this.isSalesInvoice() ? 'Customer' : 'Supplier';
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
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
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
    textAreaStyle: {
        backgroundColor: '#f1f1f1',
        borderColor: '#e5e5e5',
        borderRadius: 8,
        borderWidth: 1,
        textAlignVertical: 'top',
        paddingHorizontal: 12,
        fontSize: 16,
        color: 'black',
        height: 100
    },
    textAreaLabel: {
        fontSize: 17,
        color: 'black',
        marginTop: 12
    },
    textInput: {
        backgroundColor: '#f1f1f1',
        height: 40,
        fontSize: 14,
        color: 'black',
        paddingHorizontal: 6
    },
    title: {
        textTransform: 'uppercase',
        color: 'black',
        fontSize: 12,
        fontWeight: 'bold'
    },
    subtitle: {
        color: 'black',
        fontSize: 14
    }
});
export default AddInvoiceScreen;