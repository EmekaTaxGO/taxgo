import React, { Component } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import FullScreenError from '../components/FullScreenError';
import OnScreenSpinner from '../components/OnScreenSpinner';
import { appFont, appFontBold } from '../helpers/ViewHelper';
class InvoicePageV2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            fetchError: undefined,
            products: [
                {
                    name: 'Double Stacker',
                    quantity: 2,
                    price: '$4.56',
                    total: '$14.98'
                },
                {
                    name: 'Double Stacker2',
                    quantity: 4,
                    price: '$4.56',
                    total: '$56.98'
                },
                {
                    name: 'Double Stacker3',
                    quantity: 6,
                    price: '$4.56',
                    total: '$24.98'
                }
            ]
        }
    }

    componentDidMount() {

    }

    fetchInvoice = () => {

    }

    renderDivider = () => {
        return <View
            style={{
                height: 10,
                backgroundColor: '#fafafa'
            }} />
    }

    renderInvoiceTotal = () => {
        return (
            <View style={{ flexDirection: 'row', padding: 16 }}>
                <View style={{ flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                    <AppText style={styles.h1Label}>Invoice Total</AppText>
                    <AppText style={styles.h1Value}>$1016.50</AppText>
                </View>
                <View style={{ flexDirection: 'column', flex: 1, alignItems: 'flex-end' }}>
                    <AppText style={styles.h1Label}>Due Date</AppText>
                    <AppText style={styles.h1Value}>12/20/2018</AppText>
                </View>
            </View>
        )
    }

    renderCustomerRow = (label, value) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8 }}>
                <AppText style={styles.cusLabel}>{label}</AppText>
                <AppText style={styles.cusValue}>{value}</AppText>
            </View>
        )
    }
    renderCustomerInfo = () => {
        return (
            <View style={{ padding: 16, flexDirection: 'column' }}>
                <AppText style={styles.header}>Customer Profile</AppText>
                {this.renderCustomerRow('Name', 'Ella Doe')}
                {this.renderCustomerRow('Phone', '770-123-1234')}
                {this.renderCustomerRow('Email', 'Ella.doe@mail.com')}
            </View>
        )
    }

    renderCustomerAddress = () => {
        return (
            <View style={{ padding: 16, flexDirection: 'column' }}>
                <AppText style={styles.header}>Customer Address</AppText>
                <AppText style={styles.address}>F-110{'\n'}Swami Shradhanand Park, Bhalswa Dairy{'\n'}Delhi-110042</AppText>
            </View>
        )
    }
    renderSingleProduct = (item) => {
        return (
            <View style={{ flexDirection: 'row', paddingBottom: 12 }}>
                <AppText style={styles.productLabel}>{item.name + '\n'}<AppText style={styles.quantity}>{item.quantity + 'X' + item.price}</AppText></AppText>
                <AppText style={styles.productValue}>{item.total}</AppText>

            </View>
        )
    }
    renderProductItems = () => {
        const { products } = this.state;
        return (
            <View style={{ flexDirection: 'column', padding: 16 }}>
                <AppText style={styles.header}>Items</AppText>
                {products.map((value, index) => this.renderSingleProduct(value))}
            </View>
        )
    }
    renderTotalFigure = () => {
        return (
            <View style={{ flexDirection: 'column', padding: 16 }}>
                {this.renderCustomerRow('Subtotal', '$950')}
                {this.renderCustomerRow('Tax (7%)', '$66.5')}
            </View>
        )
    }

    render() {
        const { fetching, fetchError } = this.state;
        if (fetching) {
            return <OnScreenSpinner />
        }
        if (fetchError) {
            return <FullScreenError tryAgainClick={this.fetchInvoice} />
        }
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <KeyboardAwareScrollView style={{ flex: 1 }}>
                    {this.renderInvoiceTotal()}
                    {this.renderDivider()}
                    {this.renderCustomerInfo()}
                    {this.renderDivider()}
                    {this.renderCustomerAddress()}
                    {this.renderDivider()}
                    {this.renderProductItems()}
                    <View style={{
                        marginHorizontal: 16,
                        backgroundColor: '#fafafa',
                        height: 3
                    }} />
                    {this.renderTotalFigure()}

                </KeyboardAwareScrollView>
                <AppButton
                    containerStyle={{ marginHorizontal: 16 }}
                    title='Send Invoice'
                />
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    h1Label: {
        color: '#aeb1b8',
        fontSize: 16,
        fontFamily: appFontBold
    },
    h1Value: {
        color: '#575d64',
        fontSize: 24,
        fontFamily: appFontBold,
        paddingTop: 6
    },
    header: {
        color: '#60636e',
        fontSize: 18,
        fontFamily: appFontBold,
        paddingBottom: 8
    },
    cusLabel: {
        color: '#9ca2b0',
        fontSize: 17,
        flex: 1,
        fontFamily: appFontBold
    },
    cusValue: {
        color: '#7d8188',
        fontSize: 18,
        flex: 1,
        textAlign: 'right',
        fontFamily: appFontBold
    },
    address: {
        color: '#a1a4aa',
        fontFamily: appFont,
        fontSize: 18
    },
    productLabel: {
        color: '#64686c',
        fontSize: 16,
        fontFamily: appFontBold,
        flex: 1
    },
    productValue: {
        color: '#64686c',
        fontSize: 16,
        fontFamily: appFontBold,
        textAlign: 'right'
    },
    quantity: {
        color: '#9ca2b0',
        fontSize: 15
    }
})
export default InvoicePageV2;