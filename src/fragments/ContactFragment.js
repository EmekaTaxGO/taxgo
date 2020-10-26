import React, { useLayoutEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const ContactFragment = props => {

    const onMenuPress = () => {
        props.navigation.openDrawer();
    }

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }, [props.navigation]);

    return <View style={{ flex: 1 }}>

    </View>
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    }
});
export default ContactFragment;