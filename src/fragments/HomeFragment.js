import React, { Component, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
const HomeFragment = ({ navigation }) => {




    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }, [navigation]);

    const onMenuPress = () => {
        navigation.openDrawer();
    }

    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home Fragment</Text>
    </View>
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    }
});
export default HomeFragment;