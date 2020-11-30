import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import OnScreenSpinner from '../../components/OnScreenSpinner';
import Icon from 'react-native-vector-icons/MaterialIcons';


import * as contactActions from '../../redux/actions/contactActions'
import FullScreenError from '../FullScreenError';
import EmptyView from '../EmptyView';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SwipeListView } from 'react-native-swipe-list-view';

class SupplierTabItem extends Component {

    constructor(props) {
        super(props);
    }

    fetchSupplierList = () => {
        const { contactActions } = this.props;
        contactActions.getSupplierList();
    }

    componentDidMount() {
        this.fetchSupplierList();
    }

    renderListItem = (data, rowMap) => {
        const { index, item } = data;
        return <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 16,
            backgroundColor: 'white'
        }}>
            <Text style={{
                fontSize: 34,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'green',
                paddingHorizontal: 16,
                paddingVertical: 4
            }}>{item.name.charAt(0)}</Text>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                paddingVertical: 14,
                marginLeft: 16,
                justifyContent: 'center',
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1
            }}>
                <Text style={{ color: 'black' }}>{item.name}</Text>
                <Text style={{ marginTop: 2, color: 'gray' }}>{item.email}</Text>
                <Text style={{ marginTop: 2, color: 'gray' }}>{item.mobile}</Text>
            </View>
        </View>
    }
    onEditClick = (data) => {
        const { item } = data;
        this.props.navigation.push('AddCustomerScreen', {
            contactType: 'supplier',
            contact: item
        });
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

    onViewClick = (data) => {
        const { item } = data;
        this.props.navigation.push('AddCustomerScreen', {
            contactType: 'supplier',
            contact: item,
            mode: 'disabled'
        });
    }

    renderHiddenItem = (data, rowMap) => {
        return <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                {this.hiddenElement('View', 'visibility', 'red', () => this.onViewClick(data))}
            </View>
            {this.hiddenElement('Edit', 'edit', 'blue', () => this.onEditClick(data))}
        </View>
    }


    render() {
        const { contact } = this.props;
        if (contact.fetchingSupplierList) {
            return <OnScreenSpinner />
        }
        if (contact.supplierListError) {
            return <FullScreenError tryAgainClick={this.fetchSupplierList} />
        }
        if (contact.supplierList.length === 0) {
            return <EmptyView message='No Supplier found' iconName='location-city' />
        }
        return <SwipeListView
            style={{
                flex: 1,
                backgroundColor: 'white'
            }}
            data={contact.supplierList}
            renderItem={(data, rowMap) => this.renderListItem(data, rowMap)}
            renderHiddenItem={(data, rowMap) => this.renderHiddenItem(data, rowMap)}
            leftOpenValue={70}
            rightOpenValue={-70}
        />
    }
}
const styles = StyleSheet.create({

});
export default connect(
    state => ({
        contact: state.contact
    }),
    dispatch => ({
        contactActions: bindActionCreators(contactActions, dispatch)
    })
)(SupplierTabItem);