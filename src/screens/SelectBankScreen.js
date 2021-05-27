import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';

import * as bankActions from '../redux/actions/bankActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';
import SearchView from '../components/SearchView';
import { rColor } from '../theme/Color';
import ContactAvatarItem from '../components/ContactAvatarItem';
import { get, isEmpty } from 'lodash';

class SelectBankScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }
    componentDidMount() {
        this.fetchBankList();
    }

    fetchBankList = () => {
        const { bankActions } = this.props;
        bankActions.getBankList();
    }

    onSearchQueryChange = q => {
        this.setState({ query: q });
    }

    listData = () => {
        if (isEmpty(this.state.query)) {
            return this.props.bank.bankList;
        } else {
            return this.filteredBanks();
        }
    }
    filteredBanks = () => {
        let filteredBanks = [];
        filteredBanks = this.props.bank.bankList.filter(value => {
            const label = `${value.nominalcode} ${value.laccount}`;
            return label.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
        });
        return filteredBanks;
    }

    renderListItem = ({ item, index }) => {
        const list = get(item, 'list', {})
        const color = rColor[index % rColor.length];
        var firstChar = get(item, 'list.laccount', '-')
        firstChar = isEmpty(firstChar) ? '-' : firstChar.charAt(0)
        const title = `${list.nominalcode}-${list.laccount}`
        return (
            <ContactAvatarItem
                color={color}
                text={firstChar}
                title={title}
                clickable='true'
                subtitle={`Category: ${list.categorygroup}`}
                description={`Mathod: ${list.paidmethod}`}
                onPress={() => {
                    this.props.route.params.onBankSelected(list);
                    this.props.navigation.goBack();
                }}
            />
        )

        // return <TouchableOpacity
        //     onPress={ }>
        //     <View style={{ flexDirection: 'row', alignItems: 'center' }}>

        //         <View style={{
        //             flex: 1,
        //             flexDirection: 'column',
        //             justifyContent: 'center',
        //             marginLeft: 12,
        //             borderBottomColor: 'lightgray',
        //             borderBottomWidth: 1,
        //             paddingVertical: 12
        //         }}>
        //             <Text style={{ color: 'black', fontSize: 16 }}>{list.nominalcode} {list.laccount}</Text>
        //             <Text style={{ color: 'gray', fontSize: 14, marginTop: 3 }}>Category: {list.categorygroup}</Text>
        //             <Text style={{ color: 'gray', fontSize: 14, marginTop: 3 }}>Mathod: {list.paidmethod}</Text>
        //         </View>
        //     </View>
        // </TouchableOpacity>
    }

    render() {
        const { bank } = this.props;
        if (bank.fetchingBankList) {
            return <OnScreenSpinner />
        }
        if (bank.fetchBankListError) {
            return <FullScreenError tryAgainClick={this.fetchBankList} />
        }
        if (bank.bankList.length === 0) {
            return <EmptyView message='No Bank available' iconName='description' />
        }
        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={this.onSearchQueryChange}
                onCrossPress={() => this.onSearchQueryChange('')}
                placeholder='Search...' />
            <FlatList
                data={this.listData()}
                keyExtractor={(item, index) => `${index}`}
                renderItem={this.renderListItem}
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
        bank: state.bank
    }),
    dispatch => ({
        bankActions: bindActionCreators(bankActions, dispatch)
    })
)(SelectBankScreen);