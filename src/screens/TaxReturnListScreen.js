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
import { colorAccent } from '../theme/Color';
import { getSavedData, TAX_RETURN_REPORT } from '../services/UserStorage';
import { appFont, appFontBold, showHeaderProgress } from '../helpers/ViewHelper';
import AppText from '../components/AppText';
import AppPicker2 from '../components/AppPicker2';
import AppDatePicker from '../components/AppDatePicker';

class TaxReturnListScreen extends Component {

    constructor(props) {
        super(props);

        const fromDate = moment().set('month', 0).set('date', 1).toDate();
        const toDate = moment(fromDate).add(3, 'month').subtract(1, 'day');

        this.state = {
            periods: this.buildPeriods(),
            periodIndex: 1,
            fromDate: timeHelper.format(fromDate),
            toDate: timeHelper.format(toDate),
            showFromDateDialog: false,
            showToDateDialog: false,
            taxReports: undefined
        }
        this.presetState();
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
        this.fetchTaxReport();
    }

    componentDidUpdate(prevProps, prevState) {

        const { report: newReport } = this.props;
        const { report: oldReport } = prevProps;
        if (!newReport.fetchingTaxReport && oldReport.fetchingTaxReport) {
            showHeaderProgress(this.props.navigation, false);
            if (newReport.fetchTaxReportError === undefined) {
                this.setState({ taxReports: newReport.taxReports });
            }
        }
    }

    fetchTaxReport = () => {
        const { reportActions } = this.props;
        reportActions.fetchVatReport(this.state.fromDate, this.state.toDate);
        showHeaderProgress(this.props.navigation, true);
    }

    presetState = async () => {
        const taxReports = await getSavedData(TAX_RETURN_REPORT);

        this.setState({
            taxReports: taxReports !== undefined ? taxReports : undefined
        })
    }

    onFromDateChange = (show, date) => {
        if (show === true || date == this.state.fromDate) {
            this.setState({ showFromDateDialog: true });
            return
        }
        this.setState({
            fromDate: date,
            showFromDateDialog: show
        }, () => {
            this.fetchTaxReport();
        })
    }

    onToDateChange = (show, date) => {
        if (show === true || date == this.state.toDate) {
            this.setState({ showToDateDialog: true });
            return
        }
        this.setState({
            toDate: date,
            showToDateDialog: show
        }, () => {
            this.fetchTaxReport();
        })
    }

    renderDateRange = () => {
        const disableDate = this.state.periodIndex !== 5;
        return <View style={{ flexDirection: 'row', marginTop: 24 }}>

            <AppDatePicker
                showDialog={this.state.showFromDateDialog}
                date={this.state.fromDate}
                disable={disableDate}
                containerStyle={{ flex: 1, marginStart: 6 }}
                textFieldProps={{
                    label: 'From',
                    fieldRef: this._fromDateRef
                }}
                onChange={this.onFromDateChange}
            />
            <AppDatePicker
                showDialog={this.state.showToDateDialog}
                date={this.state.toDate}
                disable={disableDate}
                containerStyle={{ flex: 1, marginStart: 6 }}
                textFieldProps={{
                    label: 'To',
                    fieldRef: this._toDateRef
                }}
                onChange={this.onToDateChange}
            />
        </View>
    }

    renderItemRow = item => {
        return <View style={{ flexDirection: 'row', padding: 12 }}>
            <Text style={{ flex: 1, fontSize: 14 }}>{item.taxtype}</Text>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 14 }}>{item.percentage}%</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontSize: 14 }}>{item.total}</Text>
        </View>
    }

    onPricePress = item => {
        this.props.navigation.push('TaxViewScreen', {
            item,
            periodIndex: this.state.periodIndex,
            fromDate: this.state.fromDate.valueOf(),
            toDate: this.state.toDate.valueOf()
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
                <Text style={{
                    flex: 1,
                    fontSize: 15,
                    fontFamily: appFontBold
                }}>Vat on {item.label}</Text>

            </View>
            {item.vatList.map(value => this.renderItemRow(value))}
            <View style={{
                flexDirection: 'row',
                borderTopColor: 'lightgray',
                borderTopWidth: 1
            }}>
                <AppText style={{
                    flex: 1,
                    textAlign: 'left',
                    fontSize: 16,
                    fontFamily: appFontBold,
                    padding: 12
                }}>Total</AppText>
                <TouchableOpacity
                    onPress={() => this.onPricePress(item)} style={{ padding: 12 }}
                    disabled={item.total <= 0}>
                    <AppText style={{
                        flex: 1,
                        textAlign: 'right',
                        fontSize: 18,
                        color: colorAccent
                    }}>{item.total}</AppText>
                </TouchableOpacity>
            </View>
        </CardView>
    }

    renderReturnList = () => {
        const { report } = this.props;
        const { taxReports } = this.state;
        if (report.fetchingTaxReport && !taxReports) {
            return <OnScreenSpinner />
        }
        if (report.fetchTaxReportError && !taxReports) {
            return <FullScreenError tryAgainClick={this.fetchTaxReport} />
        }
        if (!taxReports) {
            return null;
        }
        return <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginTop: 24 }}>
                <AppText style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: appFont
                }}>Tax Type</AppText>
                <AppText style={{ flex: 1, textAlign: 'center', fontSize: 16 }}>Rate (%)</AppText>
                <AppText style={{ flex: 1, textAlign: 'right', fontSize: 16 }}>Amount</AppText>
            </View>
            <FlatList
                keyExtractor={(item, index) => `${index}`}
                data={taxReports}
                renderItem={({ item, index }) => this.renderReportItem(item, index)}
            />
        </View>
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
                    <AppPicker2
                        containerStyle={{ marginTop: 16 }}
                        title={periods[periodIndex]}
                        items={periods}
                        text='Select Period'
                        onChange={idx => this.onPeriodChange(idx)}
                    />
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
        marginTop: 16,
        backgroundColor: 'white'
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