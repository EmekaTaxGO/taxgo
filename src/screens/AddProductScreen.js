import React, { Component } from 'react';
import { View, Text, Picker, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
// import Picker from '@react-native-community/picker';
import ViewPager from '@react-native-community/viewpager';
import AppViewPager from '../components/AppViewpager';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextField } from 'react-native-material-textfield';
// import { IndicatorViewPager, PagerTabIndicator, PagerDotIndicator } from 'rn-viewpager';

class AddProductScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: this.createProductType(),
            selectedTypeIndex: 0,
            vats: this.createVats(),
            selectedVatIndex: 0
        }

    }

    codeRef = React.createRef();
    descriptionRef = React.createRef();
    saleAccountRef = React.createRef();
    salePriceRef = React.createRef();
    tradePriceRef = React.createRef();
    wholesalePriceRef = React.createRef();
    vatAmountRef = React.createRef();

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

    render() {

        const { types, selectedTypeIndex, vats, selectedVatIndex } = this.state;

        const vat = vats[selectedVatIndex].id * 2.009;
        console.log('Total Vat', vat);

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
                        returnKeyType='next'
                        ref={this.descriptionRef}
                        lineWidth={1}
                        onSubmitEditing={() => { this.salePriceRef.current.focus() }} />
                </View>
                <View style={{ marginTop: 12 }}>
                    {this.renderStrip('Sale')}
                </View>

                <View style={{ paddingHorizontal: 16 }}>
                    <TextField
                        label='Sales Acc.'
                        keyboardType='default'
                        returnKeyType='next'
                        ref={this.saleAccountRef}
                        lineWidth={1}
                        onSubmitEditing={() => { this.salePriceRef.current.focus() }} />
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
                </View>

                {this.renderLabel('Vat/GST')}
                <Picker
                    style={{ marginHorizontal: 12 }}
                    selectedValue={vats[selectedVatIndex].value}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ selectedVatIndex: itemIndex })}>

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
                        value={`${vat}`}
                        onSubmitEditing={() => { console.log('vat Amount', this.vatAmountRef.current.text); }} />
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    }
}
const styles = StyleSheet.create({
    textField: {
        width: '100%',
        marginLeft: 12
    }
});
export default AddProductScreen;