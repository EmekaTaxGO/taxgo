import { get } from 'lodash';
import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { appFont } from '../../helpers/ViewHelper';
import Store from '../../redux/Store';
class InvoiceProductItem extends Component {

    symbol = ' ' + get(Store.getState().auth, 'profile.countryInfo.symbol');

    renderBoxRow = (label, value) => {
        return (
            <View style={styles.boxTxtContainer}>
                <Text style={styles.boxLeftTxt}>{label}</Text>
                <Text style={styles.boxRightTxt}>{value}</Text>
            </View>
        )
    }

    render() {
        const { item, isLast } = this.props;
        const style = { marginBottom: isLast ? 12 : 0 };
        return (
            <View style={[styles.boxContainer, style]}>
                {this.renderBoxRow(item.description + '@' + item.quantity, item.costprice + this.symbol)}
                {this.renderBoxRow('Vat@' + item.incomeTax, item.incomeTaxAmount + this.symbol)}
                {this.renderBoxRow('Discount@' + item.percentage, item.discount + this.symbol)}
                {this.renderBoxRow('Total', item.total + `${this.symbol}`)}
            </View>
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
export default InvoiceProductItem;