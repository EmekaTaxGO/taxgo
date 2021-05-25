import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, Picker, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import timeHelper from '../helpers/TimeHelper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import moment from 'moment';
import { connect } from 'react-redux';
import * as reportActions from '../redux/actions/reportActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import { colorAccent } from '../theme/Color';
import { isEmpty } from 'lodash';
import ProfitLossReport from '../components/profitLoss/ProfitLossReport';
import { getSavedData, PROFIT_LOSS_REPORT } from '../services/UserStorage';
import { DATE_FORMAT } from '../constants/appConstant';
import { showHeaderProgress } from '../helpers/ViewHelper';
import AppTextField from '../components/AppTextField';
import AppPicker2 from '../components/AppPicker2';

class ProfitLossReportScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            periods: this.buildPeriods(),
            periodIndex: 0,
            fromDate: moment(),
            showFromDateDialog: false,
            toDate: moment(),
            showToDateDialog: false,
            report: {}
        }
        this.presetState()
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

    // UNSAFE_componentWillMount() {
    //     this.presetState()

    // }
    componentDidMount() {
        this.fetchProfitAndLoss();
    }

    componentDidUpdate(prevProps, prevState) {
        const { report: newReport } = this.props;
        const { report: oldReport } = prevProps;

        if (!newReport.fetchingProfitLossReport && oldReport.fetchingProfitLossReport) {
            //Profit Loss Report is Fetched
            showHeaderProgress(this.props.navigation, false);
            if (newReport.fetchProfitLossReportError === undefined) {
                this.setState({ report: newReport.profitLossReport });
            }
        }
    }

    fetchProfitAndLoss = () => {
        const { reportActions } = this.props;
        const startDate = timeHelper.format(this.state.fromDate, this.DATE_FORMAT)
        const endDate = timeHelper.format(this.state.toDate, this.DATE_FORMAT)
        showHeaderProgress(this.props.navigation, true);
        reportActions.fetchProfitAndLossReport(startDate, endDate);
    }

    presetState = async () => {
        const report = await getSavedData(PROFIT_LOSS_REPORT);
        const from = moment().set('date', 1);
        const to = moment().set('date', from.daysInMonth());
        this.setState({
            fromDate: from,
            toDate: to,
            report: report !== null ? report : {}
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
                <AppTextField
                    containerStyle={{ color: colorAccent }}
                    label='From'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={colorAccent}
                    value={timeHelper.format(this.state.fromDate, this.DATE_FORMAT)}
                    fieldRef={this._fromDateRef}
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
                <AppTextField
                    label='To'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={colorAccent}
                    value={timeHelper.format(this.state.toDate, this.DATE_FORMAT)}
                    fieldRef={this._toDateRef}
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
        const { fromDate, toDate, report: reportData } = this.state;
        if (report.fetchingProfitLossReport && isEmpty(reportData.entities)) {
            return <OnScreenSpinner />
        }
        if (report.fetchProfitLossReportError && isEmpty(reportData.entities)) {
            return <FullScreenError tryAgainClick={this.fetchProfitAndLoss} />
        }
        // const entities = get(reportData, 'entities', []);
        // if (isEmpty(entities)) {
        //     return <EmptyView message='No Profit & Loss Report Available' iconName='hail' />
        // }

        return (
            <ProfitLossReport
                report={reportData}
                startDate={timeHelper.format(fromDate, this.DATE_FORMAT)}
                endDate={timeHelper.format(toDate, this.DATE_FORMAT)}
            />
        )
    }

    onPeriodChange = itemIndex => {
        let fromDate, toDate;
        switch (itemIndex) {
            case 0:
                fromDate = moment().set('date', 1);
                toDate = moment().set('date', fromDate.daysInMonth());
                break;
            case 1:
                //Current Quarter
                fromDate = moment();
                fromDate.set('month', 3 * fromDate.quarter() - 3).set(1, 'date');
                toDate = moment(fromDate).add(3, 'month').subtract(1, 'day');
                break;
            case 2:
                //Current year
                fromDate = moment().set('month', 0).set('date', 1);
                toDate = moment(fromDate).add(1, 'year').subtract(1, 'day');
                break;
            case 3:
                //Last Month
                fromDate = moment().subtract(1, 'month').set(1, 'date');
                toDate = moment(fromDate).add(1, 'month').subtract(1, 'day');
                break;
            case 4:
                //Last Quarter
                fromDate = moment().subtract(3, 'month');
                fromDate.set('month', 3 * fromDate.quarter() - 3).set('date', 1);
                toDate = moment(fromDate).add('month', 3).subtract(1, 'day');
                break;
            case 5:
                //Last Year
                fromDate = moment().subtract(1, 'year');
                fromDate.set('month', 0).set('date', 1);
                toDate = moment(fromDate).add(1, 'year').subtract(1, 'day');
                break;
            default:
                fromDate = moment(this.state.fromDate);
                toDate = moment(this.state.toDate);
        }

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
                    <AppPicker2
                        containerStyle={{ marginTop: 12 }}
                        title={periods[periodIndex]}
                        text='Select Period'
                        items={periods}
                        onChange={this.onPeriodChange}
                    />
                    <Text style={{ color: 'gray', fontSize: 12, marginTop: 2 }}>Note: Choose custom period to modify Profit & Loss between dates</Text>
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