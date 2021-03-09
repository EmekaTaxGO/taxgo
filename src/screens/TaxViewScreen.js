import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, ScrollView, Picker, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
import EmptyView from '../components/EmptyView';
import AppTextField from '../components/AppTextField';

class TaxViewScreen extends Component {

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
        this.presetState()
    }

    componentDidMount() {
        this.configHeader();
        this.fetchNominalTaxList();
    }

    configHeader = () => {
        const title = `${this.taxItem().ledger}-View`;
        this.props.navigation.setOptions({ title })
    }

    taxItem = () => {
        return this.props.route.params.item;
    }

    fetchNominalTaxList = () => {
        const taxId = this.taxItem().id;
        // console.log('TaxItem', this.taxItem());
        const { reportActions } = this.props;
        const startDate = timeHelper.format(this.state.fromDate, this.DATE_FORMAT)
        const endDate = timeHelper.format(this.state.toDate, this.DATE_FORMAT)
        reportActions.fetchTaxNominalList(taxId, startDate, endDate);
    }

    presetState = async () => {
        const { periodIndex, fromDate, toDate } = this.props.route.params;
        this.setState({ periodIndex, fromDate, toDate });
    }

    onFromDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.fromDate;
        this.setState({
            fromDate: currentDate,
            showFromDateDialog: false
        }, () => {
            setFieldValue(this._fromDateRef, timeHelper.format(currentDate, this.DATE_FORMAT))
            this.fetchNominalTaxList();
        })
    }

    onToDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.toDate;
        this.setState({
            toDate: currentDate,
            showToDateDialog: false
        }, () => {
            setFieldValue(this._toDateRef, timeHelper.format(currentDate, this.DATE_FORMAT))
            this.fetchNominalTaxList();
        })
    }

    renderDateRange = () => {
        const disableDate = this.state.periodIndex !== 5;
        return <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <TouchableOpacity
                style={{ flex: 1, marginEnd: 6 }}
                onPress={() => this.setState({ showFromDateDialog: true })}
                disabled={disableDate}>
                <AppTextField
                    containerStyle={{ color: colorAccent }}
                    label='From'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={disableDate ? 'gray' : colorAccent}
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
                onPress={() => this.setState({ showToDateDialog: true })}
                disabled={disableDate}>
                <AppTextField
                    label='To'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={disableDate ? 'gray' : colorAccent}
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

    onViewReportPress = item => {
        this.props.navigation.push('ViewTaxReportScreen', {
            taxItem: this.taxItem(),
            product: item,
            periodIndex: this.state.periodIndex,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate
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
)(TaxViewScreen);