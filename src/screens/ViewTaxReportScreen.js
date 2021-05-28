import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, Text, StyleSheet } from 'react-native';
import timeHelper from '../helpers/TimeHelper';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import * as reportActions from '../redux/actions/reportActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import CardView from 'react-native-cardview';
import EmptyView from '../components/EmptyView';
import { get } from 'lodash';
import AppPicker2 from '../components/AppPicker2';
import AppDatePicker from '../components/AppDatePicker';
import { colorAccent } from '../theme/Color'

class ViewTaxReportScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            periods: this.buildPeriods(),
            periodIndex: this.props.route.params.periodIndex,
            fromDate: timeHelper.format(moment(this.props.route.params.fromDate)),
            toDate: timeHelper.format(moment(this.props.route.params.toDate))
        }
    }
    _fromDateRef = React.createRef();
    _toDateRef = React.createRef();


    DATE_FORMAT = 'YYYY-MM-DD';

    buildPeriods = () => {
        return [
            'Select Period',
            'First',
            'Second',
            'Third',
            'Fourth',
            'Custom'
        ]
    }

    componentDidMount() {
        this.configHeader();
        this.fetchTaxReturn();
    }

    configHeader = () => {
        const item = this.product();
        const title = `${item.product}-Report`;
        this.props.navigation.setOptions({ title })
    }

    taxItem = () => {
        return this.props.route.params.taxItem;
    }
    product = () => {
        return this.props.route.params.product;
    }

    fetchTaxReturn = () => {
        const ledger = get(this.taxItem(), 'vatList[0].id');
        const productId = this.product().id;
        const { reportActions } = this.props;
        const startDate = timeHelper.format(this.state.fromDate, this.DATE_FORMAT)
        const endDate = timeHelper.format(this.state.toDate, this.DATE_FORMAT)
        reportActions.fetchNominalTaxReturn(productId, ledger, startDate, endDate);
    }

    onFromDateChange = date => {
        this.setState({ fromDate: date }, () => {
            this.fetchTaxReturn();
        })
    }

    onToDateChange = date => {
        this.setState({ toDate: date }, () => {
            this.fetchTaxReturn();
        })
    }

    renderDateRange = () => {
        const disableDate = this.state.periodIndex !== 5;
        return <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <AppDatePicker
                date={this.state.fromDate}
                disable={disableDate}
                containerStyle={{ flex: 1, marginEnd: 6 }}
                textFieldProps={{
                    label: 'From',
                    fieldRef: this._fromDateRef,
                    baseColor: disableDate ? 'gray' : colorAccent
                }}
                onChange={this.onFromDateChange}
            />
            <AppDatePicker
                date={this.state.toDate}
                disable={disableDate}
                containerStyle={{ flex: 1, marginEnd: 6 }}
                textFieldProps={{
                    label: 'To',
                    fieldRef: this._toDateRef,
                    baseColor: disableDate ? 'gray' : colorAccent
                }}
                onChange={this.onToDateChange}
            />
        </View>
    }

    renderTaxReturnItem = (item, index) => {
        const count = this.props.report.taxReturns.length;
        const isLast = count === index + 1;
        const isDebit = item.runningtotal < 0;
        const total = item.runningtotal * (isDebit ? -1 : 1);
        const totalSuffix = isDebit ? 'Dr' : 'Cr';
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.listCard, { marginBottom: isLast ? 24 : 0 }]}>
            <View style={{ flexDirection: 'column' }}>
                {this.renderItemRow('Date', item.date, '#efefef')}
                {this.renderItemRow('Invoice Name', item.name)}
                {this.renderItemRow('Vat(%)', item.incometax, '#efefef')}
                {this.renderItemRow('Invoice Amount', item.total)}
                {this.renderItemRow('Vat(In Amount)', item.incometaxamount, '#efefef')}
                {this.renderItemRow('Debit', item.debit)}
                {this.renderItemRow('Credit', item.credit, '#efefef')}
                {this.renderItemRow('Total', `${total} ${totalSuffix}`)}
            </View>
        </CardView>
    }
    renderItemRow = (label, value, background = '#ffffff') => {
        return <View style={{ flexDirection: 'row', padding: 12, backgroundColor: background }}>
            <Text style={{ flex: 1, fontSize: 15, textTransform: 'uppercase' }}>{label}</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontSize: 15 }}>{value ? value : '-'}</Text>
        </View>
    }

    renderReturnList = () => {
        const { report } = this.props;
        if (report.fetchingTaxReturn) {
            return <OnScreenSpinner />
        }
        if (report.fetchTaxReturnError) {
            return <FullScreenError tryAgainClick={this.fetchTaxReturn} />
        }
        if (report.taxReturns.length === 0) {
            return <EmptyView message='No Tax return Available to show' iconName='hail' />
        }
        return <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={report.taxReturns}
            renderItem={({ item, index }) => this.renderTaxReturnItem(item, index)}
        />
    }

    onPeriodChange = itemIndex => {
        let startMonth;
        switch (itemIndex) {
            case 2:
                startMonth = 3;
                break;
            case 3:
                startMonth = 6;
                break;
            case 4:
                startMonth = 9;
                break;
            default:
                startMonth = 0;
        }
        const fromDate = moment().set('month', startMonth).set('date', 1);
        const toDate = moment(fromDate).add(3, 'month').subtract(1, 'day');
        this.setState({
            periodIndex: itemIndex,
            fromDate: timeHelper.format(fromDate),
            toDate: timeHelper.format(toDate)
        }, () => {
            setFieldValue(this._fromDateRef, this.state.fromDate);
            setFieldValue(this._toDateRef, this.state.toDate);
            if (itemIndex > 0 && itemIndex < 5) {
                this.fetchTaxReturn();
            }
        })
    }
    render() {
        const { periods, periodIndex } = this.state;
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>

                <View style={{ flexDirection: 'column', marginTop: 12, paddingHorizontal: 16 }}>
                    {/* Select Method Picker */}
                    <View style={{
                        borderWidth: 1,
                        borderRadius: 12,
                        borderColor: 'lightgray',
                        marginTop: 10
                    }}>
                        <AppPicker2
                            title={periods[periodIndex]}
                            text='Select Period'
                            items={periods}
                            onChange={this.onPeriodChange}
                        />
                    </View>
                    <Text style={{ color: 'gray', fontSize: 12, marginTop: 2 }}>Note: Choose custom period to modify Tax return between dates</Text>
                    {this.renderDateRange()}
                </View>
                {this.renderReturnList()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    listCard: {
        marginHorizontal: 16,
        marginTop: 24
    }
})
export default connect(
    state => ({
        report: state.report
    }),
    dispatch => ({
        reportActions: bindActionCreators(reportActions, dispatch)
    })
)(ViewTaxReportScreen);