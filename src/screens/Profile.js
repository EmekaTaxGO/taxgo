import { get } from 'lodash';
import React, { Component } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileHeader from '../components/profile/ProfileHeader';
import SettingRowItem from '../components/SettingRowItem';
import { appFontBold } from '../helpers/ViewHelper';
import deepLinkHandler from '../deeplink/DeepLinkHandler';
import Deeplink from '../deeplink/Deeplink';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: {
                name: 'Divan Raj',
                email: 'delaney.daugh@mckenna.net',
                address: '421 Lesly River Suite 478, Australia'
            },
            data: this.createSettingData()
        }
    }

    createSettingData = () => {
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
                    {
                        bgColor: '#bf1f76',
                        iconColor: 'white',
                        iconName: 'payment',
                        label: 'retail xpress',
                        hasUnread: true,
                        deeplink: Deeplink.RETAIL_XPRESS
                    },
                    {
                        bgColor: 'white',
                        iconColor: '#ee6171',
                        labelColor: '#ee6171',
                        iconName: 'power-settings-new',
                        label: 'sign out',
                        hasUnread: true,
                        hideDivider: true,
                        text: 'iOS v1.0',
                        deeplink: Deeplink.SIGN_OUT
                    }
                ]
            }
        ]
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
                    keyExtractor={(index) => `${index}`}
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

        const profile = get(this.state, 'profile', {});
        return <View style={{ flexDirection: 'column' }}>
            <ProfileHeader
                name={profile.name}
            />
            <ProfileCard
                name={profile.name}
                email={profile.email}
                address={profile.address}
                onEditPress={this.handleEditPress}
            />
        </View>
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(index) => `${index}`}
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
export default Profile;