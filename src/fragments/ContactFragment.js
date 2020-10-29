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

const ContactFragment = props => {

    const onMenuPress = () => {
        props.navigation.openDrawer();
    }

    const onAddClick = () => {
        const items = ['Customer', 'Suppliers'];
        showSingleSelectAlert('Choose Contact to add', items,
            index => {
                props.navigation.push('AddCustomerScreen',
                    { contact: index === 0 ? 'customer' : 'supplier' });
            })
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

    return <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                const iconName = route.name === 'Customer' ? 'user' : 'addusergroup';
                return <AntIcon name={iconName} size={30} color={focused ? colorAccent : 'gray'} />
            }
        })
        }
        tabBarOptions={{
            activeTintColor: colorAccent,
            inactiveTintColor: 'gray',
            allowFontScaling: true,
            showLabel: true,
            labelPosition: 'below-icon',
            labelStyle: { fontSize: 13, fontWeight: 'bold' },
            style: { height: 60, justifyContent: 'center', alignItems: 'center' },
            tabStyle: { alignItems: 'center', justifyContent: 'center', paddingVertical: 6 }
        }}
    >
        <Tab.Screen name='Customer' component={CustomerTabItem} />
        <Tab.Screen name='Supplier' component={SupplierTabItem} />
    </Tab.Navigator>
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    rightBtn: {
        padding: 12
    }
});
export default ContactFragment;