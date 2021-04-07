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
import { isEmpty } from '../../helpers/Utils'
import SalesInvoiceListItem from './SalesInvoiceListItem';

class PurchaseCNList extends Component {
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
        this.fetchPurchaseInvoice();
    }

    fetchPurchaseInvoice = () => {
        const { invoiceActions } = this.props;
        invoiceActions.getPurchaseCNInvoiceList();
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

                <Icon name={icon} color='white' size={24} />
                <Text style={{ color: 'white' }}>{label}</Text>
            </View>
        </TouchableHighlight>
    }

    onViewClick = (data) => {
        const { item } = data;
        this.props.navigation.push('ViewInvoiceScreen', {
            title: 'Purchase Credit Note',
            item
        })
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
                <View style={{ flex: 1 }}>
                    {this.hiddenElement('View', 'visibility', 'blue', () => this.onViewClick(data))}
                </View>
                {this.hiddenElement('Edit', 'edit', 'blue', () => this.onEditClick(data))}
                {this.hiddenElement('Delete', 'delete', 'red', () => this.onDeleteClick(data))}
            </View>
        </CardView>
    }

    listdata = () => {
        if (isEmpty(this.state.query)) {
            return this.props.invoice.purchaseCNInvoiceList;
        } else {
            return this.filteredInvoices();
        }
    }

    filteredInvoices = () => {
        let filteredInvoices = [];
        filteredInvoices = this.props.invoice.purchaseCNInvoiceList.filter(value =>
            value.invoiceno.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
        );
        return filteredInvoices;
    }

    render() {
        const { invoice } = this.props;
        if (invoice.fetchingPurchaseCNInvoice) {
            return <OnScreenSpinner />
        }
        if (invoice.fetchPurchaseCNInvoiceError) {
            return <FullScreenError tryAgainClick={this.fetchPurchaseInvoice} />
        }
        if (invoice.purchaseCNInvoiceList.length === 0) {
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
                }}>Purchase Credit-Notes</Text>
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
)(PurchaseCNList);