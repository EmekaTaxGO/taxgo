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
import { colorAccent, colorPrimary } from '../theme/Color';
import { log } from 'react-native-reanimated';
import { isEmpty, get, isUndefined, isNumber, set } from 'lodash';
import EmptyView from '../components/EmptyView';
import ProfitLossReport from '../components/profitLoss/ProfitLossReport';

class ProfitLossReportScreen extends Component {

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
            'This Month',
            'This Quarter',
            'This Year',
            'Last Month',
            'Last Quarter',
            'Last Year',
            'Custom'
        ]
    }

    UNSAFE_componentWillMount() {
        this.configDate()
    }
    componentDidMount() {
        this.fetchProfitAndLoss();
    }

    fetchProfitAndLoss = () => {
        const { reportActions } = this.props;
        const startDate = timeHelper.format(this.state.fromDate, this.DATE_FORMAT)
        const endDate = timeHelper.format(this.state.toDate, this.DATE_FORMAT)
        reportActions.fetchProfitAndLossReport(startDate, endDate);
    }

    configDate = () => {
        const from = moment().set('date', 1);
        const to = moment().set('date', from.daysInMonth());
        this.setState({
            fromDate: from,
            toDate: to
        });
    }

    onFromDateChange = (event, selectedDate) => {
        if (event.type !== 'set') {
            this.setState({ showFromDateDialog: false });
            return;
        }
        const currentDate = selectedDate || this.state.fromDate;
        this.setState({
            fromDate: currentDate,
            showFromDateDialog: false
        }, () => {
            setFieldValue(this._fromDateRef, timeHelper.format(currentDate, this.DATE_FORMAT))
            this.fetchProfitAndLoss();
        })
    }

    onToDateChange = (event, selectedDate) => {
        if (event.type !== 'set') {
            this.setState({ showToDateDialog: false });
            return;
        }
        const currentDate = selectedDate || this.state.toDate;
        this.setState({
            toDate: currentDate,
            showToDateDialog: false
        }, () => {
            setFieldValue(this._toDateRef, timeHelper.format(currentDate, this.DATE_FORMAT))
            this.fetchProfitAndLoss();
        })
    }

    renderDateRange = () => {
        return <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <TouchableOpacity
                style={{ flex: 1, marginEnd: 6 }}
                onPress={() => this.setState({ showFromDateDialog: true })}>
                <OutlinedTextField
                    containerStyle={{ color: colorAccent }}
                    label='From'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={colorAccent}
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
                onPress={() => this.setState({ showToDateDialog: true })}>
                <OutlinedTextField
                    label='To'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={colorAccent}
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

    onPressDebit = (item) => {

    }
    onPressCredit = (item) => {

    }

    renderReturnList = () => {
        const { report } = this.props;
        const { fromDate, toDate } = this.state;
        if (report.fetchingProfitLossReport) {
            return <OnScreenSpinner />
        }
        if (report.fetchProfitLossReportError) {
            return <FullScreenError tryAgainClick={this.fetchProfitAndLoss} />
        }
        const entities = get(report.profitLossReport, 'entities', []);
        if (isEmpty(entities)) {
            return <EmptyView message='No Profit & Loss Report Available' iconName='hail' />
        }

        return (
            <ProfitLossReport
                report={report.profitLossReport}
                startDate={timeHelper.format(fromDate, this.DATE_FORMAT)}
                endDate={timeHelper.format(toDate, this.DATE_FORMAT)}
            />
        )
    }

    onPeriodChange = (itemValue, itemIndex) => {
        let fromDate, toDate;
        switch (itemIndex) {
            case 0:
                fromDate = moment().set('date', 1);
                toDate = moment().set('date', fromDate.daysInMonth());
            case 1:
                //Current Quarter
                fromDate = moment();
                fromDate.set('month', 3 * fromDate.quarter() - 3).set('date', 1);
                toDate = moment(fromDate).add('month', 3).subtract('day', 1);
                break;
            case 2:
                //Current year
                fromDate = moment().set('month', 0).set('date', 1);
                toDate = moment(fromDate).add('year', 1).subtract('day', 1);
                break;
            case 3:
                //Last Month
                fromDate = moment().subtract('month', 1).set('date', 1);
                toDate = moment(fromDate).add('month', 1).subtract('day', 1);
                break;
            case 4:
                //Last Quarter
                fromDate = moment().subtract('month', 3);
                fromDate.set('month', 3 * fromDate.quarter() - 3).set('date', 1);
                toDate = moment(fromDate).add('month', 3).subtract('day', 1);
                break;
            case 5:
                //Last Year
                fromDate = moment().subtract('year', 1);
                fromDate.set('month', 0).set('date', 1);
                toDate = moment(fromDate).add('year', 1).subtract('day', 1);
                break;
            default:
                fromDate = moment(this.state.fromDate);
                toDate = moment(this.state.toDate);
        }
        fromDate = fromDate.toDate();
        toDate = toDate.toDate();
        this.setState({ periodIndex: itemIndex, fromDate, toDate }, () => {

            setFieldValue(this._fromDateRef, timeHelper.format(fromDate, this.DATE_FORMAT));
            setFieldValue(this._toDateRef, timeHelper.format(toDate, this.DATE_FORMAT));
            if (itemIndex < 6) {
                this.fetchProfitAndLoss();
            }
        })
    }
    render() {
        const { periods, periodIndex } = this.state;
        const { report } = this.props;
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
                            enabled={!report.fetchingTrialBalance}
                            selectedValue={periods[periodIndex]}
                            mode='dropdown'
                            onValueChange={this.onPeriodChange}>
                            {periods.map((value, index) => <Picker.Item
                                label={value} value={value} key={value} />)}
                        </Picker>
                    </View>
                    <Text style={{ color: 'gray', fontSize: 12, marginTop: 2 }}>Note: Choose custom period to modify trial balance between dates</Text>
                    {periodIndex === 6 && this.renderDateRange()}
                </View>
                {this.renderReturnList()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({

})
export default connect(
    state => ({
        report: state.report
    }),
    dispatch => ({
        reportActions: bindActionCreators(reportActions, dispatch)
    })
)(ProfitLossReportScreen);