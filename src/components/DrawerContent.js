const { View, Image, StyleSheet, Text, ScrollView, ColorPropType, Alert, TouchableHighlight } = require("react-native")
import React, { useState } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { colorAccent, colorPrimary } from '../theme/Color';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { clearData, AUTH_DATA, clearAll } from '../services/UserStorage';
import { DrawerActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppImage from './AppImage';
import { get, isNull } from 'lodash';
import deepLinkHandler from '../deeplink/DeepLinkHandler';
import Deeplink from '../deeplink/Deeplink';

const DrawerContent = props => {


    let profile = get(props, 'profile', {});
    profile = isNull(profile) ? {} : profile;
    const renderHeader = () => {
        return <View style={{
            height: 200,
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: colorAccent
        }}>
            <View>

                <View style={styles.profileImageContainer}>
                    <AppImage
                        url={profile.bimage}
                        style={styles.profileImage}
                        placeholderColor='white'
                        placeholder='person'
                    />
                </View>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={onEditClick}>
                    <Icon name='edit' size={16} color='black' />
                </TouchableOpacity>
            </View>
            <Text style={styles.name}>{profile.firstname} {profile.lastname}</Text>
            <Text style={styles.email}>{profile.email}</Text>
        </View>
    }

    const onEditClick = () => {
        props.navigation.dispatch(DrawerActions.closeDrawer());
        setTimeout(() => {
            deepLinkHandler.handleDeepLink(props.navigation, Deeplink.EDIT_PROFILE);
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

    return <SafeAreaView style={{ flex: 1, backgroundColor: colorAccent }}>
        {renderHeader()}
        <DrawerContentScrollView
            contentContainerStyle={{ paddingVertical: 0 }}>
            <View style={styles.container} >
                <View style={{ backgroundColor: 'white' }}>

                    <DrawerItemList
                        {...props}
                        style={{ backgroundColor: 'black' }}
                    />
                </View>
            </View>
        </DrawerContentScrollView>

        {renderFooter()}
    </SafeAreaView>

};
const styles = StyleSheet.create({
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'gray'
    },
    profileImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#80808040',
        marginLeft: 12
    },
    editBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 70
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
    },
    imageContainer: {
        alignItems: 'flex-start'
    }
})
export default DrawerContent;