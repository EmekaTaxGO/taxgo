import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import OnScreenSpinner from '../../components/OnScreenSpinner';
import FullScreenError from '../../components/FullScreenError';
import EmptyView from '../../components/EmptyView';

import * as contactActions from '../../redux/actions/contactActions';
import { bindActionCreators } from 'redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

class CustomerTabItem extends Component {

    constructor(props) {
        super(props);
    }

    fetchCustomerList = () => {
        const { contactActions } = this.props;
        contactActions.getCustomerList();
    }

    shouldComponentUpdate(newProps, newState) {
        const { contact: newContact } = newProps;
        const { contact: oldContact } = this.props;
        return newContact.fetchingCustomerList !== oldContact.fetchingCustomerList;
    }

    componentDidMount() {
        this.fetchCustomerList();
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
    onViewClick = (data) => {
        const { item } = data;
        this.props.navigation.push('AddCustomerScreen', {
            contactType: 'customer',
            contact: item,
            mode: 'disabled'
        });
    }

    onEditClick = (data) => {
        const { item } = data;
        this.props.navigation.push('AddCustomerScreen', {
            contactType: 'customer',
            contact: item
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
        if (contact.fetchingCustomerList) {
            return <OnScreenSpinner />
        }
        if (contact.customerListError) {
            return <FullScreenError tryAgainClick={this.fetchCustomerList} />
        }
        if (contact.customerList.length === 0) {
            return <EmptyView message='No Customer found' iconName='hail' />
        }
        return <SwipeListView
            style={{
                flex: 1,
                backgroundColor: 'white'
            }}
            data={contact.customerList}
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
)(CustomerTabItem);