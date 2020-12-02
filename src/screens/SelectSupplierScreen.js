import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { connect } from 'react-redux';

import * as contactActions from '../redux/actions/contactActions';
import { bindActionCreators } from 'redux';
import SearchView from '../components/SearchView';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';
import { FlatList } from 'react-native-gesture-handler';
import { isEmpty } from '../helpers/Utils';
import ImageView from '../components/ImageView';
import Icon from 'react-native-vector-icons/MaterialIcons';

class SelectSupplierScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }

    componentDidMount() {
        this.configHeader();
        this.fetchSupplier();
    }

    onAddClick = () => {
        this.props.navigation.push('AddCustomerScreen', {
            contactType: 'supplier',
            contact: null
        });
    }

    configHeader = () => {
        this.props.navigation.setOptions({
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick} style={{ padding: 12 }}>
                    <Icon name='add' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }

    fetchSupplier = () => {
        const { contactActions } = this.props;
        contactActions.getSupplierList();
    }

    onSearchQueryChange = q => {
        this.setState({ query: q });
    }

    listData = () => {
        if (isEmpty(this.state.query)) {
            return this.props.contact.supplierList;
        } else {
            return this.filteredSupplier();
        }
    }

    filteredSupplier = () => {
        let filteredSuppliers = [];
        filteredSuppliers = this.props.contact.supplierList.filter(value =>
            value.name.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1);
        return filteredSuppliers;
    }

    renderList = (item) => {
        return <TouchableOpacity
            onPress={() => {
                this.props.route.params.onSupplierSelected(item);
                this.props.navigation.goBack();
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ImageView
                    placeholder={require('../assets/product.png')}
                    url={''}
                    style={styles.image}
                />
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginLeft: 12,
                    borderBottomColor: 'lightgray',
                    borderBottomWidth: 1,
                    paddingVertical: 18
                }}>
                    <Text style={{ color: 'black', fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ color: 'gray', fontSize: 14, marginTop: 3 }}>{item.email}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    render() {
        const { contact } = this.props;
        if (contact.fetchingSupplierList) {
            return <OnScreenSpinner />
        }
        if (contact.supplierListError) {
            return <FullScreenError tryAgainClick={this.fetchSupplier} />
        }
        if (contact.supplierList.length === 0) {
            return <EmptyView message='No Supplier found' iconName='location-city' />
        }
        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={this.onSearchQueryChange}
                onCrossPress={() => this.onSearchQueryChange('')}
                placeholder='Search...' />
            <FlatList
                data={this.listData()}
                keyExtractor={item => `${item.id}`}
                renderItem={({ item }) => this.renderList(item)}
            />
        </View>
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
)(SelectSupplierScreen);