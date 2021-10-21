import React, { useEffect } from 'react';
import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CardView from 'react-native-cardview';
import AppImage from '../components/AppImage';
import AppText from '../components/AppText';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import Api from '../services/api';

const CountryTax = props => {
    //Tax Country Data Json is Availabel in TaxCountryData.js File
    const [country, setCountry] = useState({
        fetching: true,
        error: undefined,
        list: []
    })


    useEffect(() => {
        fetchTaxCountryList()
    }, [])


    const fetchTaxCountryList = () => {
        setCountry({
            ...country,
            fetching: true,
            error: undefined
        })
        Api.get('https://taxgo-c47a9-default-rtdb.firebaseio.com/taxCountry.json')
            .then(response => {
                setCountry({
                    ...country,
                    fetching: false,
                    error: undefined,
                    list: response.data
                })
            })
            .catch(error => {
                setCountry({
                    ...country,
                    fetching: false,
                    error: 'Error fetching country'
                })
                console.log('Error fetching country');
            })
    }

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

    if (country.fetching) {
        return <OnScreenSpinner />
    } else if (country.error) {
        return <FullScreenError
            tryAgainClick={fetchTaxCountryList} />
    } else {
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                style={{ flex: 1, backgroundColor: 'white' }}
                data={country.list}
                numColumns={2}
                keyExtractor={(item, index) => item.name}
                renderItem={renderItem}
            />
        </SafeAreaView>
    }
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