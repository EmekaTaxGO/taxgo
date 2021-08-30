import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import SearchView from '../SearchView';
import { connect } from 'react-redux';
import * as invoiceActions from '../../redux/actions/invoiceActions';
import { bindActionCreators } from 'redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FullScreenError from '../../components/FullScreenError';
import EmptyView from '../../components/EmptyView';
import OnScreenSpinner from '../../components/OnScreenSpinner';
import { isEmpty, size } from 'lodash';
import { editColor, rColor, viewColor } from '../../theme/Color';
import SalesInvoiceListItem from './SalesInvoiceListItem';
import AppText from '../AppText';
import { appFontBold } from '../../helpers/ViewHelper';

class SalesInvoiceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            allChecked: false
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
        invoiceActions.getSalesInvoiceList();
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
            title: 'Sale',
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
        console.log('Delete Click!');

    }

    renderHiddenItem = (data) => {
        console.log('Status: ', data.status);
        const { item } = data
        const enableEdit = (item.status !== 1 && item.status !== 2)
        return <CardView
            cardElevation={0}
            cornerRadius={6}
            style={styles.hiddenCard}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    {this.hiddenElement('View', 'visibility', viewColor, () => this.onViewClick(data))}
                </View>
                {enableEdit ? this.hiddenElement('Edit', 'visibility', editColor, () => this.onEditClick(data)) : null}
            </View>
        </CardView>
    }

    listdata = () => {
        if (isEmpty(this.state.query)) {
            return this.props.invoice.salesInvoiceList;
        } else {
            return this.filteredInvoices();
        }
    }

    filteredInvoices = () => {
        let filteredInvoices = [];
        filteredInvoices = this.props.invoice.salesInvoiceList.filter(value =>
            value.invoiceno.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
        );
        return filteredInvoices;
    }

    render() {
        const { invoice } = this.props;
        if (invoice.fetchingSalesInvoice) {
            return <OnScreenSpinner />
        }
        if (invoice.fetchSalesInvoiceError) {
            return <FullScreenError tryAgainClick={this.fetchSalesInvoice} />
        }
        if (invoice.salesInvoiceList.length === 0) {
            return <EmptyView message='No Invoice Available' iconName='hail' />
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
                }}>Sales Invoices</Text>
            </View>
            <SwipeListView
                data={this.listdata()}
                renderItem={(data, rowMap) => this.renderListItem(data, rowMap)}
                renderHiddenItem={(data, rowMap) => this.renderHiddenItem(data)}
                leftOpenValue={70}
                rightOpenValue={-70}
            />
        </View>
    }
};
const styles = StyleSheet.create({
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
)(SalesInvoiceList);