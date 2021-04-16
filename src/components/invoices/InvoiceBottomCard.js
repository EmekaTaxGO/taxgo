import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colorPrimary, dividerColor } from '../../theme/Color';
import AppText from '../AppText';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appFontBold } from '../../helpers/ViewHelper';
class InvoiceBottomCard extends Component {


    render() {
        const { payable, onSavePress, onBreakdownPress } = this.props;
        return (
            <CardView
                style={styles.container}
                cardElevation={4}
                cornerRadius={6}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <AppText style={styles.payableTxt}>Payable Amount: $555.56</AppText>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row', alignItems: 'center',
                            paddingVertical: 2
                        }}
                        onPress={onBreakdownPress}>
                        <Icon name='expand-more' size={30} color='gray' />
                        <AppText style={styles.breakdownTxt}>Breakdown</AppText>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={onSavePress}>
                    <AppText style={{ color: 'white', fontSize: 22 }}>Save</AppText>
                </TouchableOpacity>
            </CardView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderTopColor: dividerColor,
        borderTopWidth: 0,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        paddingBottom: 40,
        paddingTop: 12,
        alignItems: 'center'
    },
    saveBtn: {
        borderRadius: 4,
        backgroundColor: colorPrimary,
        paddingHorizontal: 20,
        paddingVertical: 6
    },
    payableTxt: {
        fontSize: 18,
        fontFamily: appFontBold
    },
    breakdownTxt: {
        fontSize: 14,
        color: 'gray'
    }
})
export default InvoiceBottomCard;