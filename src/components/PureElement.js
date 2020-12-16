import React from 'react';
const { PureComponent } = require("react");

import CardView from 'react-native-cardview';
import { StyleSheet, View, Text } from 'react-native';

class PureElement extends PureComponent {

    render() {
        const { invoiceno, type, total } = this.props.item;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text>{invoiceno}</Text>
                    <Text>{type}</Text>
                    <Text>Total: {total}</Text>
                </View>

            </View>
        </CardView>
    }
}
const styles = StyleSheet.create({
    hiddenCard: {
        marginHorizontal: 8,
        marginVertical: 12,
        flex: 1
    }
});
export default PureElement;