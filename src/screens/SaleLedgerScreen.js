import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';

import * as ledgerActions from '../redux/actions/ledgerActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';
import SearchView from '../components/SearchView';
import { isEmpty } from '../helpers/Utils';
import ImageView from '../components/ImageView';

class SaleLedgerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }
    componentDidMount() {
        this.fetchSaleLedger();
    }

    fetchSaleLedger = () => {
        const { ledgerActions } = this.props;
        ledgerActions.getSaleLedger();
    }

    onSearchQueryChange = q => {
        this.setState({ query: q });
    }

    listData = () => {
        if (isEmpty(this.state.query)) {
            return this.props.ledger.saleLedgers;
        } else {
            return this.filteredLedgers();
        }
    }
    filteredLedgers = () => {
        let filteredLedgers = [];
        filteredLedgers = this.props.ledger.saleLedgers.filter(value =>
            value.name.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1);
        return filteredLedgers;
    }

    renderListItem = (item) => {
        return <TouchableOpacity
            onPress={() => {
                this.props.route.params.onLedgerSelected(item);
                this.props.navigation.goBack();
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ImageView
                    placeholder={require('../assets/product.png')}
                    url={''}
                    style={styles.image}
                />
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 12,
                    borderBottomColor: 'lightgray',
                    borderBottomWidth: 1,
                    paddingVertical: 18
                }}>
                    <Text style={{ color: 'black', fontSize: 16 }}>{item.category}</Text>
                    <Text style={{ color: 'gray', fontSize: 14, marginTop: 3 }}>{item.categorygroup}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    render() {
        const { ledger } = this.props;
        if (ledger.fetchingSaleLedger) {
            return <OnScreenSpinner />
        }
        if (ledger.fetchSaleLedgerError) {
            return <FullScreenError tryAgainClick={this.fetchSaleLedger} />
        }
        if (ledger.saleLedgers.length === 0) {
            return <EmptyView message='No Sale Ledger available' iconName='description' />
        }
        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={this.onSearchQueryChange}
                onCrossPress={() => this.onSearchQueryChange('')}
                placeholder='Search...' />
            <FlatList
                data={this.listData()}
                keyExtractor={item => `${item.id}`}
                renderItem={({ item }) => this.renderListItem(item)}
            />
        </View>
    }
};
const styles = StyleSheet.create({
    image: {
        width: 54,
        height: 54,
        borderRadius: 27,
        marginLeft: 16,
        borderWidth: 1,
        borderColor: 'gray'
    }
});
export default connect(
    state => ({
        ledger: state.ledger
    }),
    dispatch => ({
        ledgerActions: bindActionCreators(ledgerActions, dispatch)
    })
)(SaleLedgerScreen);