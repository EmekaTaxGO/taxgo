import { get } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CardView from 'react-native-cardview';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Store from '../../redux/Store';
import { rColor } from '../../theme/Color';
class SalesInvoiceListItem extends Component {

    DATE_FORMAT = 'YYYY-MM-DD';
    symbol = get(Store.getState().auth, 'profile.countryInfo.symbol');

    shouldComponentUpdate(newProps, newState) {
        const { item: newItem } = newProps.data;
        const { item: oldItem } = this.props.data;
        return newItem.id !== oldItem.id;
    }

    getStatus = (status) => {
        switch (status) {
            case 0:
            default:
                return 'unpaid';
            case 1:
                return 'part paid';
            case 2:
                return 'paid'
        }
    }

    render() {

        const { index, item } = this.props.data;
        const color = rColor[index % rColor.length];
        const customerName = get(item, 'customer_detail.bname');
        const title = item.invoiceno + (customerName ? '-' + customerName : '');
        const isPast = moment(item.ldate).isBefore(moment().format(this.DATE_FORMAT));
        const dueColor = (isPast && item.status !== 2) ? 'red' : '#099903';
        return (
            <CardView
                cardElevation={12}
                cornerRadius={6}
                style={styles.card}>
                <View style={styles.root}>
                    <View style={styles.itemContainer}>
                        <View style={[styles.avatar, { backgroundColor: color + "30" }]}>
                            <Icons size={35} name='event-note' color={color} />
                        </View>
                    </View>
                    <View style={styles.mainContent}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.titleTxt} numberOfLines={1}>{title}</Text>
                            <Text style={styles.amountTxt}>{item.total}
                                <Text style={styles.amtSymbolTxt}> {this.symbol}</Text></Text>
                        </View>
                        <Text style={styles.descriptionTxt}>Delivery Address: {item.deladdress}</Text>
                        <View style={styles.dueContainer}>
                            <Text style={[styles.dueTxt, { color: dueColor }]}>DUE:{item.ldate}</Text>
                            <Text style={styles.statusTxt}>{this.getStatus(item.status)}</Text>
                        </View>
                    </View>
                </View>
            </CardView>
        )
    }
}
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    itemContainer: {
        flexDirection: 'row'
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainContent: {
        flexDirection: 'column',
        flex: 1,
        paddingStart: 12
    },
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    titleTxt: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
        marginEnd: 12
    },
    descriptionTxt: {
        color: '#777777',
        fontSize: 14,
        flex: 1,
        marginTop: 4
    },
    amountTxt: {
        fontSize: 16,
        color: '#727272',
        fontWeight: 'bold'
    },
    amtSymbolTxt: {
        color: 'black',
        fontSize: 14
    },
    statusTxt: {
        color: '#6e6e6e',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 14
    },
    dueTxt: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#099903',
        flex: 1
    },
    dueContainer: {
        flexDirection: 'row',
        marginTop: 12
    }
})
export default SalesInvoiceListItem;