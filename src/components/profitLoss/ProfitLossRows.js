import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
class ProfitLossRows extends Component {

    renderDataItem = ({ item, index }) => {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemLabel}>{item.reference}-{item.ledger}</Text>
                <Text style={styles.itemTxt}>{item.amount}</Text>
            </View>
        )
    }

    render() {
        const { rows } = this.props;
        return (
            <FlatList
                data={rows}
                keyExtractor={(item, index) => `${item.id}`}
                renderItem={this.renderDataItem}
            />
        )
    }
}
const styles = StyleSheet.create({
    itemLabel: {
        fontSize: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: 'black',
        flex: 1
    },
    itemTxt: {
        fontSize: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: 'black',
        textAlign: 'right',
        flex: 1
    },
    itemContainer: {
        flexDirection: 'row',
        flex: 1,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1
    }
})
export default ProfitLossRows;