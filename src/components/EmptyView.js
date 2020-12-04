
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

const EmptyView = ({ message, iconName }) => {

    return <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flexDirection: 'column',
        backgroundColor: 'white'
    }}>

        <Icon size={40} color='black' name={iconName} />
        <Text style={styles.text}>{message}</Text>
    </View>
}
const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: 'normal',
        color: 'black',
        marginTop: 12
    }
});
export default EmptyView;