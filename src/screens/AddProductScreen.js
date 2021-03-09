import React, { Component } from 'react';
import { View, Text, Picker, StyleSheet, KeyboardAvoidingView, ScrollView, Switch, Alert } from 'react-native';
import { colorAccent, colorWhite } from '../theme/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RaisedTextButton } from 'react-native-material-buttons';
import { DATE_FORMAT } from '../constants/appConstant';
import { connect } from 'react-redux';
import { toFloat, isEmpty, isInteger, isFloat, toInteger } from '../helpers/Utils';
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
import AppTextField from '../components/AppTextField';


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

        if (isEmpty(getFieldValue(this.codeRef))) {
            this.showAlert('Please enter item code.');

        } else if (isEmpty(getFieldValue(this.descriptionRef))) {
            this.showAlert('Please enter item description.');

        } else if (isStock && isEmpty(getFieldValue(this.salePriceRef))) {
            this.showAlert('Please enter sales price.');

        } else if (isStock && !isFloat(getFieldValue(this.salePriceRef))) {
            this.showAlert('Please enter valid sales price.');

        } else if (!isStock && isEmpty(getFieldValue(this.rateRef))) {
            this.showAlert('Please enter rate.');

        } else if (!isStock && !isFloat(getFieldValue(this.rateRef))) {
            this.showAlert('Please enter valid rate.');

        } else {
            console.log('Validated!!');
            this.proceedToSubmit();
        }
    }

    proceedToSubmit = () => {
        const { productActions } = this.props;
        const body = this.createPostBody();
        if (this.isEditMode()) {
            productActions.updateProduct(body, this.onUpdateSuccess, this.onUpdateError);
        } else {
            productActions.checkForPreUpdate(body, this.onUpdateSuccess, this.onUpdateError);
        }

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
            name: this.supplier ? `${this.supplier.id}` : '',
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
        const isStock = this.isStock();
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
            return toFloat(getFieldValue(this.isStock() ? this.salePriceRef : this.rateRef));
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
        this.fetchTaxList();
    }

    shouldComponentUpdate(newProps, newState) {
        const { product: newProduct, tax: newTax } = newProps;
        const { product: oldProduct, tax: oldTax } = this.props;
        return newState.selectedTypeIndex !== this.state.selectedTypeIndex
            || newState.selectedTaxIndex !== this.state.selectedTaxIndex
            || newState.includeVat !== this.state.includeVat
            || newState.showExpiryDateDialog !== this.state.showExpiryDateDialog
            || newState.alreadyHaveStock !== this.state.alreadyHaveStock
            || newState.showStockDateDialog !== this.state.showStockDateDialog

            //Props Change
            || newTax.fetchingTaxList !== oldTax.fetchingTaxList
            || newProduct.updatingProduct !== oldProduct.updatingProduct;
    }

    UNSAFE_componentWillUpdate(newProps, newState) {
        const { tax: newTax } = newProps;
        if (this.props.tax.fetchingTaxList && !newTax.fetchingTaxList
            && newTax.fetchTaxListError === undefined) {
            //Tax List has been fetched
            if (this.isEditMode()) {
                this.presetState(newProps);
            }

            //Initial Focus code Field
            setTimeout(() => {
                focusField(this.codeRef);
            }, 300);

        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { tax: newTax } = this.props;
        if (prevProps.tax.fetchingTaxList && !newTax.fetchingTaxList
            && newTax.fetchTaxListError === undefined) {
            //Tax List has been fetched
            if (this.isEditMode()) {
                this.setAllFieldData();
            }

        }
    }

    setAllFieldData = () => {
        const { productData: product } = this.props.tax;
        const isStock = product.itemtype === 'Stock';
        setFieldValue(this.codeRef, product.icode);
        setFieldValue(this.descriptionRef, product.idescription);
        setFieldValue(this.barcodeRef, product.barcode);

        if (isStock) {
            setFieldValue(this.salePriceRef, product.sp_price);
            setFieldValue(this.tradePriceRef, product.trade_price);
            setFieldValue(this.wholesalePriceRef, product.wholesale);
        } else {
            setFieldValue(this.rateRef, product.rate);
        }
        setTimeout(this.onPriceChange, 200);
        setFieldValue(this.SICodeRef, product.sicode);
        setFieldValue(this.purchaseDescRef, product.pdescription);
        setFieldValue(this.purchasePriceRef, product.costprice);
        setFieldValue(this.expiryDateRef, product.expiredate);
        setFieldValue(this.reorderLevelRef, product.rlevel);
        setFieldValue(this.reorderQtyRef, product.rquantity);

        if (isStock) {
            setFieldValue(this.stockQtyRef, product.quantity);
            setFieldValue(this.stockPriceRef, product.c_price);
        }

        setFieldValue(this.locationRef, product.location);
        setFieldValue(this.weightRef, product.weight);
        setFieldValue(this.notesRef, product.notes);

        if (isInteger(product.saccount)) {
            const filteredSales = this.props.tax.salesLedgers
                .filter(value => toInteger(product.saccount) === value.id);
            if (filteredSales && filteredSales.length > 0) {
                this.salesAccount = { ...filteredSales[0] };
                this.setSaleAccount();
            }
        }

        if (isInteger(product.paccount)) {
            const filteredPurchase = this.props.tax.purchaseLedgers
                .filter(value => toInteger(product.paccount) === value.id);
            if (filteredPurchase && filteredPurchase.length > 0) {
                this.purchaseAccount = { ...filteredPurchase[0] };
                this.setPurchaseAccount();
            }
        }
        if (isInteger(product.paccount)) {
            const filteredPurchase = this.props.tax.purchaseLedgers
                .filter(value => toInteger(product.paccount) === value.id);
            if (filteredPurchase && filteredPurchase.length > 0) {
                this.purchaseAccount = { ...filteredPurchase[0] };
                this.setPurchaseAccount();
            }
        }
        if (isInteger(product.name)) {
            const filteredSupplier = this.props.tax.suppliers
                .filter(value => toInteger(product.name) === value.id);
            if (filteredSupplier && filteredSupplier.length > 0) {
                this.supplier = { ...filteredSupplier[0] };
                this.setSupplier();
            }
        }
    }

    presetState = (newProps) => {
        const { productData: product } = newProps.tax;
        let itemIndex = 0;
        switch (product.itemtype) {
            case 'Stock':
            default:
                itemIndex = 0;
                break;
            case 'Non-Stock':
                itemIndex = 1;
                break;
            case 'Service':
                itemIndex = 2;
                break;
        }

        let taxIndex = 0;
        const { taxList } = this.props.tax;
        taxList.forEach((value, index) => {
            if (toFloat(product.vat) === value.percentage) {
                taxIndex = 1 + index;
            }
        });
        this.setState({
            selectedTypeIndex: itemIndex,
            includeVat: product.includevat === 1,
            alreadyHaveStock: isInteger(product.quantity),
            selectedTaxIndex: taxIndex
        });
    }

    configHeader = () => {
        const titlePrefix = this.isEditMode() ? 'Edit' : 'Add';
        const title = `${titlePrefix} Product`;

        this.props.navigation.setOptions({
            title,
            headerRight: () => {
                return !this.isEditMode() ?
                    <TouchableOpacity onPress={this.onBarcodePress} style={{ padding: 12 }}>
                        <MaterialIcon name='qr-code-scanner' size={30} color='white' />
                    </TouchableOpacity> : null
            }
        })
    }

    onSupplierPress = () => {
        this.props.navigation.push('SelectSupplierScreen', {
            onSupplierSelected: item => {
                this.supplier = item;
                this.setSupplier();
            }
        });
    }

    onSalesAccountClick = () => {
        this.props.navigation.push('SaleLedgerScreen', {
            onLedgerSelected: item => {
                this.salesAccount = { ...item };
                this.setSaleAccount();
            }
        })
    }

    setSaleAccount = () => {
        const label = `${this.salesAccount.nominalcode}-${this.salesAccount.laccount}`;
        setFieldValue(this.saleAccountRef, label);
    }
    setPurchaseAccount = () => {
        const label = `${this.purchaseAccount.nominalcode}-${this.purchaseAccount.laccount}`;
        setFieldValue(this.purchaseAccRef, label);
    }

    setSupplier = () => {
        setFieldValue(this.supplierRef, this.supplier.name);
    }

    onPurchaseAccPress = () => {
        this.props.navigation.push('PurchaseLedgerScreen', {
            onLedgerSelected: item => {
                this.purchaseAccount = { ...item };
                this.setPurchaseAccount();
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
                <AppTextField
                    containerStyle={styles.textField}
                    label='Quantity'
                    keyboardType='numeric'
                    returnKeyType='next'
                    lineWidth={1}
                    editable={this.state.alreadyHaveStock}
                    fieldRef={this.stockQtyRef}
                    onSubmitEditing={() => this.focus(this.stockPriceRef)} />
                <AppTextField
                    containerStyle={styles.textField}
                    label='Cost Price'
                    keyboardType='number-pad'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={this.state.alreadyHaveStock}
                    fieldRef={this.stockPriceRef} />
                {this.state.alreadyHaveStock ? <TouchableOpacity onPress={() => this.setState({ showStockDateDialog: true })}>
                    <AppTextField
                        containerStyle={styles.textField}
                        label='As of Date'
                        keyboardType='default'
                        returnKeyType='next'
                        editable={false}
                        lineWidth={1}
                        fieldRef={this.stockDateRef} />
                </TouchableOpacity> : null}

                {this.state.showStockDateDialog ? <DateTimePicker
                    value={this.state.stockDate}
                    mode={'datetime'}
                    display='default'
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
                <AppTextField
                    containerStyle={styles.textField}
                    label='Location'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    fieldRef={this.locationRef}
                    onSubmitEditing={() => this.focus(this.weightRef)} />
                <AppTextField
                    containerStyle={styles.textField}
                    label='Weight'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    fieldRef={this.weightRef}
                    onSubmitEditing={() => this.focus(this.barcodeRef)} />
                {/* <AppTextField
                    label='Barcode'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    fieldRef={this.barcodeRef}
                    onSubmitEditing={() => this.focus(this.notesRef)} /> */}
                <AppTextField
                    containerStyle={styles.textField}
                    label='Notes'
                    keyboardType='default'
                    returnKeyType='done'
                    lineWidth={1}
                    fieldRef={this.notesRef} />
            </View>
        </View>;
    }

    renderPriceField = () => {
        return <View style={{ flexDirection: 'column' }}>
            <AppTextField
                containerStyle={styles.textField}
                label='Sales Price'
                keyboardType='numeric'
                returnKeyType='next'
                fieldRef={this.salePriceRef}
                lineWidth={1}
                onChangeText={text => {
                    setTimeout(this.onPriceChange, 200);
                }}
                onSubmitEditing={() => { this.tradePriceRef.current.focus() }} />
            <AppTextField
                containerStyle={styles.textField}
                label='Trade Price'
                keyboardType='default'
                returnKeyType='next'
                fieldRef={this.tradePriceRef}
                lineWidth={1}
                onSubmitEditing={() => { this.wholesalePriceRef.current.focus() }} />
            <AppTextField
                containerStyle={styles.textField}
                label='Whole Sale Price'
                keyboardType='default'
                returnKeyType='done'
                fieldRef={this.wholesalePriceRef}
                lineWidth={1}
                onSubmitEditing={() => { }} />
        </View>;
    }

    fetchTaxList = () => {
        const { taxActions } = this.props;
        const { product } = this.props.route.params;
        taxActions.getTaxList(product ? product.id : undefined);
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
        const editMode = this.isEditMode();

        return <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='always'>

                {this.renderStrip('Item')}
                {this.renderLabel('Type')}
                <View style={styles.typeBox}>
                    <Picker
                        style={{ marginHorizontal: 12 }}
                        selectedValue={types[selectedTypeIndex].value}
                        mode='dropdown'
                        onValueChange={(itemValue, itemIndex) => this.setState({ selectedTypeIndex: itemIndex })}>

                        {types.map((value, index) => <Picker.Item
                            label={value.value} value={value.value} key={`${index}`} />)}
                    </Picker>
                </View>

                <View style={{ flexDirection: 'column', paddingHorizontal: 16 }}>
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Code/Name'
                        keyboardType='default'
                        returnKeyType='next'
                        fieldRef={this.codeRef}
                        lineWidth={1}
                        editable={!editMode}
                        onSubmitEditing={() => { this.descriptionRef.current.focus() }} />
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Description'
                        keyboardType='default'
                        returnKeyType={isStock ? 'next' : 'done'}
                        fieldRef={this.descriptionRef}
                        lineWidth={1}
                        onSubmitEditing={() => {
                            if (isStock) {
                                this.salePriceRef.current.focus()
                            }
                        }} />
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Bar Code'
                        keyboardType='default'
                        returnKeyType='next'
                        fieldRef={this.barcodeRef}
                        editable={!editMode}
                        lineWidth={1}
                    />
                </View>
                <View style={{ marginTop: 12 }}>
                    {this.renderStrip('Sale')}
                </View>

                <View style={{ paddingHorizontal: 16 }}>
                    <TouchableOpacity onPress={this.onSalesAccountClick}>
                        <AppTextField
                            containerStyle={styles.textField}
                            label='Sales Acc.'
                            keyboardType='default'
                            returnKeyType='next'
                            fieldRef={this.saleAccountRef}
                            lineWidth={1}
                            editable={false}
                            onSubmitEditing={() => { this.salePriceRef.current.focus() }} />
                    </TouchableOpacity>
                    {!isStock ?
                        <AppTextField
                            containerStyle={styles.textField}
                            label='Rate'
                            keyboardType='number-pad'
                            returnKeyType='done'
                            fieldRef={this.rateRef}
                            lineWidth={1}
                            onChangeText={text => setTimeout(this.onPriceChange, 200)}
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
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Vat Amount'
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        editable={false}
                        fieldRef={this.vatAmountRef}
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
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Total'
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        editable={false}
                        fieldRef={this.totalAmountRef}
                        onSubmitEditing={() => { }} />
                </View>
                <View style={{ marginTop: 24 }}>
                    {this.renderStrip('Purchase')}
                </View>

                <View style={{ paddingHorizontal: 16 }}>
                    <TouchableOpacity onPress={this.onSupplierPress}>
                        <AppTextField
                            containerStyle={styles.textField}
                            label='Supplier'
                            keyboardType='default'
                            returnKeyType='next'
                            lineWidth={1}
                            editable={false}
                            fieldRef={this.supplierRef}
                            onSubmitEditing={() => this.SICodeRef.current.focus()} />

                    </TouchableOpacity>
                    <AppTextField
                        containerStyle={styles.textField}
                        label='SI Code'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.SICodeRef}
                        onSubmitEditing={() => this.purchaseDescRef.current.focus()} />

                    <AppTextField
                        containerStyle={styles.textField}
                        label='Purchase Desc.'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.purchaseDescRef}
                        onSubmitEditing={() => this.purchasePriceRef.current.focus()} />

                    <AppTextField
                        containerStyle={styles.textField}
                        label='Cost Price'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.purchasePriceRef}
                        onSubmitEditing={() => this.purchaseAccRef.current.focus()} />
                    <TouchableOpacity onPress={this.onPurchaseAccPress}>
                        <AppTextField
                            containerStyle={styles.textField}
                            label='Purchase Acc.'
                            keyboardType='default'
                            returnKeyType='next'
                            lineWidth={1}
                            editable={false}
                            fieldRef={this.purchaseAccRef}
                            onSubmitEditing={() => { }} />

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ showExpiryDateDialog: true })}>
                        <AppTextField
                            containerStyle={styles.textField}
                            label='Expiry Date'
                            keyboardType='default'
                            returnKeyType='next'
                            lineWidth={1}
                            editable={false}
                            fieldRef={this.expiryDateRef} />
                    </TouchableOpacity>
                    {this.state.showExpiryDateDialog ? <DateTimePicker
                        value={this.state.purchaseExpiryDate}
                        mode={'datetime'}
                        display='default'
                        onChange={this.onPurchaseExpiryChange}
                    /> : null}

                    <AppTextField
                        containerStyle={styles.textField}
                        label='Reorder Level.'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.reorderLevelRef}
                        onSubmitEditing={() => this.focus(this.reorderQtyRef)} />

                    <AppTextField
                        containerStyle={styles.textField}
                        label='Reorder Quantity'
                        keyboardType='numeric'
                        returnKeyType='next'
                        lineWidth={1}
                        fieldRef={this.reorderQtyRef} />
                </View>
                {isStock ? this.renderStock() : null}
                {isStock ? this.renderOther() : null}
                <RaisedTextButton
                    title={this.isEditMode() ? 'Update' : 'Add'}
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
        marginTop: 18
    },
    materialBtn: {
        padding: 26,
        marginTop: 30,
        fontSize: 50,
        margin: 16
    },
    typeBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'lightgray',
        marginHorizontal: 16,
        marginTop: 12
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