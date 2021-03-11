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
import ContactAvatarItem from '../ContactAvatarItem';
import { rColor } from '../../theme/Color';
import { get, isEmpty } from 'lodash';

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
        const color = rColor[index % rColor.length];
        const firstChar = isEmpty(get(item, 'name', '')) ? '-' : item.name.charAt(0);
        return (
            <ContactAvatarItem
                color={color}
                text={firstChar}
                title={item.name}
                subtitle={item.email}
                description={item.mobile}
            />
        )
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