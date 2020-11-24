import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import SearchView from '../components/SearchView';
import Icon from 'react-native-vector-icons/MaterialIcons';

class UserFragment extends Component {
    constructor(props) {
        super(props);
        const users = this.createUsers();
        this.state = {
            query: '',
            users: users,
            filteredUsers: users
        }
    }

    createUsers = () => {
        return [
            {
                id: 1,
                state: 'suspended',
                email: 'taxgosupport@gmail1.com',
                name: 'Samraj Saundarajan1'
            },
            {
                email: 'taxgosupport@gmail2.com',
                name: 'Samraj Saundarajan2',
                id: 2,
                state: 'suspended',
            },
            {
                email: 'taxgosupport@gmail3.com',
                name: 'Samraj Saundarajan3',
                id: 3,
                state: 'active',
            },
            {
                email: 'taxgosupport@gmail4.com',
                name: 'Samraj Saundarajan4',
                id: 4,
                state: 'suspended',
            },
            {
                email: 'taxgosupport@gmail5.com',
                name: 'Samraj Saundarajan5',
                id: 5,
                state: 'active',
            },
            {
                email: 'taxgosupport@gmail6.com',
                name: 'Samraj Saundarajan6',
                id: 6,
                state: 'susended',
            }
        ]
    }

    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }
    onAddClick = () => {
        this.props.navigation.navigate('UpdateUserScreen', {
            title: 'Add User'
        })
    }
    onSearchQueryChange = q => {
        let filteredUsers = null;
        if (q.length === 0) {
            filteredUsers = this.state.users;
        } else {
            filteredUsers = this.state.users.filter((value) =>
                value.name.toLowerCase().indexOf(q.toLowerCase()) > -1)
        }
        this.setState({ query: q, filteredUsers: [...filteredUsers] });
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

    onItemPress = (item) => {
        this.props.navigation.navigate('UpdateUserScreen', {
            title: 'Edit User'
        });
    }

    getStateColor = (item) => {
        switch (item.state) {
            case 'suspended':
                return 'red';
            case 'active':
                return 'green';
            default:
                return 'gray';
        }
    }

    renderListItem = (item, index) => {
        const stateColor = this.getStateColor(item);
        return <TouchableOpacity onPress={() => this.onItemPress(item)}>
            <View style={{
                flexDirection: 'row',
                marginLeft: 16,
                alignItems: 'center',
                borderColor: 'lightgray',
                borderBottomWidth: 1,
                paddingVertical: 12,
                paddingRight: 12
            }}>
                <View style={{
                    flex: 1, justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <Text style={{ color: 'gray' }}>{item.name} - {item.id}</Text>
                    <Text style={{ marginTop: 4 }}>{item.email}</Text>
                </View>
                <Text style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: stateColor,
                    borderRadius: 12,
                    textTransform: 'capitalize',
                    color: 'white',
                    fontSize: 11
                }}>{item.state}</Text>
            </View>
        </TouchableOpacity>

    }

    render() {
        return <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column' }}>

            <SearchView
                value={this.state.query}
                onChangeQuery={this.onSearchQueryChange}
                onCrossPress={() => this.onSearchQueryChange('')}
                placeholder='Search...' />
            <FlatList
                style={{ flex: 1 }}
                data={this.state.filteredUsers}
                keyExtractor={(item, index) => `${item.id}`}
                renderItem={({ item, index }) => this.renderListItem(item, index)}
            />
        </View>
    }
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    rightBtn: {
        padding: 12
    }
})
export default UserFragment;