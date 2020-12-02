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

class ProductFragment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }

    products = [{
        image: 'http://image.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock1',
        description: 'First Stock'

    }, {
        image: undefined,
        name: 'Stock kjldnf ewikjlf ewrfre wfrlkerwjr ferwlf ',
        itemId: 'Stock2 kjewfhr efrekj ergjktrg trkg etjker fijerjf erfg reilerjlkferj ',
        description: 'First Stock wkjdfher fre fkrekfljerk fjerf ergfioerg regjo gitrgi tr'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock3',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock4',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock5',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock234',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock234',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock234',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock234',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock234',
        description: 'First Stock'

    }];

    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    onAddClick = () => {
        this.props.navigation.push('AddProductScreen', {

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
                <Text>{item.name}</Text>
                <Text style={{ marginTop: 4 }}>Item :{item.itemId}</Text>
                <Text style={{ marginTop: 4 }}>Description: {item.itemId}</Text>
            </View>
        </View>
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
                data={this.products}
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