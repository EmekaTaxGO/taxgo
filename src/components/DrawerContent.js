const { View, Image, StyleSheet, Text, ScrollView, ColorPropType, Alert, TouchableHighlight } = require("react-native")
import React, { useState } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { colorAccent, colorPrimary } from '../theme/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { clearData, AUTH_DATA, clearAll } from '../services/UserStorage';
import { DrawerActions } from '@react-navigation/native';

const DrawerContent = props => {

    const { profile } = props;
    const fName = profile ? profile.firstname : '';
    const lName = profile ? profile.lastname : '';
    const email = profile ? profile.email : '';
    const renderHeader = () => {
        return <TouchableHighlight
            onPress={onHeaderClick}
            underlayColor={colorPrimary}>
            <View style={{
                width: '100%',
                height: 200,
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: colorAccent
            }}>
                <Image
                    source={{ uri: 'https://tse4.mm.bing.net/th?id=OIP.kblJvBOiO-XnU0fkjB1VyQHaFv&pid=Api&P=0&w=221&h=172' }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{fName} {lName}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>
        </TouchableHighlight>

    }

    const onHeaderClick = () => {
        props.navigation.dispatch(DrawerActions.closeDrawer());
        setTimeout(() => {
            props.navigation.push('EditProfileScreen');
        }, 200);
    }

    const onSignOutPress = () => {
        Alert.alert('Are you sure', 'Do you really want to Sign Out?', [
            {
                text: 'NO'
            },
            {
                text: 'YES',
                style: 'default',
                onPress: async () => {
                    await clearAll();
                    props.navigation.replace('LoginScreen');
                }
            }
        ])
    }
    const renderFooter = () => {
        return <TouchableOpacity style={{
            width: '100%',
            backgroundColor: colorAccent,
            flexDirection: 'row',
            padding: 12,
            alignItems: 'center'
        }}
            onPress={onSignOutPress}>
            <FeatherIcon name='power' size={30} color='white' />
            <Text style={{ fontSize: 16, color: 'white', paddingStart: 12 }}>Sign Out</Text>
        </TouchableOpacity>
    }

    return <DrawerContentScrollView>
        <View style={styles.container} >
            {renderHeader()}
            <DrawerItemList {...props} style={{ backgroundColor: 'black' }} />
            {renderFooter()}
        </View>
    </DrawerContentScrollView>

};
const styles = StyleSheet.create({
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginLeft: 12
    },
    name: {
        fontSize: 16,
        color: 'white',
        paddingStart: 12,
        paddingTop: 12
    },
    email: {
        fontSize: 14,
        color: 'white',
        paddingStart: 12,
        paddingTop: 2
    },
    container: {
        flexDirection: 'column'
    }
})
export default DrawerContent;