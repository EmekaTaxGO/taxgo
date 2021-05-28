import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
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
import AppDatePicker from '../components/AppDatePicker';
import moment from 'moment';

class BalanceSheetScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            untilDate: timeHelper.format(moment()),
            balanceSheet: []
        }
    }
    _untilDateRef = React.createRef();

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

    componentDidUpdate(oldProps, oldState) {
        const { report: newReport } = this.props;
        const { report: oldReport } = oldProps;

        if (!newReport.fetchingBalanceSheet && oldReport.fetchingBalanceSheet) {
            //Balance Sheet is Fetched
            showHeaderProgress(this.props.navigation, false);
            if (newReport.fetchBalanceSheetError === undefined) {
                this.setState({ balanceSheet: newReport.balanceSheet });
            }
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        // const { report: newReport } = newProps;
        // const { report: oldReport } = this.props;

        // if (!newReport.fetchingBalanceSheet && oldReport.fetchingBalanceSheet) {
        //     //Balance Sheet is Fetched
        //     showHeaderProgress(this.props.navigation, false);
        //     if (newReport.fetchBalanceSheetError === undefined) {
        //         this.setState({ balanceSheet: newReport.balanceSheet });
        //     }
        // }
    }

    fetchBalanceSheet = () => {
        const { reportActions } = this.props;
        showHeaderProgress(this.props.navigation, true);
        reportActions.fetchBalanceSheet(this.state.untilDate);
    }

    onUntilDateChange = date => {
        this.setState({ untilDate: date }, () => {
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
        
        return <BalanceSheet
            sheet={this.state.balanceSheet}
            onChange={this.onBalanceSheetChange}
        />
    }
    renderDate = () => {
        const disableDate = this.props.report.fetchingBalanceSheet;
        return <View style={{ paddingHorizontal: 16, marginTop: 24, flexDirection: 'column' }}>
            <AppDatePicker
                disable={disableDate}
                date={this.state.untilDate}
                containerStyle={{ width: '100%', marginEnd: 6, marginBottom: 6 }}
                textFieldProps={{
                    label: `Until`,
                    fieldRef: this._untilDateRef,
                    baseColor: disableDate ? 'gray' : colorAccent
                }}
                onChange={this.onUntilDateChange}
            />
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