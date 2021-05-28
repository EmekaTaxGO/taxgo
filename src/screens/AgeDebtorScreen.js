import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, ScrollView, Picker, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
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
import { AGE_DEBTOR_REPORT, getSavedData } from '../services/UserStorage';
import { showHeaderProgress } from '../helpers/ViewHelper';
import { get } from 'lodash';
import AppTextField from '../components/AppTextField';
import AppDatePicker from '../components/AppDatePicker';

class AgeDebtorScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            untilDate: timeHelper.format(moment()),
            ageDebtors: undefined
        }
        this.presetState();
    }
    _untilDateRef = React.createRef();

    componentDidMount() {
        this.fetchAgeDebtors();
    }

    componentDidUpdate(prevProps, prevState) {
        const { report: newReport } = this.props;
        const { report: oldReport } = prevProps;
        if (!newReport.fetchingAgeDebtors && oldReport.fetchingAgeDebtors) {
            showHeaderProgress(this.props.navigation, false);
            if (!newReport.fetchAgeDebtorsError) {
                this.setState({ ageDebtors: newReport.ageDebtors });
            }
        }
    }

    presetState = async () => {
        const ageDebtors = await getSavedData(AGE_DEBTOR_REPORT);
        if (ageDebtors !== null) {
            this.setState({ ageDebtors });
        }
    }

    fetchAgeDebtors = () => {
        const { reportActions } = this.props;
        reportActions.fetchAgeDebtors(this.state.untilDate);
        showHeaderProgress(this.props.navigation, true);
    }

    onUntilDateChange = date => {
        this.setState({ untilDate: date, }, () => {
            this.fetchAgeDebtors();
        })
    }

    onOutstandingClick = item => {
        this.props.navigation.push('DebtorBreakdownScreen', {
            untilDate: this.state.untilDate,
            debtor: item
        });

    }

    renderAgeDebtorItem = (item, index) => {
        const count = this.props.report.ageDebtors.length;
        const isLast = count === index + 1;
        const { age } = item;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.listCard, { marginBottom: isLast ? 24 : 0 }]}>
            <View style={{ flexDirection: 'column' }}>
                {this.renderItemRow('Customer', item.cname, '#efefef')}

                {this.renderClickableItemRow('O/S Amt', age.outstanding,
                    () => this.onOutstandingClick(item))}

                {this.renderItemRow('30days', Number(age.total30).toFixed(2), '#efefef')}
                {this.renderItemRow('60days', Number(age.total60).toFixed(2))}
                {this.renderItemRow('90days', Number(age.total90).toFixed(2), '#efefef')}
                {this.renderItemRow('120days', Number(age.total120).toFixed(2))}
                {this.renderItemRow('Older', Number(age.totalOLD).toFixed(2), '#efefef')}
            </View>
        </CardView>
    }
    renderClickableItemRow = (label, value, onClick, background = '#ffffff') => {
        const total = Number(value)
        return <View style={{ flexDirection: 'row', backgroundColor: background }}>
            <Text style={{
                flex: 1,
                fontSize: 15,
                textTransform: 'uppercase',
                padding: 12
            }}>{label}</Text>
            <TouchableOpacity onPress={onClick}
                style={{ padding: 12 }}
                disabled={total <= -1}>
                <Text style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: 15,
                    color: colorAccent
                }}>{total.toFixed(2)}</Text>
            </TouchableOpacity>
        </View>
    }
    renderItemRow = (label, value, background = '#ffffff') => {
        return <View style={{ flexDirection: 'row', padding: 12, backgroundColor: background }}>
            <Text style={{ flex: 1, fontSize: 15, textTransform: 'uppercase' }}>{label}</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontSize: 15 }}>{value}</Text>
        </View>
    }

    renderAgeDebtorList = () => {
        const { report } = this.props;
        const { ageDebtors } = this.state;
        if (report.fetchingAgeDebtors && !ageDebtors) {
            return <OnScreenSpinner />
        }
        if (report.fetchAgeDebtorsError && !ageDebtors) {
            return <FullScreenError tryAgainClick={this.fetchAgeDebtors} />
        }

        if (!ageDebtors) {
            return null;
        }
        return <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={ageDebtors}
            renderItem={({ item, index }) => this.renderAgeDebtorItem(item, index)}
        />
    }
    renderDate = () => {
        const disableDate = this.props.report.fetchingAgeDebtors;
        return <View style={{ paddingHorizontal: 16, marginTop: 24, flexDirection: 'column' }}>

            <AppDatePicker
                disable={disableDate}
                date={this.state.untilDate}
                containerStyle={{ width: '100%', marginEnd: 6 }}
                textFieldProps={{
                    label: `Until`,
                    fieldRef: this._untilDateRef,
                    baseColor: disableDate ? 'gray' : colorAccent
                }}
                onChange={this.onUntilDateChange}
            />
            <Text style={{ marginTop: 4 }}>Choose the date for aged debtors report</Text>
        </View>
    }


    render() {
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                {this.renderDate()}
                {this.renderAgeDebtorList()}
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
)(AgeDebtorScreen);