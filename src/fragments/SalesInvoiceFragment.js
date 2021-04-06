import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showSingleSelectAlert } from '../components/SingleSelectAlert';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SalesCNList from '../components/invoices/SalesCNList';
import SalesInvoiceList from '../components/invoices/SalesInvoiceList';
import BottomTabLayout from '../components/materialTabs/BottomTabLayout';

class SalesInvoiceFragment extends Component {

    _tab = 'sales';
    constructor(props) {
        super(props);
    }


    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    onAddClick = () => {
        this.showDialogToAddSales();
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
        return (
            <BottomTabLayout tab={Tab}>
                <Tab.Screen name='sales'
                    component={SalesInvoiceList}
                    options={{
                        title: 'Sales',
                        tabBarIcon: ({ focused, color, size }) =>
                            <Icon name='point-of-sale' color={color} size={size} />
                    }}
                    listeners={{ tabPress: e => this._tab = 'sales' }}
                />

                <Tab.Screen name='c_note'
                    component={SalesCNList}
                    options={{
                        title: 'C.Note',
                        tabBarIcon: ({ focused, color, size }) =>
                            <Icon name='description' color={color} size={size} />
                    }}
                    listeners={{ tabPress: e => this._tab = 'c_note' }} />
            </BottomTabLayout>
        )
    }
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    }
});
export default SalesInvoiceFragment;