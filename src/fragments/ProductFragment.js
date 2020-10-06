import React, { Component, useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

const ProductFragment = ({ navigation }) => {




    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerLeft: () => {
    //             return <TouchableOpacity onPress={onMenuPress} style={styles.menu}>
    //                 <Icon name='menu' size={30} color='white' />
    //             </TouchableOpacity>
    //         }
    //     })
    // }, [navigation]);

    const onMenuPress = () => {
        navigation.openDrawer();
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }, [navigation]);


    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Product Fragment</Text>
    </View>
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    }
});
export default ProductFragment;