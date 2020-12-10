import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Text, Image } from 'react-native';
import { connect } from 'react-redux';

import * as ledgerActions from '../../redux/actions/ledgerActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../OnScreenSpinner';
import FullScreenError from '../FullScreenError';
import EmptyView from '../EmptyView';
import { SwipeListView } from 'react-native-swipe-list-view';
import { isEmpty } from '../../helpers/Utils';
import SearchView from '../SearchView';
import Icon from 'react-native-vector-icons/MaterialIcons';

class MyLedgerTabItem extends Component {

    imageRadius = 30;
    imageUrl = 'https://images.unsplash.com/photo-1571292098320-997aa03a5d19?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=294&q=80';
    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }
    componentDidMount() {
        this.fetchMyLedger();
    }

    fetchMyLedger = () => {
        const { ledgerActions } = this.props;
        ledgerActions.getMyLedger();
    }

    listData = () => {
        if (isEmpty(this.state.query)) {
            return this.props.ledger.myLedgers;
        } else {
            return this.filteredLedgers();
        }
    }

    filteredLedgers = () => {
        let filteredLedgers = [];
        filteredLedgers = this.props.ledger.myLedgers.filter(value => {
            const label = `${value.nominalcode}-${value.laccount}`;
            return label.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
        });
        return filteredLedgers;
    }

    onSearchQueryChange = q => {
        this.setState({ query: q });
    }

    listItem = (item) => {
        return <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 16,
            backgroundColor: 'white'
        }}>
            <Image style={{
                width: 2 * this.imageRadius,
                height: 2 * this.imageRadius,
                borderRadius: this.imageRadius,
                borderWidth: 1,
                borderColor: 'lightgray'
            }}
                source={{ uri: this.imageUrl }} />
            <View style={{
                flex: 1,
                flexDirection: 'column',
                paddingVertical: 14,
                marginLeft: 16,
                justifyContent: 'center',
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1
            }}>
                <Text style={{ color: 'black' }}>{`${item.nominalcode}-${item.laccount}`}</Text>
                <Text style={{ marginTop: 2, color: 'gray' }}>{item.category}</Text>
                <Text style={{ marginTop: 2, color: 'gray' }}>{item.categorygroup}</Text>
            </View>
        </View>
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

    onViewClick = (item) => {

    }

    onEditClick = (item) => {
        this.props.navigation.push('AddLedgerScreen', {
            ledger: item,
            onLedgerUpdated: this.fetchMyLedger
        });
    }

    renderHiddenItem = (item) => {
        return <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                {this.hiddenElement('View', 'visibility', 'red', () => this.onViewClick(item))}
            </View>
            {this.hiddenElement('Edit', 'edit', 'blue', () => this.onEditClick(item))}
        </View>
    }

    render() {
        const { ledger } = this.props;
        if (ledger.fetchingMyLedger) {
            return <OnScreenSpinner />
        }
        if (ledger.fetchMyLedgerError) {
            return <FullScreenError tryAgainClick={this.fetchMyLedger} />
        }
        if (ledger.myLedgers.length === 0) {
            return <EmptyView message='No Ledgers found' iconName='hail' />
        }
        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={this.onSearchQueryChange}
                onCrossPress={() => { this.onSearchQueryChange('') }}
                placeholder='Search...' />
            <SwipeListView
                style={{ flex: 1 }}
                data={this.listData()}
                renderItem={(data, rowMap) => this.listItem(data.item)}
                renderHiddenItem={(data, rowMap) => this.renderHiddenItem(data.item)}
                leftOpenValue={70}
                rightOpenValue={-70}
            />
        </View>

    }


};
const styles = StyleSheet.create({

});
export default connect(
    state => ({
        ledger: state.ledger
    }),
    dispatch => ({
        ledgerActions: bindActionCreators(ledgerActions, dispatch)
    })
)(MyLedgerTabItem);