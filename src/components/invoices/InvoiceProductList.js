import { get } from 'lodash';
import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { appFont } from '../../helpers/ViewHelper';
import Store from '../../redux/Store';
class InvoiceProductList extends Component {

    symbol = ' '+get(Store.getState().auth, 'profile.countryInfo.symbol');

    renderBoxRow = (label, value) => {
        return (
            <View style={styles.boxTxtContainer}>
                <Text style={styles.boxLeftTxt}>{label}</Text>
                <Text style={styles.boxRightTxt}>{value}</Text>
            </View>
        )
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={styles.boxContainer}>
                {this.renderBoxRow(item.description + '@' + item.quantity, item.costprice + this.symbol)}
                {this.renderBoxRow('Vat@' + item.incomeTax, item.incomeTaxAmount + this.symbol)}
                {this.renderBoxRow('Discount@' + item.percentage, item.discount + this.symbol)}
                {this.renderBoxRow('Total', item.total + `${this.symbol}`)}
            </View>
        )
    }
    render() {
        const { data } = this.props;
        return (
            <FlatList
                data={data}
                keyExtractor={(item, index) => `${index}`}
                renderItem={this.renderItem}
            />
        )
    }
}
const styles = StyleSheet.create({
    boxLeftTxt: {
        fontFamily: appFont,
        fontSize: 16,
        flex: 1
    },
    boxRightTxt: {
        fontFamily: appFont,
        fontSize: 16
    },
    boxTxtContainer: {
        flexDirection: 'row'
    },
    boxContainer: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'red',
        flexDirection: 'column',
        marginHorizontal: 16,
        marginTop: 16
    }
})
export default InvoiceProductList;