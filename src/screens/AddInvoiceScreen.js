import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { tabSelectedColor, colorPrimary } from '../theme/Color'

class AddInvoiceScreen extends Component {
    constructor(props) {
        super();
        this.state = {
            selectedTab: 'supplier'
        }
    }

    componentDidMount() {
        const { info } = this.props.route.params;
        console.log('Info: ', info);
    }

    isEditMode = () => {
        return this.props.route.params.info.mode === 'update';
    }
    isCreditNote = () => {
        return this.props.route.params.info.credit_note === true;
    }
    isSalesInvoice = () => {
        const type = this.props.route.params.info.invoice_type;
        return type === 'sales';
    }

    getIcon = (icon, iconType, color) => {
        if (iconType === undefined) {
            return <MaterialIcon name={icon} size={24} color={color} />
        }
        switch (iconType) {
            case 'FontAwesome5Icon':
                return <FontAwesome5Icon name={icon} size={24} color={color} />;
            default:
                return <MaterialIcon name={icon} size={24} color={color} />;
        }

    }

    selectTab = (tabName) => {
        this.setState({ selectedTab: tabName });
    }

    tabComponent = (title, icon, iconType, selected, onPress) => {
        return <TouchableHighlight style={{
            flex: 1,
            backgroundColor: colorPrimary,
            paddingVertical: 6,
            borderBottomWidth: selected ? 2 : 0,
            borderBottomColor: tabSelectedColor,
        }}
            onPress={onPress}
            underlayColor={colorPrimary}>
            <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {this.getIcon(icon, iconType, selected ? tabSelectedColor : 'white')}
                <Text style={{
                    color: selected ? tabSelectedColor : 'white',
                    fontSize: 14
                }}>{title}</Text>
            </View>
        </TouchableHighlight>
    }
    renderSupplierContainer = () => {
        return <ScrollView style={{ flex: 1, flexDirection: 'column' }}>

        </ScrollView>
    }
    renderProductContainer = () => {
        return <View style={{ flex: 1, flexDirection: 'column' }}>

        </View>
    }
    render() {
        const selected = this.state.selectedTab;
        const customerLabel = this.isSalesInvoice() ? 'Supplier' : 'Customer';
        return <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        {this.tabComponent(customerLabel, 'user-circle', 'FontAwesome5Icon',
                            selected === 'supplier', () => this.selectTab('supplier'))}

                        {this.tabComponent('Product', 'local-offer', undefined,
                            selected === 'product', () => this.selectTab('product'))}
                    </View>
                    {selected === 'supplier' ? this.renderSupplierContainer() : null}
                    {selected === 'product' ? this.renderProductContainer() : null}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
};
const styles = StyleSheet.create({

});
export default AddInvoiceScreen;