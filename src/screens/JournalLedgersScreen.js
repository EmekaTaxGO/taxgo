import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import SearchView from '../components/SearchView';
import { TouchableOpacity } from 'react-native-gesture-handler';
class JournalLedgersScreen extends Component {


    constructor(props) {
        super(props);
        const ledgers = this.createLedgers();
        this.state = {
            query: '',
            ledgers: ledgers,
            filteredLedgers: ledgers
        }
    }

    createLedgers = () => {
        return [
            {
                title: '4450-Sales-Products'
            },
            {
                title: '6780-Sales-Products'
            },
            {
                title: '12f0-Sales-Products'
            },
            {
                title: 'uu80-Sales-Products'
            },
            {
                title: '99c0-Sales-Products'
            }
        ]
    }

    onItemClick = (item) => {
        const { params } = this.props.route;
        params.onLedgerSelected(item);
        this.props.navigation.goBack();
    }

    renderListItem = (item, index) => {
        return <TouchableOpacity onPress={() => this.onItemClick(item)}>
            <View style={{ marginLeft: 16 }}>
                <Text style={{
                    flex: 1,
                    paddingVertical: 18,
                    color: 'black',
                    fontSize: 14,
                    borderBottomWidth: 1,
                    borderColor: 'lightgray',
                }}>{item.title}</Text>
            </View>
        </TouchableOpacity>
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

    render() {
        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={this.onSearchQueryChange}
                onCrossPress={() => this.onSearchQueryChange('')}
                placeholder='Search...' />
            <FlatList
                style={{ flex: 1 }}
                keyExtractor={(item, index) => `${index}`}
                data={this.state.filteredLedgers}
                renderItem={({ item, index }) => this.renderListItem(item, index)}
            />
        </View>
    }
}
const styles = StyleSheet.create({

});
export default JournalLedgersScreen;