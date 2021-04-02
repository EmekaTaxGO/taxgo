import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EditProfileScreen from './EditProfileScreen';
import { tabBackgroundColor, tabIndicatorColor, tabSelectedColor } from '../theme/Color';
import { appFont, appFontBold } from '../helpers/ViewHelper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TabLayout from '../components/materialTabs/TabLayout';
import GeneralTab from '../components/profile/GeneralTab';
import BusinessTab from '../components/profile/BusinessTab';
import AccountingTab from '../components/profile/AccountingTab';
import SecurityTab from '../components/profile/SecurityTab';
import CustomizeTab from '../components/profile/CustomizeTab';
import SubscriptionTab from '../components/profile/SubscriptionTab';

class EditProfileV2 extends Component {

    Tab = createMaterialTopTabNavigator();
    iconSize = 26;
    render() {

        return (
            <TabLayout tab={this.Tab}>

                <this.Tab.Screen
                    name='General'
                    component={GeneralTab}
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='account-circle' size={this.iconSize} color={color} />
                    }} />

                <this.Tab.Screen
                    name='Business'
                    component={BusinessTab}
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='account-circle' size={this.iconSize} color={color} />
                    }} />
                <this.Tab.Screen
                    name='Accounting'
                    component={AccountingTab}
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='account-circle' size={this.iconSize} color={color} />
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
export default EditProfileV2;