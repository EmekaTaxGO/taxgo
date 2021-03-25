import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import timeHelper from '../helpers/TimeHelper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import { connect } from 'react-redux';
import * as reportActions from '../redux/actions/reportActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import { colorAccent } from '../theme/Color';
import EmptyView from '../components/EmptyView';
import BalanceSheet from '../components/balanceSheet/BalanceSheet';
import { isEmpty } from 'lodash';
import { BALANCE_SHEET, getSavedData } from '../services/UserStorage';
import { showHeaderProgress } from '../helpers/ViewHelper';
import AppTextField from '../components/AppTextField';

class BalanceSheetScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            untilDate: new Date(),
            showUntilDateDialog: false,
            balanceSheet: []
        }
    }
    _untilDateRef = React.createRef();

    DATE_FORMAT = 'YYYY-MM-DD';

    componentDidMount() {
        this.fetchBalanceSheet();
    }

    UNSAFE_componentWillMount() {
        this.fetchLocalBalanceSheet();
    }
    fetchLocalBalanceSheet = async () => {
        const balanceSheet = await getSavedData(BALANCE_SHEET);
        if (balanceSheet !== null) {
            this.setState({ balanceSheet });
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { report: newReport } = newProps;
        const { report: oldReport } = this.props;

        if (!newReport.fetchingBalanceSheet && oldReport.fetchingBalanceSheet) {
            //Balance Sheet is Fetched
            showHeaderProgress(this.props.navigation, false);
            if (newReport.fetchBalanceSheetError === undefined) {
                this.setState({ balanceSheet: newReport.balanceSheet });
            }
        }
    }

    fetchBalanceSheet = () => {
        const { reportActions } = this.props;
        const date = timeHelper.format(this.state.untilDate, this.DATE_FORMAT)
        showHeaderProgress(this.props.navigation, true);
        reportActions.fetchBalanceSheet(date);
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
            this.fetchBalanceSheet();
        })
    }

    onBalanceSheetChange = newSheet => {
        this.setState({ balanceSheet: newSheet });
    }


    renderReturnList = () => {
        const { report } = this.props;
        if (report.fetchingBalanceSheet && isEmpty(this.state.balanceSheet)) {
            return <OnScreenSpinner />
        }
        if (report.fetchBalanceSheetError && isEmpty(this.state.balanceSheet)) {
            return <FullScreenError tryAgainClick={this.fetchBalanceSheet} />
        }
        // if (this.state.balanceSheet.length === 0) {
        //     return <EmptyView message='No Balance Sheet Data Available!' iconName='hail' />
        // }
        return <BalanceSheet
            sheet={this.state.balanceSheet}
            onChange={this.onBalanceSheetChange}
        />
    }
    renderDate = () => {
        const disableDate = this.props.report.fetchingBalanceSheet;
        return <View style={{ paddingHorizontal: 16, marginTop: 24, flexDirection: 'column' }}>
            <TouchableOpacity
                style={{ width: '100%', marginEnd: 6, marginBottom: 12 }}
                onPress={() => this.setState({ showUntilDateDialog: true })}
                disabled={disableDate}>
                <AppTextField
                    containerStyle={{ color: colorAccent }}
                    label='Until'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={disableDate ? 'gray' : colorAccent}
                    value={timeHelper.format(this.state.fromDate, this.DATE_FORMAT)}
                    fieldRef={this._untilDateRef}
                />
            </TouchableOpacity>
            {this.state.showUntilDateDialog ? <DateTimePicker
                value={this.state.untilDate}
                mode={'datetime'}
                display='default'
                onChange={this.onUntilDateChange}
            /> : null}
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
    },
    sheetHeader: {
        fontSize: 18,
        color: 'white',
        backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingVertical: 12
    }
})
export default connect(
    state => ({
        report: state.report
    }),
    dispatch => ({
        reportActions: bindActionCreators(reportActions, dispatch)
    })
)(BalanceSheetScreen);