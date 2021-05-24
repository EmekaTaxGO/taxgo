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
import * as color from '../../theme/Color';
import ContactAvatar from '../ContactAvatar';
import ContactAvatarItem from '../ContactAvatarItem';

class MyLedgerTabItem extends Component {

    imageRadius = 30;
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

    firstLetter = (text) => {
        return (text !== undefined && text !== null && text.length > 0) ? text.charAt(0) : '-';
    }

    listItem = (data) => {
        const { item, index } = data;
        const firstLetter = this.firstLetter(item.laccount);
        const bgColor = color.rColor[index % color.rColor.length];
        return (
            <ContactAvatarItem
                title={`${item.nominalcode}-${item.laccount}`}
                subtitle={item.category}
                description={item.categorygroup}
                color={bgColor}
                text={firstLetter}
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
                {this.hiddenElement('View', 'visibility', color.viewColor, () => this.onViewClick(item))}
            </View>
            {this.hiddenElement('Edit', 'edit', color.editColor, () => this.onEditClick(item))}
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
                disableRightSwipe={true}
                renderItem={(data, rowMap) => this.listItem(data)}
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