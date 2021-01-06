import React, { Component } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import * as productActions from '../redux/actions/productActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import CardView from 'react-native-cardview';
import { colorAccent, colorPrimary } from '../theme/Color';
import ImageView from '../components/ImageView';
import AppTab from '../components/AppTab';
import moment from 'moment';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';

class ViewProductInfoScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 'activity',
            startDate: new Date(),
            showStartDateDialog: false,
            endDate: new Date(),
            showEndDateDialog: false
        }
    }

    DATE_FORMAT = 'YYYY-MM-DD';

    getProductId = () => {
        return this.props.route.params.id;
    }

    shouldComponentUpdate(newProps, newState) {
        const { product: newProduct } = newProps;
        const { product: oldProduct } = this.props;
        return newState.tab !== this.state.tab
            || newState.showStartDateDialog !== this.state.showStartDateDialog
            || newState.showEndDateDialog !== this.state.showEndDateDialog

            //Props Change
            || newProduct.fetchingProductInfo !== oldProduct.fetchingProductInfo;
    }

    componentDidMount() {
        this.fetchProductInfo();
    }

    UNSAFE_componentWillMount() {
        const startDate = moment();
        startDate.set('date', 1);

        const endDate = moment();
        endDate.set('date', endDate.daysInMonth());

        this.setState({
            startDate: startDate.toDate(),
            endDate: endDate.toDate()
        });
    }

    fetchProductInfo = () => {
        const { productActions } = this.props;
        const startDate = moment(this.state.startDate).format(this.DATE_FORMAT);
        const endDate = moment(this.state.endDate).format(this.DATE_FORMAT);
        
        productActions.getProductDetails(this.getProductId(), startDate, endDate);
    }

    header = (title) => {
        return <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            width: '100%',
            color: 'black',
            backgroundColor: colorPrimary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            color: 'white'
        }}>{title}</Text>
    }

    row = (label, value) => {
        return <View style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4
        }}>
            <Text style={{ flex: 5, color: 'black', fontSize: 14 }}>{label}</Text>
            {value ? <Text style={{
                flex: 4,
                color: 'gray',
                fontSize: 14,
                textAlign: 'right'
            }}
                numberOfLines={1}>{value}</Text> : null}
        </View>
    }

    renderSalesInfo = (product) => {
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={styles.card}>
            <View style={{ flexDirection: 'column' }}>
                {this.header('Sales Info')}
                <View style={styles.cardContainer}>

                    {this.row('Ledger Acc.', null)}
                    {this.row('Sales Price', product.price)}
                    {this.row('Trade Price', product.trade_price)}
                    {this.row('Wholesale Price', product.wholesale)}
                    {this.row('Vat/GST(%)', product.vat)}
                    {this.row('Vat(Amt)', product.vatamt)}
                </View>
            </View>
        </CardView>
    }
    renderPurchaseInfo = (product) => {
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={styles.card}>
            <View style={{ flexDirection: 'column' }}>
                {this.header('Purchase Info')}
                <View style={styles.cardContainer}>

                    {this.row('Supplier', product.location)}
                    {this.row('Item Code', product.icode)}
                    {this.row('Purchase Description', product.pdescription)}
                    {this.row('Cost Price', product.costprice)}
                    {this.row('Purchase Account', product.paccount)}
                    {this.row('Reorder Level', product.rlevel)}
                    {this.row('Reorder Quantity', product.rquantity)}
                    {this.row('Expiry Date', product.expiredate)}
                </View>
            </View>
        </CardView>
    }
    renderMoreInfo = (product) => {
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.card, { marginBottom: 22 }]}>
            <View style={{ flexDirection: 'column' }}>
                {this.header('More Info')}
                <View style={styles.cardContainer}>

                    {this.row('Location', product.location)}
                    {this.row('Weight', product.weight)}
                    {this.row('Notes', product.notes)}
                </View>
            </View>
        </CardView>
    }

    renderMainInfo = (product) => {
        return <View style={{
            flexDirection: 'row',
            paddingHorizontal: 13,
            paddingTop: 12,
            alignItems: 'flex-end'
        }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={{ fontSize: 20, fontWeight: '400' }}>{product.name}</Text>
                <Text style={{ fontSize: 15 }}>{product.pdescription}</Text>
            </View>
            <Text style={{ color: 'black', fontSize: 16 }}>{product.itemtype}</Text>
        </View>
    }

    selectTab = tab => {
        this.setState({ tab: tab });
    }

    renderTabs = () => {
        const { tab } = this.state;
        return <View style={{ flexDirection: 'row', width: '100%' }}>
            <AppTab
                title='Info'
                selected={tab === 'info'}
                onTabPress={() => this.selectTab('info')} />
            <AppTab
                title='Activity'
                selected={tab === 'activity'}
                onTabPress={() => this.selectTab('activity')} />

        </View>
    }

    renderProductInfo = (product) => {
        const { product_data } = product.productInfo;
        return <ScrollView>
            <ImageView
                url={product_data.pimage}
                placeholder={require('../assets/product.png')}
                style={{
                    marginTop: 12,
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'gray',
                    alignSelf: 'center'
                }} />
            {this.renderMainInfo(product_data)}
            {this.renderSalesInfo(product_data)}
            {this.renderPurchaseInfo(product_data)}
            {this.renderMoreInfo(product_data)}
        </ScrollView>
    }

    renderDateView = (date) => {
        return <View >

        </View>
    }

    onStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.startDate;
        this.setState({
            startDate: currentDate,
            showStartDateDialog: false
        });
    }

    onEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.endDate;
        this.setState({
            endDate: currentDate,
            showEndDateDialog: false
        });
    }

    renderProductActivity = (product) => {
        const { productInfo } = product;
        return <View style={{ flex: 1, paddingHorizontal: 16, flexDirection: 'column' }}>

            <View style={{ flexDirection: 'row' }}>
                {/* Start Date */}
                <View style={{
                    flexDirection: 'column',
                    flex: 1,
                    paddingTop: 6,
                    marginRight: 8
                }}>
                    <Text>Start Date</Text>
                    <TouchableOpacity onPress={() => this.setState({ showStartDateDialog: true })}>
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: 'lightgray',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 6,
                            marginTop: 6
                        }}>
                            <Text style={{
                                flex: 1,
                                fontSize: 14
                            }}>{moment(this.state.startDate).format(this.DATE_FORMAT)}</Text>
                            <AntDesignIcon name='calendar' color='white' size={30} />
                        </View>
                    </TouchableOpacity>
                    {this.state.showStartDateDialog ? <DateTimePicker
                        value={this.state.startDate}
                        mode={'datetime'}
                        display='default'
                        onChange={this.onStartDateChange}
                    /> : null}
                </View>
                {/* End Date */}
                <View style={{
                    flexDirection: 'column',
                    flex: 1,
                    paddingTop: 6,
                    marginLeft: 8
                }}>
                    <Text>End Date</Text>
                    <TouchableOpacity onPress={() => this.setState({ showEndDateDialog: true })}>
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: 'lightgray',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 6,
                            marginTop: 6
                        }}>
                            <Text style={{
                                flex: 1,
                                fontSize: 14
                            }}>{moment(this.state.endDate).format(this.DATE_FORMAT)}</Text>
                            <AntDesignIcon name='calendar' color='white' size={30} />
                        </View>
                    </TouchableOpacity>
                    {this.state.showEndDateDialog ? <DateTimePicker
                        value={this.state.endDate}
                        mode={'datetime'}
                        display='default'
                        onChange={this.onEndDateChange}
                    /> : null}
                </View>
            </View>

        </View>
    }

    render() {
        const { product } = this.props;
        const { tab } = this.state;
        if (product.fetchingProductInfo) {
            return <OnScreenSpinner />
        }
        if (product.fetchProductInfoError || product.productInfo === undefined) {
            return <FullScreenError tryAgainClick={this.fetchProductInfo} />
        }
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {this.renderTabs()}
            {tab === 'info' ? this.renderProductInfo(product) : null}
            {tab === 'activity' ? this.renderProductActivity(product) : null}
        </SafeAreaView>
    }
};
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 12,
        marginTop: 16
    },
    cardContainer: {
        width: '100%',
        flexDirection: 'column',
        paddingHorizontal: 12,
        paddingBottom: 12
    }
});
export default connect(
    state => ({
        product: state.product
    }),
    dispatch => ({
        productActions: bindActionCreators(productActions, dispatch)
    })
)(ViewProductInfoScreen);