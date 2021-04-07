import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';

import * as contactActions from '../redux/actions/contactActions';
import { bindActionCreators } from 'redux';
import SearchView from '../components/SearchView';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';
import { FlatList } from 'react-native-gesture-handler';
import ImageView from '../components/ImageView';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { rColor } from '../theme/Color';
import { get, isEmpty } from 'lodash';
import ContactAvatarItem from '../components/ContactAvatarItem';

class SelectCustomerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }

    componentDidMount() {
        this.configHeader();
        this.fetchCustomer();
    }

    onAddClick = () => {
        this.props.navigation.push('AddCustomerScreen', {
            contactType: 'customer',
            contact: null
        });
    }

    configHeader = () => {
        this.props.navigation.setOptions({
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick} style={{ paddingRight: 12 }}>
                    <Icon name='add' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }

    fetchCustomer = () => {
        const { contactActions } = this.props;
        contactActions.getCustomerList();
    }

    onSearchQueryChange = q => {
        this.setState({ query: q });
    }

    listData = () => {
        if (isEmpty(this.state.query)) {
            return this.props.contact.customerList;
        } else {
            return this.filteredCustomer();
        }
    }

    filteredCustomer = () => {
        let filteredCustomers = [];
        filteredCustomers = this.props.contact.customerList.filter(value =>
            value.name.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1);
        return filteredCustomers;
    }

    renderList = ({ item, index }) => {
        const cIdx = index % rColor.length;
        const color = rColor[cIdx];
        let nameChar = get(item, 'name', '-');
        nameChar = isEmpty(nameChar) ? '-' : nameChar.charAt(0);
        return (
            <ContactAvatarItem
                title={item.name}
                subtitle={item.email}
                color={color}
                text={nameChar}
                clickable={true}
                onPress={() => {
                    this.props.route.params.onCustomerSelected(item);
                    this.props.navigation.goBack();
                }}
            />
        )
    }

    render() {
        const { contact } = this.props;
        if (contact.fetchingCustomerList) {
            return <OnScreenSpinner />
        }
        if (contact.customerListError) {
            return <FullScreenError tryAgainClick={this.fetchCustomer} />
        }
        if (contact.customerList.length === 0) {
            return <EmptyView message='No Customer found' iconName='location-city' />
        }
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={this.onSearchQueryChange}
                onCrossPress={() => this.onSearchQueryChange('')}
                placeholder='Search...' />
            <FlatList
                data={this.listData()}
                keyExtractor={item => `${item.id}`}
                renderItem={this.renderList}
            />
        </SafeAreaView>
    }
}
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
        contact: state.contact
    }),
    dispatch => ({
        contactActions: bindActionCreators(contactActions, dispatch)
    })
)(SelectCustomerScreen);