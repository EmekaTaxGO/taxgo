import { get } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CardView from 'react-native-cardview';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Store from '../../redux/Store';
import { errorColor, rColor, successColor } from '../../theme/Color';
import Title from '../../components/item/Title';
import SubTitle from '../../components/item/SubTitle';
import { appFont, appFontBold } from '../../helpers/ViewHelper';
import timeHelper from '../../helpers/TimeHelper';
import { H_DATE_FORMAT } from '../../constants/appConstant';
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

    getStatusColor = status => {
        switch (status) {
            case 0:
            default:
                return errorColor;
            case 1:
                return 'orange';
            case 2:
                return successColor;
        }
    }

    render() {

        const { index, item } = this.props.data;
        const color = rColor[index % rColor.length];
        const customerName = get(item, 'customer_detail.bname');
        const title = item.invoiceno + (customerName ? '-' + customerName : '');
        const isPast = moment(item.ldate).isBefore(moment().format(this.DATE_FORMAT));
        const dueColor = (isPast && item.status !== 2) ? errorColor : successColor;
        const statusColor = this.getStatusColor(item.status);
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
                            <Title style={styles.titleTxt} numberOfLines={1}>{title}</Title>
                            <Text style={styles.amountTxt}>{item.total}
                                <Text style={styles.amtSymbolTxt}> {this.symbol}</Text></Text>
                        </View>
                        <SubTitle style={styles.descriptionTxt}>Delivery Address: {item.deladdress}</SubTitle>
                        <View style={styles.dueContainer}>
                            <Text style={[styles.dueTxt, { color: dueColor }]}>DUE:{timeHelper.format(item.ldate, H_DATE_FORMAT)}</Text>
                            <Text style={[styles.statusTxt, { color: statusColor }]}>{this.getStatus(item.status)}</Text>
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
        paddingVertical: 8,
        backgroundColor: 'white'
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
        flex: 1,
        marginEnd: 12
    },
    descriptionTxt: {
        flex: 1,
        marginTop: 4
    },
    amountTxt: {
        fontSize: 16,
        color: '#727272',
        fontFamily: appFontBold
    },
    amtSymbolTxt: {
        color: 'black',
        fontSize: 14,
        fontFamily: appFont
    },
    statusTxt: {
        color: '#6e6e6e',
        fontFamily: appFontBold,
        textTransform: 'uppercase',
        fontSize: 14
    },
    dueTxt: {
        fontSize: 15,
        fontFamily: appFontBold,
        color: '#099903',
        flex: 1
    },
    dueContainer: {
        flexDirection: 'row',
        marginTop: 12
    }
})
export default SalesInvoiceListItem;