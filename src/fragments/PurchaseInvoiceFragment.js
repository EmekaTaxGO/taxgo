import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showSingleSelectAlert } from '../components/SingleSelectAlert';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colorAccent, bottomTabActiveColor, bottomTabInactiveColor, bottomTabBackgroundColor } from '../theme/Color';
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
        this.showDialogToAddPurchases();
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

    showDialogToAddPurchases = () => {
        const items = ['Purchase Invoice', 'Purchase Credit Notes'];
        showSingleSelectAlert('New Purchase', items,
            index => {
                this.launchAddInvoice('add', index === 1, 'purchase');
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
                return <TouchableOpacity onPress={this.onAddClick} style={{ padding: 12 }}>
                    <Icon name='add' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }

    render() {
        const Tab = createBottomTabNavigator();
        return <Tab.Navigator
            screenOptions={({ route }) => ({

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'purchase') {
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

            <Tab.Screen name='C.Note'
                component={PurchaseCNList}
                options={{ title: 'c_note' }}
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