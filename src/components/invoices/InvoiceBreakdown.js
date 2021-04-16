import React, { Component } from 'react';
import { Modal, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { dividerColor, transparentColor } from '../../theme/Color';
import AppText from '../AppText';
import { appFont, appFontBold } from '../../helpers/ViewHelper';
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
        const { visible, onPressOutside } = this.props;
        return (
            <Modal
                animationType='slide'
                visible={visible}
                transparent={true}>
                <TouchableOpacity style={styles.modalChild}
                    onPress={onPressOutside}>
                    <TouchableWithoutFeedback>
                        <View style={styles.bottomSheet}>

                            {this.renderRow('sub total', '233323')}
                            {this.renderRow('total vat', '233345')}
                            {this.renderRow('total discount', '-1233')}
                            {this.renderRow('total payable amount', '78923')}
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    modalChild: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
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