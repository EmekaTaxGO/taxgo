import React from 'react';
import { View, Button, StyleSheet, useWindowDimensions } from 'react-native';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent';
import ProductStack from '../components/drawerStack/ProductStack';
import InvoiceStack from '../components/drawerStack/InvoiceStack';
import HomeStack from '../components/drawerStack/HomeStack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DRAWER_ICON_SIZE } from '../constants/appConstant';
import { colorPrimary, colorAccent } from '../theme/Color';
import InitialRender from '../components/InitialRender';
import SettingStack from '../components/drawerStack/SettingStack';
import ContactFragment from '../fragments/ContactFragment';
import ContactStack from '../components/drawerStack/ContactStack';
import JournalStack from '../components/drawerStack/JournalStack';

const HomeScreen = ({ navigation }) => {

    const dimension = useWindowDimensions();

    const drawerWidth = (7 * dimension.width) / 10;

    const Drawer = createDrawerNavigator();

    return <Drawer.Navigator
        initialRouteName='HomeFragment'
        drawerType={dimension.width > 760 ? 'permanent' : 'front'}
        overlayColor='transparent'
        drawerPosition='left'
        drawerStyle={{ backgroundColor: 'white', width: InitialRender ? 0 : drawerWidth }}
        drawerContent={DrawerContent}
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

        <Drawer.Screen name='InvoiceFragment'
            component={InvoiceStack}
            options={{
                title: 'Invoices', drawerIcon: ({ color }) =>
                    <Icon name='my-library-books' size={DRAWER_ICON_SIZE} color={color} />
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

    </Drawer.Navigator>
}
const styles = StyleSheet.create({

})
export default HomeScreen;