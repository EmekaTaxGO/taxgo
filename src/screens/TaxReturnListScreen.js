import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, ScrollView, Picker, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { OutlinedTextField } from 'react-native-material-textfield';
import timeHelper from '../helpers/TimeHelper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import * as reportActions from '../redux/actions/reportActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import CardView from 'react-native-cardview';
import { colorAccent } from '../theme/Color';
import { log } from 'react-native-reanimated';

class TaxReturnListScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            periods: this.buildPeriods(),
            periodIndex: 0,
            fromDate: new Date(),
            showFromDateDialog: false,
            toDate: new Date(),
            showToDateDialog: false
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

    UNSAFE_componentWillMount() {
        this.configDate()
    }
    componentDidMount() {
        this.fetchTaxReport();
    }

    fetchTaxReport = () => {
        const { reportActions } = this.props;
        const startDate = timeHelper.format(this.state.fromDate, this.DATE_FORMAT)
        const endDate = timeHelper.format(this.state.toDate, this.DATE_FORMAT)
        reportActions.fetchVatReport(startDate, endDate);
    }

    configDate = () => {
        const fromDate = moment().set('month', 0).set('date', 1).toDate();
        const toDate = moment().set('month', 2).set('date', 31).toDate();
        this.setState({ fromDate, toDate })
    }

    onFromDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.fromDate;
        this.setState({
            fromDate: currentDate,
            showFromDateDialog: false
        }, () => {
            setFieldValue(this._fromDateRef, timeHelper.format(currentDate, this.DATE_FORMAT))
            this.fetchTaxReport();
        })
    }

    onToDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.toDate;
        this.setState({
            toDate: currentDate,
            showToDateDialog: false
        }, () => {
            setFieldValue(this._toDateRef, timeHelper.format(currentDate, this.DATE_FORMAT))
            this.fetchTaxReport();
        })
    }

    renderDateRange = () => {
        const disableDate = this.state.periodIndex !== 5;
        return <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <TouchableOpacity
                style={{ flex: 1, marginEnd: 6 }}
                onPress={() => this.setState({ showFromDateDialog: true })}
                disabled={disableDate}>
                <OutlinedTextField
                    containerStyle={{ color: colorAccent }}
                    label='From'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={disableDate ? 'gray' : colorAccent}
                    value={timeHelper.format(this.state.fromDate, this.DATE_FORMAT)}
                    ref={this._fromDateRef}
                />
            </TouchableOpacity>
            {this.state.showFromDateDialog ? <DateTimePicker
                value={this.state.fromDate}
                mode={'datetime'}
                display='default'
                maximumDate={this.state.toDate}
                onChange={this.onFromDateChange}
            /> : null}
            <TouchableOpacity
                style={{ flex: 1, marginStart: 6 }}
                onPress={() => this.setState({ showToDateDialog: true })}
                disabled={disableDate}>
                <OutlinedTextField
                    label='To'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={disableDate ? 'gray' : colorAccent}
                    value={timeHelper.format(this.state.toDate, this.DATE_FORMAT)}
                    ref={this._toDateRef}
                />
            </TouchableOpacity>
            {this.state.showToDateDialog ? <DateTimePicker
                value={this.state.toDate}
                mode={'datetime'}
                display='default'
                minimumDate={this.state.fromDate}
                onChange={this.onToDateChange}
            /> : null}
        </View>
    }

    renderItemRow = (ledger, item) => {
        return <View style={{ flexDirection: 'row', padding: 12 }}>
            <Text style={{ flex: 1, fontSize: 14, fontFamily: '' }}>{ledger} ({item.percentage})</Text>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 14 }}>{item.percentage}</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontSize: 14 }}>{item.total}</Text>
        </View>
    }

    onPricePress = item => {
        this.props.navigation.push('TaxViewScreen', {
            item,
            periodIndex: this.state.periodIndex,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate
        })
    }

    renderReportItem = (item, index) => {
        const count = this.props.report.taxReports.length;
        const isLast = count === index + 1;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.listCard, { marginBottom: isLast ? 16 : 0 }]}>
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#f5f5f5',
                padding: 12
            }}>
                <Text style={{ flex: 1, fontSize: 14, fontFamily: '' }}>Ledger</Text>
                <Text style={{ flex: 1, textAlign: 'center', fontSize: 14 }}>Rate</Text>
                <Text style={{ flex: 1, textAlign: 'right', fontSize: 14 }}>Amount</Text>
            </View>
            {item.vatRate.map(value => this.renderItemRow(item.ledger, value))}
            <View style={{
                flexDirection: 'row',
                borderTopColor: 'lightgray',
                borderTopWidth: 1
            }}>
                <Text style={{
                    flex: 1,
                    textAlign: 'left',
                    fontSize: 14,
                    fontWeight: 'bold',
                    padding: 12
                }}>Total {item.ledger}</Text>
                <TouchableOpacity onPress={() => this.onPricePress(item)} style={{ padding: 12 }}>
                    <Text style={{
                        flex: 1,
                        textAlign: 'right',
                        fontSize: 14,
                        color: colorAccent
                    }}>{item.totalTax}</Text>
                </TouchableOpacity>
            </View>
        </CardView>
    }

    renderReturnList = () => {
        const { report } = this.props;
        if (report.fetchingTaxReport) {
            return <OnScreenSpinner />
        }
        if (report.fetchTaxReportError) {
            return <FullScreenError tryAgainClick={this.fetchTaxReport} />
        }
        return <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={report.taxReports}
            renderItem={({ item, index }) => this.renderReportItem(item, index)}
        />
    }

    onPeriodChange = (itemValue, itemIndex) => {
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
        const fromDate = moment().set('month', startMonth).set('date', 1).toDate();
        const toDate = moment(fromDate).add('month', 3).subtract('day', 1).toDate();
        this.setState({ periodIndex: itemIndex, fromDate, toDate }, () => {

            setFieldValue(this._fromDateRef, timeHelper.format(fromDate, this.DATE_FORMAT));
            setFieldValue(this._toDateRef, timeHelper.format(toDate, this.DATE_FORMAT));
            if (itemIndex > 0 && itemIndex < 5) {
                this.fetchTaxReport();
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
                        <Picker
                            selectedValue={periods[periodIndex]}
                            mode='dropdown'
                            onValueChange={this.onPeriodChange}>
                            {periods.map((value, index) => <Picker.Item
                                label={value} value={value} key={value} />)}
                        </Picker>
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
        marginTop: 16
    }
})
export default connect(
    state => ({
        report: state.report
    }),
    dispatch => ({
        reportActions: bindActionCreators(reportActions, dispatch)
    })
)(TaxReturnListScreen);