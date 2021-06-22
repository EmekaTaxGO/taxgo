import React from 'react';
import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CardView from 'react-native-cardview';
import AppImage from '../components/AppImage';
import AppText from '../components/AppText';
import taxCountries from '../data/TaxCountryData';
import { appFontBold } from '../helpers/ViewHelper';

const CountryTax = props => {

    const [countries, setCountries] = useState(taxCountries)

    const onPressCountry = item => {
        const sender = props.route.params.sender
        props.navigation.navigate(sender, {
            country: item
        })
    }

    const renderItem = ({ item, index }) => {
        return (
            <CardView
                cardElevation={4}
                cornerRadius={6}
                style={styles.card}
                key={item.name}>
                <TouchableOpacity
                    onPress={() => onPressCountry(item)}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <AppImage
                            style={styles.image}
                            url={item.icon}
                            placeholderColor='gray'
                            placeholder='image'
                        />
                        <AppText style={styles.title}>{item.name}</AppText>
                    </View>

                </TouchableOpacity>
            </CardView>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                style={{ flex: 1, backgroundColor: 'white' }}
                data={countries}
                numColumns={2}
                keyExtractor={(item, index) => item.name}
                renderItem={renderItem}
            />
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    card: {
        margin: 12,
        backgroundColor: 'white',
        flex: 1,
        paddingVertical: 16
    },
    title: {
        fontSize: 20,
        color: 'black',
        marginTop: 6,
        textAlign: 'center'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'lightgray'
    }
})
export default CountryTax;