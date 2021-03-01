import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import CardView from 'react-native-cardview';
import { colorPrimary } from '../../theme/Color';
import BalanceSheetData from './BalanceSheetData';

class BalanceSheetRows extends Component {


    renderRowDetails = (item) => {
        return (
            <CardView
                cardElevation={4}
                cornerRadius={4}
                style={styles.detailCard}>
                <View style={styles.detailHeader}>
                    <Text style={styles.detailHeaderTxt}>Leg. A/c</Text>
                    <Text style={[styles.detailHeaderTxt, { textAlign: 'center' }]}>Leg. Name</Text>
                    <Text style={[styles.detailHeaderTxt, { textAlign: 'right' }]}>Amount</Text>
                </View>
                <BalanceSheetData
                    data={item.data}
                />
            </CardView>
        )
    }

    onArrowPress = (item, index) => {
        const expanded = item.expanded ? item.expanded : false;
        const newItem = {
            ...item,
            expanded: !expanded
        };

        const newRows = [...this.props.rows];
        newRows.splice(index, 1, newItem);
        this.props.onChange(newRows);
    }

    renderRowItem = ({ item, index }) => {
        const expanded = item.expanded ? item.expanded : false;
        const total = Number(item.total).toFixed(2);
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={styles.arrowContainer}>
                    <View style={styles.container}>
                        <Text style={styles.label}>{item.label}</Text>
                        <Text style={styles.value}>Total {item.label}: {total}</Text>
                    </View>
                    <TouchableOpacity style={styles.arrowBox} onPress={() => this.onArrowPress(item, index)}>
                        <Icons name={expanded ? 'expand-less' : 'expand-more'} size={30} />
                    </TouchableOpacity>
                </View>
                {expanded && this.renderRowDetails(item)}
            </View>

        )
    }
    render() {
        const { rows } = this.props;
        return (
            <FlatList
                data={rows}
                keyExtractor={(item, index) => item.label}
                renderItem={this.renderRowItem}
            />
        )
    }
}
const styles = StyleSheet.create({
    arrowBox: {
        padding: 12
    },
    label: {
        fontSize: 14,
        color: 'gray'
    },
    value: {
        fontSize: 14,
        color: 'gray',
        fontWeight: 'bold'
    },
    container: {
        paddingVertical: 12,
        paddingStart: 12,
        flexDirection: 'column',
        flex: 1
    },
    arrowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    detailCard: {
        marginHorizontal: 12,
        marginVertical: 12,
        backgroundColor: 'white'
    },
    detailHeader: {
        flexDirection: 'row',
        backgroundColor: colorPrimary
    },
    detailHeaderTxt: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 4,
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold'
    }
})
export default BalanceSheetRows;