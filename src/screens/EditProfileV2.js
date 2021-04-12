import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TabLayout from '../components/materialTabs/TabLayout';
import GeneralTab from '../components/profile/GeneralTab';
import BusinessTab from '../components/profile/BusinessTab';
import AccountingTab from '../components/profile/AccountingTab';
import SecurityTab from '../components/profile/SecurityTab';
import CustomizeTab from '../components/profile/CustomizeTab';
import SubscriptionTab from '../components/profile/SubscriptionTab';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../redux/actions/authActions';
import { get, isNull } from 'lodash';
import { Buffer } from 'buffer';

class EditProfileV2 extends Component {

    Tab = createMaterialTopTabNavigator();
    iconSize = 26;

    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            profile: this.getProfile()
        }
    }

    onClickBtn = () => {
        console.log('State Updated!');
        this.setState({ value: this.state.value + 1 });
    }

    getProfile = () => {
        var profile = get(this.props.auth, 'profile', {});
        var profile = isNull(profile) ? {} : profile;
        return {
            ...profile,
            company: Buffer.from(profile.company).toString(),
            address1: Buffer.from(profile.address1).toString(),
            address2: Buffer.from(profile.address2).toString(),
            defaultmail: Buffer.from(profile.defaultmail).toString(),
            defaultTerms: Buffer.from(profile.defaultTerms).toString(),

        }
    }

    onSubmitForm = () => {
        console.log('Form Submitting...');
    }
    onChangeForm = profile => {
        const newProfile = {
            ...this.state.profile,
            ...profile
        };
        this.setState({ profile: newProfile }, () => {
            console.log('New Form: ', JSON.stringify(newProfile, null, 2));
        });
    }
    render() {
        const { profile } = this.state;
        return (
            <TabLayout tab={this.Tab}>

                <this.Tab.Screen
                    name='General'
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='account-circle' size={this.iconSize} color={color} />
                    }}>
                    {props => <GeneralTab
                        profile={profile}
                        onSubmit={this.onSubmitForm}
                        onChange={this.onChangeForm}
                    />}
                </this.Tab.Screen>

                <this.Tab.Screen
                    name='Business'
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='business' size={this.iconSize} color={color} />

                    }}>
                    {props => <BusinessTab
                        profile={profile}
                        onSubmit={this.onSubmitForm}
                        onChange={this.onChangeForm} />}
                </this.Tab.Screen>

                <this.Tab.Screen
                    name='Accounting'
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='menu-book' size={this.iconSize} color={color} />
                    }}>
                    {props => <AccountingTab
                        profile={profile}
                        onSubmit={this.onSubmitForm}
                        onChange={this.onChangeForm} />}
                </this.Tab.Screen>

                <this.Tab.Screen
                    name='Security'
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='security' size={this.iconSize} color={color} />
                    }}>
                    {props => <SecurityTab
                        profile={profile}
                        onSubmit={this.onSubmitForm}
                        onChange={this.onChangeForm} />}
                </this.Tab.Screen>

                <this.Tab.Screen
                    name='Customize'
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='dashboard-customize' size={this.iconSize} color={color} />
                    }}>
                    {props => <CustomizeTab
                        profile={profile}
                        onSubmit={this.onSubmitForm}
                        onChange={this.onChangeForm} />}
                </this.Tab.Screen>

                <this.Tab.Screen
                    name='Subscription'
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='subscriptions' size={this.iconSize} color={color} />
                    }}>
                    {props => <SubscriptionTab
                        profile={profile}
                        onSubmit={this.onSubmitForm}
                        onChange={this.onChangeForm} />}
                </this.Tab.Screen>

            </TabLayout>
        )
    }
}
export default connect(
    state => ({
        auth: state.auth
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)(EditProfileV2);