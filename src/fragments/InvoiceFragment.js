import React, { Component, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppTab from '../components/AppTab';
import { showSingleSelectAlert } from '../components/SingleSelectAlert';
import InvoiceList from '../components/invoices/InvoiceList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colorPrimary, colorAccent, bottomTabActiveColor, bottomTabInactiveColor, bottomTabBackgroundColor } from '../theme/Color';

class InvoiceFragment extends Component {

    _tabPressListener;
    constructor(props) {
        super(props);
    }


    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    onAddClick = () => {
        if (this.focusedTab === 'sales') {
            this.showDialogToAddSales();
        } else {
            this.showDialogToAddPurchases();
        }
    }

    launchAddInvoice = (mode = 'add', creditNote = false, invoiceType = 'sales') => {
        this.props.navigation.navigate('AddInvoiceScreen', {
            info: {
                mode: mode,
                credit_note: creditNote,
                invoice_type: invoiceType
            }
        });
    }
    showDialogToAddSales = () => {
        const items = ['Sales Invoice', 'Sales Credit Notes'];
        showSingleSelectAlert('New Sale', items,
            index => {
                console.log('Sales Added!');
                this.launchAddInvoice('add', index === 1);
            })
    }
    showDialogToAddPurchases = () => {
        const items = ['Purchase Invoice', 'Purchase Credit Notes'];
        showSingleSelectAlert('New Purchase', items,
            index => {
                this.launchAddInvoice('add', index === 1, 'purchase');
            })
    }

    _tabPressHandler = (e) => {
        console.log('Event', e);
    }

    componentWillUnmount() {
        // this.props.navigation.removeListener('tabPress', this._tabPressHandler);
        this.props.navigation.removeListener(this._tabPressListener);
    }

    componentDidMount() {
        this._tabPressListener = this.props.navigation.addListener('tabPress',
            e => {
                console.log('Event: ', e);
            });
        this.props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={this.onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            },
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick} style={{ padding: 12 }}>
                    <Icon name='add' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }


    // Tab = createBottomTabNavigator();
    render() {
        const Tab = createBottomTabNavigator();
        return <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'sales') {
                        iconName = 'receipt';
                    } else {
                        iconName = 'shopping-cart';
                    }

                    return <Icon name={iconName}
                        color={focused ? bottomTabActiveColor : bottomTabInactiveColor} size={30} />
                }
            })}
            tabBarOptions={{
                activeTintColor: colorAccent,
                inactiveTintColor: bottomTabInactiveColor,
                activeBackgroundColor: bottomTabBackgroundColor,
                inactiveBackgroundColor: bottomTabBackgroundColor,
                labelStyle: {
                    fontSize: 14
                },
                style: {
                    backgroundColor: bottomTabBackgroundColor,
                    padding: 12,
                    height: 60
                },
                tabStyle: {
                    padding: 2
                }
            }}>
            <Tab.Screen name='sales' component={InvoiceList} options={{ title: 'Sales' }} />
            <Tab.Screen name='purchase' component={InvoiceList} options={{ title: 'Purchases' }} />
        </Tab.Navigator>
    }
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    }
});
export default InvoiceFragment;