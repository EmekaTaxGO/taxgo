const { Component } = require("react");

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SearchView from '../components/SearchView';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';

import * as productActions from '../redux/actions/productActions';
import { bindActionCreators } from 'redux';
import { isEmpty } from '../helpers/Utils';


class SelectLedgerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }

    componentDidMount() {
        this.fetchProductLedger();
    }

    fetchProductLedger = () => {
        const { productActions } = this.props;
        productActions.getProductLedger();
    }
    onItemClicked = (item) => {
        const { params } = this.props.route;
        params.onLedgerSelected(item);
        this.props.navigation.goBack();
    }

    listItem = (item) => {
        const label = `${item.nominalcode}-${item.laccount}`;
        return <TouchableOpacity onPress={() => { this.onItemClicked(item) }}>
            <Text style={{
                flex: 1,
                borderBottomWidth: 1,
                borderColor: 'lightgray',
                marginLeft: 16,
                paddingRight: 16,
                paddingVertical: 18,
                fontSize: 16,
                color: 'gray'
            }}>
                {label}
            </Text>
        </TouchableOpacity>
    }

    onSearchQueryChange = q => {
        this.setState({ query: q });
    }

    listLedgers = () => {
        if (isEmpty(this.state.query)) {
            return this.props.product.productLedgers;
        } else {
            return this.filteredLedgers();
        }
    }

    filteredLedgers = () => {
        let filteredLedgers = [];
        filteredLedgers = this.props.product.productLedgers.filter(value => {
            const label = `${value.nominalcode}-${value.laccount}`;
            return label.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
        });
        return filteredLedgers;
    }

    render() {
        //     fetchingProductLedger: false,
        // fetchProductLedgerError: undefined,
        // productLedgers: []
        const { product } = this.props;
        if (product.fetchingProductLedger) {
            return <OnScreenSpinner />
        }
        if (product.fetchProductLedgerError) {
            return <FullScreenError tryAgainClick={this.fetchProductLedger} />
        }
        if (product.productLedgers.length === 0) {
            return <EmptyView message='No Ledgers Available' iconName='hourglass-empty' />
        }

        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={this.onSearchQueryChange}
                onCrossPress={() => { this.onSearchQueryChange('') }}
                placeholder='Search...' />
            <FlatList
                data={this.listLedgers()}
                renderItem={({ item }) => this.listItem(item)}
                keyExtractor={(item, index) => `${index}`}
            />
        </View>
    }
}
const styles = StyleSheet.create({

});
export default connect(
    state => ({
        product: state.product
    }),
    dispatch => ({
        productActions: bindActionCreators(productActions, dispatch)
    })
)(SelectLedgerScreen);