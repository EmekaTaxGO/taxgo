import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
import EmptyView from '../components/EmptyView';
import AppTextField from '../components/AppTextField';
import AppPicker2 from '../components/AppPicker2';
import { get } from 'lodash';
import AppDatePicker from '../components/AppDatePicker';

class TaxViewScreen extends Component {

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
        this.fetchNominalTaxList();
    }

    configHeader = () => {
        const title = `${this.taxItem().label}-View`;
        this.props.navigation.setOptions({ title })
    }

    taxItem = () => {
        return this.props.route.params.item;
    }

    fetchNominalTaxList = () => {
        const taxId = get(this.taxItem(), 'vatList[0].id');
        const { reportActions } = this.props;
        const startDate = timeHelper.format(this.state.fromDate, this.DATE_FORMAT)
        const endDate = timeHelper.format(this.state.toDate, this.DATE_FORMAT)
        reportActions.fetchTaxNominalList(taxId, startDate, endDate);
    }

    onFromDateChange = date => {
        this.setState({ fromDate: date }, () => {
            this.fetchNominalTaxList();
        })
    }

    onToDateChange = date => {
        this.setState({ toDate: date }, () => {
            this.fetchNominalTaxList();
        })
    }

    renderDateRange = () => {
        const disableDate = this.state.periodIndex !== 5;
        return <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <AppDatePicker
                date={this.state.fromDate}
                disable={disableDate}
                containerStyle={{ flex: 1, marginStart: 6 }}
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
                containerStyle={{ flex: 1, marginStart: 6 }}
                textFieldProps={{
                    label: 'To',
                    fieldRef: this._toDateRef,
                    baseColor: disableDate ? 'gray' : colorAccent
                }}
                onChange={this.onToDateChange}
            />
        </View>
    }

    onViewReportPress = item => {

        this.props.navigation.push('ViewTaxReportScreen', {
            taxItem: this.taxItem(),
            product: item,
            periodIndex: this.state.periodIndex,
            fromDate: this.state.fromDate.valueOf(),
            toDate: this.state.toDate.valueOf()
        })
    }

    renderTaxItem = (item, index) => {
        const count = this.props.report.nominalTaxList;
        const isLast = count === index + 1;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.listCard, { marginBottom: isLast ? 16 : 0 }]}>
            <View style={{ flexDirection: 'column' }}>
                {this.renderItemRow('S.No', index + 1, '#efefef')}
                {this.renderItemRow('Product Name', item.product)}
                {this.renderItemRow('Total', item.amount, '#efefef')}
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 1, fontSize: 15, padding: 15 }}>Action</Text>
                    <TouchableOpacity style={{ padding: 15 }} onPress={() => this.onViewReportPress(item)}>
                        <Text style={{ fontSize: 15, color: colorAccent }}>View The Report</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CardView>
    }
    renderItemRow = (label, value, background = '#ffffff') => {
        return <View style={{ flexDirection: 'row', padding: 12, backgroundColor: background }}>
            <Text style={{ flex: 1, fontSize: 15 }}>{label}</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontSize: 15 }}>{value}</Text>
        </View>
    }

    renderReturnList = () => {
        const { report } = this.props;
        if (report.fetchingNominalTaxList) {
            return <OnScreenSpinner />
        }
        if (report.fetchNominalTaxListError) {
            return <FullScreenError tryAgainClick={this.fetchNominalTaxList} />
        }
        if (report.nominalTaxList.length === 0) {
            return <EmptyView message='No Taxes Available to show' iconName='hail' />
        }
        return <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={report.nominalTaxList}
            renderItem={({ item, index }) => this.renderTaxItem(item, index)}
        />
    }

    onPeriodChange = (itemIndex) => {
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
                this.fetchNominalTaxList();
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
                            text='Select Sales Period'
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
)(TaxViewScreen);