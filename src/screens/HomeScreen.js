import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent';
import ProductStack from '../components/drawerStack/ProductStack';
import HomeStack from '../components/drawerStack/HomeStack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DRAWER_ICON_SIZE } from '../constants/appConstant';
import { colorAccent } from '../theme/Color';
import InitialRender from '../components/InitialRender';
import SettingStack from '../components/drawerStack/SettingStack';
import ContactStack from '../components/drawerStack/ContactStack';
import JournalStack from '../components/drawerStack/JournalStack';
import LedgerStack from '../components/drawerStack/LedgerStack';
import UserStack from '../components/drawerStack/UserStack';
import BankStack from '../components/drawerStack/BankStack';
import SalesInvoiceStack from '../components/drawerStack/SalesInvoiceStack';
import PurchaseInvoiceStack from '../components/drawerStack/PurchaseInvoiceStack';

import * as authActions from '../redux/actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class HomeScreen extends Component {

    dimension = Dimensions.get('window');

    drawerWidth = (7 * this.dimension.width) / 10;




    componentDidMount() {
        const { authActions } = this.props;
        authActions.getProfile();
    }

    render() {
        const Drawer = createDrawerNavigator();
        return <Drawer.Navigator
            initialRouteName='HomeFragment'
            drawerType={this.dimension.width > 760 ? 'permanent' : 'front'}
            overlayColor='transparent'
            drawerPosition='left'
            drawerStyle={{ backgroundColor: 'white', width: InitialRender ? 0 : this.drawerWidth }}
            drawerContent={DrawerContent}
            keyboardDismissMode='on-drag'
            detachInactiveScreens
            drawerContentOptions={{
                activeTintColor: colorAccent,
                inactiveTintColor: 'black'
            }}
            screenOptions={{
                // headerStyle: { backgroundColor: colorPrimary },
                // headerTintColor: colorWhite,
                // headerTitleStyle: { fontWeight: '400' }

            }}>

            <Drawer.Screen name='HomeFragment'
                component={HomeStack}
                options={{
                    title: 'Home', drawerIcon: ({ color }) =>
                        <Icon name='dashboard' size={DRAWER_ICON_SIZE} color={color} />
                }} />
            <Drawer.Screen name='ProductFragment'
                component={ProductStack}
                options={{
                    title: 'Product & Services', drawerIcon: ({ color }) =>
                        <Icon name='miscellaneous-services' size={DRAWER_ICON_SIZE} color={color} />
                }} />

            <Drawer.Screen name='SalesInvoiceFragment'
                component={SalesInvoiceStack}
                options={{
                    title: 'Sales Invoice', drawerIcon: ({ color }) =>
                        <Icon name='point-of-sale' size={DRAWER_ICON_SIZE} color={color} />
                }} />
            <Drawer.Screen name='PurchaseInvoiceFragment'
                component={PurchaseInvoiceStack}
                options={{
                    title: 'Purchase Invoice', drawerIcon: ({ color }) =>
                        <Icon name='shopping-cart' size={DRAWER_ICON_SIZE} color={color} />
                }} />



            <Drawer.Screen name='SettingFragment'
                component={SettingStack}
                options={{
                    title: 'Settings', drawerIcon: ({ color }) =>
                        <Icon name='settings' size={DRAWER_ICON_SIZE} color={color} />
                }} />
            <Drawer.Screen name='ContactFragment'
                component={ContactStack}
                options={{
                    title: 'Contacts', drawerIcon: ({ color }) =>
                        <Icon name='contacts' size={DRAWER_ICON_SIZE} color={color} />
                }} />
            <Drawer.Screen name='JournalFragment'
                component={JournalStack}
                options={{
                    title: 'Journals', drawerIcon: ({ color }) =>
                        <Ionicons name='journal' size={DRAWER_ICON_SIZE} color={color} />
                }} />
            <Drawer.Screen name='LedgerFragment'
                component={LedgerStack}
                options={{
                    title: 'Ledger', drawerIcon: ({ color }) =>
                        <Ionicons name='ios-pencil-sharp' size={DRAWER_ICON_SIZE} color={color} />
                }} />
            <Drawer.Screen name='BankFragment'
                component={BankStack}
                options={{
                    title: 'Banking', drawerIcon: ({ color }) =>
                        <MaterialCommunityIcon name='bank' size={DRAWER_ICON_SIZE} color={color} />
                }} />
            <Drawer.Screen name='UserFragment'
                component={UserStack}
                options={{
                    title: 'Users/Employees', drawerIcon: ({ color }) =>
                        <EntypoIcon name='users' size={DRAWER_ICON_SIZE} color={color} />
                }} />

        </Drawer.Navigator>
    }
}
const styles = StyleSheet.create({

})
export default connect(
    state => ({
        auth: state.auth
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)(HomeScreen);