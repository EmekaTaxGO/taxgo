import React from 'react';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colorPrimary } from '../theme/Color';
import AppText from '../components/AppText';
import { appFontBold } from '../helpers/ViewHelper';

const TaxgoServices = props => {


    useEffect(() => {
        if (props.route.params?.country) {
            setTimeout(() => {
                props.navigation.navigate('LoginScreen')
            }, 200)
        }
    }, [props.route.params?.country])


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
                    <TouchableOpacity onPress={item.onPress} style={styles.btnStyle}>
                        <AppText style={styles.btnTxt}>{item.btnTxt}</AppText>
                    </TouchableOpacity>
                </View>
            </CardView>
        )
    }

    const getCardData = () => {
        return [
            {
                icon: 'calculate',
                description: 'Calculate your taxes based on your country.',
                btnTxt: 'Calculate',
                title: 'Tax Calculator',
                onPress: () => {
                    props.navigation.navigate('CountryTax', {
                        sender: 'TaxgoServices'
                    })
                }
            },
            {
                icon: 'code',
                description: 'Manage your invoice & accounts with Tax Go. Register to find Out.',
                btnTxt: 'Accounting',
                title: 'Accounting',
                onPress: () => {
                    props.navigation.navigate('LoginScreen')
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