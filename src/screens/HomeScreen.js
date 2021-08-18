import React, { Component } from 'react';
import { StyleSheet, Dimensions, Linking, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent';
import ProductStack from '../components/drawerStack/ProductStack';
import DashboardStack from '../components/drawerStack/DashboardStack';
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
import ReportStack from '../components/drawerStack/ReportStack';
import { appFont } from '../helpers/ViewHelper';
import messaging from '@react-native-firebase/messaging';

class HomeScreen extends Component {

    dimension = Dimensions.get('window');

    drawerWidth = (7 * this.dimension.width) / 10;

    unsubscribeMessage;
    componentDidMount() {
        const { authActions } = this.props;
        authActions.getProfile();
        Linking.addEventListener('url', this.handleOpenURL)
        this.checkDeeplink()
        unsubscribeMessage = messaging().onMessage(async remoteMessage => {
            console.log('New FCM Message', JSON.stringify(remoteMessage));
        })
    }

    componentWillUnmount() {
        unsubscribeMessage();
    }

    async checkDeeplink() {
        const url = await Linking.getInitialURL()
        if (url != null) {
            this.navigate(url)
        }
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL)
    }

    handleOpenURL = (event) => {
        console.log('Url: ', event);
        this.navigate(event.url)
    }

    navigate = (url) => {
        const routeName = url.split('://')[1].split('?')[0]
        if (routeName != 'home') {
            Alert.alert('Can\'t open this link')
        }
    }

    render() {
        const Drawer = createDrawerNavigator();
        return <Drawer.Navigator
            initialRouteName='HomeFragment'
            drawerType={this.dimension.width > 760 ? 'permanent' : 'front'}
            drawerPosition='left'
            drawerStyle={{ backgroundColor: 'white', width: InitialRender ? 0 : this.drawerWidth }}
            drawerContent={DrawerContent}
            keyboardDismissMode='on-drag'
            detachInactiveScreens
            drawerContentOptions={{
                activeTintColor: colorAccent,
                inactiveTintColor: 'black',
                profile: this.props.auth.profile,
                labelStyle: {
                    fontFamily: appFont,
                    fontSize: 15
                }
            }}
            screenOptions={{
            }}>

            <Drawer.Screen name='Dashboard'
                component={DashboardStack}
                options={{
                    title: 'Dashboard', drawerIcon: ({ color }) =>
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
            <Drawer.Screen name='ReportFragment'
                component={ReportStack}
                options={{
                    title: 'Report', drawerIcon: ({ color }) =>
                        <MaterialCommunityIcon name='file-document-edit-outline' size={DRAWER_ICON_SIZE} color={color} />
                }} />

            {/* <Drawer.Screen name='UserFragment'
                component={UserStack}
                options={{
                    title: 'Users/Employees', drawerIcon: ({ color }) =>
                        <EntypoIcon name='users' size={DRAWER_ICON_SIZE} color={color} />
                }} /> */}

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