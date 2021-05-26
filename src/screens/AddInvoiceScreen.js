import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, Switch } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colorAccent, colorWhite, errorColor, snackbarActionColor, successColor } from '../theme/Color'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { DATE_FORMAT, H_DATE_FORMAT } from '../constants/appConstant';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import { isFloat, isInteger, toInteger, toFloat, getApiErrorMsg, toNum, showError, showSuccess } from '../helpers/Utils';

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
import Store from '../redux/Store';
import AppTextField from '../components/AppTextField';
import timeHelper from '../helpers/TimeHelper';
import AppDatePicker from '../components/AppDatePicker';
import { showSingleSelectAlert } from '../components/SingleSelectAlert';
import InvoiceBottomCard from '../components/invoices/InvoiceBottomCard';
import InvoiceBreakdown from '../components/invoices/InvoiceBreakdown';
import { get, isEmpty, isNaN } from 'lodash';
import Api from '../services/api';
import ProgressDialog from '../components/ProgressDialog';
import AppText from '../components/AppText';
import { appFontBold } from '../helpers/ViewHelper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppPicker2 from '../components/AppPicker2';

class AddInvoiceScreen extends Component {
    constructor(props) {
        super();
        this.state = {
            selectedTab: 'supplier',
            showInvDatePicker: false,
            fetching: true,
            updating: false,
            fetchError: undefined,
            taxList: [],
            invDate: this.getInvoiceDate(),
            showDueDatePicker: false,
            dueDate: this.getDueDate(),
            showBreakdown: false,
            issuedcats: ['Yes', 'No'],
            issued: 'Yes',
            customer: undefined,
            bank: undefined,
            subTotal: 0.0,
            totalVat: 0.0,
            totalDiscount: 0.0,
            payable: 0.0,
            invoiceno: '',
            invoiceAddress: '',
            deliveryAddress: '',
            termsCondition: '',
            notes: '',
            total: 0,
            columns: [this.getPlaceholderColumn()],
            paymentIndex: 2,
            paymentMode: ['Select Payment', 'Live Payment', 'Record payment'],
            payDate: new Date(),
            showPayDateDialog: false,
            payMethod: ['Select Method', 'Cash', 'Current', 'Electronic', 'Credit/Debit Card', 'Paypal'],
            payMethodIndex: 0,
            currency: get(Store.getState().auth, 'profile.countryInfo.symbol'),
            isSale: this.isSalesInvoice(props),
            creditNote: this.isCreditNote(props),
            editMode: this.isEditMode(props)
        }
    }
    _reference = ''

