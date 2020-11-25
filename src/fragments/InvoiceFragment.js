import React, { Component, useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppTab from '../components/AppTab';
import { showSingleSelectAlert } from '../components/SingleSelectAlert';
import SalesView from '../components/invoices/SalesView';

class InvoiceFragment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 'sales'
        }
    }

    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    onAddClick = () => {
        if (this.state.selected === 'sales') {
            this.showDialogToAddSales();
        } else {
            this.showDialogToAddPurchases();
        }
    }
    showDialogToAddSales = () => {
        const items = ['Sales Invoice', 'Sales Credit Notes'];
        showSingleSelectAlert('New Sale', items,
            index => {
                console.log('Sales Added!');
                // props.navigation.push('AddCustomerScreen',
                //     { contact: index === 0 ? 'customer' : 'supplier' });
            })
    }
    showDialogToAddPurchases = () => {
        const items = ['Purchase Invoice', 'Purchase Credit Notes'];
        showSingleSelectAlert('New Purchase', items,
            index => {
                console.log('Purchases Added!');
                // props.navigation.push('AddCustomerScreen',
                //     { contact: index === 0 ? 'customer' : 'supplier' });
            })
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
        return <View style={{
            flex: 1,
            backgroundColor: 'white'
        }
        }>
            <View style={{ flexDirection: 'row' }}>
                <AppTab label='Sales'
                    isSelected={this.state.selected === 'sales'}
                    onSelected={() => this.setState({ selected: 'sales' })} />

                <AppTab
                    label='Purchase'
                    isSelected={this.state.selected === 'purchases'}
                    onSelected={() => this.setState({ selected: 'purchases' })} />

            </View>
            <View style={{ flex: 1 }}>
                <SalesView type={this.state.selected} />
            </View>

        </View >
    }
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    }
});
export default InvoiceFragment;