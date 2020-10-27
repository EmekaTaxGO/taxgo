import React, { Component, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import ImageView from '../components/ImageView';
import SearchView from '../components/SearchView';

const ProductFragment = props => {

    const [query, setQuery] = useState('');
    const products = [{
        image: 'http://image.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock1',
        description: 'First Stock'

    }, {
        image: undefined,
        name: 'Stock kjldnf ewikjlf ewrfre wfrlkerwjr ferwlf ',
        itemId: 'Stock2 kjewfhr efrekj ergjktrg trkg etjker fijerjf erfg reilerjlkferj ',
        description: 'First Stock wkjdfher fre fkrekfljerk fjerf ergfioerg regjo gitrgi tr'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock3',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock4',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock5',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock234',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock234',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock234',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock234',
        description: 'First Stock'

    }, {
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        name: 'Stock',
        itemId: 'Stock234',
        description: 'First Stock'

    }];
    const onMenuPress = () => {
        props.navigation.openDrawer();
    }

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }, [props.navigation]);

    const ListItem = ({ item }) => {
        return <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',

        }}>
            <ImageView
                url={item.image}
                placeholder={require('../assets/product.png')}
                style={styles.image} />
            <View style={{
                flexDirection: 'column',
                flex: 1,
                marginStart: 16,
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                paddingVertical: 16
            }}>
                <Text>{item.name}</Text>
                <Text style={{ marginTop: 4 }}>Item :{item.itemId}</Text>
                <Text style={{ marginTop: 4 }}>Description: {item.itemId}</Text>
            </View>
        </View>
    }


    return <View style={{ flex: 1 }}>
        <SearchView
            value={query}
            onChangeQuery={q => setQuery(q)}
            onCrossPress={() => { setQuery('') }} />
        <FlatList
            style={{ flex: 1 }}
            data={products}
            keyExtractor={(row, index) => `${index}`}
            renderItem={({ item }) => <ListItem item={item} />} />
    </View>
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'lightgray',
        marginStart: 16
    }
});
export default ProductFragment;