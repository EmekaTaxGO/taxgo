import React, { Component, PureComponent } from 'react';
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
import FullScreenError from '../../components/FullScreenError';
import EmptyView from '../../components/EmptyView';
import OnScreenSpinner from '../../components/OnScreenSpinner';
import { isEmpty, showError, showSuccess } from '../../helpers/Utils'
import SalesInvoiceListItem from './SalesInvoiceListItem';
import { appFontBold } from '../../helpers/ViewHelper';
import AppText from '../AppText';
import Store from '../../redux/Store';
import Api from '../../services/api'
import ProgressDialog from '../ProgressDialog';

class PurchaseInvoiceList extends Component {
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
        this.fetchPurchaseInvoice();
    }

    fetchPurchaseInvoice = () => {
        const { invoiceActions } = this.props;
        invoiceActions.getPurchaseInvoiceList();
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
            title: 'Purchase',
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
        Api.post('/purchase/deleteInvoice', body)
            .then(response => {
                this.setState({ updating: false })
                setTimeout(() => {
                    showSuccess('Invoice Deleted Successfully.')
                    this.fetchPurchaseInvoice()
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
            return this.props.invoice.purchaseInvoiceList;
        } else {
            return this.filteredInvoices();
        }
    }

    filteredInvoices = () => {
        let filteredInvoices = [];
        filteredInvoices = this.props.invoice.purchaseInvoiceList.filter(value =>
            value.invoiceno.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
        );
        return filteredInvoices;
    }

    render() {
        const { invoice } = this.props;
        if (invoice.fetchingPurchaseInvoice) {
            return <OnScreenSpinner />
        }
        if (invoice.fetchPurchaseInvoiceError) {
            return <FullScreenError tryAgainClick={this.fetchPurchaseInvoice} />
        }
        if (invoice.purchaseInvoiceList.length === 0) {
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
                }}>Invoices</Text>
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
)(PurchaseInvoiceList);