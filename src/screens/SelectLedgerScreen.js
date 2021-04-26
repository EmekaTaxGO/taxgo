const { Component } = require("react");

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SearchView from '../components/SearchView';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';

import * as ledgerActions from '../redux/actions/ledgerActions';
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
        this.fetchLedgerCategory();
    }

    fetchLedgerCategory = () => {
        const { ledgerActions } = this.props;
        ledgerActions.getLedgerCategory();
    }
    onItemClicked = (item) => {
        const { params } = this.props.route;
        params.onLedgerCategorySelected(item);
        this.props.navigation.goBack();
    }

    listItem = (item) => {
        const label = `${item.category}-${item.categorygroup}`;
        return <TouchableOpacity onPress={() => { this.onItemClicked(item) }}>
            <View style={{
                borderBottomWidth: 1,
                borderBottomColor: 'lightgray',
                marginLeft: 16,
                paddingRight: 16,
                paddingVertical: 18,
                fontSize: 16,
            }}>
                <Text style={{
                    flex: 1,
                    color: 'gray'
                }}>
                    {label}
                </Text>
            </View>

        </TouchableOpacity>
    }

    onSearchQueryChange = q => {
        this.setState({ query: q });
    }

    listLedgers = () => {
        if (isEmpty(this.state.query)) {
            return this.props.ledger.ledgerCategories;
        } else {
            return this.filteredLedgers();
        }
    }

    filteredLedgers = () => {
        let filteredLedgers = [];
        filteredLedgers = this.props.ledger.ledgerCategories.filter(value => {
            const label = `${value.category}-${value.categorygroup}`;
            return label.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
        });
        return filteredLedgers;
    }

    render() {
        //     fetchingProductLedger: false,
        // fetchProductLedgerError: undefined,
        // productLedgers: []
        const { ledger } = this.props;
        if (ledger.fetchingLedgerCategory) {
            return <OnScreenSpinner />
        }
        if (ledger.fetchLedgerCategoryError) {
            return <FullScreenError tryAgainClick={this.fetchLedgerCategory} />
        }
        if (ledger.ledgerCategories.length === 0) {
            return <EmptyView message='No Ledgers Category Available' iconName='hourglass-empty' />
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
        ledger: state.ledger
    }),
    dispatch => ({
        ledgerActions: bindActionCreators(ledgerActions, dispatch)
    })
)(SelectLedgerScreen);