    invoiceNumRef = React.createRef();
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
        this.fetchInfo();
    }

    getInvoiceTag = () => {

    }

    getPlaceholderColumn = () => {
        return {
            id: "",
            description: "",
            quantity: '',
            saccount: "",
            includevat: false,
            vatrate: 0,
            vatamt: 0.0,
            vatrate: 0,
            discount: 0.0,
            incomeTax: 0,
            costprice: 0.0,
            incomeTaxAmount: 0.0,
            total: 0.0,
            itemtype: "Stock",
            ledger: undefined,
            product: {
                idescription: "",
                vat: 0.0,
                vatamt: 0.0,
                total: 0,
                itemtype: "Stock",
                includevat: false,
                quantity: 1,
                saccount: "",
            },
            options: false
        }
    }

    getInvoiceNoURL = () => {
        const { id } = Store.getState().auth.authData;
        const creditNote = this.state.creditNote;
        if (this.state.isSale) {
            return creditNote
                ? `sales/getInvoiceNo/${id}/scredit`
                : `sales/getInvoiceNo/${id}/sales`;
        } else {
            return creditNote ? `sales/getInvoiceNo/${id}/pcredit`
                : `/sales/getInvoiceNo/${id}/purchase`;
        }
    }

    fetchInfo = () => {
        this.setState({
            fetching: true,
            fetchError: undefined
        });
        const { authData } = Store.getState().auth;

        Promise.all([
            Api.get(`/default/taxList/${authData.country}`),
            Api.get(this.getInvoiceNoURL())
        ])
            .then(results => {
                this.setState({
                    fetching: false,
                    taxList: results[0].data.data,
                    invoiceno: results[1].data.data
                });
            })
            .catch(err => {
                console.log('Error fetching TaxList: ', err);
                this.setState({
                    fetching: false,
                    fetchError: getApiErrorMsg(err)
                });
            })
    }



    getInvoiceDate = () => {
        return timeHelper.format(moment(), H_DATE_FORMAT);
    }

    getDueDate = () => {
        const dueDate = moment().add(1, 'M').subtract(1, 'd');
        return timeHelper.format(dueDate, H_DATE_FORMAT);
    }

    isEditMode = (props) => {
        return props.route.params.info.mode === 'update';
    }
    isCreditNote = (props) => {
        const type = props.route.params.info.invoice_type;
        return type === 'scredit' || type === 'pcredit';
    }

    isSalesInvoice = (props) => {
        const type = props.route.params.info.invoice_type;
        return type === 'sales' || type === 'scredit';
    }

    selectTab = (tabName) => {
        this.setState({ selectedTab: tabName });
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

    onInvDateChanged = (show, date) => {
        this.setState({
            showInvDatePicker: show,
            invDate: date
        });
    }
    onPayDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.payDate;
        this.setState({
            payDate: currentDate,
            showPayDateDialog: false
        }, () => {
            setFieldValue(this.payDateRef, timeHelper.format(currentDate));
        });
    }

    onDueDateChanged = (show, date) => {
        this.setState({
            showDueDatePicker: show,
            dueDate: date
        });
    }

    onCustomerPress = () => {
        const screen = this.state.isSale ? 'SelectCustomerScreen' : 'SelectSupplierScreen';
        let address = null;
        this.props.navigation.push(screen, {
            onCustomerSelected: item => {
                address = `${item.address}\n${item.town}\n${item.post_code}`;
                this.setState({
                    invoiceAddress: address,
                    deliveryAddress: address,
                    customer: item
                }, () => {
                    setFieldValue(this.customerRef, item.name);
                })
            },
            onSupplierSelected: item => {
                address = `${item.address}\n${item.town}\n${item.post_code}`;
                this.setState({
                    invoiceAddress: address,
                    deliveryAddress: address,
                    notes: item.notes,
                    customer: item
                }, () => {
                    setFieldValue(this.customerRef, item.name);
                })
            }
        });
    }

    onIssueChange = idx => {
        const cats = this.state.issuedcats
        this.setState({ issued: cats[idx] })
    }

    renderSupplierContainer = () => {
        const isSaleInvoice = this.state.isSale;
        return <KeyboardAwareScrollView style={{
            flex: 1,
            flexDirection: 'column'
        }}>
            <View>
                <TouchableOpacity onPress={this.onCustomerPress}>
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Invoice No.'
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        fieldRef={this.invoiceNumRef}
                        value={this.state.invoiceno} />
                    <AppTextField
                        containerStyle={styles.textField}
                        label={isSaleInvoice ? 'Customer' : 'Supplier'}
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        fieldRef={this.customerRef}
                        value={get(this.state.customer, 'name', '')}
                        editable={false}
                        onSubmitEditing={() => { }} />
                </TouchableOpacity>

                <AppDatePicker
                    showDialog={this.state.showInvDatePicker}
                    date={this.state.invDate}
                    containerStyle={styles.textField}
                    textFieldProps={{
                        label: 'Invoice Date',
                        fieldRef: this.invoiceDateRef
                    }}
                    displayFormat={DATE_FORMAT}
                    onChange={this.onInvDateChanged}
                />

                <AppDatePicker
                    showDialog={this.state.showDueDatePicker}
                    date={this.state.dueDate}
                    containerStyle={styles.textField}
                    textFieldProps={{
                        label: 'Due Date',
                        fieldRef: this.dueDateRef
                    }}
                    displayFormat={DATE_FORMAT}
                    onChange={this.onDueDateChanged}
                />
            </View>
            {isSaleInvoice ? <View style={{ flexDirection: 'column' }}>
                <Text style={{
                    color: 'gray',
                    fontSize: 18,
                    paddingLeft: 16,
                    paddingTop: 20
                }}>Issued</Text>
                <AppPicker2
                    containerStyle={styles.picker}
                    title={this.state.issued}
                    text='Select Issued state'
                    items={this.state.issuedcats}
                    onChange={this.onIssueChange}
                />

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
                <Text style={[styles.textAreaLabel, { marginTop: 40 }]}>{'Invoice Notes'}</Text>
                <TextInput
                    style={[styles.textAreaStyle, { marginTop: 12 }]}
                    multiline={true}
                    numberOfLines={3}
                    value={this.state.notes}
                    onChangeText={text => this.setState({ notes: text })}
                />
            </View> : null}
            {!this.state.isSale ? this.renderReceiptFile() : null}
        </KeyboardAwareScrollView>
    }

    renderReceiptFile = () => {
        return (
            <View style={{ flexDirection: 'column', paddingHorizontal: 16 }}>
                <Text style={[styles.textAreaLabel, { marginTop: 20 }]}>{'Invoice Notes'}</Text>
                <TextInput
                    style={[styles.textAreaStyle, { marginTop: 12 }]}
                    multiline={true}
                    numberOfLines={3}
                    value={this.state.notes}
                    onChangeText={text => this.setState({ notes: text })}
                />
            </View>
        )
    }

    onProductNamePress = (index) => {
        this.props.navigation.push('SelectProductScreen', {
            onProductSelected: item => {
                const { columns } = this.state;
                const product = {
                    ...item
                };
                const costprice = Number(item.itemtype === 'Stock' ? item.sp_price : rate);
                const vat = Number(item.vat);
                const quantity = 1;
                const includevat = false;

                const column = {
                    product,
                    costprice: costprice.toString(),
                    quantity: quantity.toString(),
                    vatrate: vat.toFixed(2),
                    incomeTax: vat.toFixed(2),
                    description: item.idescription,
                    itemtype: item.itemtype,
                    includevat
                };
                const newColumns = [...columns];
                newColumns.splice(index, 1, column);
                this.setState({ columns: newColumns });

                setTimeout(() => this.onItemChange(index), 200);
            }
        })
    }

    onLedgerPress = (index, isSale) => {
        const componentId = isSale ? 'SaleLedgerScreen' : 'PurchaseLedgerScreen';
        this.props.navigation.push(componentId, {
            onLedgerSelected: item => {
                const newColumn = {
                    ...this.state.columns[index],
                    ledger: item
                }
                const newColumns = [...this.state.columns];
                newColumns.splice(index, 1, newColumn);
                this.setState({ columns: newColumns });
            }
        })
    }

    getLedgerLabel = (index) => {
        const ledger = get(this.state.columns[index], 'ledger');
        if (ledger) {
            return `${ledger.nominalcode}-${ledger.laccount}`;
        } else {
            return '';
        }
    }

    handleColumnChange = (text, prop, idx) => {
        let columns = this.state.columns;
        columns[idx][prop] = text
        this.setState({
            columns
        });

        setTimeout(() => {
            this.onItemChange(idx);
        }, 100);
    };


    getProductName = (column) => {
        const product = get(column, 'product', {});
        if (isEmpty(product.icode)) {
            return '';
        }
        else {
            return `${product.icode}-${product.idescription}`;
        }
    }

    onChangeDescription = (index, text) => {
        const newColumn = {
            ...this.state.columns[index],
            description: text
        };
        const newColumns = [...this.state.columns];
        newColumns.splice(index, 1, newColumn);
        this.setState({ columns: newColumns });
    }
    renderProductItem = ({ item, index }) => {
        const { taxList } = this.state;
        const isSale = this.state.isSale;
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
                    <TouchableOpacity
                        onPress={() => this.onProductNamePress(index)}
                        style={{ marginTop: 6, marginLeft: 12, marginRight: 6 }}>
                        <TextInput
                            pointerEvents='none'
                            style={styles.textInput}
                            value={this.getProductName(item)}
                            placeholder='Name'
                            placeholderTextColor='gray'
                            editable={false}
                        />
                    </TouchableOpacity>

                </View>

                {/* Ledger Account */}
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={styles.title}>{isSale ? 'Ledger Account' : 'Purchase Ledger'}</Text>
                    <TouchableOpacity style={{ marginTop: 6, marginLeft: 12, marginRight: 12 }}
                        onPress={() => this.onLedgerPress(index, isSale)}>
                        <TextInput
                            pointerEvents='none'
                            style={styles.textInput}
                            value={this.getLedgerLabel(index)}
                            placeholder='Ledger Account'
                            editable={false}
                            placeholderTextColor='gray'
                        />
                    </TouchableOpacity>

                </View>

            </View>
            <View style={{
                flexDirection: 'row',
                paddingTop: 12
            }}>
                <View style={{
                    flexDirection: 'column',
                    flex: 1
                }}>
                    {/* <Text style={styles.title}>Description</Text> */}
                    <TextInput
                        style={[styles.textInput, { marginLeft: 16, marginEnd: 4, marginTop: 4 }]}
                        value={item.description}
                        placeholder='Description'
                        placeholderTextColor='gray'
                        onChangeText={text => this.onChangeDescription(index, text)}
                    />
                </View>
                <View style={{ flex: 1 }} />

            </View>
            <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                marginVertical: 12
            }} />
            <View style={{ flexDirection: 'column' }}>
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
                            value={item.costprice}
                            onChangeText={text => this.handleColumnChange(text, 'costprice', index)}
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
                            onChangeText={text => this.handleColumnChange(text, 'quantity', index)}
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
                            value={item.vatamt}
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
                    <AppPicker2
                        containerStyle={{ flex: 2, marginTop: 4 }}
                        title={taxList.filter(element => element.percentage === Number(item.vatrate))
                            .map(item => {
                                return `${item.taxtype}-${item.percentage}`
                            })[0]}
                        text='Select Tax Rate'
                        items={taxList.map(item => {
                            return `${item.taxtype}-${item.percentage}`
                        })}
                        onChange={idx => this.onVatChange(index, idx)}
                    />
                    <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Include Vat</Text>
                        <Switch
                            style={{}}
                            thumbColor={item.includevat ? colorAccent : 'gray'}
                            value={item.includevat}
                            onValueChange={enabled => this.handleColumnChange(enabled, 'includevat', index)} />
                    </View>

                </View>
            </View>
            {isSale ? this.renderDiscount(item, index) : null}
            <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 3,
                marginTop: 16
            }} />
            {this.renderActionView(item, index)}
        </View>
    }

    renderActionView = (item, index) => {
        const isLast = index + 1 === this.state.columns.length;
        return (
            isLast ? <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingHorizontal: 12,
                flex: 1,
                paddingVertical: 20
            }}>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    backgroundColor: successColor,
                    borderRadius: 12,
                    marginRight: 6
                }}
                    onPress={this.addInvoiceItem}>
                    <Ionicons size={34} name='add-circle' color='white' />
                    <AppText style={{ fontSize: 14, color: 'white', paddingStart: 4, fontFamily: appFontBold }}>Add More</AppText>
                </TouchableOpacity>

                {index > 0 ? <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    backgroundColor: errorColor,
                    borderRadius: 12,
                    marginLeft: 6
                }}
                    onPress={() => this.deleteInvoiceItem(index)}>
                    <MaterialCommunityIcons size={34} name='delete-circle' color='white' />
                    <AppText style={{ fontSize: 14, color: 'white', paddingStart: 4, fontFamily: appFontBold }}>Delete</AppText>
                </TouchableOpacity> : null}
            </View> : null
        )
    }
    renderDiscount = (item, index) => {
        return (
            <View style={{ flexDirection: 'column' }}>
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
                            value={item.percentage}
                            onChangeText={text => this.handleColumnChange(text, 'percentage', index)}
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
                            value={item.discount}
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
                            value={item.total}
                            style={[styles.textInput, { marginTop: 6 }]}
                            editable={false}
                        />
                    </View>
                </View>
            </View>
        )
    }
    addInvoiceItem = () => {
        const newColumns = [...this.state.columns];
        newColumns.push(this.getPlaceholderColumn());
        this.setState({ columns: newColumns }, () => {
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
        let newColumns = [...this.state.columns];
        newColumns.splice(index, 1);
        this.setState({ columns: newColumns }, () => {
            Snackbar.show({
                text: 'Product Deleted.',
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
    onIncludeVatChange = (listIndex, enabled) => {
        const newProduct = {
            ...this.state.products[listIndex],
            includevat: enabled ? 1 : 0
        };

        const newProducts = [...this.state.products];
        newProducts.splice(listIndex, 1, newProduct);
        this.setState({ products: newProducts });
    }

    onVatChange = (idx, taxIdx) => {
        const { taxList } = this.state;
        const newColumn = {
            ...this.state.columns[idx],
            vatrate: taxList[taxIdx].percentage
        };
        const newColumns = [...this.state.columns];
        newColumns.splice(idx, 1, newColumn);
        this.setState({
            columns: newColumns
        });
        setTimeout(() => this.onItemChange(idx), 200)
    }

    //When anything is changed
    onItemChange = (index) => {
        const column = this.state.columns[index];
        const price = toNum(column.costprice);
        const quantity = toNum(column.quantity);
        const vatrate = toNum(column.vatrate);
        const includevat = column.includevat;
        const disPer = toNum(column.percentage);
        let vatamt;
        let total;
        let discount;
        if (includevat) {
            vatamt = (vatrate * price) / (vatrate + 100);
        } else {
            vatamt = (vatrate * price) / 100;
        }
        vatamt *= quantity;
        total = price * quantity;
        if (!includevat) {
            total += vatamt;
        }
        discount = (disPer * total) / 100;
        total -= discount;


        const newColumn = {
            ...column,
            vatrate: vatrate.toFixed(2),
            incomeTax: vatrate.toFixed(2),
            vatamt: vatamt.toFixed(2),
            incomeTaxAmount: vatamt.toFixed(2),
            total: total.toFixed(2),
            totalamount: total.toFixed(2),
            discount: discount.toFixed(2)
        };
        const newColumns = [...this.state.columns];
        newColumns.splice(index, 1, newColumn);
        this.setState({ columns: newColumns });

        setTimeout(() => {
            this.evaluateTotal();
        }, 200);
    }

    evaluateTotal = () => {
        let subTotal = 0, totalVat = 0, totalDiscount = 0, payable = 0;

        for (let i = 0; i < this.state.columns.length; i++) {
            const element = this.state.columns[i];
            subTotal += toNum(element.costprice);
            totalVat += toNum(element.incomeTaxAmount);
            totalDiscount += toNum(element.discount);
            payable += toNum(element.total);
        }

        this.setState({
            subTotal: subTotal.toFixed(2),
            totalVat: totalVat.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2),
            payable: payable.toFixed(2)
        });
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
            data={this.state.columns}
            keyExtractor={(item, index) => `${index}`}
            renderItem={this.renderProductItem}
        />
    }

    renderRefundContainer = () => {
        return <KeyboardAwareScrollView style={{ flex: 1 }}>
            {this.renderRecordPayment()}
        </KeyboardAwareScrollView>
    }


    onDropDownChange = (key, idx) => {
        this.setState({ [key]: idx })
    }

    renderPaymentContainer = () => {

        return <KeyboardAwareScrollView style={{
            flexDirection: 'column',
            flex: 1
        }}>
            <AppPicker2
                title={this.state.paymentMode[this.state.paymentIndex]}
                text='Select Payment Mode'
                onChange={idx => this.onDropDownChange('paymentIndex', idx)}
                items={this.state.paymentMode}
            />
            {/* <View style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1
            }} /> */}
            {this.state.paymentIndex === 2 ? this.renderRecordPayment() : null}
            {this.state.paymentIndex === 1 ? this.renderCardInfo() : null}

        </KeyboardAwareScrollView>
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
            {/* <AppTextField
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
            <AppTextField
                label='MM'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required' />
            <AppTextField
                label='YYYY'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required' />
            <AppTextField
                label='CVV'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required' /> */}
        </View>

    }

    setAllBankFields = () => {
        setTimeout(() => {
            const { bank } = this.state;
            setFieldValue(this.bankRef, this.bankName(bank));
            setFieldValue(this.accNameRef, bank.laccount);
            setFieldValue(this.accNumRef, bank.accnum);

            setFieldValue(this.accTypeRef, bank.acctype);
            setFieldValue(this.swiftCodeRef, bank.bicnum);
            setFieldValue(this.ibanNumRef, bank.ibannum);
        }, 300);
    }

    onBankPress = () => {
        this.props.navigation.push('SelectBankScreen', {
            onBankSelected: bank => {
                const payMethodIndex = this.getPayMethodIndex(bank.paidmethod);
                this.setState({ payMethodIndex: payMethodIndex, bank: bank }, () => {
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
        if (bank) {
            const bankTitle = `${bank.nominalcode}-${bank.laccount}`;
            return bankTitle;
        }
        return '';

    }

    renderRecordPayment = () => {
        const { bank } = this.state;
        const { payMethod, payMethodIndex } = this.state;
        const isCreditNote = this.state.creditNote;
        return <View style={{
            flexDirection: 'column',
            paddingBottom: 12
        }}>
            <TouchableOpacity onPress={this.onBankPress}>
                <AppTextField
                    containerStyle={styles.textField}
                    label='Bank'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    lineWidth={1}
                    value={this.bankName(bank)}
                    title='*required'
                    editable={false}
                    fieldRef={this.bankRef} />

            </TouchableOpacity>
            <AppTextField
                containerStyle={styles.textField}
                label='A/c Name'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                fieldRef={this.accNameRef}
                value={bank ? bank.laccount : ''} />
            <AppTextField
                containerStyle={styles.textField}
                label='A/c No.'
                keyboardType='number-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                fieldRef={this.accNumRef}
                value={bank ? bank.accnum : ''} />
            <AppTextField
                containerStyle={styles.textField}
                label='A/c Type'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                value={bank ? bank.acctype : ''}
                fieldRef={this.accTypeRef} />
            <AppTextField
                containerStyle={styles.textField}
                label='BIC/Swift'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                editable={false}
                title='*required'
                value={bank ? bank.bicnum : ''}
                fieldRef={this.swiftCodeRef} />

            <AppTextField
                containerStyle={styles.textField}
                label='IBAN No'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                editable={false}
                value={bank ? bank.ibannum : ''}
                fieldRef={this.ibanNumRef} />

            {isCreditNote ? <AppTextField
                containerStyle={styles.textField}
                label='Reference'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                fieldRef={this.refNumRef}
                value={this._reference}
                onChangeText={text => this._reference = text} /> : null}

            <AppTextField
                containerStyle={styles.textField}
                label='Amount Paid'
                keyboardType='number-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                fieldRef={this.amtPaidRef} />
            <AppTextField
                containerStyle={styles.textField}
                label='Out. Amount'
                keyboardType='name-phone-pad'
                returnKeyType='next'
                lineWidth={1}
                title='*required'
                editable={false}
                fieldRef={this.outAmtRef} />
            {/* Select Method Picker */}
            <View style={styles.pickerBox}>
                
                <AppPicker2
                    title={payMethod[payMethodIndex]}
                    items={payMethod}
                    onChange={idx=>this.onDropDownChange('payMethodIndex',idx)}
                    text='Select Payment Method'
                />

            </View>

            <TouchableOpacity onPress={() => this.setState({ showPayDateDialog: true })}>
                <AppTextField
                    containerStyle={styles.textField}
                    label='Pay Date'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    editable={false}
                    value={timeHelper.format(this.state.payDate)}
                    fieldRef={this.payDateRef} />
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

    renderTabs = () => {
        const selected = this.state.selectedTab;
        const customerLabel = this.state.isSale ? 'Customer' : 'Supplier';
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

            {/* {this.isCreditNote() ? <AppTab title='Refund'
                icon='cash-refund'
                iconType='MaterialCommunityIcons'
                selected={selected === 'refund'}
                onTabPress={() => this.selectTab('refund')} />
                : null} */}
            {/* {(invoiceAmount > 0 && !this.isCreditNote()) ?
                <AppTab
                    title='Payment'
                    icon='payment'
                    selected={selected === 'payment'}
                    onTabPress={() => this.selectTab('payment')} />
                : null} */}

        </View>
    }

    showSaveOptions = body => {
        const items = ['Save', 'Save & New', 'Save & Email', 'Save & Print'];
        showSingleSelectAlert('Save Options', items, index => {
            this.addInvoice(body);
        })
    }

    addInvoice = body => {
        this.setState({ updating: true });
        const url = this.state.isSale ? '/sales/addSales' : '/purchase/addUpdatePurchase';
        Api.post(url, body)
            .then(response => {
                this.setState({ updating: false });
                this.onInvoiceUpdated(response.data.message);
            })
            .catch(err => {
                console.log('Error adding/updating invoice', err);
                this.setState({ updating: false });
                const action = this.state.editMode ? 'updating' : 'adding';
                setTimeout(() => showError(`Error ${action} invoice.`), 300);
            })
    }

    onInvoiceUpdated = message => {
        const { invoiceActions } = this.props;
        if (this.state.isSale) {
            if (this.state.creditNote) {
                invoiceActions.getSalesCNInvoiceList();
            } else {
                invoiceActions.getSalesInvoiceList();
            }
        } else {
            if (this.state.creditNote) {
                invoiceActions.getPurchaseCNInvoiceList();
            } else {
                invoiceActions.getPurchaseInvoiceList();
            }
        }
        setTimeout(() => {
            this.props.navigation.goBack();
            showSuccess(message);
        }, 300);
    }

    validateAndSave = () => {
        const { authData } = Store.getState().auth;
        const isSale = this.state.isSale;
        const body = {
            invoiceno: this.state.invoiceno,
            sdate: this.state.invDate,
            ldate: this.state.dueDate,
            inaddress: this.state.invoiceAddress,
            deladdress: this.state.deliveryAddress,
            terms: this.state.terms,
            quotes: this.state.notes,
            userid: authData.id,
            status: '0',
            issued: this.state.issued.toLowerCase(),
            type: this.props.route.params.info.invoice_type,
            pagetype: "1",
            total: `${this.state.payable}`,
            userdate: moment().utc().format()
        }
        if (isSale) {
            body.columns = this.state.columns;
            body.customer = this.state.customer;
        } else {
            body.pList = this.state.columns;
            body.supplier = this.state.customer;
            body.purchase = {
                sdate: body.sdate,
                ldate: body.ldate,
                invoiceno: body.invoiceno,
                inaddress: body.inaddress,
                deladdress: body.deladdress,
                total: body.total,
                quotes: body.quotes,
                status: body.status
            }
        }

        const customerTag = isSale ? 'customer' : 'supplier';
        if (!this.state.customer) {
            showError(`Please choose a ${customerTag}.`);
        } else {
            this.showSaveOptions(body);
        }
    }


    renderBottomCard = () => {
        const { payable, currency } = this.state;
        const payableAmt = `${currency} ${payable}`;
        return (
            payable > 0 ? <InvoiceBottomCard
                payable={payableAmt}
                onSavePress={this.validateAndSave}
                onBreakdownPress={() => this.setState({ showBreakdown: true })}
            /> : null
        )
    }
    render() {
        const { fetching,
            fetchError,
            currency,
            subTotal,
            totalVat,
            totalDiscount,
            payable } = this.state;
        if (fetching) {
            return <OnScreenSpinner />
        }
        if (fetchError) {
            return <FullScreenError tryAgainClick={this.fetchInfo} />
        }

        const selected = this.state.selectedTab;
        const discount = this.state.isSale ? `${totalDiscount} ${currency}-` : undefined;
        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1 }}>

                {this.renderTabs()}
                {selected === 'supplier' ? this.renderSupplierContainer() : null}
                {selected === 'product' ? this.renderProductContainer() : null}
                {/* {selected === 'payment' ? this.renderPaymentContainer() : null}
                {selected === 'refund' ? this.renderRefundContainer() : null} */}
                {this.renderBottomCard()}
            </View>
            <InvoiceBreakdown
                total={`${subTotal} ${currency}`}
                vat={`${totalVat} ${currency}`}
                discount={discount}
                payable={`${payable} ${currency}`}
                visible={this.state.showBreakdown}
                onPressOutside={() => this.setState({ showBreakdown: false })} />
            <ProgressDialog visible={this.state.updating} />
        </View>
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
    },
    textField: {
        marginTop: 18,
        marginHorizontal: 16
    },
    pickerBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'lightgray',
        marginHorizontal: 16,
        marginTop: 8
    },
    picker: {
        marginHorizontal: 12,
        marginTop: 4
    },
    appBtn: {
        borderRadius: 0
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