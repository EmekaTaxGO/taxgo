import React, { Component } from 'react';
import { View, Text, Picker, StyleSheet, KeyboardAvoidingView, ScrollView, Switch, Alert } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { colorAccent, colorWhite } from '../theme/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RaisedTextButton } from 'react-native-material-buttons';
import { DATE_FORMAT } from '../constants/appConstant';
import { connect } from 'react-redux';
import { toFloat } from '../helpers/Utils';
import { getFieldValue, setFieldValue, focusField } from '../helpers/TextFieldHelpers';

import * as productActions from '../redux/actions/productActions';
import * as taxActions from '../redux/actions/taxActions';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { bindActionCreators } from 'redux';
import Store from '../redux/Store';
import Snackbar from 'react-native-snackbar';
import { log } from '../components/Logger';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import ProgressDialog from '../components/ProgressDialog';


class AddProductScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: this.createProductType(),
            selectedTypeIndex: 0,
            selectedTaxIndex: 0,
            includeVat: false,
            showExpiryDateDialog: false,
            purchaseExpiryDate: new Date(),
            alreadyHaveStock: false,
            stockDate: new Date(),
            showStockDateDialog: false,
        }

    }

    salesAccount;
    purchaseAccount;
    supplier;

    codeRef = React.createRef();
    descriptionRef = React.createRef();
    barcodeRef = React.createRef();
    saleAccountRef = React.createRef();
    rateRef = React.createRef();
    salePriceRef = React.createRef();
    tradePriceRef = React.createRef();
    wholesalePriceRef = React.createRef();
    vatAmountRef = React.createRef();
    totalAmountRef = React.createRef();
    supplierRef = React.createRef();
    SICodeRef = React.createRef();
    purchaseDescRef = React.createRef();
    purchasePriceRef = React.createRef();
    purchaseAccRef = React.createRef();
    expiryDateRef = React.createRef();
    reorderLevelRef = React.createRef();
    reorderQtyRef = React.createRef();
    stockQtyRef = React.createRef();
    stockDateRef = React.createRef();
    stockPriceRef = React.createRef();
    locationRef = React.createRef();
    weightRef = React.createRef();
    barcodeRef = React.createRef();
    notesRef = React.createRef();

    createProductType = () => {
        return [
            {
                id: 1,
                value: 'Stock'
            },
            {
                id: 2,
                value: 'Non-Stock'
            },
            {
                id: 3,
                value: 'Service'
            },
        ]
    }

    isEditMode = () => {
        return this.props.route.params.product !== undefined;
    }

    renderStrip = (text) => {
        return <Text
            style={{
                width: '100%',
                backgroundColor: 'gray',
                color: 'white',
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 18
            }}>
            {text}
        </Text>
    }
    renderLabel = (text) => {
        return <Text
            style={{
                width: '100%',
                color: 'black',
                fontSize: 14,
                paddingHorizontal: 16,
                paddingTop: 12
            }}>
            {text}
        </Text>
    }

    onVatChange = (itemValue, itemIndex) => {

        // this.setState({ selectedVatIndex: itemIndex }, () => {
        //     const { vats, selectedTaxIndex } = this.state;
        //     const vat = vats[selectedVatIndex].id * 2.009
        //     this.setText(this.vatAmountRef, vat);
        //     this.setText(this.totalAmountRef, vat * 1.5);
        // })
        this.setState({
            selectedTaxIndex: itemIndex
        }, () => {
            this.onPriceChange();
        })
    }

    setText = (ref, value) => {
        const { current: field } = ref;
        field.setValue(value);
    }

    focus = ref => {
        ref.current.focus();
    }

    onPurchaseExpiryChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.purchaseExpiryDate;
        this.setState({
            purchaseExpiryDate: currentDate,
            showExpiryDateDialog: false
        }, () => {
            this.setText(this.expiryDateRef, moment(currentDate).format(DATE_FORMAT));
        })
    }

    onStockDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.stockDate;
        this.setState({
            stockDate: currentDate,
            showStockDateDialog: false
        }, () => {
            this.setText(this.stockDateRef, moment(currentDate).format(DATE_FORMAT));
        })
    }

    onBarcodePress = () => {
        this.props.navigation.push('ScanBarcodeScreen', {
            onBarCodeScanned: data => {
                setFieldValue(this.barcodeRef, data);
            }
        });
    }

    validateAndSubmitForm = () => {
        const isStock = this.state.selectedTypeIndex === 0;

        // if (isEmpty(getFieldValue(this.codeRef))) {
        //     this.showAlert('Please enter item code.');

        // } else if (isEmpty(getFieldValue(this.descriptionRef))) {
        //     this.showAlert('Please enter item description.');

        // } else if (isStock && isEmpty(getFieldValue(this.salePriceRef))) {
        //     this.showAlert('Please enter sales price.');

        // } else if (isStock && !isFloat(getFieldValue(this.salePriceRef))) {
        //     this.showAlert('Please enter valid sales price.');

        // } else if (!isStock && isEmpty(getFieldValue(this.rateRef))) {
        //     this.showAlert('Please enter rate.');

        // } else if (!isStock && !isFloat(getFieldValue(this.rateRef))) {
        //     this.showAlert('Please enter valid rate.');

        // } else {
        this.proceedToSubmit();
        // }
    }

    proceedToSubmit = () => {
        const { productActions } = this.props;
        const body = this.createPostBody();
        console.log('Product Update Body:', body);
        productActions.checkForPreUpdate(body, this.onUpdateSuccess, this.onUpdateError);
    }

    onUpdateSuccess = data => {
        Alert.alert('Alert', data.message, [
            {
                style: 'default',
                text: 'OK',
                onPress: () => {
                    this.props.route.params.onProductUpdated();
                    this.props.navigation.goBack();
                }
            }
        ], { cancelable: false });
    }

    onUpdateError = message => {
        Alert.alert('Alert', message, [
            {
                style: 'default',
                text: 'OK',
                onPress: () => { }
            }
        ], { cancelable: false });
    }

    isStock = () => {
        return this.state.selectedTypeIndex === 0;
    }

    createPostBody = () => {

        const { authData } = Store.getState().auth;
        const isStock = this.isStock();
        return {
            type: this.isEditMode() ? '2' : '1',
            userid: `${authData.id}`,
            itemtype: this.state.types[this.state.selectedTypeIndex].value,
            icode: getFieldValue(this.codeRef),
            idescription: getFieldValue(this.descriptionRef),
            saccount: this.salesAccount ? `${this.salesAccount.id}` : '', //Sales Ledger Id
            sp_price: isStock ? getFieldValue(this.salePriceRef) : '',
            trade_price: isStock ? getFieldValue(this.tradePriceRef) : '',
            quantity: isStock ? getFieldValue(this.stockQtyRef) : '',
            date: isStock ? moment(this.state.stockDate).format('YYYY-MM-DD') : '',
            c_price: isStock ? getFieldValue(this.stockPriceRef) : '',
            wholesale: isStock ? getFieldValue(this.wholesalePriceRef) : '',
            rate: !isStock ? getFieldValue(this.rateRef) : '',
            sicode: getFieldValue(this.SICodeRef),
            pdescription: getFieldValue(this.purchaseDescRef),
            costprice: getFieldValue(this.purchasePriceRef),
            paccount: this.purchaseAccount ? `${this.purchaseAccount.id}` : '',
            rlevel: getFieldValue(this.reorderLevelRef),
            // name: "18",
            rquantity: getFieldValue(this.reorderQtyRef),
            location: isStock ? getFieldValue(this.locationRef) : '',
            barcode: getFieldValue(this.barcodeRef),
            weight: isStock ? getFieldValue(this.weightRef) : '',
            notes: isStock ? getFieldValue(this.notesRef) : '',
            adminid: '',
            userdate: moment(new Date()).format('YYYY-MM-DD'),
            logintype: 'user',
            // pimage: "TAXGO_IMAGES_1608187534911.png",
            expiredate: moment(this.state.purchaseExpiryDate).format('YYYY-MM-DD'),
            vat: `${this.getTaxPercentage()}`,
            vatamt: `${this.getTaxAmount()}`,
            includevat: this.state.includeVat ? 1 : 0,
            totalprice: `${this.getTotalPrice()}`
        }
    }

    getSalesPrice = () => {
        const isStock = this.state.selectedTypeIndex === 0;
        const salesPrice = toFloat(getFieldValue(isStock ? this.salePriceRef : this.rateRef)).toFixed(2);
        return toFloat(salesPrice);
    }

    getTaxPercentage = () => {
        const { selectedTaxIndex } = this.state;
        const { taxList } = this.props.tax;
        if (selectedTaxIndex === 0) {
            return 0;
        } else {
            const percentage = toFloat(taxList[selectedTaxIndex - 1].percentage).toFixed(2);
            return toFloat(percentage);
        }
    }

    getTotalPrice = () => {

        if (this.state.includeVat) {
            return toFloat(getFieldValue(this.salePriceRef));
        } else {
            return this.getSalesPrice() + this.getTaxAmount();
        }
    }

    getTaxAmount = () => {
        const salesPrice = this.getSalesPrice();
        const taxPercentage = this.getTaxPercentage();
        let taxAmt = 0.0;
        if (this.state.includeVat) {
            const principal = (salesPrice * 100) / (100 + taxPercentage);
            taxAmt = salesPrice - principal;
        } else {
            taxAmt = (taxPercentage * salesPrice) / 100;
        }
        taxAmt = toFloat(taxAmt.toFixed(2));
        return taxAmt;
    }

    onPriceChange = () => {
        setFieldValue(this.vatAmountRef, `${this.getTaxAmount()}`);
        setFieldValue(this.totalAmountRef, `${this.getTotalPrice()}`);
    }

    showAlert = (message) => {
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
            action: {
                text: 'OK',
                textColor: colorWhite,
                onPress: () => { }
            }
        });
    }

    componentDidMount() {
        this.configHeader();
        this.setTitle();
        this.setFieldsValue();

        // setTimeout(() => {
        //     focusField(this.codeRef);
        // }, 200);
        this.fetchTaxList();
    }

    configHeader = () => {
        this.props.navigation.setOptions({
            headerRight: () => {
                return <TouchableOpacity onPress={this.onBarcodePress} style={{ padding: 12 }}>
                    <MaterialIcon name='qr-code-scanner' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }

    setTitle = () => {
        const titlePrefix = this.isEditMode() ? 'Edit' : 'Add';
        const title = `${titlePrefix} Product`;
        this.props.navigation.setOptions({ title });
    }
    setFieldsValue = () => {
        const { product } = this.props.route.params;
        if (product !== undefined) {
            //Preset values
        }
    }

    onSupplierPress = () => {
        this.props.navigation.push('SelectSupplierScreen', {
            onSupplierSelected: item => {
                this.supplier = item;
                setFieldValue(this.supplierRef, item.name);
            }
        });
    }

    onSalesAccountClick = () => {
        this.props.navigation.push('SaleLedgerScreen', {
            onLedgerSelected: item => {
                log('Selected Ledger:', item);
                this.salesAccount = { ...item };
                const label = `${item.nominalcode}-${item.category}-${item.categorygroup}`;
                setFieldValue(this.saleAccountRef, label);
            }
        })
    }

    onPurchaseAccPress = () => {
        this.props.navigation.push('PurchaseLedgerScreen', {
            onLedgerSelected: item => {
                this.purchaseAccount = { ...item };
                const label = `${item.nominalcode}-${item.category}-${item.categorygroup}`;
                setFieldValue(this.purchaseAccRef, label);
            }
        })
    }

    onStockChange = enabled => {
        this.setState({ alreadyHaveStock: enabled }, () => {
            setFieldValue(this.stockQtyRef, enabled ? '0' : '');
            setFieldValue(this.stockPriceRef, enabled ? '0.00' : '');
        });
    }

    renderStock = () => {
        return <View style={{ flexDirection: 'column' }}>
            <View style={{ marginVertical: 24 }}>
                {this.renderStrip('Stock')}
            </View>

            <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 16, color: 'gray' }}>I have existing stock in hand.</Text>
                <Switch
                    style={{ marginLeft: 40 }}
                    thumbColor={this.state.alreadyHaveStock ? colorAccent : 'gray'}
                    value={this.state.alreadyHaveStock}
                    onValueChange={this.onStockChange}
                />
            </View>
            <View style={{ marginTop: 8, paddingHorizontal: 16 }}>
                <TextField
                    label='Quantity'
                    keyboardType='numeric'
                    returnKeyType='next'
                    lineWidth={1}
                    editable={this.state.alreadyHaveStock}
                    ref={this.stockQtyRef}
                    onSubmitEditing={() => this.focus(this.stockPriceRef)} />
                <TextField
                    label='Cost Price'
                    keyboardType='number-pad'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={this.state.alreadyHaveStock}
                    ref={this.stockPriceRef} />
                {this.state.alreadyHaveStock ? <TouchableOpacity onPress={() => this.setState({ showStockDateDialog: true })}>
                    <TextField
                        label='As of Date'
                        keyboardType='default'
                        returnKeyType='next'
                        editable={false}
                        lineWidth={1}
                        ref={this.stockDateRef} />
                </TouchableOpacity> : null}

                {this.state.showStockDateDialog ? <DateTimePicker
                    value={this.state.stockDate}
                    mode={'datetime'}
                    display='default'
                    minimumDate={new Date()}
                    onChange={this.onStockDateChange}
                /> : null}
            </View>
        </View>;
    }

    renderOther = () => {
        return <View style={{ flexDirection: 'column' }}>
            <View style={{ marginTop: 24 }}>
                {this.renderStrip('Others')}
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
                <TextField
                    label='Location'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    ref={this.locationRef}
                    onSubmitEditing={() => this.focus(this.weightRef)} />
                <TextField
                    label='Weight'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    ref={this.weightRef}
                    onSubmitEditing={() => this.focus(this.barcodeRef)} />
                {/* <TextField
                    label='Barcode'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    ref={this.barcodeRef}
                    onSubmitEditing={() => this.focus(this.notesRef)} /> */}
                <TextField
                    label='Notes'
                    keyboardType='default'
                    returnKeyType='done'
                    lineWidth={1}
                    ref={this.notesRef} />
            </View>
        </View>;
    }

    renderPriceField = () => {
        return <View style={{ flexDirection: 'column' }}>
            <TextField
                label='Sales Price'
                keyboardType='numeric'
                returnKeyType='next'
                ref={this.salePriceRef}
                lineWidth={1}
                onChangeText={text => {
                    setTimeout(this.onPriceChange, 200);
                }}
                onSubmitEditing={() => { this.tradePriceRef.current.focus() }} />
            <TextField
                label='Trade Price'
                keyboardType='default'
                returnKeyType='next'
                ref={this.tradePriceRef}
                lineWidth={1}
                onSubmitEditing={() => { this.wholesalePriceRef.current.focus() }} />
            <TextField
                label='Whole Sale Price'
                keyboardType='default'
                returnKeyType='done'
                ref={this.wholesalePriceRef}
                lineWidth={1}
                onSubmitEditing={() => { }} />
        </View>;
    }

    fetchTaxList = () => {
        const { taxActions } = this.props;
        taxActions.getTaxList();
    }

    getTaxList = () => {
        const taxes = ['Select Tax Rates'];
        this.props.tax.taxList.forEach((value) => {
            taxes.push(`${value.taxtype}-${value.percentage}%`);
        })
        return taxes;
    }

    onIncludeVatChange = enabled => {
        this.setState({ includeVat: enabled }, () => {
            this.onPriceChange();
        });
    }


    render() {

        const { tax } = this.props;
        if (tax.fetchingTaxList) {
            return <OnScreenSpinner />
        }
        if (tax.fetchTaxListError) {
            return <FullScreenError tryAgainClick={this.fetchTaxList} />
        }

        const { types, selectedTypeIndex, selectedTaxIndex } = this.state;
        const isStock = selectedTypeIndex === 0;
        const taxList = this.getTaxList();

        return <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='always'>

                {this.renderStrip('Item')}
                {this.renderLabel('Type')}
                <Picker
                    style={{ marginHorizontal: 12 }}
                    selectedValue={types[selectedTypeIndex].value}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ selectedTypeIndex: itemIndex })}>

                    {types.map((value, index) => <Picker.Item
                        label={value.value} value={value.value} key={`${index}`} />)}
                </Picker>
                <View style={{ flexDirection: 'column', paddingHorizontal: 16 }}>
                    <TextField
                        label='Code/Name'
                        keyboardType='default'
                        returnKeyType='next'
                        ref={this.codeRef}
                        lineWidth={1}
                        onSubmitEditing={() => { this.descriptionRef.current.focus() }} />
                    <TextField
                        label='Description'
                        keyboardType='default'
                        returnKeyType={isStock ? 'next' : 'done'}
                        ref={this.descriptionRef}
                        lineWidth={1}
                        onSubmitEditing={() => {
                            if (isStock) {
                                this.salePriceRef.current.focus()
                            }
                        }} />
                    <TextField
                        label='Bar Code'
                        keyboardType='default'
                        returnKeyType='next'
                        ref={this.barcodeRef}
                        lineWidth={1}
                    />
                </View>
                <View style={{ marginTop: 12 }}>
                    {this.renderStrip('Sale')}
                </View>

                <View style={{ paddingHorizontal: 16 }}>
                    <TouchableOpacity onPress={this.onSalesAccountClick}>
                        <TextField
                            label='Sales Acc.'
                            keyboardType='default'
                            returnKeyType='next'
                            ref={this.saleAccountRef}
                            lineWidth={1}
                            editable={false}
                            onSubmitEditing={() => { this.salePriceRef.current.focus() }} />
                    </TouchableOpacity>
                    {!isStock ?
                        <TextField
                            label='Rate'
                            keyboardType='number-pad'
                            returnKeyType='done'
                            ref={this.rateRef}
                            lineWidth={1}
                        /> : null}
                    {isStock ? this.renderPriceField() : null}
                </View>

                {this.renderLabel('VAT/GST')}
                <Picker
                    style={{ marginHorizontal: 12 }}
                    selectedValue={taxList[selectedTaxIndex]}
                    mode='dropdown'
                    onValueChange={this.onVatChange}>

                    {taxList.map((value, index) => <Picker.Item
                        label={value} value={value} key={`${index}`} />)}
                </Picker>
                <View style={{ paddingHorizontal: 16 }}>
                    <TextField
                        label='Vat Amount'
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        editable={false}
                        ref={this.vatAmountRef}
                        onSubmitEditing={() => { }} />
                </View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginTop: 12 }}>
                    <Text style={{ fontSize: 16, color: 'gray' }}>Include Vat.</Text>
                    <Switch
                        style={{ marginLeft: 40 }}
                        thumbColor={this.state.includeVat ? colorAccent : 'gray'}
                        value={this.state.includeVat}
                        onValueChange={this.onIncludeVatChange}
                    />
                </View>

                <View style={{ paddingHorizontal: 16 }}>
                    <TextField
                        label='Total'
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        editable={false}
                        ref={this.totalAmountRef}
                        onSubmitEditing={() => { }} />
                </View>
                <View style={{ marginTop: 24 }}>
                    {this.renderStrip('Purchase')}
                </View>

                <View style={{ paddingHorizontal: 16 }}>
                    <TouchableOpacity onPress={this.onSupplierPress}>
                        <TextField
                            label='Supplier'
                            keyboardType='default'
                            returnKeyType='next'
                            lineWidth={1}
                            editable={false}
                            ref={this.supplierRef}
                            onSubmitEditing={() => this.SICodeRef.current.focus()} />

                    </TouchableOpacity>
                    <TextField
                        label='SI Code'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.SICodeRef}
                        onSubmitEditing={() => this.purchaseDescRef.current.focus()} />

                    <TextField
                        label='Purchase Desc.'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.purchaseDescRef}
                        onSubmitEditing={() => this.purchasePriceRef.current.focus()} />

                    <TextField
                        label='Cost Price'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.purchasePriceRef}
                        onSubmitEditing={() => this.purchaseAccRef.current.focus()} />
                    <TouchableOpacity onPress={this.onPurchaseAccPress}>
                        <TextField
                            label='Purchase Acc.'
                            keyboardType='default'
                            returnKeyType='next'
                            lineWidth={1}
                            editable={false}
                            ref={this.purchaseAccRef}
                            onSubmitEditing={() => { }} />

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ showExpiryDateDialog: true })}>
                        <TextField
                            label='Expiry Date'
                            keyboardType='default'
                            returnKeyType='next'
                            lineWidth={1}
                            editable={false}
                            ref={this.expiryDateRef} />
                    </TouchableOpacity>
                    {this.state.showExpiryDateDialog ? <DateTimePicker
                        value={this.state.purchaseExpiryDate}
                        mode={'datetime'}
                        display='default'
                        minimumDate={new Date()}
                        onChange={this.onPurchaseExpiryChange}
                    /> : null}

                    <TextField
                        label='Reorder Level.'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.reorderLevelRef}
                        onSubmitEditing={() => this.focus(this.reorderQtyRef)} />

                    <TextField
                        label='Reorder Quantity'
                        keyboardType='numeric'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.reorderQtyRef} />
                </View>
                {isStock ? this.renderStock() : null}
                {isStock ? this.renderOther() : null}
                <RaisedTextButton
                    title='Add'
                    color={colorAccent}
                    titleColor='white'
                    style={styles.materialBtn}
                    onPress={this.validateAndSubmitForm} />
                <ProgressDialog visible={this.props.product.updatingProduct} />
            </ScrollView>

        </KeyboardAvoidingView>
    }
}
const styles = StyleSheet.create({
    textField: {
        width: '100%',
        marginLeft: 12
    },
    materialBtn: {
        padding: 26,
        marginTop: 30,
        fontSize: 50,
        margin: 16
    }
});
export default connect(
    state => ({
        product: state.product,
        tax: state.tax
    }),
    dispatch => ({
        productActions: bindActionCreators(productActions, dispatch),
        taxActions: bindActionCreators(taxActions, dispatch)
    })
)(AddProductScreen);