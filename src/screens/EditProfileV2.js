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

class EditProfileV2 extends Component {

    Tab = createMaterialTopTabNavigator();
    iconSize = 26;

    constructor(props) {
        super(props);
        this.state = {
            value: 1
        }
    }

    onClickBtn = () => {
        console.log('State Updated!');
        this.setState({ value: this.state.value + 1 });
    }
    render() {

        const showBusiness = this.state.value % 2 === 1;
        return (
            <TabLayout tab={this.Tab}>

                <this.Tab.Screen
                    name='General'
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='account-circle' size={this.iconSize} color={color} />
                    }}>
                    {props => <GeneralTab
                        {...props}
                        onClick={this.onClickBtn}
                    />}
                </this.Tab.Screen>

                <this.Tab.Screen
                    name='Business'
                    options={{
                        tabBarIcon: ({ focused, color }) =>
                            <Icon name='account-circle' size={this.iconSize} color={color} />

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