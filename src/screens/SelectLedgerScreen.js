const { Component } = require("react");

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SearchView from '../components/SearchView';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

class SelectLedgerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            ledgers: this.createLedgers()
        }
    }

    createLedgers = () => {
        return [
            {
                category: 'Bank Assets',
                group: 'Assets'
            },
            {
                category: 'Bank Assets2',
                group: 'Assets2'
            },
            {
                category: 'Bank Assets3',
                group: 'Assets3'
            },
            {
                category: 'Bank Assets4',
                group: 'Assets4'
            },
            {
                category: 'Bank Assets5',
                group: 'Assets5'
            },
            {
                category: 'Bank Assets6',
                group: 'Assets6'
            },
        ];
    }

    componentDidMount() {

    }
    onItemClicked = (item) => {
        const { params } = this.props.route;
        params.onLedgerSelected(item);
        this.props.navigation.goBack();
    }

    listItem = (item) => {
        return <TouchableOpacity onPress={() => { this.onItemClicked(item) }}>
            <Text style={{
                flex: 1,
                borderBottomWidth: 1,
                borderColor: 'lightgray',
                marginLeft: 16,
                paddingRight: 16,
                paddingVertical: 18,
                fontSize: 16,
                color: 'gray'
            }}>
                {item.category}
            </Text>
        </TouchableOpacity>
    }

    render() {
        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SearchView
                value={this.state.query}
                onChangeQuery={q => this.setState({ query: q })}
                onCrossPress={() => { this.setState({ query: '' }) }}
                placeholder='Search...' />
            <FlatList
                data={this.state.ledgers}
                renderItem={({ item }) => this.listItem(item)}
                keyExtractor={(item, index) => `${index}`}
            />
        </View>
    }
}
const styles = StyleSheet.create({

});
export default SelectLedgerScreen;