import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { colorAccent } from '../theme/Color'


const FullScreenError = ({ tryAgainClick }) => {
    return <View style={styles.container}>
        <Icon name='error' size={40} color={colorAccent} />
        <Text style={styles.errorText}>Something went wrong, Try again.</Text>
        <TouchableOpacity style={styles.tryAgain} onPress={tryAgainClick} >
            <View>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>Try Again</Text>
            </View>
        </TouchableOpacity>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    errorText: {
        fontSize: 14,
        color: '#000000',
        marginTop: 8
    },
    tryAgain: {
        backgroundColor: colorAccent,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 4,
        marginTop: 20
    }
})
export default FullScreenError;