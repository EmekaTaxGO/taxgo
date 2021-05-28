import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, Text, StyleSheet } from 'react-native';
import timeHelper from '../helpers/TimeHelper';
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
import { showHeaderProgress } from '../helpers/ViewHelper';
import AppPicker2 from '../components/AppPicker2';
import AppDatePicker from '../components/AppDatePicker';

class ProfitLossReportScreen extends Component {

    constructor(props) {
        super(props);

        const fromDate = moment().set('date', 1)
        const toDate = moment().set('date', fromDate.daysInMonth())
        this.state = {
            periods: this.buildPeriods(),
            periodIndex: 0,
            fromDate: timeHelper.format(fromDate),
            toDate: timeHelper.format(toDate),
            report: {}
        }
        this.presetState()
    }
    _fromDateRef = React.createRef();
    _toDateRef = React.createRef();



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
        showHeaderProgress(this.props.navigation, true);
        reportActions.fetchProfitAndLossReport(this.state.fromDate, this.state.toDate);
    }

    presetState = async () => {
        const report = await getSavedData(PROFIT_LOSS_REPORT);
        this.setState({
            report: report !== null ? report : {}
        });
    }

    onFromDateChange = date => {
        this.setState({ fromDate: date }, () => {
            this.fetchProfitAndLoss();
        })
    }

    onToDateChange = date => {
        this.setState({ toDate: date }, () => {
            this.fetchProfitAndLoss();
        })
    }

    renderDateRange = () => {
        return <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <AppDatePicker
                date={this.state.fromDate}
                containerStyle={{ flex: 1, marginEnd: 6 }}
                textFieldProps={{
                    label: `From`,
                    fieldRef: this._fromDateRef,
                    baseColor: colorAccent
                }}
                onChange={this.onFromDateChange}
            />
            <AppDatePicker
                date={this.state.toDate}
                containerStyle={{ flex: 1, marginEnd: 6 }}
                textFieldProps={{
                    label: `To`,
                    fieldRef: this._toDateRef,
                    baseColor: colorAccent
                }}
                onChange={this.onToDateChange}
            />
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
                startDate={fromDate}
                endDate={toDate}
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
                // console.log('Quarter: ', fromDate.quarter());
                // console.log('Month: ', fromDate.get('month'));
                const quarter = moment().quarter();
                fromDate = moment().set('month', 3 * quarter - 3).set('date', 1);
                toDate = moment(fromDate).add(3, 'month').subtract(1, 'day');
                break;
            case 2:
                //Current year
                fromDate = moment().set('month', 0).set('date', 1);
                toDate = moment(fromDate).add(1, 'year').subtract(1, 'day');
                break;
            case 3:
                //Last Month
                fromDate = moment().subtract(1, 'month').set('date', 1);
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

        this.setState({
            periodIndex: itemIndex,
            fromDate: timeHelper.format(fromDate),
            toDate: timeHelper.format(toDate)
        }, () => {

            setFieldValue(this._fromDateRef, this.state.fromDate);
            setFieldValue(this._toDateRef, this.state.toDate);
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