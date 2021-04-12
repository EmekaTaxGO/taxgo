import { get, isNull } from 'lodash';
import React, { Component } from 'react';
import { FlatList, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileHeader from '../components/profile/ProfileHeader';
import SettingRowItem from '../components/SettingRowItem';
import { appFontBold } from '../helpers/ViewHelper';
import deepLinkHandler from '../deeplink/DeepLinkHandler';
import Deeplink from '../deeplink/Deeplink';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeviceInfo from 'react-native-device-info';
import * as authActions from '../redux/actions/authActions';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.createSettingData()
        }
    }

    createSettingData = () => {
        const info = Platform.select({
            ios: {
                platform: 'iOS',
                version: `${DeviceInfo.getBuildNumber()}.0`
            },
            android: {
                platform: 'Android',
                version: DeviceInfo.getVersion()
            }
        });
        return [
            {
                label: 'profile settings',
                data: [
                    {
                        bgColor: '#18b3ef',
                        iconColor: 'white',
                        iconName: 'lock',
                        label: 'change password',
                        hasUnread: true,
                        hideDivider: true,
                        deeplink: Deeplink.CHANGE_PASSWORD
                    }
                ]
            },
            {
                label: 'account settings',
                data: [
                    {
                        bgColor: '#18b3ef',
                        iconColor: 'white',
                        iconName: 'supervisor-account',
                        label: 'Invoice Settings',
                        hasUnread: true,
                        deeplink: Deeplink.INVOICE_SETTINGS
                    },
                    {
                        bgColor: '#01b3b1',
                        iconColor: 'white',
                        iconName: 'supervisor-account',
                        label: 'Manage Accounts',
                        hasUnread: false,
                        hideDivider: true,
                        deeplink: Deeplink.MANAGE_ACCOUNTS
                    }
                ]
            },
            {
                label: 'payments',
                data: [
                    {
                        bgColor: '#fcb811',
                        iconColor: 'white',
                        iconName: 'stars',
                        label: 'subscriptions',
                        hasUnread: true,
                        hideDivider: true,
                        deeplink: Deeplink.SUBSCRIPTIONS
                    }
                ]
            },
            {
                label: 'other settings',
                data: [
                    {
                        bgColor: '#4682ff',
                        iconColor: 'white',
                        iconName: 'edit',
                        label: 'write us',
                        hasUnread: true,
                        hideDivider: false,
                        deeplink: Deeplink.WRITE_US
                    },
                    {
                        bgColor: '#969ebb',
                        iconColor: 'white',
                        iconName: 'thumb-up',
                        label: 'rate us',
                        hasUnread: true,
                        hideDivider: false,
                        deeplink: Deeplink.RATE_US
                    },
                    // {
                    //     bgColor: '#bf1f76',
                    //     iconColor: 'white',
                    //     iconName: 'payment',
                    //     label: 'retail xpress',
                    //     hasUnread: true,
                    //     deeplink: Deeplink.RETAIL_XPRESS
                    // },
                    {
                        bgColor: 'white',
                        iconColor: '#ee6171',
                        labelColor: '#ee6171',
                        iconName: 'power-settings-new',
                        label: 'sign out',
                        hasUnread: true,
                        hideDivider: true,
                        text: `${info.platform} v${info.version}`,
                        deeplink: Deeplink.SIGN_OUT
                    }
                ]
            }
        ]
    }

    getProfile = () => {
        const profile = get(this.props.auth, 'profile', {});
        return isNull(profile) ? {} : profile;
    }

    onItemClick = deeplink => {
        if (deepLinkHandler.canHandle(deeplink)) {
            deepLinkHandler.handleDeepLink(this.props.navigation, deeplink);
        }

    }

    renderSettingItem = ({ item, index }) => {
        // const { bgColor, iconColor, label, text, hasUnread, onPress } = this.props;
        return (
            <View style={{ flexDirection: 'column' }}>
                <AppText style={styles.section}>{item.label}</AppText>
                <FlatList
                    data={item.data}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({ item, index }) =>
                        <SettingRowItem
                            {...item}
                            onPress={() => this.onItemClick(item.deeplink)}
                        />}
                />
            </View>
        )
    }

    handleEditPress = () => {
        deepLinkHandler.handleDeepLink(this.props.navigation, Deeplink.EDIT_PROFILE);
    }
    renderHeader = () => {

        const profile = this.getProfile();
        console.log('New Profile Data: ', JSON.stringify(profile, null, 2));
        const fullName = `${profile.firstname} ${profile.lastname}`;
        return <View style={{ flexDirection: 'column' }}>
            <ProfileHeader
                name={fullName}
                image={profile.bimage}
            />
            <ProfileCard
                name={fullName}
                email={profile.email}
                address={profile.fullAddress}
                image={profile.bimage}
                onEditPress={this.handleEditPress}
            />
        </View>
    }



    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={this.renderSettingItem}
                    ListHeaderComponent={this.renderHeader}
                />
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
        fontFamily: appFontBold,
        paddingVertical: 16,
        color: 'gray',
        fontSize: 16,
        textTransform: 'uppercase'
    }
})
export default connect(
    state => ({
        auth: state.auth
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)(Profile);