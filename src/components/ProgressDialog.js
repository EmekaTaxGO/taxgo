import React from 'react'
import { StyleSheet, View, Modal, Text, ActivityIndicator } from 'react-native';
import { colorAccent } from '../theme/Color';

const ProgressDialog = ({ visible }) => {
    return <Modal
        animationType='fade'
        visible={visible}
        transparent={true}>
        <View style={styles.modalChild}>
            <View style={styles.card}>
                <ActivityIndicator size="small" color={colorAccent} style={{ marginLeft: 20 }} />
                <Text style={styles.progressHeader}>Please wait...</Text>
            </View>
        </View>
    </Modal>
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
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 5,
        width: "80%",
        flexDirection: 'row',
        alignItems: 'center'
    },
    progressHeader: {
        color: colorAccent,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 20
    }
})
export default ProgressDialog;