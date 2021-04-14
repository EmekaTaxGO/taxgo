import React, { Component } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import CardView from 'react-native-cardview';
import AppImage from '../AppImage';
class CustomizeTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pages: this.createInvoicePages(),
            selected: 1
        }
    }

    createInvoicePages = () => {
        return [
            {
                id: 1,
                url: 'https://taxgo.s3-eu-west-1.amazonaws.com/taxgo/InvoiceDesign/Invoicev1.png'
            },
            {
                id: 2,
                url: 'https://taxgo.s3-eu-west-1.amazonaws.com/taxgo/InvoiceDesign/Invoicev2.png'
            },
            {
                id: 3,
                url: 'https://taxgo.s3-eu-west-1.amazonaws.com/taxgo/InvoiceDesign/Invoicev3.png'
            }
        ];
    }

    renderInvoice = ({ item, index }) => {

        return (
            <View>
                <CardView
                    cardElevation={4}
                    cornerRadius={6}
                    style={[styles.card]}>
                    <Image
                        style={styles.image}
                        placeholder='person'
                        source={{ uri: item.url }}
                    />
                </CardView>
            </View>
        )
    }

    componentDidMount() {

    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    style={{ flex: 1 }}
                    data={this.state.pages}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={this.renderInvoice}
                />
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        marginTop: 12,
        aspectRatio: 2 / 3
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 6
    }
})
export default CustomizeTab;