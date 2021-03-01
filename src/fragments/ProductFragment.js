import React, { Component, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
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
import { SwipeListView } from 'react-native-swipe-list-view';
import SwipeHiddenView from '../product/SwipeHiddenView';
import ProductListItem from '../product/ProductListItem';

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

    shouldComponentUpdate(newProps, newState) {
        const { product: newProduct } = newProps;
        const { product: oldProduct } = this.props;
        return newState.query !== this.state.query
            //Props Change
            || newProduct.fetchingProductList !== oldProduct.fetchingProductList;
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

    renderListItem = (data) => {
        const { item } = data;
        return (
            <ProductListItem
                data={data}
            />
        )
    }
    renderHiddenItem = (data) => {
        const { item, index } = data;
        return <SwipeHiddenView
            id={index}
            item={item}
            onViewClick={this.onViewClick}
            onEditClick={this.onEditClick}
        />
    }

    onViewClick = item => {
        this.props.navigation.push('ViewProductInfoScreen', { id: item.id });
    }
    onEditClick = item => {
        this.props.navigation.push('AddProductScreen', {
            onProductUpdated: () => {
                this.fetchProductList();
            },
            product: { ...item }
        });
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
            <SwipeListView
                style={{
                    flex: 1,
                    backgroundColor: 'white'
                }}
                data={this.listData()}
                renderItem={(data) => this.renderListItem(data)}
                renderHiddenItem={(data) => this.renderHiddenItem(data)}
                leftOpenValue={70}
                rightOpenValue={-70}
            />
            {/* <FlatList
                style={{ flex: 1 }}
                data={this.listData()}
                keyExtractor={(row, index) => `${index}`}
                renderItem={({ item }) => <this.renderListItem item={item} />} /> */}
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