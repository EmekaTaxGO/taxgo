import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Text, SafeAreaView, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as merchantActions from '../redux/actions/merchantActions';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import ProgressDialog from '../components/ProgressDialog';
import EmptyView from '../components/EmptyView';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class MerchantAccountScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            merchants: []
        }
    }

    onAddClick = () => {
        this.props.navigation.push('AddMerchantScreen', {
            onMerchantUpdated: this.fetchMerchantAccount
        });
    }
    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick}
                    style={{ padding: 12 }}>
                    <Icon name='plus-a' size={20} color='white' />
                </TouchableOpacity>
            }
        })
        this.fetchMerchantAccount();
    }

    componentDidUpdate(oldProps, oldState) {
        const { merchant: oldMerchant } = oldProps;
        const { merchant: newMerchant } = this.props;

        if (oldMerchant.fetchingMerchant && !newMerchant.fetchingMerchant
            && newMerchant.fetchMerchantError === undefined) {
            //case when merchant is fetched
            this.setState({ merchants: [...newMerchant.merchants] })
        }
    }

    fetchMerchantAccount = () => {
        const { merchantActions } = this.props;
        merchantActions.fetchMerchants();
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

                <MaterialIcons name={icon} color='white' size={24} />
                <Text style={{ color: 'white' }}>{label}</Text>
            </View>
        </TouchableHighlight>
    }

    onEditClick = item => {
        this.props.navigation.push('AddMerchantScreen', {
            onMerchantUpdated: this.fetchMerchantAccount,
            item
        });
    }

    renderHiddenItem = (data) => {
        const { item, index } = data;
        return <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }} />
            {this.hiddenElement('Edit', 'edit', 'blue', () => this.onEditClick(item))}
        </View>
    }

    renderItem = data => {
        const { index, item } = data;
        return <View style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            backgroundColor: 'white'
        }}>
            <Text style={{
                fontSize: 24,
                paddingHorizontal: 24,
                paddingVertical: 12
            }}>{item.accname.toUpperCase().charAt(0)}</Text>
            <View style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: 'lightgray'
            }}>
                <Text>{item.accname}</Text>
                <Text style={{ marginTop: 4, color: 'gray' }}>{item.type}</Text>
            </View>
        </View>
    }




    render() {
        const { merchant } = this.props;
        if (merchant.fetchingMerchant) {
            return <OnScreenSpinner />
        }
        if (merchant.fetchMerchantError) {
            return <FullScreenError tryAgainClick={this.fetchMerchantAccount} />
        }
        if (!merchant.merchants) {
            return <EmptyView message='No Merchant Available' iconName='hail' />
        }

        return <SwipeListView
            style={{ flex: 1, backgroundColor: 'white' }}
            data={this.state.merchants}
            renderItem={(data, rowMap) => this.renderItem(data)}
            renderHiddenItem={(data, rowMap) => this.renderHiddenItem(data)}
            rightOpenValue={-70}
        />
    }
}
const styles = StyleSheet.create({

});
export default connect(
    state => ({
        merchant: state.merchant
    }),
    dispatch => ({
        merchantActions: bindActionCreators(merchantActions, dispatch)
    })
)(MerchantAccountScreen);