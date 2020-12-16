import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';

import * as productActions from '../redux/actions/productActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';
import SearchView from '../components/SearchView';
import { isEmpty } from '../helpers/Utils';

class SelectProductScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }

    componentDidMount() {
        this.fetchProductList();
    }
    fetchProductList = () => {
        const { productActions } = this.props;
        productActions.getProductList();
    }

    onProductPress = item => {
        this.props.route.params.onProductSelected(item);
        this.props.navigation.goBack();
    }

    renderProductItem = ({ item, index }) => {
        const label = `${item.icode}-${item.idescription}`;
        return <TouchableOpacity onPress={() => this.onProductPress(item)}>
            <Text style={styles.product}>
                {label}
            </Text>
        </TouchableOpacity>
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
            const label = `${value.icode}-${value.idescription}`;
            return label.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
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
        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={q => this.setState({ query: q })}
                onCrossPress={() => { this.setState({ query: '' }) }}
                placeholder='Search Products' />
            <FlatList
                style={{ flex: 1 }}
                data={this.listData()}
                keyExtractor={(row, index) => `${index}`}
                renderItem={this.renderProductItem} />
        </View >
    }

}
const styles = StyleSheet.create({
    product: {
        fontSize: 15,
        color: 'black',
        paddingRight: 16,
        paddingVertical: 16,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
        marginLeft: 16
    }
});
export default connect(
    state => ({
        product: state.product
    }),
    dispatch => ({
        productActions: bindActionCreators(productActions, dispatch)
    })
)(SelectProductScreen);