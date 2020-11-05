import React, { useLayoutEffect, Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, ActionSheetIOS, FlatList, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchView from '../components/SearchView';

class JournalFragment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            journals: this.createJournals()
        }
    }

    createJournals = () => {
        return [
            {
                title: 'Journal1 lkewf erwfkljer ferkljfklre jflerkjg reklgj relkgj relkgj relgk erjklg',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal2',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal3',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal4',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal5',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal6',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal7',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal8',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal9',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal10',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal11',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal12',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal13',
                count: 1000,
                date: '2020-10-06'
            },
            {
                title: 'Journal14',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal15',
                count: 1000,
                date: '2020-10-06'
            },
            {
                title: 'Journal16',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal17',
                count: 1000,
                date: '2020-10-06'
            },
            {
                title: 'Journal18',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal19',
                count: 100,
                date: '2020-10-06'
            },
            {
                title: 'Journal20',
                count: 1000,
                date: '2020-10-06'
            }
        ]
    }
    onMenuPress = () => {
        this.props.navigation.openDrawer();
    }

    onAddClick = () => {
        this.props.navigation.push('AddJournalScreen');
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

    listItem = (item, index) => {
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
                <Text style={{ fontSize: 30, color: 'white' }}>J</Text>
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
                <Text style={[styles.textStyle, { marginTop: 4 }]}>{item.count}</Text>
                <Text style={[styles.textStyle, { marginTop: 4 }]}>{item.date}</Text>
            </View>

        </View>
    }

    render() {

        return <View style={{ flex: 1 }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={q => this.setState({ query: q })}
                onCrossPress={() => { this.setState({ query: '' }) }}
                placeholder='Search Journals' />

            <FlatList
                data={this.state.journals}
                renderItem={({ item, index }) => this.listItem(item, index)}
                keyExtractor={(item, index) => index}
            />
        </View >
    }

}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    rightBtn: {
        padding: 12
    },
    textStyle: {
        fontSize: 16,
        color: 'gray',
        paddingRight: 12
    }
});
export default JournalFragment;