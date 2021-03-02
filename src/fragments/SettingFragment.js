import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Text, SectionList } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { rColor } from '../theme/Color';
const SettingFragment = props => {

    let i = 0;
    const form = [
        {
            title: {
                label: 'Profile Settings',
                description: 'Manage information about your company, logo and password'
            },
            data: [
                {
                    icon: 'edit',
                    label: 'Edit Profile'
                },
                {
                    icon: 'lock-outline',
                    label: 'Change Password'
                }
            ]
        },
        {
            title: {
                label: 'Subscription & Payment',
                description: 'Tax Go gives you one month of free trial and upgrade plans at minimum of your budget.'
            },
            data: [
                {
                    icon: 'supervisor-account',
                    label: 'Merchant Account'
                },
                {
                    icon: 'wallet-membership',
                    label: 'Upgrade Plan'
                }
            ]
        },
        {
            title: {
                label: 'Account Settings',
                span: '**comming soon',
                description: 'Manage information about your account, default terms & conditions, default email messages and choose from multiple invoice style.'
            },
            data: [
                {
                    icon: 'dashboard-customize',
                    label: 'Customize'
                },
                {
                    icon: 'menu-book',
                    label: 'Invoice Style'
                },
                {
                    icon: 'payment',
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
        return <View style={{
            flexDirection: 'column',
            borderBottomColor: '#fdfdfd',
            borderBottomWidth: 1
        }}>
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#6c757e',
                flex: 1,
                alignItems: 'center'
            }}>
                <Text style={styles.headerTitle}>
                    {section.title.label}
                </Text>
                <Text style={{
                    color: '#b9aa4c',
                    paddingStart: 4
                }}>{section.title.span}</Text>
            </View>
            <Text style={{
                paddingHorizontal: 6,
                paddingVertical: 8
            }}>
                {section.title.description}</Text>

        </View>
    }
    const onItemPress = item => {
        let screen = null;
        switch (item.icon) {
            case 'edit':
                screen = 'EditProfileScreen';
                break;
            case 'lock-outline':
                screen = 'ChangePasswordScreen';
                break;
            case 'supervisor-account':
                screen = 'MerchantAccountScreen';
                break;
            case 'wallet-membership':
                screen = 'UpgradePlanScreen';
                break;
            default:
                break;
        }
        if (screen !== null) {
            props.navigation.push(screen);
        }
    }
    const Item = ({ item, index }) => {
        const iconColor = rColor[i++ % rColor.length];
        return <TouchableOpacity style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
        }} onPress={() => onItemPress(item)}>

            <Icon name={item.icon} size={30} color={iconColor} style={{ padding: 16 }} />

            <View style={{
                flex: 1,
                flexDirection: 'row',
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                paddingVertical: 16,
                marginStart: 8
            }}>
                <Text style={{ fontSize: 18, color: iconColor }}>{item.label}</Text>
            </View>
        </TouchableOpacity>
    }


    return <SectionList
        sections={form}
        keyExtractor={item => item.label}
        renderSectionHeader={({ section }) => <SectionHeader section={section} />}
        renderItem={({ item, index }) => <Item item={item} index={index} />}
    />
}
const styles = StyleSheet.create({
    menu: {
        paddingLeft: 12
    },
    headerTitle: {
        paddingHorizontal: 4,
        paddingVertical: 8,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
export default SettingFragment;