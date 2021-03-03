import { get, sumBy } from 'lodash';
import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InvoiceProductList from '../components/invoices/InvoiceProductList';
import { appFont, appFontBold } from '../helpers/ViewHelper';
import { colorAccent } from '../theme/Color';
import * as invoiceActions from '../redux/actions/invoiceActions';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';

class ViewInvoiceScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invoice: {}
        }
    }

    onMoreClick = () => {

    }
    componentDidMount() {

        const { title } = this.props.route.params;
        this.props.navigation.setOptions({
            title,
            headerRight: () => {
                return (
                    <TouchableOpacity onPress={this.onMoreClick} style={styles.rightBtn}>
                        <Icon name='add' size={30} color='white' />
                    </TouchableOpacity>
                )
            }
        })
        this.fetchInvoiceDetails();
    }

    fetchInvoiceDetails = () => {
        const { invoiceActions } = this.props;
        invoiceActions.getSalesInvoice();
    }

    componentDidUpdate(prevProps, prevState) {
        const { invoice: oldInvoice } = prevProps;
        const { invoice: newInvoice } = this.props;
        if (oldInvoice.fetchingSalesInvoiceDetail && !newInvoice.fetchingSalesInvoiceDetail
            && !newInvoice.fetchingSalesInvoiceDetail) {
            //Invoives has just fetched
            this.setState({ invoice: newInvoice.salesInvoiceDetail });
        }
    }
    renderSectionLabel = (icon, label) => {
        return (
            <View style={styles.sectionContainer}>
                <Icon name={icon} size={26} color={colorAccent} />
                <Text style={styles.sectionLabel}>{label}</Text>
            </View>
        )
    }
    renderCheckoutContainer = (total) => {
        return (
            <View style={styles.paymentContainer}>
                <View style={styles.paymentTxtContainer}>
                    <Text style={styles.payableLabel}>Total Payable</Text>
                    <Text style={styles.amountVal}>{total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.payBtn}>
                    <Text style={styles.payTxt}>Pay Now</Text>
                </TouchableOpacity>
            </View>
        )
    }
    render() {

        // fetchingSalesInvoiceDetail: false,
        // salesInvoiceDetail: undefined,
        // fetchSalesInvoiceDetailError: undefined
        const { invoice } = this.props;

        if (invoice.fetchingSalesInvoiceDetail) {
            return <OnScreenSpinner />
        }
        if (invoice.fetchSalesInvoiceDetailError) {
            <FullScreenError tryAgainClick={this.fetchInvoiceDetails} />
        }
        const salesView = get(this.state.invoice, 'salesView', {});
        const customer = get(this.state.invoice, 'cname', {});
        const salesList = get(this.state.invoice, 'salesList', []);

        const total = sumBy(this.state.products, product => parseFloat(product.total));
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.invNumLabel}>Invoice No:</Text>
                            <Text style={styles.invNumValue}>{salesView.invoiceno}</Text>
                        </View>
                        <Text style={styles.buyerLabel}>Buyers</Text>
                        <Text style={styles.email}>{customer.email}</Text>
                        <View style={styles.dateContainer}>
                            <Text style={styles.createdTxt}>Created: {salesView.sdate}</Text>
                            <Text style={styles.dueDateTxt}>Due: {salesView.ldate}</Text>
                        </View>
                        {this.renderSectionLabel('near-me', 'Invoice Address')}
                        <Text style={styles.sectionTxt}>{salesView.inaddress}</Text>
                        {this.renderSectionLabel('place', 'Deliver Address')}
                        <Text style={styles.sectionTxt}>{salesView.deladdress}</Text>
                        <Text style={styles.productTxt}>Products</Text>
                        <InvoiceProductList
                            data={salesList}
                        />
                    </View>
                </ScrollView>
                {this.renderCheckoutContainer(total)}
            </SafeAreaView>
        )
    }
};
const styles = StyleSheet.create({
    rightBtn: {
        padding: 12
    },
    container: {
        flexDirection: 'column',
        paddingVertical: 12
    },
    text: {
        fontSize: 40,
        color: 'black'
    },
    invNumLabel: {
        fontFamily: appFontBold,
        fontSize: 20,
        flex: 1,
        marginHorizontal: 16
    },
    invNumValue: {
        fontFamily: appFontBold,
        fontSize: 20,
        borderBottomColor: 'red',
        borderBottomWidth: 2,
        marginHorizontal: 16
    },
    buyerLabel: {
        fontFamily: appFont,
        color: 'gray',
        fontSize: 16,
        marginHorizontal: 16
    },
    email: {
        fontFamily: appFont,
        fontSize: 18,
        color: 'black',
        marginHorizontal: 16
    },
    dateContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        alignItems: 'center',
        marginBottom: 24
    },
    createdTxt: {
        fontFamily: appFont,
        fontSize: 16,
        color: 'black',
        flex: 1
    },
    dueDateTxt: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 4,
        fontFamily: appFont,
        fontSize: 16,
        color: 'black',
        paddingHorizontal: 4,
        paddingVertical: 4,
        textAlign: 'right',
        marginLeft: 16
    },
    sectionContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 6,
        alignItems: 'center',
        backgroundColor: '#f2f2f2'
    },
    sectionLabel: {
        fontFamily: appFont,
        fontSize: 18,
        color: 'black',
        paddingHorizontal: 4
    },
    sectionTxt: {
        fontFamily: appFont,
        fontSize: 18,
        color: 'black',
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    paymentContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f2f2f2'
    },
    paymentTxtContainer: {
        flexDirection: 'column',
        flex: 1
    },
    payableLabel: {
        fontFamily: appFontBold,
        color: 'black',
        fontSize: 19
    },
    amountVal: {
        fontFamily: appFont,
        color: 'gray',
        fontSize: 18
    },
    payTxt: {
        fontFamily: appFont,
        fontSize: 18,
        color: 'white'
    },
    payBtn: {
        borderRadius: 6,
        backgroundColor: colorAccent,
        paddingHorizontal: 12,
        paddingVertical: 12
    },
    productTxt: {
        color: 'black',
        fontFamily: appFontBold,
        paddingHorizontal: 16,
        fontSize: 18,
        borderTopColor: 'lightgray',
        borderTopWidth: 1,
        paddingTop: 12
    }
})
export default connect(
    state => ({
        invoice: state.invoice
    }),
    dispatch => ({
        invoiceActions: bindActionCreators(invoiceActions, dispatch)
    })
)(ViewInvoiceScreen);