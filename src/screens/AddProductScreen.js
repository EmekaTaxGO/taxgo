import React, { Component } from 'react';
import { View, Text, Picker, StyleSheet, KeyboardAvoidingView, ScrollView, Switch, Alert } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { colorAccent } from '../theme/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RaisedTextButton } from 'react-native-material-buttons';
import { DATE_FORMAT } from '../constants/appConstant';
import { connect } from 'react-redux';
import { isEmpty, validateEmail } from '../helpers/Utils';
import { getFieldValue, setFieldValue, focusField } from '../helpers/TextFieldHelpers';

import * as productActions from '../redux/actions/productActions';
import { bindActionCreators } from 'redux';
import Store from '../redux/Store';

class AddProductScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: this.createProductType(),
            selectedTypeIndex: 0,
            vats: this.createVats(),
            selectedVatIndex: 0,
            includeVat: false,
            showExpiryDateDialog: false,
            purchaseExpiryDate: new Date(),
            alreadyHaveStock: false,
            stockDate: new Date(),
            showStockDateDialog: false,
        }

    }

    salesAccount;
    supplier;

    codeRef = React.createRef();
    descriptionRef = React.createRef();
    barcodeRef = React.createRef();
    saleAccountRef = React.createRef();
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
    reorderLimitRef = React.createRef();
    reorderQtyRef = React.createRef();
    stockQtyRef = React.createRef();
    stockDateRef = React.createRef();
    stockPriceRef = React.createRef();
    locationRef = React.createRef();
    weightRef = React.createRef();
    barcodeRef = React.createRef();
    notesRef = React.createRef();


    createVats = () => {
        return [
            {
                id: 1,
                value: '0.00 % VAT-Zero rate'
            },
            {
                id: 2,
                value: '5.00 % VAT-Standard rate'
            },
            {
                id: 3,
                value: '10.00 % VAT-Market rate'
            }
        ]
    }
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
        return this.props.route.params.product !== null;
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

        this.setState({ selectedVatIndex: itemIndex }, () => {
            const { vats, selectedVatIndex } = this.state;
            const vat = vats[selectedVatIndex].id * 2.009
            this.setText(this.vatAmountRef, vat);
            this.setText(this.totalAmountRef, vat * 1.5);
        })
    }

    setText = (ref, value) => {
        const { current: field } = ref;
        field.setValue(value);
    }

    focus = ref => {
        ref.current.focus();
    }

    getTotal = () => {
        const { vats, selectedVatIndex } = this.state;
        const total = vats[selectedVatIndex].id * 234;
        return total;
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
                console.log('Scanned Data', data);
                setFieldValue(this.barcodeRef, data);
            }
        });
    }

    validateAndSubmitForm = () => {
        if (isEmpty(getFieldValue(this.codeRef))) {
            this.showAlert('Please enter item code.');

        } else if (isEmpty(getFieldValue(this.descriptionRef))) {
            this.showAlert('Please enter product description.');

        } else {
            proceedToSubmit
        }
    }

    proceedToSubmit = () => {
        const { productActions } = this.props;
        const body = this.createPostBody();
        productActions.createProduct(this.props.navigation, body)
    }

    createPostBody = () => {

        const { authData } = Store.getState().auth;
        const body = {
            itemtype: this.state.types[this.state.selectedTypeIndex].value,
            icode: getFieldValue(this.codeRef),
            idescription: getFieldValue(this.descriptionRef),
            saccount: '',
            sp_price: '',
            trade_price: '',
            wholesale: '',
            rate: '',
            sicode: '',
            pdescription: '',
            costprice: '',
            paccount: '',
            rlevel: '',
            quantity: '',
            price: '',
            date: '',
            c_price: '',
            rquantity: '',
            location: '',
            barcode: '',
            weight: '',
            notes: '',
            userid: authData.id,
            adminid: authData.id,
            userdate: '',
            name: '',
            logintype: '',
            expiredate: '',
            vat: '',
            vatamt: '',
            inclidevat: ''
        }
    }

    showAlert = (message) => {
        Alert.alert('Alert', message, [{
            style: 'default',
            text: 'OK',
            onPress: () => { }
        }])
    }

    componentDidMount() {
        this.setTitle();
        this.setFieldsValue();
    }

    setTitle = () => {
        const titlePrefix = this.isEditMode() ? 'Edit' : 'Add';
        const title = `${titlePrefix} Product`;
        this.props.navigation.setOptions({ title });
    }
    setFieldsValue = () => {
        const { product } = this.props.route.params;
        if (product !== null) {
            //Preset values
        }
    }

    onSupplierPress = () => {
        this.props.navigation.push('SelectSupplierScreen', {
            onSupplierSelected: item => {
                this.supplier = item;
                console.log('Supplier: ', this.supplier);
                setFieldValue(this.supplierRef, item.name);
            }
        });
    }

    onSalesAccountClick = () => {
        this.props.navigation.push('SelectLedgerScreen', {
            onLedgerSelected: (item) => {
                const label = `${item.nominalcode}-${item.laccount}`;
                this.salesAccount = item;
                setFieldValue(this.saleAccountRef, label);
            }
        })
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
                    onValueChange={enabled => this.setState({ alreadyHaveStock: enabled })}
                />
            </View>
            <View style={{ marginTop: 8, paddingHorizontal: 16 }}>
                <TextField
                    label='Quantity'
                    keyboardType='numeric'
                    returnKeyType='next'
                    lineWidth={1}
                    ref={this.stockQtyRef}
                    onSubmitEditing={() => this.focus(this.stockPriceRef)} />
                <TouchableOpacity onPress={() => this.setState({ showStockDateDialog: true })}>
                    <TextField
                        label='As of Date'
                        keyboardType='default'
                        returnKeyType='next'
                        editable={false}
                        lineWidth={1}
                        ref={this.stockDateRef} />
                </TouchableOpacity>

                {this.state.showStockDateDialog ? <DateTimePicker
                    value={this.state.stockDate}
                    mode={'datetime'}
                    display='default'
                    minimumDate={new Date()}
                    onChange={this.onStockDateChange}
                /> : null}

                <TextField
                    label='Cost Price'
                    keyboardType='number-pad'
                    returnKeyType='done'
                    lineWidth={1}
                    ref={this.stockPriceRef} />
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
                keyboardType='default'
                returnKeyType='next'
                ref={this.salePriceRef}
                lineWidth={1}
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
    render() {

        const { types, selectedTypeIndex, vats, selectedVatIndex } = this.state;
        const isStock = selectedTypeIndex === 0;

        return <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>

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
                    <TouchableOpacity onPress={this.onBarcodePress}>
                        <TextField
                            label='Bar Code'
                            keyboardType='default'
                            returnKeyType='next'
                            editable={false}
                            ref={this.barcodeRef}
                            lineWidth={1}
                        />
                    </TouchableOpacity>

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

                    {isStock ? this.renderPriceField() : null}
                </View>

                {this.renderLabel('VAT/GST')}
                <Picker
                    style={{ marginHorizontal: 12 }}
                    selectedValue={vats[selectedVatIndex].value}
                    mode='dropdown'
                    onValueChange={this.onVatChange}>

                    {vats.map((value, index) => <Picker.Item
                        label={value.value} value={value.value} key={`${index}`} />)}
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
                        onValueChange={enabled => this.setState({ includeVat: enabled })}
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
                        value={this.getTotal()}
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
                        editable={false}
                        ref={this.SICodeRef}
                        onSubmitEditing={() => this.purchaseDescRef.current.focus()} />

                    <TextField
                        label='Purchase Desc.'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        editable={false}
                        ref={this.purchaseDescRef}
                        onSubmitEditing={() => this.purchasePriceRef.current.focus()} />

                    <TextField
                        label='Cost Price'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        editable={false}
                        ref={this.purchasePriceRef}
                        onSubmitEditing={() => this.purchaseAccRef.current.focus()} />
                    <TextField
                        label='Purchase Acc.'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        editable={false}
                        ref={this.purchaseAccRef}
                        onSubmitEditing={() => { }} />

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
                        label='Reorder Limit.'
                        keyboardType='default'
                        returnKeyType='next'
                        lineWidth={1}
                        ref={this.reorderLimitRef}
                        onSubmitEditing={() => this.focus(this.reorderQtyRef)} />

                    <TextField
                        label='Expiry Qty'
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
        product: state.product
    }),
    dispatch => ({
        productActions: bindActionCreators(productActions, dispatch)
    })
)(AddProductScreen);