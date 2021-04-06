import React, { Component, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showSingleSelectAlert } from '../components/SingleSelectAlert';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colorAccent, bottomTabActiveColor, bottomTabInactiveColor, bottomTabBackgroundColor } from '../theme/Color';
import SalesCNList from '../components/invoices/SalesCNList';
import SalesInvoiceList from '../components/invoices/SalesInvoiceList';
import PurchaseInvoiceList from '../components/invoices/PurchaseInvoiceList';
import PurchaseCNList from '../components/invoices/PurchaseCNList';

class PurchaseInvoiceFragment extends Component {

    _tab = 'purchase';
    constructor(props) {
        super(props);
    }


    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    onAddClick = () => {
        this.showDialogToAddPurchase();
    }

    launchAddInvoice = (mode = 'add', creditNote = false, invoiceType = 'purchase') => {
        this.props.navigation.navigate('AddInvoiceScreen', {
            info: {
                mode: mode,
                credit_note: creditNote,
                invoice_type: invoiceType
            }
        });
    }
    showDialogToAddPurchase = () => {
        const items = ['Purchase Invoice', 'Purchase Credit Notes'];
        showSingleSelectAlert('New Purchase', items,
            index => {
                this.launchAddInvoice('add', index === 1);
            })
    }

    componentWillUnmount() {

    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={this.onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            },
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick} style={{ paddingRight: 12 }}>
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
                        iconName = 'shopping-cart';
                    } else {
                        iconName = 'description';
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
            <Tab.Screen name='purchase'
                component={PurchaseInvoiceList}
                options={{ title: 'Purchase' }}
                listeners={{ tabPress: e => this._tab = 'purchase' }} />

            <Tab.Screen name='c_note'
                component={PurchaseCNList}
                options={{ title: 'C.Note' }}
                listeners={{ tabPress: e => this._tab = 'c_note' }} />
        </Tab.Navigator>
    }
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    }
});
export default PurchaseInvoiceFragment;