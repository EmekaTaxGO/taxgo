const { Component } = require("react");
import React from 'react';
import { SafeAreaView, View, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { OutlinedTextField } from 'react-native-material-textfield';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';

class AddMerchantScreen extends Component {


    componentDidMount() {

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
    _posBussName

    isEditMode = () => {
        return false;
    }

    validateAndSave = () => {
        console.log('on Save/Update');
    }


    render() {
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{
                        flexDirection: 'column',
                        paddingHorizontal: 16,
                        paddingVertical: 12
                    }}>
                        <OutlinedTextField
                            containerStyle={styles.fieldStyle}
                            label='Account Name'
                            secureTextEntry={true}
                            lineWidth={1}
                            ref={this.passRef}
                            value={this._accName}
                            onChangeText={text => this._accName = text} />
                        <OutlinedTextField
                            containerStyle={styles.fieldStyle}
                            label='Merchant Id'
                            secureTextEntry={true}
                            lineWidth={1}
                            ref={this.passRef}
                            value={this._merchantId}
                            onChangeText={text => this._merchantId = text} />
                        <OutlinedTextField
                            containerStyle={styles.fieldStyle}
                            label='Private Key'
                            secureTextEntry={true}
                            lineWidth={1}
                            ref={this.passRef}
                            value={this._privateKey}
                            onChangeText={text => this._privateKey = text} />
                        <OutlinedTextField
                            containerStyle={styles.fieldStyle}
                            label='Public Key'
                            secureTextEntry={true}
                            lineWidth={1}
                            ref={this.passRef}
                            value={this._publicKey}
                            onChangeText={text => this._publicKey = text} />
                        <OutlinedTextField
                            containerStyle={styles.fieldStyle}
                            label='Payment Type'
                            secureTextEntry={true}
                            lineWidth={1}
                            ref={this.passRef}
                            value={this._paymentType}
                            onChangeText={text => this._paymentType = text} />
                        <OutlinedTextField
                            containerStyle={styles.fieldStyle}
                            label='POS vendor Name'
                            secureTextEntry={true}
                            lineWidth={1}
                            ref={this.passRef}
                            value={this._posVendName}
                            onChangeText={text => this._posVendName = text} />
                        <OutlinedTextField
                            containerStyle={styles.fieldStyle}
                            label='Device Id'
                            secureTextEntry={true}
                            lineWidth={1}
                            ref={this.passRef}
                            value={this._deviceId}
                            onChangeText={text => this._deviceId = text} />
                        <OutlinedTextField
                            containerStyle={styles.fieldStyle}
                            label='POS Registered ID'
                            secureTextEntry={true}
                            lineWidth={1}
                            ref={this.passRef}
                            value={this._posRegId}
                            onChangeText={text => this._posRegId = text} />
                        <OutlinedTextField
                            containerStyle={styles.fieldStyle}
                            label='POS Registered Name'
                            secureTextEntry={true}
                            lineWidth={1}
                            ref={this.passRef}
                            value={this._posRegName}
                            onChangeText={text => this._posRegName = text} />
                        <OutlinedTextField
                            containerStyle={styles.fieldStyle}
                            label='POS Business Name'
                            secureTextEntry={true}
                            lineWidth={1}
                            ref={this.passRef}
                            value={this._posBussName}
                            onChangeText={text => this._posBussName = text} />

                        <RaisedTextButton
                            title={this.isEditMode() ? 'Update' : 'Save'}
                            color={colorAccent}
                            titleColor='white'
                            style={styles.materialBtn}
                            onPress={this.validateAndSave} />
                    </View>
                </ScrollView>
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
export default AddMerchantScreen;