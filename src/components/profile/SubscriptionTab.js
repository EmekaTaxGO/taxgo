import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CardView from 'react-native-cardview';
import LinearGradient from 'react-native-linear-gradient';
import { FlatList } from 'react-native-gesture-handler';
class SubscriptionTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.createItems()
        };
    }

    createItems = () => {
        return [
            {
                header: 'top-head',
                title: 'CURRENT SUBSCRIPTION',
                expiredOn: '',
                subscribedOn: ''
            },
            {
                header: 'Basic',
                description: 'Tax GO Basic is a FREE subscription from Tax G0 to support every business. Enjoy all the features and when your business is growing tax go premium features can be your best partner.',
                features: [
                    '5 Invoices/Month', '5 Customers', '5 Suppliers', 'Choose your own Invoice Design', '2 Bank Accounts'
                ],
                startColor: '#fda9a7',
                endColor: '#fbc0ba'
            },
            {
                header: 'Standard',
                description: 'Tax GO Standard is upgraded version of your basic account It will help your small/medium business with extra support.',
                features: ['Get Basic Account', '250 Invoices/Month', '50 Customers', '50 Suppliers', 'Choose your own Invoice Design', '5 Bank Accounts', 'Reports and Accounting'],
                startColor: '#f7cb6a',
                endColor: '#fca881'
            },
            {
                header: 'Pro',
                description: 'Tax GO Pro is the best partner for your business. Pro accounts helps you setup a retail store just with your phone.',
                features: ['Get Basic Account', 'Unlimited Invoices/Month', 'Unlimited Customers', 'Unlimited Suppliers', 'Unlimted Bank Accounts', 'Reports and Accounting', 'Retail Access'],
                startColor: '#f189e2',
                endColor: '#f56185'
            }

        ]
    }


    componentDidMount() {
        const items = ['Bikas', 'Ashish'];

    }

    topHeader = () => {
        return <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{
                marginLeft: 16,
                marginTop: 18,
                fontSize: 17,
                fontWeight: 'bold'
            }}>Current Subscription</Text>
            <CardView
                cardElevation={4}
                cornerRadius={20}
                style={styles.topCard}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#fec107', '#fec107']}
                    style={{ flexDirection: 'column', padding: 12, }}>
                    <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Tax Go Pro</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <Text style={{ color: 'white', color: 'gray' }}>Expiry: </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'white', color: 'black' }}>Subscribed On: </Text>
                    </View>
                </LinearGradient>
            </CardView>
        </View>
    }

    listItem = (item, isLast) => {
        return <CardView
            cardElevation={4}
            cornerRadius={20}
            style={[styles.card, { marginBottom: isLast ? 20 : 0 }]}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[item.startColor, item.endColor]}
                style={styles.gradient}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    padding: 18,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: 'white'
                }}>
                    <Text style={{ fontSize: 18, color: 'gray' }}>Tax Go</Text>
                    <Text style={{ color: 'green', paddingStart: 12, fontSize: 16 }}>{item.header}</Text>
                </View>
                <View style={{
                    flexDirection: 'column',
                    paddingHorizontal: 12,
                    paddingTop: 8,
                    paddingBottom: 12
                }}>
                    <Text style={{ color: 'gray', fontSize: 14 }}>{item.description}</Text>
                    <Text style={{
                        borderBottomColor: 'white',
                        borderBottomWidth: 1,
                        paddingVertical: 8,
                        fontSize: 18
                    }}>Features</Text>
                    <View style={{ marginTop: 12 }} />
                    {item.features.map(value =>
                        <Text key={value} style={{
                            color: 'gray',
                            fontWeight: '600'
                        }}>{value}</Text>)}
                </View>

            </LinearGradient>
        </CardView>
    }

    renderListItem = (item, index) => {
        const isLast = index + 1 === this.state.items.length;
        return index === 0 ? this.topHeader() : this.listItem(item, isLast);
    }

    render() {
        return <FlatList
            data={this.state.items}
            keyExtractor={row => row.header}
            renderItem={({ item, index }) => this.renderListItem(item, index)}
            style={{ flex: 1 }}
        />
    }
}
const styles = StyleSheet.create({
    topCard: {
        marginHorizontal: 16,
        marginTop: 6
    },
    card: {
        marginHorizontal: 16,
        marginTop: 12
    },
    gradient: {
        flexDirection: 'column',
    }
});
export default SubscriptionTab;