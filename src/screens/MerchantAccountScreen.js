import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';

class MerchantAccountScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            merchants: this.getMerchants()
        }
    }

    getMerchants = () => {
        return [
            {
                id: '1',
                tag: 'A',
                email: 'abc@gmail.com',
                description: 'Something'
            },
            {
                id: '2',
                tag: 'B',
                email: 'abc@gmail.com',
                description: 'Something'
            },
            {
                id: '3',
                tag: 'C',
                email: 'abc@gmail.com',
                description: 'Something'
            },
            {
                id: '4',
                tag: 'D',
                email: 'abc@gmail.com',
                description: 'Something'
            },
            {
                id: '5',
                tag: 'E',
                email: 'abc@gmail.com',
                description: 'Something'
            }
        ];
    }
    onAddClick = () => {
        console.log('On Merchant Add Click!');
    }
    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick}
                    style={{ padding: 12 }}>
                    <Icon name='plus-a' size={20} color='white' />
                </TouchableOpacity>
            }
        })
    }

    merchantItem = row => {
        console.log('Data', JSON.stringify(row));
        return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{
                fontSize: 24,
                paddingHorizontal: 24,
                paddingVertical: 12
            }}>{row.tag}</Text>
            <View style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: 'lightgray'
            }}>
                <Text>{row.email}</Text>
                <Text style={{ marginTop: 4, color: 'gray' }}>{row.description}</Text>
            </View>
        </View>
    }

    render() {
        return <View style={{ flex: 1 }}>
            <FlatList
                style={{ flex: 1 }}
                data={this.state.merchants}
                keyExtractor={row => row.id}
                renderItem={({ item }) => this.merchantItem(item)}
            />
        </View>
    }
}
const styles = StyleSheet.create({

});
export default MerchantAccountScreen;