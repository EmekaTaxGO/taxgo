import React from 'react';
import { useEffect } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colorPrimary } from '../theme/Color';
import AppText from '../components/AppText';
import { appFontBold } from '../helpers/ViewHelper';
import { CALCULATOR_STORE_URL, COUNTRY_TAX_DEEPLINK } from '../constants/appConstant';
import { log, showToast } from '../components/Logger';
import Store from '../redux/Store';

const TaxgoServices = ({ navigation }) => {

    const handleOpenURL = (event) => {
        navigate(event.url)
    }
    const checkDeeplinkFlow = async () => {
        const deeplinkURL = await Linking.getInitialURL()
        if (deeplinkURL != null) {
            //When app is launched from deeplink
            navigate(deeplinkURL)
            return
        }
        //User Launch Handling

    }

    useEffect(() => {
        Linking.addEventListener('url', handleOpenURL)
        checkDeeplinkFlow()
        return () => {
            Linking.removeEventListener('url', handleOpenURL)
        }
    }, [])

    const navigate = (url) => {
        const routeName = url.split('://')[1].split('?')[0]
        if (routeName === 'home') {
            if (Store.getState().auth.authData != null) {
                navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
            } else {
                navigation.navigate('LoginScreen')
            }
        } else {
            Alert.alert('Can\'t open this link')
        }
    }


    const renderCard = (item) => {
        return (
            <CardView
                cardElevation={4}
                cornerRadius={6}
                style={styles.card}
                key={item.title}>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={item.icon} size={60} color={colorPrimary} />
                    <AppText style={styles.titleTxt}>{item.title}</AppText>
                    <AppText style={styles.descriptionTxt}>{item.description}</AppText>
                    {item.btnTxt && (<TouchableOpacity onPress={item.onPress} style={styles.btnStyle}>
                        <AppText style={styles.btnTxt}>{item.btnTxt}</AppText>
                    </TouchableOpacity>)}
                </View>
            </CardView>
        )
    }

    const openTaxCalculator = async () => {
        const canOpenDeeplink = await Linking.canOpenURL(COUNTRY_TAX_DEEPLINK)
        if (canOpenDeeplink) {
            Linking.openURL(COUNTRY_TAX_DEEPLINK)
            return
        }
        const canOpenStore = await Linking.canOpenURL(CALCULATOR_STORE_URL)
        if (canOpenStore) {
            Linking.openURL(CALCULATOR_STORE_URL)
        } else {
            showToast('Can\'t Open')
        }

    }

    const getCardData = () => {
        return [
            {
                icon: 'calculate',
                description: 'Calculate your taxes based on your country.',
                btnTxt: 'Calculate',
                title: 'Tax Calculator',
                onPress: () => {
                    openTaxCalculator()
                }
            },
            {
                icon: 'code',
                description: 'Manage your invoice & accounts with Tax Go. Register to find Out.',
                btnTxt: 'Accounting',
                title: 'Accounting',
                onPress: () => {
                    navigation.navigate('LoginScreen')
                }
            }
        ]
    }

    const renderOptions = () => {
        const cardData = getCardData()
        return (
            <View style={{ flexDirection: 'column' }}>
                {cardData.map(item => renderCard(item))}
            </View>
        )
    }
    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {renderOptions()}
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {

    },
    card: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    btnStyle: {
        backgroundColor: colorPrimary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 12,
        borderRadius: 4
    },
    btnTxt: {
        color: 'white',
        fontSize: 16,
        fontFamily: appFontBold
    },
    descriptionTxt: {
        color: 'gray',
        marginTop: 6,
        fontSize: 18,
        textAlign: 'center'

    },
    titleTxt: {
        color: 'black',
        fontSize: 26,
        marginTop: 12
    }
})
export default TaxgoServices;