import React, { Component, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ImageView from '../components/ImageView';
import SearchView from '../components/SearchView';
import { connect } from 'react-redux';

import * as productActions from '../redux/actions/productActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';
import { isEmpty } from '../helpers/Utils';

class ProductFragment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }

    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    onAddClick = () => {
        this.props.navigation.push('AddProductScreen', {
            onProductUpdated: () => {
                console.log('Fetching Pro List...');
                this.fetchProductList();
            }
        });
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={this.onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            },
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick} style={{ padding: 12 }}>
                    <MaterialIcon name='add' size={30} color='white' />
                </TouchableOpacity>
            }
        })

        this.fetchProductList();
    }

    fetchProductList = () => {
        const { productActions } = this.props;
        productActions.getProductList();
    }

    ListItem = ({ item }) => {
        return <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',

        }}>
            <ImageView
                url={item.image}
                placeholder={require('../assets/product.png')}
                style={styles.image} />
            <View style={{
                flexDirection: 'column',
                flex: 1,
                marginStart: 16,
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                paddingVertical: 16
            }}>
                <Text style={styles.textStyle}>{item.itemtype}</Text>
                <Text style={[styles.textStyle, { marginTop: 4 }]}>Item: {item.icode}</Text>
                <Text style={[styles.textStyle, { marginTop: 4 }]}>Description: {item.idescription}</Text>
            </View>
        </View>
    }

    listData = () => {
        if (isEmpty(this.state.query)) {
            return this.props.product.productList;
        } else {
            return this.filteredProducts();
        }
    }
    filteredProducts = () => {
        let filteredProducts = [];
        filteredProducts = this.props.product.productList.filter(value => {
            return value.icode.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
        });
        return filteredProducts;
    }


    render() {
        const { product } = this.props;
        if (product.fetchingProductList) {
            return <OnScreenSpinner />
        }
        if (product.productListError) {
            return <FullScreenError tryAgainClick={this.fetchProductList} />
        }
        if (product.productList.length === 0) {
            return <EmptyView message='No Product Available.'
                iconName='description' />
        }
        return <View style={{ flex: 1 }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={q => this.setState({ query: q })}
                onCrossPress={() => { this.setState({ query: '' }) }}
                placeholder='Search Products' />
            <FlatList
                style={{ flex: 1 }}
                data={this.listData()}
                keyExtractor={(row, index) => `${index}`}
                renderItem={({ item }) => <this.ListItem item={item} />} />
        </View >
    }
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'lightgray',
        marginStart: 16
    },
    textStyle: {
        color: '#3c3c3c',
        fontSize: 14
    }
});
export default connect(
    state => ({
        product: state.product
    }),
    dispatch => ({
        productActions: bindActionCreators(productActions, dispatch)
    })
)(ProductFragment);