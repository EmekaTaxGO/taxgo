import { get, sumBy } from 'lodash';
import React, { Component } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InvoiceProductItem from '../components/invoices/InvoiceProductItem';
import { appFont, appFontBold } from '../helpers/ViewHelper';
import { colorAccent } from '../theme/Color';
import * as invoiceActions from '../redux/actions/invoiceActions';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import printSalesInvoiceRequest from '../data/printSalesInvoiceRequest';
import { getApiErrorMsg, showError, toFloat } from '../helpers/Utils';
import pdfHelper from '../helpers/PdfHelper';
import ProgressDialog from '../components/ProgressDialog'
import timehelper from '../helpers/TimeHelper';
import { DATE_FORMAT } from '../constants/appConstant';

class ViewInvoiceScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invoice: {},
            fetching: false
        }
    }

    onPrintClick = () => {
        this.setState({ fetching: true }, () => {

            const { invoiceActions } = this.props;
            invoiceActions.printSalesInvoice(printSalesInvoiceRequest)
                .then(async (data) => {
                    await pdfHelper.print(data.template, data.attachment);
                    this.setState({ fetching: false });
                })
                .catch(err => {
                    console.log('Error fetching Print Data', err);
                    this.setState({ fetching: false }, () => {
                        showError(getApiErrorMsg(err));
                    })
                })
        })
    }
    componentDidMount() {

        const { title } = this.props.route.params;
        this.props.navigation.setOptions({
            title,
            headerRight: () => {
                return (
                    <View style={styles.headerRightContainer}>
                        <TouchableOpacity onPress={this.onPrintClick} style={styles.rightBtn}>
                            <Icon name='print' size={30} color='white' />
                        </TouchableOpacity>
                    </View>

                )
            }
        })
        this.fetchInvoiceDetails();
    }

    fetchInvoiceDetails = () => {
        const { invoiceActions } = this.props;
        const { item } = this.props.route.params;
        console.log('Item is:', JSON.stringify(item, null, 2));
        invoiceActions.getViewInvoice(item.id, item.type);
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

    renderHeader = () => {
        const data = get(this.state.invoice, 'data', {});
        const customer = get(this.state.invoice, 'customer', {});

        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.invNumLabel}>Invoice No:</Text>
                    <Text style={styles.invNumValue}>{data.invoiceno}</Text>
                </View>
                <Text style={styles.buyerLabel}>Buyers</Text>
                <Text style={styles.email}>{customer.email}</Text>
                <View style={styles.dateContainer}>
                    <Text style={styles.createdTxt}>Created: {timehelper.format(data.sdate, 'DD-MM-YYYY')}</Text>
                    <Text style={styles.dueDateTxt}>Due: {timehelper.format(data.ldate, 'DD-MM-YYYY')}</Text>
                </View>
                {this.renderSectionLabel('near-me', 'Invoice Address')}
                <Text style={styles.sectionTxt}>{data.inaddress}</Text>
                {this.renderSectionLabel('place', 'Deliver Address')}
                <Text style={styles.sectionTxt}>{data.deladdress}</Text>
                <Text style={styles.productTxt}>Products</Text>
            </View>
        )
    }
    render() {
        const { invoice } = this.props;

        if (invoice.fetchingSalesInvoiceDetail) {
            return <OnScreenSpinner />
        }
        if (invoice.fetchSalesInvoiceDetailError) {
            <FullScreenError tryAgainClick={this.fetchInvoiceDetails} />
        }
        const salesList = get(this.state.invoice, 'invoiceItems', []);
        const data = get(this.state.invoice, 'data', {});

        // const total = sumBy(this.state.products, product => parseFloat(product.total));
        const total = toFloat(get(data, 'outstanding', '0'));
        const hasOutstanding = data.status === 0 || data.status === 1;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <FlatList
                    data={salesList}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({ item, index }) => (
                        <InvoiceProductItem
                            item={item}
                            isLast={index + 1 === salesList.length} />
                    )}
                    ListHeaderComponent={() => this.renderHeader()}
                />
                {hasOutstanding ? this.renderCheckoutContainer(total) : null}
                <ProgressDialog visible={this.state.fetching} />
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
        borderTopColor: 'lightgray'
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
    },
    headerRightContainer: {
        flexDirection: 'row'
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