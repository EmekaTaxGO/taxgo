import React, { Component, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
const HomeFragment = ({ navigation }) => {

    const gridItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: 'dashboard',
            color: '#0f659b'
        },
        {
            id: 'accounts',
            title: 'Accounts',
            icon: 'account-balance',
            color: '#20344d'
        },
        {
            id: 'sales',
            title: 'Sales',
            icon: 'point-of-sale',
            color: '#1f1c49'
        },
        {
            id: 'purchase',
            title: 'Purchase',
            icon: 'shopping-basket',
            color: '#ff4459'
        },
        {
            id: 'product',
            title: 'Product/Service',
            icon: 'miscellaneous-services',
            color: '#008766'
        },
        {
            id: 'contacts',
            title: 'Contacts',
            icon: 'contacts',
            color: '#0ebdf6'
        },
        {
            id: 'journals',
            title: 'Journals',
            icon: 'line-weight',
            color: '#2a2b2d'
        },
        {
            id: 'ledgers',
            title: 'Ledgers',
            icon: 'account-circle',
            color: '#f13510'
        },
        {
            id: 'banking',
            title: 'Banking',
            icon: 'account-balance',
            color: '#ffbb53'
        },
        {
            id: 'retailXpress',
            title: 'Retail Xpress',
            icon: 'groups',
            color: '#883cd2'
        },
        {
            id: 'taxes',
            title: 'Taxes',
            icon: 'timeline',
            color: '#fd9268'
        },
        {
            id: 'news',
            title: 'News',
            icon: 'import-contacts',
            color: '#1cb487'
        }
    ]

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => {
                return <TouchableOpacity onPress={onMenuPress} style={styles.menu}>
                    <Icon name='menu' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }, [navigation]);

    const onMenuPress = () => {
        navigation.openDrawer();
    }
    const onGridItemClick = item => {

    }

    const GridItem = ({ item }) => {
        return <View style={{
            width: '100%',
            aspectRatio: 16 / 9,
            flex: 1,
            flexDirection: 'column',
            margin: 6
        }}>
            <TouchableOpacity style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                padding: 6,
                backgroundColor: item.color,
                borderRadius: 12
            }}>
                {/* onPress={() => onGridItemClick(item)} */}

                <Icon size={30} color='white' name={item.icon} />
                <Text style={{
                    fontSize: 16,
                    color: 'white',
                    marginTop: 6
                }}>{item.title}</Text>
            </TouchableOpacity>

        </View>
    }

    return <View style={{
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 6
    }}>
        <FlatList
            style={{ flex: 1 }}
            data={gridItems}
            keyExtractor={(row, index) => `${index}`}
            renderItem={({ item }) => <GridItem item={item} />}
            numColumns={2}
            showsVerticalScrollIndicator={false}
        />
    </View>
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    }
});
export default HomeFragment;