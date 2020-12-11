import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import SearchView from '../SearchView';
import { connect } from 'react-redux';
import * as invoiceActions from '../../redux/actions/invoiceActions';
import { bindActionCreators } from 'redux';
import { colorAccent } from '../../theme/Color';
import { SwipeListView } from 'react-native-swipe-list-view';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FullScreenError from '../../components/FullScreenError';
import EmptyView from '../../components/EmptyView';
import OnScreenSpinner from '../../components/OnScreenSpinner';
import { isEmpty } from '../../helpers/Utils';
import PureElement from '../PureElement';

class SalesInvoiceList extends Component {
    constructor(props) {
        super(props);
        const invoices = this.createInvoices();
        this.state = {
            query: '',
            invoices: invoices,
            filteredInvoices: invoices,
            allChecked: false
        }
    }

    createInvoices = () => {
        return [
            {
                id: 1,
                item_name: 'Item1-General',
                customer_name: 'Customer',
                due_date: '25 sep, 2006'
            },
            {
                id: 2,
                item_name: 'Item1-General',
                customer_name: 'Customer',
                due_date: '25 sep, 2006'
            },
            {
                id: 3,
                item_name: 'Item1-General',
                customer_name: 'Customer',
                due_date: '25 sep, 2006'
            },
            {
                id: 4,
                item_name: 'Item1-General',
                customer_name: 'Customer',
                due_date: '25 sep, 2006'
            },
            {
                id: 5,
                item_name: 'Item1-General',
                customer_name: 'Customer Name',
                due_date: '25 sep, 2006'
            },
            {
                id: 6,
                item_name: 'Item1-General',
                customer_name: 'Customer',
                due_date: '25 sep, 2006'
            },
            {
                id: 7,
                item_name: 'Item1-General',
                customer_name: 'Customer',
                due_date: '25 sep, 2006'
            }
        ]
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

    isSaleInvoice = () => {
        return this.props.route.name === 'sales';
    }

    onSearchQueryChange = q => {
        this.setState({ query: q });
    }

    renderListItem = (data, rowMap) => {
        const { index, item } = data;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text>{item.invoiceno}</Text>
                    <Text>{item.type}</Text>
                    <Text>Total: {item.total}</Text>
                </View>

            </View>
        </CardView>
    }

    hiddenElement = (label, icon, color, onPress) => {
        return <TouchableHighlight onPress={onPress} underlayColor={color}>
            <View style={{
                flexDirection: 'column',
                backgroundColor: color,
                width: 70,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <Icon name={icon} color='white' size={24} />
                <Text style={{ color: 'white' }}>{label}</Text>
            </View>
        </TouchableHighlight>
    }

    onViewClick = (data) => {
        console.log('View Click!');
    }

    onEditClick = (data) => {
        console.log('Edit Click!');

    }
    onDeleteClick = (data) => {
        console.log('Delete Click!');

    }

    renderHiddenItem = (data) => {
        return <CardView
            cardElevation={0}
            cornerRadius={6}
            style={styles.hiddenCard}>
            <View style={{ flexDirection: 'row' }}>
                {this.hiddenElement('View', 'visibility', 'blue', () => this.onViewClick(data))}
            </View>
        </CardView>
    }

    listdata = () => {
        if (isEmpty(this.state.query)) {
            return this.props.invoice.salesInvoiceList;
        } else {
            console.log('Loop Running');
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
        console.log('Rendering SalesInvoice List');
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
                    color: 'gray'
                }}>{this.isSaleInvoice() ? 'Sales Invoice' : 'Invoices'}</Text>
                <CheckBox
                    tintColors={{ true: colorAccent, false: 'gray' }}
                    style={{ borderColor: colorAccent }}
                    value={this.state.allChecked}
                    onValueChange={checked => this.setState({ allChecked: checked })} />
                <Text style={{ color: 'gray' }}>All</Text>
            </View>
            <SwipeListView
                data={this.listdata()}
                renderItem={(data, rowMap) => this.renderListItem(data, rowMap)}
                renderHiddenItem={(data, rowMap) => this.renderHiddenItem(data)}
                leftOpenValue={70}
            />
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
        marginHorizontal: 8,
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