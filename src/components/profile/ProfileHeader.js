import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appFontBold } from '../../helpers/ViewHelper';
import AppText from '../AppText';

class ProfileHeader extends Component {

    imagePath = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80';
    render() {
        const { onPressProfile, name } = this.props;
        return (
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                paddingVertical: 16,
                alignItems: 'center'
            }}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <AppText style={styles.title}>Profile</AppText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 2 }}>
                        <View style={styles.accBubble}>
                            <Icon name='star' color='white' size={18} />
                        </View>
                        <AppText style={styles.subtitle}>Premium Account</AppText>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={onPressProfile}
                    style={styles.profileSelector}>
                    <Image
                        source={{ uri: this.imagePath }}
                        style={styles.smallImg}
                    />
                    <AppText style={styles.smallName}>{name}</AppText>
                    <Icon name='keyboard-arrow-down' size={30} color='gray' />
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: 'black',
        fontFamily: appFontBold
    },
    subtitle: {
        fontSize: 16,
        color: '#b6b8c7',
        fontFamily: appFontBold,
        paddingStart: 4
    },
    profileSelector: {
        flexDirection: 'row',
        borderRadius: 40,
        elevation: 2,
        paddingHorizontal: 6,
        paddingVertical: 6,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    smallImg: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
    smallName: {
        fontFamily: appFontBold,
        fontSize: 16,
        paddingStart: 6,
        paddingEnd: 2
    },
    accBubble: {
        backgroundColor: '#f3b928',
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default ProfileHeader;