const { Component } = require("react");
import React from 'react';
import { SafeAreaView, View, KeyboardAvoidingView, StyleSheet, Text, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import RadioForm from 'react-native-simple-radio-button';
import { isEmpty, showError } from '../helpers/Utils';
import Store from '../redux/Store';
import { setFieldValue } from '../helpers/TextFieldHelpers'
import ProgressDialog from '../components/ProgressDialog';
import { connect } from 'react-redux';
import * as merchantActions from '../redux/actions/merchantActions';
import { bindActionCreators } from 'redux';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';

class AddMerchantScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            accTypes: [
                {
                    label: 'BrainTree',
                    value: 0
                },
                {
                    label: 'SmartPay',
                    value: 1
                }
            ],
            selectedAccType: 0
        }
    }
    componentDidMount() {
        this.configheader();
    }

    configheader = () => {
        const prefix = this.isEditMode() ? 'Edit' : 'Add'
        const title = `${prefix} Merchant Account`;
        this.props.navigation.setOptions({ title });
    }

    componentDidUpdate(oldProps, oldState) {
        const { merchant: oldMerchant } = oldProps;
        const { merchant: newMerchant } = this.props;

        if (oldMerchant.savingMerchant && !newMerchant.savingMerchant) {
            if (newMerchant.saveMerchantError) {
                setTimeout(() => {
                    showError(newMerchant.saveMerchantError);
                }, 300)
            } else {
                this.showMerchantUpdatedAlert(newMerchant.merchantSaved.message);
            }
        }
    }

    showMerchantUpdatedAlert = (message) => {
        Alert.alert('Alert', message, [
            {
                style: 'default',
                text: 'OK',
                onPress: () => {
                    this.props.navigation.goBack();
                    this.props.route.params.onMerchantUpdated();
                }
            }
        ], { cancelable: false })
    }

    getAccount = () => {
        return this.props.route.params.item;
    }

    UNSAFE_componentWillMount() {
        if (this.isEditMode()) {
            const account = this.getAccount();
            this._accName = account.accname;
            this._privateKey = account.privatekey;
            this._publicKey = account.publickey;
            this._paymentType = account.type;
            this._posVendName = account.vendor_name;
            this._posRegId = account.registered_id;
            this._posRegName = account.registered_name;
            this._posBusName = account.business_name;

            if (this._paymentType === 'braintree') {
                this._merchantId = account.merchantid;
            } else {
                this._deviceId = account.merchantid;
            }
        } else {
            this._paymentType = 'braintree'
        }
        this.setState({ selectedAccType: this._paymentType === 'smartpay' ? 1 : 0 })
    }

    _accNameRef = React.createRef()
    _merchantIdRef = React.createRef()
    _privateKeyRef = React.createRef()
    _publicKeyRef = React.createRef()
    _paymentTypeRef = React.createRef()
    _posVendNameRef = React.createRef()
    _deviceIdRef = React.createRef()
    _posRegIdRef = React.createRef()
    _posRegNameRef = React.createRef()
    _posBussNameRef = React.createRef()


    _accName
    _merchantId
    _privateKey
    _publicKey
    _paymentType
    _posVendName
    _deviceId
    _posRegId
    _posRegName
    _posBusName

    isEditMode = () => {
        const { item } = this.props.route.params;
        return item !== undefined;
    }

    validateAndSave = () => {
        if (isEmpty(this._accName)) {
            showError('Enter Account Name!');
            return;
        }
        if (this.isEditMode() && this.getAccount().type !== this._paymentType) {
            showError('Merchant Account Type Cannot be changed!')
            return;
        }
        if (this.isBrainTree()) {
            if (isEmpty(this._merchantId)) {
                showError('Enter Merchant Id!')
            }
            else if (isEmpty(this._privateKey)) {
                showError('Enter Private Key!')
            }
            else if (isEmpty(this._publicKey)) {
                showError('Enter Public Key!')
            } else {
                this.addOrUpdateMerchant();
            }
        } else {
            if (isEmpty(this._posVendName)) {
                showError('Enter POS Vendor Name!')
            }
            else if (isEmpty(this._deviceId)) {
                showError('Enter Device Id!')
            }
            else if (isEmpty(this._posRegId)) {
                showError('Show POS Registered Id!')
            }
            else if (isEmpty(this._posRegName)) {
                showError('Enter POS Registered Name!')
            }
            else if (isEmpty(this._posBusName)) {
                showError('Enter POS Business Name!')
            }
            else {
                this.addOrUpdateMerchant();
            }
        }
    }

    addOrUpdateMerchant = () => {
        const isBrainTree = this.isBrainTree();
        const { authData } = Store.getState().auth;
        const id = this.isEditMode() ? this.getAccount().id : undefined
        const body = {
            id,
            accounttype: isBrainTree ? 'braintree' : 'smartpay',
            type: isBrainTree ? 'braintree' : 'smartpay',
            accname: this._accName,
            privatekey: isBrainTree ? this._privateKey : undefined,
            publickey: isBrainTree ? this._publicKey : undefined,
            merchantid: isBrainTree ? this._merchantId : this._deviceId,
            registered_name: !isBrainTree ? this._posRegName : undefined,
            registered_id: !isBrainTree ? this._posRegId : undefined,
            vendor_name: !isBrainTree ? this._posVendName : undefined,
            page: this.isEditMode() ? '2' : '1',
            userid: authData.id,
            business_name: !isBrainTree ? this._posBusName : undefined
        }
        const { merchantActions } = this.props;
        merchantActions.saveOrUpdateMerchant(body);
    }

    isBrainTree = () => {
        return this.state.selectedAccType === 0;
    }

    renderBrainTreeField = () => {
        return <View style={{ flexDirection: 'column' }}>
            <AppTextField
                containerStyle={styles.fieldStyle}
                label='Merchant Id'
                lineWidth={1}
                fieldRef={this.passRef}
                value={this._merchantId}
                onChangeText={text => this._merchantId = text} />
            <AppTextField
                containerStyle={styles.fieldStyle}
                label='Private Key'
                secureTextEntry={true}
                lineWidth={1}
                fieldRef={this.passRef}
                value={this._privateKey}
                onChangeText={text => this._privateKey = text} />
            <AppTextField
                containerStyle={styles.fieldStyle}
                label='Public Key'
                secureTextEntry={true}
                lineWidth={1}
                fieldRef={this.passRef}
                value={this._publicKey}
                onChangeText={text => this._publicKey = text} />
        </View>
    }

    renderSmartPayField = () => {
        return <View style={{ flexDirection: 'column' }}>
            <AppTextField
                containerStyle={styles.fieldStyle}
                label='POS vendor Name'
                lineWidth={1}
                fieldRef={this.passRef}
                value={this._posVendName}
                onChangeText={text => this._posVendName = text} />
            <AppTextField
                containerStyle={styles.fieldStyle}
                label='Device Id'
                lineWidth={1}
                fieldRef={this.passRef}
                value={this._deviceId}
                onChangeText={text => this._deviceId = text} />
            <AppTextField
                containerStyle={styles.fieldStyle}
                label='POS Registered ID'
                lineWidth={1}
                fieldRef={this.passRef}
                value={this._posRegId}
                onChangeText={text => this._posRegId = text} />
            <AppTextField
                containerStyle={styles.fieldStyle}
                label='POS Registered Name'
                lineWidth={1}
                fieldRef={this.passRef}
                value={this._posRegName}
                onChangeText={text => this._posRegName = text} />
            <AppTextField
                containerStyle={styles.fieldStyle}
                label='POS Business Name'
                lineWidth={1}
                fieldRef={this.passRef}
                value={this._posBusName}
                onChangeText={text => this._posBusName = text} />
        </View>
    }

    onAccountTypePress = val => {
        this.setState({ selectedAccType: val }, () => {
            setFieldValue(this._paymentTypeRef, val === 0 ? 'braintree' : 'smartpay');
        })

    }

    render() {
        const { merchant } = this.props;
        const isBrainTree = this.isBrainTree();
        const editMode = this.isEditMode();
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{
                        flexDirection: 'column',
                        paddingHorizontal: 16,
                        paddingVertical: 12
                    }}>
                        {!editMode ? <View style={{ flexDirection: 'column' }}>
                            <Text style={{
                                fontSize: 18,
                                paddingStart: 12,
                                paddingTop: 12,
                                color: 'gray'
                            }}>Account Type</Text>
                            <RadioForm
                                radio_props={this.state.accTypes}
                                initial={this.state.selectedAccType}
                                style={{ padding: 12 }}
                                labelStyle={{ paddingStart: 12, paddingEnd: 12 }}
                                formHorizontal={true}
                                onPress={this.onAccountTypePress}
                                animation={false}
                            />
                        </View> : null}
                        <AppTextField
                            containerStyle={styles.fieldStyle}
                            label='Account Name'
                            lineWidth={1}
                            fieldRef={this.passRef}
                            value={this._accName}
                            onChangeText={text => this._accName = text} />
                        {isBrainTree ? this.renderBrainTreeField() : null}
                        {!isBrainTree ? this.renderSmartPayField() : null}
                        <AppTextField
                            containerStyle={styles.fieldStyle}
                            label='Payment Type'
                            lineWidth={1}
                            fieldRef={this._paymentTypeRef}
                            editable={false}
                            value={this._paymentType}
                            onChangeText={text => this._paymentType = text} />
                        <AppButton
                            title={this.isEditMode() ? 'Update' : 'Save'}
                            onPress={this.validateAndSave} />
                    </View>
                </ScrollView>
                <ProgressDialog visible={merchant.savingMerchant} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    }

}
const styles = StyleSheet.create({
    fieldStyle: {
        marginTop: 6
    },
    materialBtn: {
        padding: 26,
        marginTop: 30,
        fontSize: 50
    }
})
export default connect(
    state => ({
        merchant: state.merchant
    }),
    dispatch => ({
        merchantActions: bindActionCreators(merchantActions, dispatch)
    })
)(AddMerchantScreen);