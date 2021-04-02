import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appFont, appFontBold } from '../../helpers/ViewHelper';
import AppText from '../AppText';
import Divider from '../Divider';
class ProfileCard extends Component {

    imagePath = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80';
    render() {
        const { name, email, address, onEditPress } = this.props;
        return (
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'column',
                paddingHorizontal: 16
            }}>

                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 20
                }}>
                    <Image
                        style={styles.image}
                        source={{ uri: this.imagePath }}
                    />
                    <View style={{ flexDirection: 'column', justifyContent: 'center', paddingStart: 16 }}>
                        <AppText style={styles.name}>{name}</AppText>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1 }}>
                            <Icon name='email' size={22} color='gray' />
                            <AppText style={styles.email}>{email}</AppText>
                        </View>
                    </View>
                </View>
                <Divider />
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 8,
                    alignItems: 'center'
                }}>
                    <Icon name='location-on' size={30} color='#9aa1bb' />
                    <AppText style={styles.locationTxt}>{address}</AppText>
                </View>

                <TouchableOpacity style={styles.editBtn} onPress={onEditPress}>
                    <Icon name='edit' size={20} color='white' />
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    name: {
        fontSize: 20,
        color: 'black',
        fontFamily: appFontBold
    },
    email: {
        fontFamily: appFont,
        color: 'gray',
        fontSize: 16,
        paddingStart: 12
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    locationTxt: {
        fontSize: 16,
        color: 'black',
        fontFamily: appFontBold,
        paddingStart: 6
    },
    editBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#1ab3f4',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        left: 50,
        top: 10
    }
})
export default ProfileCard;