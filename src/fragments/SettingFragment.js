import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Text, SectionList } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
const SettingFragment = props => {

    const form = [
        {
            head: {
                label: 'Profile',
                description: 'Manage information about your company, logo and password'
            },
            fields: [
                {
                    icon: '',
                    label: 'Edit Profile'
                },
                {
                    icon: '',
                    label: 'Change Password'
                }
            ]
        },
        {
            head: {
                label: 'Subscription & Payment',
                description: 'Tax Go gives you one month of free trial and upgrade plans at minimum of your budget.'
            },
            fields: [
                {
                    icon: '',
                    label: 'Merchant Account'
                },
                {
                    icon: '',
                    label: 'Upgrade Plan'
                }
            ]
        },
        {
            head: {
                label: 'Account',
                span: '**comming soon',
                description: 'Manage information about your account, default terms & conditions, default email messages and choose from multiple invoice style.'
            },
            fields: [
                {
                    icon: '',
                    label: 'Customize'
                },
                {
                    icon: '',
                    label: 'Invoice Style'
                },
                {
                    icon: '',
                    label: 'Retail Xpress'
                }
            ]
        }
    ];
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


    const SectionHeader = ({ section }) => {
        console.log('Section');
        return <View style={{ flexDirection: 'column' }}>
            <Text style={styles.headerTitle}>
                {section.head.label}
            </Text>

        </View>
    }
    const Item = ({ item }) => {
        console.log('Item');
        return <View style={{ flex: 1, flexDirection: 'row' }}>
            <Icon name={item.icon} size={20} color='black' />
            <Text>{item.label}</Text>
        </View>
    }
    const SectionItem = ({ item }) => {
        console.log('Item')
        return <FlatList
            style={{ flex: 1, flexDirection: 'row' }}
            data={item.fields}
            keyExtractor={({ item, index }) => `${item + index}`}
            renderItem={({ item }) => <Item item={item} />}
        />
    }

    console.log('Length', form.length);

    return <SectionList
        sections={form}
        keyExtractor={({ item, index }) => `${item + index}`}
        renderSectionHeader={({ section }) => <SectionHeader section={section} />}
        renderItem={({ item }) => <Item item={item} />} />
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    headerTitle: {
        flex: 1,
        paddingHorizontal: 4,
        paddingVertical: 12
    }
});
export default SettingFragment;