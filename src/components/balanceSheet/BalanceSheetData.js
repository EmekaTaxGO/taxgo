import React, { Component } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
class BalanceSheetData extends Component {

    renderData = ({ item, index }) => {
        const amount = Number(item.amount).toFixed(2);
        return (
            <View style={styles.container}>
                <Text style={styles.dataTxt}>{item.reference}</Text>
                <Text style={[styles.dataTxt, { textAlign: 'center' }]}>{item.ledger}</Text>
                <Text style={[styles.dataTxt, { textAlign: 'right', fontWeight: 'bold' }]}>{amount}</Text>
            </View>
        )
    }
    render() {
        const { data } = this.props;
        return (
            <FlatList
                data={data}
                keyExtractor={(item, index) => item.id}
                renderItem={this.renderData}
            />
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    dataTxt: {
        fontSize: 14,
        flex: 1,
        color: 'black',
        paddingHorizontal: 6,
        paddingVertical: 4
    }
})
export default BalanceSheetData;