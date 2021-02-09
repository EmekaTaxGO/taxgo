import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableOpacity, Picker, TextInput, FlatList, Switch } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { tabSelectedColor, colorPrimary, colorAccent, colorWhite, snackbarActionColor } from '../theme/Color'
import { TextField } from 'react-native-material-textfield';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { DATE_FORMAT } from '../constants/appConstant';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import { isFloat, isInteger, toInteger, toFloat } from '../helpers/Utils';

import * as invoiceActions from '../redux/actions/invoiceActions';
import * as taxActions from '../redux/actions/taxActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import AppTab from '../components/AppTab';
import { log } from '../components/Logger'
import Snackbar from 'react-native-snackbar';
import { CreditCardInput } from 'react-native-credit-card-input';
import CardView from 'react-native-cardview';
import Store from '../redux/Store';

class AddInvoiceScreen extends Component {
    constructor(props) {
        super();
        this.state = {
            selectedTab: 'refund',
            showInvDatePicker: false,
            invDate: undefined,

            showDueDatePicker: false,
            dueDate: undefined,

            issuedcats: ['Issued', 'Yes', 'No'],
            selectedIssuedCatIndex: 1,

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
                includevat: 0,
                taxIndex: 0,
                price: '',
                itemtype: '',
                priceIndex: 0,
                discount_per: 0
            }],
            paymentIndex: 2,
            paymentMode: ['Select Payment', 'Live Payment', 'Record payment'],
            payDate: new Date(),
            showPayDateDialog: false,
            payMethod: ['Select Method', 'Cash', 'Current', 'Electronic', 'Credit/Debit Card', 'Paypal'],
            payMethodIndex: 0
        }
    }
    _customer = '';
    _invoiceAddress = '';
    _bank = null;
    _reference = ''

    customerRef = React.createRef();
    invoiceDateRef = React.createRef();
    dueDateRef = React.createRef();
    invoiceAddressRef = React.createRef();
    deliveryAddressRef = React.createRef();
    termsRef = React.createRef();

    // Payment References
    bankRef = React.createRef();
    accNameRef = React.createRef();
    accNumRef = React.createRef();
    accTypeRef = React.createRef();
    swiftCodeRef = React.createRef();
    ibanNumRef = React.createRef();
    refNumRef = React.createRef();
    amtPaidRef = React.createRef();
    outAmtRef = React.createRef();
    payDateRef = React.createRef();



    componentDidMount() {
        const { info } = this.props.route.params;
        const { taxActions } = this.props;
        // taxActions.getTaxList();
    }
    componentWillMount() {
        const invDate = moment();
        const dueDate = moment().add(1, 'M').subtract(1, 'd');
        this.setState({
            invDate: invDate.toDate(),
            dueDate: dueDate.toDate()
        });
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

    selectTab = (tabName) => {
        this.setState({ selectedTab: tabName });
    }

    formattedDate = date => {
        return date ? moment(date).format(DATE_FORMAT) : '';
    }

    productPrice = (listIndex) => {
        const item = this.state.products[listIndex];
        if (isFloat(item.price)) {
            return toFloat(toFloat(item.price).toFixed(2));
        } else {
            return 0;
        }
    }

    vatPercentage = (listIndex) => {
        const item = this.state.products[listIndex];
        if (isFloat(item.vat)) {
            return toFloat(toFloat(item.vat).toFixed(2));
        } else {
            return 0;
        }
    }

    productQuantity = (listIndex) => {
        const item = this.state.products[listIndex];
        if (isInteger(item.quantity)) {
            return toInteger(item.quantity);
        } else {
            return 0;
        }
    }

    getTaxAmount = listIndex => {
        const item = this.state.products[listIndex];
        const includeVat = item.includevat === 1;
        const price = this.productPrice(listIndex);
        const taxPercentage = this.vatPercentage(listIndex);
        let taxAmt = 0.0;
        if (includeVat) {
            const principal = (price * 100) / (100 + taxPercentage);
            taxAmt = price - principal;
        } else {
            taxAmt = (taxPercentage * price) / 100;
        }
        taxAmt = toFloat(taxAmt.toFixed(2));
        return taxAmt;
    }

    getTaxList = () => {
        const taxes = ['Select Tax Rates'];
        this.props.tax.taxList.forEach((value) => {
            taxes.push(`${value.taxtype}-${value.percentage}%`);
        })
        return taxes;
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
    onPayDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.payDate;
        this.setState({
            payDate: currentDate,
            showPayDateDialog: false
        }, () => {
            setFieldValue(this.payDateRef, this.formattedDate(currentDate));
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
        let address = null;
        this.props.navigation.push(screen, {
            onCustomerSelected: item => {
                address = `${item.address}\n${item.town}\n${item.post_code}`;
                this.setState({
                    invoiceAddress: address,
                    deliveryAddress: address
                }, () => {
                    setFieldValue(this.customerRef, item.name);
                    this._customer = item.name;
                })
            },
            onSupplierSelected: item => {
                this.setState({ notes: item.notes }, () => {
                    setFieldValue(this.customerRef, item.name);
                    this._customer = item.name;
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
                let taxIndex = 0;
                const { taxList } = this.props.tax;
                taxList.forEach((value, index) => {
                    if (toFloat(item.vat) === value.percentage) {
                        taxIndex = 1 + index;
                    }
                });

                const newProduct = {
                    ...this.state.products[index],
                    ...item,
                    label: `${item.icode}-${item.idescription}`,
                    taxIndex: taxIndex,
                    price: item.itemtype === 'Stock' ? item.sp_price : item.rate,
                    priceIndex: 0
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
                    ledger: `${item.nominalcode}-${item.laccount}`
                };

                const newProducts = [...this.state.products];
                newProducts.splice(index, 1, newProduct);
                this.setState({ products: newProducts });
            }
        })
    }

    refreshPrice = () => {
        const newProduct = {
            ...this.state.products[index],
            sp_price: text
        };

        const newProducts = [...this.state.products];
        newProducts.splice(index, 1, newProduct);
        this.setState({ products: newProducts });
    }

    onPriceChange = (text, index) => {
        const newProduct = {
            ...this.state.products[index],
            price: text
        };

        const newProducts = [...this.state.products];
        newProducts.splice(index, 1, newProduct);
        this.setState({ products: newProducts });
    }

    onDiscountChange = (text, index) => {
        const newProduct = {
            ...this.state.products[index],
            discount_per: text
        };

        const newProducts = [...this.state.products];
        newProducts.splice(index, 1, newProduct);
        this.setState({ products: newProducts });
    }
    discountPercentage = (listIndex) => {
        const item = this.state.products[listIndex];
        if (isFloat(item.discount_per)) {
            return toFloat(toFloat(item.discount_per).toFixed(2));
        } else {
            return 0;
        }
    }

    // Total Discount Amount for a Specific Invoice
    discountAmount = (listIndex) => {
        const item = this.state.products[listIndex];
        const includeVat = item.includevat === 1;
        let price = this.productPrice(listIndex);
        const discountPer = this.discountPercentage(listIndex);
        const quantity = this.productQuantity(listIndex);
        let discount;
        if (!includeVat) {
            price = price + this.getTaxAmount(listIndex);
        }
        discount = (discountPer * price) / 100;
        return toFloat((discount * quantity).toFixed(2));
    }

    // Total Amount for Invoice Item 
    totalAmount = (listIndex) => {
        const item = this.state.products[listIndex];
        const includeVat = item.includevat === 1;
        let price = this.productPrice(listIndex);
        const quantity = this.productQuantity(listIndex);
        if (!includeVat) {
            price = price + this.getTaxAmount(listIndex);
        }
        let totalAmt = (price * quantity) + this.discountAmount(listIndex);
        return toFloat(totalAmt.toFixed(2));
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

    renderPriceDropdown = (item, index) => {
        const priceList = [
            `Sale Price(${item.sp_price})`,
            `Trade Price(${item.trade_price})`,
            `Whole Sale(${item.wholesale})`
        ];
        return item.itemtype === 'Stock' ? <View style={{ flexDirection: 'column' }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16
            }}>
                <Text style={[styles.subtitle, { flex: 1 }]}>Select Price</Text>
                <Picker
                    style={{ flex: 2 }}
                    selectedValue={priceList[item.priceIndex]}
                    mode='dropdown'
                    onValueChange={(itemValue, itemPosition) => this.onPriceIndexChange(index, itemPosition)}>
                    {priceList.map((value, index) => <Picker.Item
                        label={value} value={value} key={`${index}`} />)}
                </Picker>


            </View>
            <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                marginVertical: 6
            }} />
        </View> : null
    }

    renderProductItem = ({ item, index }) => {
        const isLast = index + 1 === this.state.products.length;
        const taxList = this.getTaxList();
        const isStock = item.itemtype === 'Stock';
        return <View style={{ flexDirection: 'column' }}>

            <View style={{
                flexDirection: 'row',
                paddingTop: 10
            }}>
                {/* Product */}
                <View style={{
                    flexDirection: 'column',
                    flex: 1
                }}>
                    <Text style={styles.title}>Product({index + 1})</Text>
                    <TouchableOpacity style={{ marginTop: 6, marginLeft: 12, marginRight: 6 }}
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
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={styles.title}>Ledger Account</Text>
                    <TouchableOpacity style={{ marginTop: 6, marginLeft: 12, marginRight: 12 }}
                        onPress={() => this.onLedgerPress(index)}>
                        <TextInput
                            style={styles.textInput}
                            value={item.ledger}
                            placeholder='Ledger Account'
                            editable={false}
                            placeholderTextColor='gray'
                        />
                    </TouchableOpacity>

                </View>

            </View>
            <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                marginVertical: 12
            }} />
            <View style={{ flexDirection: 'column' }}>

                <Text style={styles.title}>Price And Tax</Text>
                {/* Prices */}
                {this.renderPriceDropdown(item, index)}


                <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
                    {/* Price/Rate */}
                    <View style={{
                        flexDirection: 'column',
                        marginTop: 14,
                        flex: 2
                    }}>
                        <Text style={styles.subtitle}>Price/Rate</Text>
                        <TextInput
                            style={[styles.textInput, { marginTop: 6 }]}
                            value={item.price}
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
                            value={`${this.getTaxAmount(index)}`}
                            style={[styles.textInput, { marginTop: 6 }]}
                            editable={false}
                        />
                    </View>
                </View>


            </View>
            <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                marginVertical: 12
            }} />

            {/* Taxes */}
            <View style={{
                flexDirection: 'column',
                marginTop: 12
            }}>
                <Text style={styles.title}>Select Taxes (Vat/GST %)</Text>
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    paddingTop: 2,
                    paddingHorizontal: 16
                }}>
                    <Picker
                        style={{ flex: 2 }}
                        selectedValue={taxList[item.taxIndex]}
                        mode='dropdown'
                        onValueChange={(itemValue, itemPosition) => this.onVatChange(index, itemPosition)}>
                        {taxList.map((value, index) => <Picker.Item
                            label={value} value={value} key={`${index}`} />)}
                    </Picker>
                    <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center' }}>
                        <Text>Include Vat</Text>
                        <Switch
                            style={{}}
                            thumbColor={item.includevat === 1 ? colorAccent : 'gray'}
                            value={item.includevat === 1}
                            onValueChange={enabled => this.onIncludeVatChange(index, enabled)} />
                    </View>

                </View>
            </View>
            <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                marginVertical: 12
            }} />
            <Text style={styles.title}>{'Discount & Total'}</Text>
            <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
                {/* % */}
                <View style={{
                    flexDirection: 'column',
                    marginTop: 4,
                    flex: 1
                }}>
                    <Text style={styles.subtitle}>%</Text>
                    <TextInput
                        style={[styles.textInput, { marginTop: 6 }]}
                        value={item.discount_per}
                        onChangeText={text => this.onDiscountChange(text, index)}
                    />
                </View>

                {/* Discount Amt */}
                <View style={{
                    flexDirection: 'column',
                    marginTop: 4,
                    flex: 1,
                    marginLeft: 12
                }}>
                    <Text style={styles.subtitle}>(Amt)</Text>
                    <TextInput
                        value={`${this.discountAmount(index)}`}
                        style={[styles.textInput, { marginTop: 6 }]}
                        editable={false}
                        onChangeText={text => this.onQuantityChange(text, index)}
                    />
                </View>

                {/* Total */}
                <View style={{
                    flexDirection: 'column',
                    marginTop: 4,
                    flex: 1,
                    marginLeft: 12
                }}>
                    <Text style={styles.subtitle}>Total</Text>
                    <TextInput
                        value={`${this.totalAmount(index)}`}
                        style={[styles.textInput, { marginTop: 6 }]}
                        editable={false}
                    />
                </View>
                {isLast ? <View style={{
                    flexDirection: 'column',
                    marginTop: 4,
                    flex: 1,
                    justifyContent: 'center',
                    marginLeft: 12,
                    alignItems: 'center'
                }}>
                    <Text style={styles.subtitle}>More</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            isLast ? <TouchableOpacity onPress={this.addInvoiceItem} style={{ padding: 6 }}>
                                <Ionicons size={34} name='add-circle' color='green' />
                            </TouchableOpacity> : null
                        }
                        {
                            index > 0 ? <TouchableOpacity onPress={() => this.deleteInvoiceItem(index)}
                                style={{ marginLeft: 2, padding: 6 }}>
                                <MaterialCommunityIcons size={34} name='delete-circle' color='red' />
                            </TouchableOpacity> : null
                        }
                    </View>
                </View> : null}

            </View>
            <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 5,
                marginTop: 16
            }} />
        </View>
    }
    addInvoiceItem = () => {
        const newProducts = [...this.state.products];
        newProducts.push({
            product_name: '',
            ledger_account: '',
            rate: '',
            quantity: '',
            vat: '0',
            includevat: 0,
            taxIndex: 0,
            price: '',
            itemtype: '',
            priceIndex: 0,
            discount_per: 0
        });
        this.setState({ products: newProducts }, () => {
            Snackbar.show({
                text: 'New Product added.',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    text: 'OK',
                    textColor: snackbarActionColor,
                    onPress: () => { }
                }
            })
        });
    }

    deleteInvoiceItem = index => {
        let newProducts = [...this.state.products];
        newProducts.splice(index, 1)
        this.setState({ products: newProducts }, () => {
            Snackbar.show({
                text: 'Product Deleted.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                action: {
                    text: 'OK',
                    textColor: colorWhite,
                    onPress: () => { }
                }
            })
        })
    }
    onIncludeVatChange = (listIndex, enabled) => {
        const newProduct = {
            ...this.state.products[listIndex],
            includevat: enabled ? 1 : 0
        };

        const newProducts = [...this.state.products];
        newProducts.splice(listIndex, 1, newProduct);
        this.setState({ products: newProducts });
    }

    onVatChange = (listIndex, taxIndex) => {
        const taxList = this.props.tax.taxList;
        const newProduct = {
            ...this.state.products[listIndex],
            taxIndex: taxIndex,
            vat: taxIndex === 0 ? '0' : taxList[taxIndex - 1].percentage
        };

        const newProducts = [...this.state.products];
        newProducts.splice(listIndex, 1, newProduct);
        this.setState({ products: newProducts });
    }
    onPriceIndexChange = (listIndex, priceIndex) => {
        const item = this.state.products[listIndex];
        let price;
        switch (priceIndex) {
            case 0:
                price = item.sp_price;
                break;
            case 1:
                price = item.trade_price;
                break;
            default:
                price = item.wholesale;
        }
        const newProduct = {
            ...item,
            priceIndex: priceIndex,
            price: price
        };

        const newProducts = [...this.state.products];
        newProducts.splice(listIndex, 1, newProduct);
        this.setState({ products: newProducts });
    }

    renderProductContainer = () => {
        return <FlatList
            data={this.state.products}
            keyExtractor={(item, index) => `${index}`}
            renderItem={this.renderProductItem}
        />
    }
    renderRefundContainer = () => {
        return <ScrollView style={{ flex: 1 }}>
            {this.renderRecordPayment()}
        </ScrollView>
    }

    renderPaymentContainer = () => {

        return <ScrollView style={{
            flexDirection: 'column',
            flex: 1
        }}>
            <Picker
                style={{ marginHorizontal: 16 }}
                selectedValue={this.state.paymentMode[this.state.paymentIndex]}
                mode='dropdown'
                onValueChange={(itemValue, itemIndex) => this.setState({ paymentIndex: itemIndex })}>
                {this.state.paymentMode.map((value, index) => <Picker.Item
                    label={value} value={value} key={`${index}`} />)}
            </Picker>
            <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1
            }} />
            {this.state.paymentIndex === 2 ? this.renderRecordPayment() : null}
            {this.state.paymentIndex === 1 ? this.renderCardInfo() : null}

        </ScrollView>
    }

    onCreditCardInfoChange = form => {
        log('Card Info', form);
    }

    renderCardInfo = () => {
        return <View style={{
            flexDirection: 'column',
            paddingHorizontal: 12,
            paddingVertical: 16
        }}>
            <CreditCardInput
                onChange={this.onCreditCardInfoChange}
            />
            {/* <TextField
                label='Card Number'
                keyboardType='name-phone-pad'
                textContentType='creditCardNumber'
                returnKeyType='next'
                lineWidth={1}
                title='*required' /> */}
            {/* <TextInput
                placeholder='Cred'
                textContentType='creditCardNumber'
                autoCompleteType='cc-number' />
            <TextField
                label='MM'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required' />
            <TextField
                label='YYYY'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required' />
            <TextField
                label='CVV'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required' /> */}
        </View>

    }

    setAllBankFields = () => {
        const bank = this._bank;
        setFieldValue(this.bankRef, this.bankName(bank));
        setFieldValue(this.accNameRef, bank.laccount);
        setFieldValue(this.accNumRef, bank.accnum);

        setFieldValue(this.accTypeRef, bank.acctype);
        setFieldValue(this.swiftCodeRef, bank.bicnum);
        setFieldValue(this.ibanNumRef, bank.ibannum);
    }

    onBankPress = () => {
        this.props.navigation.push('SelectBankScreen', {
            onBankSelected: bank => {
                this._bank = { ...bank };
                const payMethodIndex = this.getPayMethodIndex(bank.paidmethod);
                this.setState({ payMethodIndex: payMethodIndex }, () => {
                    this.setAllBankFields();
                })

            }
        })
    }
    getPayMethodIndex = (method) => {
        switch (method) {
            case 'cash':
                return 1;
            case 'current':
                return 2;
            case 'electronic':
                return 3;
            case 'credit/debit card':
                return 4;
            case 'paypal':
                return 5;
            default:
                return 0;
        }
    }

    bankName = bank => {
        if (bank === null) {
            return '';
        }
        const bankTitle = `${bank.nominalcode}-${bank.laccount}`;
        return bankTitle;
    }

    renderRecordPayment = () => {
        const bank = this._bank;
        const { payMethod, payMethodIndex } = this.state;
        const isCreditNote = this.isCreditNote();
        return <View style={{
            flexDirection: 'column',
            paddingHorizontal: 16,
            paddingBottom: 12
        }}>
            <TouchableOpacity onPress={this.onBankPress}>
                <TextField
                    label='Bank'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    lineWidth={1}
                    value={this.bankName(bank)}
                    title='*required'
                    editable={false}
                    ref={this.bankRef} />

            </TouchableOpacity>
            <TextField
                label='A/c Name'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                ref={this.accNameRef}
                value={bank ? bank.laccount : ''} />
            <TextField
                label='A/c No.'
                keyboardType='number-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                ref={this.accNumRef}
                value={bank ? bank.accnum : ''} />
            <TextField
                label='A/c Type'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                value={bank ? bank.acctype : ''}
                ref={this.accTypeRef} />
            <TextField
                label='BIC/Swift'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                editable={false}
                title='*required'
                value={bank ? bank.bicnum : ''}
                ref={this.swiftCodeRef} />

            <TextField
                label='IBAN No'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                editable={false}
                value={bank ? bank.ibannum : ''}
                ref={this.ibanNumRef} />

            {isCreditNote ? <TextField
                label='Reference'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                ref={this.refNumRef}
                value={this._reference}
                onChangeText={text => this._reference = text} /> : null}

            <TextField
                label='Amount Paid'
                keyboardType='number-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                ref={this.amtPaidRef} />
            <TextField
                label='Out. Amount'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                ref={this.outAmtRef} />
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

            <TouchableOpacity onPress={() => this.setState({ showPayDateDialog: true })}>
                <TextField
                    label='Pay Date'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={this.formattedDate(this.state.payDate)}
                    ref={this.payDateRef} />
            </TouchableOpacity>
            {this.state.showPayDateDialog ? <DateTimePicker
                value={this.state.payDate}
                mode={'datetime'}
                display='default'
                minimumDate={new Date()}
                onChange={this.onPayDateChange}
            /> : null}
        </View>
    }

    renderTabs = (invoiceAmount) => {
        const selected = this.state.selectedTab;
        const customerLabel = this.isSalesInvoice() ? 'Customer' : 'Supplier';
        return <View style={{ width: '100%', flexDirection: 'row' }}>

            <AppTab title={customerLabel}
                icon='user-circle'
                iconType='FontAwesome5Icon'
                selected={selected === 'supplier'}
                onTabPress={() => this.selectTab('supplier')} />

            <AppTab title='Product'
                icon='local-offer'
                selected={selected === 'product'}
                onTabPress={() => this.selectTab('product')} />

            {this.isCreditNote() ? <AppTab title='Refund'
                icon='cash-refund'
                iconType='MaterialCommunityIcons'
                selected={selected === 'refund'}
                onTabPress={() => this.selectTab('refund')} />
                : null}
            {(invoiceAmount > 0 && !this.isCreditNote()) ?
                <AppTab
                    title='Payment'
                    icon='payment'
                    selected={selected === 'payment'}
                    onTabPress={() => this.selectTab('payment')} />
                : null}


        </View>
    }

    invoiceAmount = () => {
        let total = 0;
        for (let i = 0; i < this.state.products.length; i++) {
            total += this.totalAmount(i);
        }
        return total;
    }
    renderBottomCard = (invoiceTotal) => {
        const { authData } = Store.getState().auth;
        return <CardView
            cardElevation={4}
            cardRadius={6}
            style={{ backgroundColor: colorPrimary }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 6,
                paddingStart: 16
            }}>
                <MaterialCommunityIcons name='wallet' size={40} color='black' />
                <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', paddingHorizontal: 12 }}>
                    <Text style={{ fontSize: 16, flex: 1 }}>Total {authData.currency} {invoiceTotal}</Text>
                    <Text style={{ fontSize: 16, flex: 1 }}>Items {this.state.products.length}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => { }}
                        style={{
                            backgroundColor: 'blue',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 4,
                            marginEnd: 16
                        }}>
                        <Text style={{ fontSize: 16, color: 'white' }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}
                        style={{ paddingHorizontal: 16 }}>
                        <FontAwesomeIcon name='angle-double-up' size={24} color='black' />
                    </TouchableOpacity>

                </View>

            </View>
        </CardView>
    }
    render() {
        const { tax } = this.props;
        if (tax.fetchingTaxList) {
            return <OnScreenSpinner />
        }
        if (tax.fetchTaxListError) {
            return <FullScreenError tryAgainClick={this.fetchTaxList} />
        }

        const selected = this.state.selectedTab;
        const invoiceAmount = this.invoiceAmount();
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {this.renderTabs(invoiceAmount)}
                    {selected === 'supplier' ? this.renderSupplierContainer() : null}
                    {selected === 'product' ? this.renderProductContainer() : null}
                    {selected === 'payment' ? this.renderPaymentContainer() : null}
                    {selected === 'refund' ? this.renderRefundContainer() : null}
                    {this.renderBottomCard(invoiceAmount)}
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
        paddingHorizontal: 16
    },
    subtitle: {
        color: 'gray',
        fontSize: 14
    }
});
export default connect(
    state => ({
        invoice: state.invoice,
        tax: state.tax
    }),
    dispatch => ({
        invoiceActions: bindActionCreators(invoiceActions, dispatch),
        taxActions: bindActionCreators(taxActions, dispatch)
    })
)(AddInvoiceScreen);