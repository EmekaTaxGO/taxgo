import React, { Component } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import CardView from 'react-native-cardview';
import BalanceSheetRows from './BalanceSheetRows';
import { colorPrimary } from '../../theme/Color';

class BalanceSheet extends Component {

    onChangeRows = (newRows, index) => {
        const newSheets = [...this.props.sheet];
        const newSheet = {
            ...newSheets[index],
            rows: newRows
        };
        newSheets.splice(index, 1, newSheet);
        this.props.onChange(newSheets);
    }
    renderSheetItem = ({ item, index }) => {
        return (
            <View style={styles.container}>
                <Text style={styles.headerTxt}>{item.label}</Text>
                <CardView
                    cardElevation={4}
                    cornerRadius={6}
                    style={styles.card}>
                    <BalanceSheetRows
                        rows={item.rows}
                        onChange={newRows => this.onChangeRows(newRows, index)}
                    />
                    <Text style={styles.totalTxt}>Total {item.label}: {item.total}</Text>
                </CardView>
            </View>
        )
    }

    render() {
        const { sheet } = this.props;
        return (
            <FlatList
                keyExtractor={(item, index) => item.label}
                data={sheet}
                renderItem={this.renderSheetItem}
            />
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column'
    },
    headerTxt: {
        fontSize: 16,
        color: 'white',
        backgroundColor: 'gray',
        paddingHorizontal: 17,
        paddingVertical: 12
    },
    card: {
        marginHorizontal: 16,
        marginVertical: 12
    },
    totalTxt: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: colorPrimary,
        color: 'black',
        textTransform: 'capitalize'
    }
})
export default BalanceSheet;