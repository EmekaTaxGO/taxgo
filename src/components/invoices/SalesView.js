import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchView from '../SearchView';
import { connect } from 'react-redux';
import * as invoiceActions from '../../redux/actions/invoiceActions';
import { bindActionCreators } from 'redux';

class SalesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }

    componentDidMount() {

    }

    onSearchQueryChange = q => {
        const { invoiceActions } = this.props;
        invoiceActions.onQueryChange(this.props.type, q);
    }

    render() {
        const { invoice } = this.props;
        const searchQuery = this.props.type === 'sales' ? invoice.salesQuery
            : invoice.purchaseQuery;
        return <View style={{ flex: 1 }}>
            <SearchView
                value={searchQuery}
                onChangeQuery={this.onSearchQueryChange}
                onCrossPress={() => this.onSearchQueryChange('')}
                placeholder='Search...' />
        </View>
    }
};
const styles = StyleSheet.create({

});
export default connect(
    state => ({
        invoice: state.invoice
    }),
    dispatch => ({
        invoiceActions: bindActionCreators(invoiceActions, dispatch)
    })
)(SalesView);