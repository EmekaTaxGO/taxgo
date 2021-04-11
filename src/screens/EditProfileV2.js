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
        const profile = get(this.props.auth, 'profile', {});
        return isNull(profile) ? {} : profile;
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
                        {...props}
                        id='Business_Tab'
                        onClick={this.onClickBtn} />}
                </this.Tab.Screen>
                <this.Tab.Screen
                    name='Accounting'
                    component={AccountingTab}
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='menu-book' size={this.iconSize} color={color} />
                    }} />
                <this.Tab.Screen
                    name='Security'
                    component={SecurityTab}
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='security' size={this.iconSize} color={color} />
                    }} />
                <this.Tab.Screen
                    name='Customize'
                    component={CustomizeTab}
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='dashboard-customize' size={this.iconSize} color={color} />
                    }} />
                <this.Tab.Screen
                    name='Subscription'
                    component={SubscriptionTab}
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='subscriptions' size={this.iconSize} color={color} />
                    }} />

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