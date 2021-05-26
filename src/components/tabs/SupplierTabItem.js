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
import { editColor, rColor, viewColor } from '../../theme/Color';
import { get, isEmpty } from 'lodash';
import ContactAvatarItem from '../ContactAvatarItem';

class SupplierTabItem extends Component {

    constructor(props) {
        super(props);
    }

    fetchSupplierList = () => {
        const { contactActions } = this.props;
        contactActions.getSupplierList();
    }

    shouldComponentUpdate(newProps, newState) {
        const { contact: newContact } = newProps;
        const { contact: oldContact } = this.props;
        return newContact.fetchingSupplierList !== oldContact.fetchingSupplierList;
    }

    componentDidMount() {
        this.fetchSupplierList();
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
                {this.hiddenElement('View', 'visibility', viewColor, () => this.onViewClick(data))}
            </View>
            {this.hiddenElement('Edit', 'edit', editColor, () => this.onEditClick(data))}
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