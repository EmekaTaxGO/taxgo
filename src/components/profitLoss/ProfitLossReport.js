import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { colorPrimary } from '../../theme/Color';
import ProfitLossRows from './ProfitLossRows';
class ProfitLossReport extends Component {

    renderProfit = () => {
        const { gprofit, nprofit } = this.props.report;
        return (
            <View style={styles.profitContainer}>
                <View style={styles.itemFooter}>
                    <Text style={styles.profitTxt}>GROSS PROFIT & LOSS</Text>
                    <Text style={[styles.profitTxt, { textAlign: 'right' }]}>{gprofit}</Text>
                </View>
                <View style={styles.itemFooter}>
                    <Text style={styles.profitTxt}>Net PROFIT & LOSS</Text>
                    <Text style={[styles.profitTxt, { textAlign: 'right' }]}>{nprofit}</Text>
                </View>
            </View>
        )
    }

    renderItem = ({ item, index }) => {
        const isLast = index + 1 === this.props.report.entities.length;
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemHead}>{item.label}</Text>
                <ProfitLossRows
                    rows={item.rows}
                />
                <View style={styles.itemFooter}>
                    <Text style={styles.itemFooterTxt}>Total {item.label}</Text>
                    <Text style={[styles.itemFooterTxt, { textAlign: 'right' }]}>{item.total}</Text>
                </View>
                {isLast && this.renderProfit()}
            </View>
        )
    }

    render() {
        const { report, startDate, endDate } = this.props;
        if (report === undefined) {
            return null;
        }
        return (
            <View style={styles.container}>
                <Text style={styles.headerContainer}>
                    PROFIT AND LOSS REPORT FOR PERIOD FROM {startDate} TO {endDate}
                </Text>
                <FlatList
                    data={report.entities}
                    keyExtractor={(item, index) => item.label}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        marginTop: 12
    },
    headerContainer: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        textAlign: 'center',
        backgroundColor: '#4363a880',
        fontSize: 14,
        color: 'black'
    },
    itemHead: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colorPrimary,
        fontSize: 14,
        color: 'white',
        fontSize: 16
    },
    itemFooter: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray'
    },
    profitContainer: {
        flexDirection: 'column'
    },
    itemFooterTxt: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        paddingVertical: 12,
        textTransform: 'capitalize',
        flex: 1
    },
    itemContainer: {
        flexDirection: 'column'
    },
    profitTxt: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        paddingVertical: 12,
        textTransform: 'uppercase',
        flex: 1
    }
})
export default ProfitLossReport;