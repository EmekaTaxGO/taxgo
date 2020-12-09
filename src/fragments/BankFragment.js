import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Text, TouchableHighlight } from 'react-native';
import SearchView from '../components/SearchView';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SwipeListView } from 'react-native-swipe-list-view';
import CardView from 'react-native-cardview';
import { connect } from 'react-redux';

import * as bankActions from '../redux/actions/bankActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';
import { log } from 'react-native-reanimated';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';

class BankFragment extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }
    onAddClick = () => {
        this.props.navigation.navigate('UpdateUserScreen', {
            title: 'Add User'
        })
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={this.onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            },
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick} style={styles.rightBtn}>
                    <Icon name='add' size={30} color='white' />
                </TouchableOpacity>
            }
        })
        this.fetchBankList();
    }

    fetchBankList = () => {
        const { bankActions } = this.props;
        bankActions.getBankList();
    }

    onItemPress = (item) => {
        // this.props.navigation.navigate('UpdateUserScreen', {
        //     title: 'Edit User'
        // });
        console.log('Item', item);
    }

    accountIcon = (accType) => {
        const iconSize = 30;
        const iconColor = 'white';
        switch (accType) {
            case 'card':
                return <AntDesignIcon name='creditcard' size={iconSize} color={iconColor} />;
            case 'cash':
                return <MaterialCommunityIcon name='cash' size={iconSize} color={iconColor} />;
            case 'current':
                return <MaterialCommunityIcon name='file-document' size={iconSize} color={iconColor} />;
            case 'savings':
                return <MaterialIcons name='attach-money' size={iconSize} color={iconColor} />;
            default:
                return <FontistoIcon name='money-symbol' size={iconSize} color={iconColor} />;

        }
    }

    rowItem = (label, value) => {
        return <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6
        }}>
            <Text style={{
                flex: 3,
                color: 'white'
            }}>{label}</Text>
            <Text style={{
                flex: 5,
                textAlign: 'right',
                color: 'white'
            }}>{value}</Text>
        </View>
    }

    renderListItem = (data) => {
        const { item, index } = data;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={styles.bankCard}>
            <View style={{
                flexDirection: 'column'
            }}>

                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    {this.accountIcon(item.acctype)}
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        flexDirection: 'row'
                    }}>
                        <Text style={{
                            opacity: 1,
                            borderRadius: 20,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            fontSize: 16,
                            textAlign: 'center',
                            backgroundColor: '#43a8d4'
                        }}>{item.acctype}</Text>
                    </View>

                </View>
                <Text style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 20
                }}>{item.accnum ? item.accnum : '****  ***  ****'}</Text>
                {this.rowItem('Current Balance', item.total)}
                {this.rowItem('Opening Balance', item.opening)}
                {this.rowItem(item.userdate, item.acctype)}
            </View>
        </CardView>
    }

    hiddenElement = (label, icon, color, onPress) => {
        return <TouchableHighlight onPress={onPress} underlayColor='white'>
            <View style={{
                flexDirection: 'column',
                backgroundColor: 'white',
                width: 70,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <Icon name={icon} color={color} size={24} />
                <Text style={{ color: color }}>{label}</Text>
            </View>
        </TouchableHighlight>
    }

    onViewClick = () => {
        console.log('View Click');
    }
    onEditClick = () => {
        console.log('Edit Click');
    }

    renderHiddenItem = (data) => {
        const { item, index } = data;
        return <View style={{
            flex: 1,
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 2,
            flexDirection: 'row'
        }}>
            <View style={{ flex: 1 }}>
                {this.hiddenElement('View', 'visibility', 'green', this.onViewClick)}
            </View>
            {this.hiddenElement('Edit', 'edit', 'blue', () => this.onEditClick(data))}
        </View>
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
            return <EmptyView message='No Bank Account Found' iconName='house' />
        }
        return <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column' }}>
            <SwipeListView
                style={{
                    flex: 1,
                    backgroundColor: 'white'
                }}
                data={bank.bankList}
                keyExtractor={(item, index) => `${item.id}`}
                renderItem={(data, rowMap) => this.renderListItem(data)}
                renderHiddenItem={(data, rowMap) => this.renderHiddenItem(data)}
                leftOpenValue={70}
                rightOpenValue={-70}
            />
        </View>
    }
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    rightBtn: {
        padding: 12
    },
    bankCard: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#3b96ef',
        paddingHorizontal: 16,
        paddingVertical: 12
    }
})
export default connect(
    state => ({
        bank: state.bank
    }),
    dispatch => ({
        bankActions: bindActionCreators(bankActions, dispatch)
    })
)(BankFragment);