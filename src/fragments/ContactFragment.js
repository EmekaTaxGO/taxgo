import React, { useLayoutEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, ActionSheetIOS } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ContactTabItem from '../components/tabs/CustomerTabItem';
import { colorAccent, colorDark } from '../theme/Color';
import CustomerTabItem from '../components/tabs/CustomerTabItem';
import SupplierTabItem from '../components/tabs/SupplierTabItem';
import { showSingleSelectAlert } from '../components/SingleSelectAlert';
import BottomTabLayout from '../components/materialTabs/BottomTabLayout';

const ContactFragment = props => {

    const onMenuPress = () => {
        props.navigation.openDrawer();
    }

    const onAddClick = () => {
        const items = ['Customer', 'Suppliers'];
        showSingleSelectAlert('Choose Contact to add', items,
            index => {
                launchAddContact(index === 0 ? 'customer' : 'supplier');
            })
    }

    const launchAddContact = (contactType, contact = null) => {
        props.navigation.push('AddCustomerScreen', {
            contactType: contactType,
            contact: contact
        });
    }

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            },
            headerRight: () => {
                return <TouchableOpacity onPress={onAddClick} style={styles.rightBtn}>
                    <Icon name='add' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }, [props.navigation]);

    const Tab = createBottomTabNavigator();

    return (
        <BottomTabLayout tab={Tab}>
            <Tab.Screen
                name='Customer'
                component={CustomerTabItem}
                options={{
                    title: 'Customer',
                    tabBarIcon: ({ focused, color, size }) =>
                        <Icon name='people-outline' color={color} size={size} />
                }} />
            <Tab.Screen
                name='Supplier'
                component={SupplierTabItem}
                options={{
                    title: 'Supplier',
                    tabBarIcon: ({ focused, color, size }) =>
                        <Icon name='storefront' color={color} size={size} />
                }} />
        </BottomTabLayout>


    )
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    rightBtn: {
        paddingRight: 12
    }
});
export default ContactFragment;