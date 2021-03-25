import { get } from 'lodash';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../AppText';
import timeHelper from '../../helpers/TimeHelper';
import { H_DATE_FORMAT } from '../../constants/appConstant';
class InvoicePaymentInfo extends Component {


    render() {
        const { item } = this.props;
        const accNum = get(item, 'bankInf.accnum');
        return (
            <View style={{ flexDirection: 'row' }}>
                <AppText style={styles.leftText}>{accNum}</AppText>
                <AppText style={[styles.leftText, { textAlign: 'center' }]}>{item.paidmethod}</AppText>
                <AppText style={[styles.leftText, { textAlign: 'center' }]}>{item.amount}</AppText>
                <AppText style={[styles.leftText, { textAlign: 'right' }]}>{timeHelper.format(item.date, H_DATE_FORMAT)}</AppText>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    leftText: {
        textAlign: 'left',
        color: 'black',
        fontSize: 14,
        paddingVertical: 4,
        flex: 1
    }
})
export default InvoicePaymentInfo;