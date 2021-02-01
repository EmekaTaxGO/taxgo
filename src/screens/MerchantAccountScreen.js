import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Text, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as merchantActions from '../redux/actions/merchantActions';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import ProgressDialog from '../components/ProgressDialog';
import EmptyView from '../components/EmptyView';

class MerchantAccountScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            merchants: []
        }
    }

    onAddClick = () => {
        this.props.navigation.push('AddMerchantScreen');
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

    renderItem = item => {
        return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            return <EmptyView message='No Invoice Available' iconName='hail' />
        }

        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                style={{ flex: 1 }}
                data={this.state.merchants}
                keyExtractor={row => `${row.id}`}
                renderItem={({ item }) => this.renderItem(item)}
            />
        </SafeAreaView>
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