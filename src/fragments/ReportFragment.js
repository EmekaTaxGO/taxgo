import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, FlatList, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CardView from 'react-native-cardview';
import InAppIcon from '../components/InAppIcon';
import AppText from '../components/AppText';


class ReportFragment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.createReportItems()
        }
    }

    createReportItems = () => {
        return [
            {
                icon: 'file-invoice-dollar',
                iconType: 'FontAwesome5',
                color: '#95daf0',
                background: '#e9f9fe',
                title: 'VAT/GST',
                description: 'VAT on Sale/Purchase'
            },
            {
                icon: 'receipt',
                iconType: 'FontAwesome5',
                color: '#8393f4',
                background: '#e1e4fc',
                title: 'Balance Sheet',
                description: 'Financial Statement'
            },
            {
                icon: 'line-chart',
                iconType: 'FontAwesome',
                color: '#e9cc71',
                background: '#fdf9ec',
                title: 'Profit & Loss',
                description: 'Income Statement'
            },
            {
                icon: 'balance-scale',
                iconType: 'FontAwesome',
                color: '#dd9893',
                background: '#e5e2e0',
                title: 'Trial Balance',
                description: 'Balance of Ledgers'
            },
            {
                icon: 'user-tag',
                iconType: 'FontAwesome5',
                color: '#a5dfad',
                background: '#eaf8ec',
                title: 'Aged Debtors',
                description: undefined
            },
            {
                icon: 'hand-holding-usd',
                iconType: 'FontAwesome5',
                color: '#bcda57',
                background: '#f4f9e4',
                title: 'Aged Creditors',
                description: undefined
            }
        ]
    }

    componentDidMount() {
        this.configHeader();
    }
    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    configHeader = () => {
        this.props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={this.onMenuPress} style={styles.menu}>
                    <MaterialIcons name='menu' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }
    onItemPress = (index) => {
        let screen = '';
        switch (index) {
            case 0:
                screen = 'TaxReturnListScreen';
                break;
            case 1:
                screen = 'BalanceSheetScreen';
                break;
            case 2:
                screen = 'ProfitLossReportScreen';
                break;
            case 3:
                screen = 'TrialBalanceScreen';
                break;
            case 4:
                screen = 'AgeDebtorScreen';
                break;
            case 5:
                screen = 'AgeCreditorScreen';
                break;
            default:
                screen = 'AgeDebtorScreen';
                break;
        }
        this.props.navigation.push(screen);
    }
    renderItem = (item, index) => {
        const count = this.state.items.length;
        const hasRightSpace = index % 2 == 1;
        const isLastTwo = index + 1 === count || index + 2 == count;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.card,
            {
                marginRight: hasRightSpace ? 15 : 0,
                marginBottom: isLastTwo ? 15 : 0
            }]}>
            <TouchableOpacity style={{
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center'
            }}
                onPress={() => this.onItemPress(index)}>
                <View style={{
                    backgroundColor: item.background,
                    borderRadius: 8,
                    paddingHorizontal: 18,
                    paddingVertical: 12,
                    marginBottom: 12
                }}>
                    <InAppIcon
                        icon={item.icon}
                        iconType={item.iconType}
                        color={item.color}
                        size={34}
                    />
                </View>
                <AppText style={{ color: 'black', fontSize: 16, textAlign: 'center' }}>{item.title}</AppText>
                <AppText style={{ color: 'gray', marginTop: 2, textAlign: 'center' }}>{item.description}</AppText>
            </TouchableOpacity>
        </CardView>
    }


    render() {
        return <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                style={{ flex: 1 }}
                keyExtractor={(item, index) => item.title}
                data={this.state.items}
                numColumns={2}
                renderItem={({ item, index }) => this.renderItem(item, index)}
            />
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    card: {
        width: '100%',
        aspectRatio: 16 / 16,
        flex: 1,
        marginLeft: 15,
        marginTop: 15,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    }
})
export default ReportFragment;