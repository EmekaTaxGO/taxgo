import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Text, Picker } from 'react-native';
import SearchView from '../components/SearchView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colorWhite, colorAccent } from '../theme/Color';
import MyLedgerTabItem from '../components/tabs/MyLedgerTabItem';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import DefaultLedgerTabItem from '../components/tabs/DefaultLedgerTabItem';
import BottomTabLayout from '../components/materialTabs/BottomTabLayout';

class LedgerFragment extends Component {
    constructor(props) {
        super(props);
        const ledgers = this.createLedgers();
        this.state = {
            query: '',
            ledgers: ledgers,
            filteredLedgers: ledgers,
            ledgerTypes: ['Default', 'Custom'],
            selectedLedgerType: ''
        }
    }

    createLedgers = () => {
        return [
            {
                title: 'Title1',
                investment: 'INV1',
                type: 'assets'
            },
            {
                title: 'Title2',
                investment: 'INV2',
                type: 'assets2'
            },
            {
                title: 'Title3',
                investment: 'INV3',
                type: 'assets3'
            },
            {
                title: 'Title4',
                investment: 'INV4',
                type: 'assets4'
            },
            {
                title: 'Title5',
                investment: 'INV5',
                type: 'assets5'
            },
            {
                title: 'Title6',
                investment: 'INV6',
                type: 'assets6'
            }
        ]
    }

    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }
    onAddClick = () => {
        this.props.navigation.push('AddLedgerScreen', {
            ledger: null,
            onLedgerUpdated: () => { }
        });
    }

    setTitle = (title) => {
        this.props.navigation.setOptions({ title });
    }
    onSearchQueryChange = q => {
        let filteredLedgers = null;
        if (q.length === 0) {
            filteredLedgers = this.state.ledgers;
        } else {
            filteredLedgers = this.state.ledgers.filter((value) =>
                value.title.toLowerCase().indexOf(q.toLowerCase()) > -1)
        }
        this.setState({ query: q, filteredLedgers: [...filteredLedgers] });
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={this.onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            },
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick} style={styles.rightBtn}>
                    <Icon name='add' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }

    renderListItem = (item, index) => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: 'blue',
                marginLeft: 16,
                marginVertical: 12,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Ionicons name='ios-pencil-sharp' color='white' size={30} />
            </View>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                borderBottomWidth: 1,
                marginLeft: 18,
                borderColor: 'lightgray',
                paddingVertical: 12
            }}>
                <Text style={styles.textStyle}>{item.title}</Text>
                <Text style={[styles.textStyle, { marginTop: 4 }]}>{item.investment}</Text>
                <Text style={[styles.textStyle, { marginTop: 4 }]}>{item.type}</Text>
            </View>
        </View>
    }


    render() {
        const Tab = createBottomTabNavigator();
        return (
            <BottomTabLayout tab={Tab}>
                <Tab.Screen name='myledger'
                    component={MyLedgerTabItem}
                    options={{
                        title: 'Custom',
                        tabBarIcon: ({ color, size }) =>
                            <FA5Icon name='user' size={22} color={color} />
                    }}
                    listeners={{ tabPress: e => this.setTitle('My Ledger') }}
                />

                <Tab.Screen name='defaultledger'
                    component={DefaultLedgerTabItem}
                    options={{
                        title: 'Default',
                        tabBarIcon: ({ color, size }) =>
                            <FA5Icon name='user-tag' size={22} color={color} />
                    }}
                    listeners={{ tabPress: e => this.setTitle('Default Ledger') }}
                />
            </BottomTabLayout>
        )
    }
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    rightBtn: {
        paddingRight: 12
    }
})
export default LedgerFragment;