import React, { Component } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import { dividerColor } from '../../theme/Color';
import AppText from '../AppText';
import { appFontBold } from '../../helpers/ViewHelper';
import BottomSheet from '../BottomSheet';
class InvoiceBreakdown extends Component {


    renderRow = (label, value) => {
        return (
            <View style={{
                flexDirection: 'row',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderBottomColor: dividerColor,
                borderBottomWidth: 1
            }}>
                <AppText style={styles.rowLabel}>{label}</AppText>
                <AppText style={styles.rowValue}>{value}</AppText>
            </View>
        )
    }
    render() {
        const { visible, onPressOutside, total, vat, discount, payable } = this.props;
        return (
            <BottomSheet
                visible={visible}
                onPressOutside={onPressOutside}>
                <View style={styles.bottomSheet}>
                    {this.renderRow('sub total', total)}
                    {this.renderRow('total vat', vat)}
                    {this.renderRow('total discount', discount)}
                    {this.renderRow('total payable amount', payable)}
                </View>
            </BottomSheet>
        )
    }
}
const styles = StyleSheet.create({
    rowLabel: {
        flex: 1,
        color: 'black',
        fontFamily: appFontBold,
        fontSize: 18,
        textTransform: 'capitalize'
    },
    rowValue: {
        color: 'black',
        fontSize: 20
    },
    bottomSheet: {
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingTop: 12,
        paddingBottom: Platform.select({ ios: 40, android: 12 })
    }
})
export default InvoiceBreakdown;