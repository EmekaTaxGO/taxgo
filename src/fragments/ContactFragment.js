import React, { useLayoutEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ContactTabItem from '../components/tabs/ContactTabItem';
import { colorAccent, colorDark } from '../theme/Color';

const ContactFragment = props => {

    const onMenuPress = () => {
        props.navigation.openDrawer();
    }

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            },
            headerRight: () => {
                return <TouchableOpacity onPress={() => { }} style={styles.rightBtn}>
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
                return <AntIcon name={iconName} size={30} color={focused ? colorAccent : colorDark} />
            }
        })
        }
        tabBarOptions={{
            activeTintColor: colorAccent,
            inactiveTintColor: colorDark,
            allowFontScaling: true,
            showLabel: true,
            labelPosition: 'below-icon',
            labelStyle: { fontSize: 13, fontWeight: 'bold' },
            style: { height: 60, justifyContent: 'center', alignItems: 'center' },
            tabStyle: { alignItems: 'center', justifyContent: 'center', paddingVertical: 6 }
        }}
    >
        <Tab.Screen name='Customer' component={ContactTabItem} />
        <Tab.Screen name='Supplier' component={ContactTabItem} />
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