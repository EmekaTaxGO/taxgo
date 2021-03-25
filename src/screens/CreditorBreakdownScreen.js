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

class CreditorBreakdownScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            untilDate: new Date(),
            showUntilDateDialog: false,
        }
    }
    _untilDateRef = React.createRef();

    DATE_FORMAT = 'YYYY-MM-DD';

    UNSAFE_componentWillMount() {
        this.presetState()
    }

    componentDidMount() {
        this.fetchCreditorBreakdown();
    }

    fetchCreditorBreakdown = () => {
        const { reportActions } = this.props;
        const { creditor } = this.props.route.params;
        const date = timeHelper.format(this.state.untilDate, this.DATE_FORMAT)
        reportActions.fetchAgedCreditorBreakdown(creditor.id, date);
    }

    presetState = () => {
        const untilDate = this.props.route.params.untilDate;
        this.setState({ untilDate });
    }

    onUntilDateChange = (event, selectedDate) => {
        if (event.type !== 'set') {
            this.setState({ showUntilDateDialog: false });
            return;
        }
        const currentDate = selectedDate || this.state.untilDate;
        this.setState({
            untilDate: currentDate,
            showUntilDateDialog: false
        }, () => {
            setFieldValue(this._untilDateRef, timeHelper.format(currentDate, this.DATE_FORMAT))
            this.fetchCreditorBreakdown();
        })
    }

    renderAgeCreditorItem = (item, index) => {
        const count = this.props.report.agedCreditorBreakdown.length;
        const isLast = count === index + 1;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.listCard, { marginBottom: isLast ? 24 : 0 }]}>
            <View style={{ flexDirection: 'column' }}>
                {this.renderItemRow('Date', item.sdate)}
                {this.renderItemRow('Reference', item.invoiceno, '#efefef')}
                {this.renderItemRow('Total', item.total)}
                {this.renderItemRow('Due Date', item.ldate, '#efefef')}
                {this.renderItemRow('O/S Amt', item.outtotal)}
                {this.renderItemRow('30Days', item.outamount3, '#efefef')}
                {this.renderItemRow('60Days', item.outamount6)}
                {this.renderItemRow('90Days', item.outamount9, '#efefef')}
                {this.renderItemRow('120Days', item.outamount12)}
                {this.renderItemRow('Older', item.outamountold, '#efefef')}
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
        if (report.fetchingAgedCreditorBreakdown) {
            return <OnScreenSpinner />
        }
        if (report.fetchAgedcreditorBreakdownError) {
            return <FullScreenError tryAgainClick={this.fetchCreditorBreakdown} />
        }
        if (report.agedCreditorBreakdown.length === 0) {
            return <EmptyView message='No Creditor Breakdown  Found!' iconName='hail' />
        }
        return <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={report.agedCreditorBreakdown}
            renderItem={({ item, index }) => this.renderAgeCreditorItem(item, index)}
        />
    }
    renderDate = () => {
        const disableDate = this.props.report.fetchingAgedCreditorBreakdown;
        return <View style={{ paddingHorizontal: 16, marginTop: 24, flexDirection: 'column' }}>
            <TouchableOpacity
                style={{ width: '100%', marginEnd: 6 }}
                onPress={() => this.setState({ showUntilDateDialog: true })}
                disabled={disableDate}>
                <AppTextField
                    containerStyle={{ color: colorAccent }}
                    label='Until'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={disableDate ? 'gray' : colorAccent}
                    value={timeHelper.format(this.state.untilDate, this.DATE_FORMAT)}
                    fieldRef={this._untilDateRef}
                />
            </TouchableOpacity>
            {this.state.showUntilDateDialog ? <DateTimePicker
                value={this.state.untilDate}
                mode={'datetime'}
                display='default'
                onChange={this.onUntilDateChange}
            /> : null}
            <Text>Choose the date for aged Creditor report</Text>
        </View>
    }


    render() {
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                {this.renderDate()}
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
)(CreditorBreakdownScreen);