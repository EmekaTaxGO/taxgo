import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableHighlight, TouchableOpacity, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import SearchView from '../SearchView';
import { connect } from 'react-redux';
import * as invoiceActions from '../../redux/actions/invoiceActions';
import { bindActionCreators } from 'redux';
import { colorAccent, deleteColor, editColor, errorColor, viewColor } from '../../theme/Color';
import { SwipeListView } from 'react-native-swipe-list-view';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OnScreenSpinner from '../OnScreenSpinner';
import FullScreenError from '../FullScreenError';
import EmptyView from '../EmptyView';
import { isEmpty, showError, showSuccess } from '../../helpers/Utils';
import SalesInvoiceListItem from './SalesInvoiceListItem';
import AppText from '../AppText';
import { appFontBold } from '../../helpers/ViewHelper';
import Api from '../../services/api';
import ProgressDialog from '../../components/ProgressDialog';
import Store from '../../redux/Store';

class SalesCNList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            allChecked: false,
            updating: false
        }
    }

    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    componentDidMount() {
        this.fetchSalesInvoice();
    }

    fetchSalesInvoice = () => {
        const { invoiceActions } = this.props;
        invoiceActions.getSalesCNInvoiceList();
    }

    onSearchQueryChange = q => {
        this.setState({ query: q });
    }

    renderListItem = (data, rowMap) => {
        return (
            <SalesInvoiceListItem
                data={data}
            />
        )
    }

    hiddenElement = (label, icon, color, onPress) => {
        return <TouchableHighlight onPress={onPress} underlayColor={color}>
            <View style={{
                flexDirection: 'column',
                backgroundColor: color,
                width: 70,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12
            }}>

                <Icon name={icon} color='white' size={30} />
                <AppText style={{ color: 'white', fontFamily: appFontBold }}>{label}</AppText>
            </View>
        </TouchableHighlight>
    }

    onViewClick = (data) => {
        const { item } = data;
        this.props.navigation.push('ViewInvoiceScreen', {
            title: 'Sale Credit Note',
            item
        })
    }

    onEditClick = (data) => {
        this.props.navigation.navigate('AddInvoiceScreen', {
            info: {
                invoice_id: data.item.id,
                invoice_type: data.item.type
            }
        });

    }
    onDeleteClick = (data) => {
        const { item } = data
        Alert.alert('Are you sure', 'Do you really want to delete this invoice?', [
            {
                style: 'cancel',
                onPress: () => { },
                text: 'CANCEL'
            },
            {
                onPress: () => { this.deleteInvoice(item) },
                style: 'default',
                text: 'YES'
            }
        ])
    }

    deleteInvoice = (item) => {
        const body = {
            id: item.id,
            invoiceno: item.invoiceno,
            userid: Store.getState().auth.authData.id
        }
        this.setState({ updating: true })
        Api.post('/sales/deleteInvoice', body)
            .then(response => {
                this.setState({ updating: false })
                setTimeout(() => {
                    showSuccess('Invoice Deleted Successfully.')
                    this.fetchSalesInvoice()
                }, 300)
            })
            .catch(err => {
                console.log('Error deleting invoice');
                this.setState({ updating: false })
                setTimeout(() => {
                    showError('Error Deleting Invoice')
                }, 300)
            })
    }

    renderHiddenItem = (data) => {
        const { item } = data
        const enableOptionBtn = (item.status !== 1 && item.status !== 2)
        return <CardView
            cardElevation={0}
            cornerRadius={6}
            style={styles.hiddenCard}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    {this.hiddenElement('View', 'visibility', viewColor, () => this.onViewClick(data))}
                </View>
                {enableOptionBtn ? this.hiddenElement('Edit', 'edit', editColor, () => this.onEditClick(data)) : null}
                {enableOptionBtn ? this.hiddenElement('Delete', 'delete', deleteColor, () => this.onDeleteClick(data)) : null}
            </View>
        </CardView>
    }

    listdata = () => {
        if (isEmpty(this.state.query)) {
            return this.props.invoice.salesCNInvoiceList;
        } else {
            return this.filteredInvoices();
        }
    }

    filteredInvoices = () => {
        let filteredInvoices = [];
        filteredInvoices = this.props.invoice.salesCNInvoiceList.filter(value =>
            value.invoiceno.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
        );
        return filteredInvoices;
    }

    render() {
        const { invoice } = this.props;
        if (invoice.fetchingSalesCNInvoice) {
            return <OnScreenSpinner />
        }
        if (invoice.fetchSalesCNInvoiceError) {
            return <FullScreenError tryAgainClick={this.fetchSalesInvoice} />
        }
        if (invoice.salesCNInvoiceList.length === 0) {
            return <EmptyView message='No Invoice Credit Note Available' iconName='hail' />
        }
        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={this.onSearchQueryChange}
                onCrossPress={() => this.onSearchQueryChange('')}
                placeholder='Search...' />
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
                <Text style={{
                    flex: 1,
                    fontSize: 13,
                    color: 'gray',
                    textTransform: 'uppercase'
                }}>Sales Credit-Invoices</Text>
                {/* <CheckBox
                    tintColors={{ true: colorAccent, false: 'gray' }}
                    style={{ borderColor: colorAccent }}
                    value={this.state.allChecked}
                    onValueChange={checked => this.setState({ allChecked: checked })} />
                <Text style={{ color: 'gray' }}>All</Text> */}
            </View>
            <SwipeListView
                data={this.listdata()}
                renderItem={(data, rowMap) => this.renderListItem(data, rowMap)}
                renderHiddenItem={(data, rowMap) => this.renderHiddenItem(data)}
                leftOpenValue={70}
                rightOpenValue={-140}
            />
            <ProgressDialog visible={this.state.updating} />
        </View>
    }
};
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 8,
        marginVertical: 12,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    hiddenCard: {
        marginHorizontal: 16,
        marginVertical: 12,
        flex: 1
    },
    menu: {
        paddingLeft: 12
    }
});
export default connect(
    state => ({
        invoice: state.invoice
    }),
    dispatch => ({
        invoiceActions: bindActionCreators(invoiceActions, dispatch)
    })
)(SalesCNList);