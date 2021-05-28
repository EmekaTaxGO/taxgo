import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
import { colorAccent, colorPrimary } from '../theme/Color';
import { isNumber } from 'lodash';
import { getSavedData, TRIAL_BALANCE_REPORT } from '../services/UserStorage';
import { showHeaderProgress } from '../helpers/ViewHelper';
import AppPicker2 from '../components/AppPicker2';
import AppDatePicker from '../components/AppDatePicker';

class TrialBalanceScreen extends Component {

    constructor(props) {
        super(props);

        const fromDate = moment().set('date', 1)
        const toDate = moment().set('date', fromDate.daysInMonth())
        this.state = {
            periods: this.buildPeriods(),
            periodIndex: 0,
            fromDate: timeHelper.format(fromDate),
            toDate: timeHelper.format(toDate),
            showFromDateDialog: false,
            showToDateDialog: false,
            trialBalance: undefined
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

    componentDidMount() {
        this.fetchTrialBalance();
    }

    componentDidUpdate(prevProps, prevState) {
        const { report: oldReport } = prevProps;
        const { report: newReport } = this.props;
        if (!newReport.fetchingTrialBalance && oldReport.fetchingTrialBalance) {
            showHeaderProgress(this.props.navigation, false);
            if (newReport.fetchTrialBalanceError === undefined) {
                this.setState({ trialBalance: newReport.trialBalance })
            }
        }
    }

    fetchTrialBalance = () => {
        const { reportActions } = this.props;
        showHeaderProgress(this.props.navigation, true);
        reportActions.fetchTrialBalance(this.state.fromDate, this.state.toDate);
    }

    presetState = async () => {
        const trialBalance = await getSavedData(TRIAL_BALANCE_REPORT);
        this.setState({
            trialBalance: trialBalance !== null ? trialBalance : undefined
        });
    }

    onFromDateChange = (show, date) => {
        if (show === true || date === this.state.fromDate) {
            this.setState({ showFromDateDialog: true })
            return
        }
        this.setState({
            fromDate: date,
            showFromDateDialog: false
        }, () => {
            this.fetchTrialBalance();
        })
    }

    onToDateChange = (show, date) => {
        if (show === true || this.state.toDate === date) {
            this.setState({ showToDateDialog: true })
            return
        }
        this.setState({
            toDate: date,
            showToDateDialog: false
        }, () => {
            this.fetchTrialBalance();
        })
    }

    renderDateRange = () => {
        return <View style={{ flexDirection: 'row', marginTop: 24 }}>

            <AppDatePicker
                showDialog={this.state.showFromDateDialog}
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
                showDialog={this.state.showToDateDialog}
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

    renderTrialBalance = (item, index) => {
        let debit = !isNumber(item.debit) ? '0.00' : item.debit;
        if (debit < 0) {
            debit *= -1;
        }
        const credit = !isNumber(item.credit) ? '0.00' : item.credit;

        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemTxt}>{item.nominalcode}-{item.laccount}</Text>
                <TouchableOpacity
                    onPress={() => this.onPressDebit(item)}
                    style={styles.itemTouch}>
                    <Text style={styles.itemDebitTxt}>{debit}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.onPressCredit(item)}
                    style={styles.itemTouch}>
                    <Text style={styles.itemCreditTxt}>{credit}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderReturnList = () => {
        const { report } = this.props;
        const { trialBalance } = this.state;
        if (report.fetchingTrialBalance && !trialBalance) {
            return <OnScreenSpinner />
        }
        if (report.fetchTrialBalanceError && !trialBalance) {
            return <FullScreenError tryAgainClick={this.fetchTrialBalance} />
        }
        if (!trialBalance) {
            return null;
        }
        let { ledgers, debtotal, credtotal } = trialBalance;
        if (debtotal < 0) {
            debtotal *= -1;
        }
        
        return (

            <CardView
                cardElevation={4}
                cornerRadius={6}
                style={styles.card}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTxt}>Ledger</Text>
                    <Text style={[styles.headerTxt, { textAlign: 'center' }]}>Debit</Text>
                    <Text style={[styles.headerTxt, { textAlign: 'right' }]}>Credit</Text>
                </View>
                <FlatList
                    keyExtractor={(item, index) => `${index}`}
                    data={ledgers}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => this.renderTrialBalance(item, index)}
                />
                <View style={styles.footerContainer}>
                    <Text style={styles.footerTxt}>TRIAL BALANCE</Text>
                    <Text style={[styles.footerTxt, { textAlign: 'center' }]}>{debtotal}</Text>
                    <Text style={[styles.footerTxt, { textAlign: 'right' }]}>{credtotal}</Text>
                </View>
            </CardView>
        )
    }

    onPeriodChange = (itemIndex) => {
        let fromDate, toDate;
        switch (itemIndex) {
            case 0:
                fromDate = moment().set('date', 1);
                toDate = moment().set('date', fromDate.daysInMonth());
            case 1:
                //Current Quarter
                const quarter = moment().quarter()
                fromDate = moment().set('month', 3 * quarter - 3).set('date', 1);
                toDate = moment(fromDate).add('month', 3).subtract(1, 'day');
                break;
            case 2:
                //Current year
                fromDate = moment().set('month', 0).set('date', 1);
                toDate = moment(fromDate).add('year', 1).subtract(1, 'day');
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
                toDate = moment(fromDate).add(3, 'month').subtract(1, 'day');
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
                this.fetchTrialBalance();
            }
        })
    }
    render() {
        const { periods, periodIndex } = this.state;
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
                    <Text style={{ color: 'gray', fontSize: 12, marginTop: 2 }}>Note: Choose custom period to modify trial balance between dates</Text>
                    {periodIndex === 6 && this.renderDateRange()}
                </View>
                {this.renderReturnList()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: colorPrimary
    },
    headerTxt: {
        flex: 1,
        fontSize: 14,
        color: 'white',
        paddingVertical: 4,
        paddingHorizontal: 6
    },
    card: {
        marginHorizontal: 16,
        marginVertical: 12,
        flex: 1,
        backgroundColor: 'white'
    },
    itemContainer: {
        flexDirection: 'row'
    },
    itemTxt: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 6,
        fontSize: 10
    },
    itemDebitTxt: {
        flex: 1,
        fontSize: 10,
        textAlign: 'center',
        color: 'blue'
    },
    itemCreditTxt: {
        flex: 1,
        fontSize: 10,
        textAlign: 'right',
        color: 'blue'
    },
    itemTouch: {
        paddingVertical: 12,
        paddingHorizontal: 6,
        flex: 1
    },
    footerContainer: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2'
    },
    footerTxt: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 6,
        paddingVertical: 12,
        flex: 1
    }
})
export default connect(
    state => ({
        report: state.report
    }),
    dispatch => ({
        reportActions: bindActionCreators(reportActions, dispatch)
    })
)(TrialBalanceScreen);