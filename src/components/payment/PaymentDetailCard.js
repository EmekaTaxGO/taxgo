import React, { Component } from 'react'
import { StyleSheet, View, Modal, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colorAccent } from '../../theme/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { isEmpty } from '../../helpers/Utils';

class PaymentDetailCard extends React.PureComponent {

    renderRow = (label, value, textColor = 'black') => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: 4
        }}>
            <Text style={{ fontSize: 17, flex: 1, textAlign: 'right', color: textColor, paddingEnd: 8, fontWeight: 'bold' }}>{label}</Text>
            <Text style={{ fontSize: 17, flex: 1, color: textColor, paddingStart: 8 }}>{!isEmpty(value) ? value : '-'}</Text>
        </View>
    }
    render() {
        const { visible, payment, onCrossPress } = this.props;
        return <Modal
            animationType='slide'
            visible={visible}
            transparent={true}>
            <View style={styles.modalChild}>
                <View style={styles.card}>
                    <TouchableOpacity style={{
                        marginTop: 4,
                        marginRight: 4,
                        padding: 8,
                        alignSelf: 'flex-end'
                    }}
                        onPress={onCrossPress}>
                        <MaterialCommunityIcons name='close-circle' color='gray' size={30} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 30 }} />
                    {this.renderRow('Date:', payment.date)}
                    {this.renderRow('Total:', payment.total, 'blue')}
                    {this.renderRow('Outstanding:', payment.outstanding, 'red')}
                    {this.renderRow('Amount Paid:', payment.amountpaid)}
                    {this.renderRow('Reference:', payment.reference,)}

                </View>
            </View>
        </Modal >
    }
}
const styles = StyleSheet.create({
    modalChild: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    card: {
        backgroundColor: "white",
        borderRadius: 5,
        width: "80%",
        flexDirection: 'column',
        paddingBottom: 16
    },
    progressHeader: {
        color: colorAccent,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 20
    }
})
export default PaymentDetailCard;