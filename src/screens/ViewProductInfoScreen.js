import React, { Component } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';

import * as productActions from '../redux/actions/productActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import CardView from 'react-native-cardview';
import { colorAccent, colorPrimary } from '../theme/Color';
import ImageView from '../components/ImageView';

class ViewProductInfoScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    getProductId = () => {
        return this.props.route.params.id;
    }

    componentDidMount() {
        // console.log('Product Id:', this.getProductId());
        this.fetchProductInfo();
    }

    fetchProductInfo = () => {
        const { productActions } = this.props;
        productActions.getProductById(this.getProductId());
    }

    header = (title) => {
        return <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            width: '100%',
            color: 'black',
            backgroundColor: colorPrimary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            color: 'white'
        }}>{title}</Text>
    }

    row = (label, value) => {
        return <View style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4
        }}>
            <Text style={{ flex: 5, color: 'black', fontSize: 14 }}>{label}</Text>
            {value ? <Text style={{
                flex: 4,
                color: 'gray',
                fontSize: 14,
                textAlign: 'right'
            }}
                numberOfLines={1}>{value}</Text> : null}
        </View>
    }

    renderSalesInfo = (product) => {
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={styles.card}>
            <View style={{ flexDirection: 'column' }}>
                {this.header('Sales Info')}
                <View style={styles.cardContainer}>

                    {this.row('Ledger Acc.', null)}
                    {this.row('Sales Price', product.price)}
                    {this.row('Trade Price', product.trade_price)}
                    {this.row('Wholesale Price', product.wholesale)}
                    {this.row('Vat/GST(%)', product.vat)}
                    {this.row('Vat(Amt)', product.vatamt)}
                </View>
            </View>
        </CardView>
    }
    renderPurchaseInfo = (product) => {
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={styles.card}>
            <View style={{ flexDirection: 'column' }}>
                {this.header('Purchase Info')}
                <View style={styles.cardContainer}>

                    {this.row('Supplier', product.location)}
                    {this.row('Item Code', product.icode)}
                    {this.row('Purchase Description', product.pdescription)}
                    {this.row('Cost Price', product.costprice)}
                    {this.row('Purchase Account', product.paccount)}
                    {this.row('Reorder Level', product.rlevel)}
                    {this.row('Reorder Quantity', product.rquantity)}
                    {this.row('Expiry Date', product.expiredate)}
                </View>
            </View>
        </CardView>
    }
    renderMoreInfo = (product) => {
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.card, { marginBottom: 22 }]}>
            <View style={{ flexDirection: 'column' }}>
                {this.header('More Info')}
                <View style={styles.cardContainer}>

                    {this.row('Location', product.location)}
                    {this.row('Weight', product.weight)}
                    {this.row('Notes', product.notes)}
                </View>
            </View>
        </CardView>
    }

    renderMainInfo = (product) => {
        return <View style={{
            flexDirection: 'row',
            paddingHorizontal: 13,
            paddingTop: 12,
            alignItems: 'flex-end'
        }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={{ fontSize: 20, fontWeight: '400' }}>{product.name}</Text>
                <Text style={{ fontSize: 15 }}>{product.pdescription}</Text>
            </View>
            <Text style={{ color: 'black', fontSize: 16 }}>{product.itemtype}</Text>
        </View>
    }

    render() {
        const { product } = this.props;
        if (product.fetchingProductInfo) {
            return <OnScreenSpinner />
        }
        if (product.fetchProductInfoError || product.productInfo === undefined) {
            return <FullScreenError tryAgainClick={this.fetchProductInfo} />
        }
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <ImageView
                    url={product.pimage}
                    placeholder={require('../assets/product.png')}
                    style={{
                        marginTop: 12,
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: 'gray',
                        alignSelf: 'center'
                    }} />
                {this.renderMainInfo(product.productInfo)}
                {this.renderSalesInfo(product.productInfo)}
                {this.renderPurchaseInfo(product.productInfo)}
                {this.renderMoreInfo(product.productInfo)}
            </ScrollView>
        </SafeAreaView>
    }
};
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 12,
        marginTop: 16
    },
    cardContainer: {
        width: '100%',
        flexDirection: 'column',
        paddingHorizontal: 12,
        paddingBottom: 12
    }
});
export default connect(
    state => ({
        product: state.product
    }),
    dispatch => ({
        productActions: bindActionCreators(productActions, dispatch)
    })
)(ViewProductInfoScreen);