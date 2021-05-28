import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import timeHelper from '../helpers/TimeHelper';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import * as reportActions from '../redux/actions/reportActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import CardView from 'react-native-cardview';
import { colorAccent } from '../theme/Color';
import { showHeaderProgress } from '../helpers/ViewHelper';
import { AGE_CREDITOR_REPORT, getSavedData } from '../services/UserStorage';
import { get } from 'lodash';
import AppDatePicker from '../components/AppDatePicker';

class AgeCreditorScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            untilDate: timeHelper.format(moment()),
            ageCreditor: undefined
        }
        this.presetState();
    }
    _untilDateRef = React.createRef();


    componentDidMount() {
        this.fetchAgeCreditor();
    }

    componentDidUpdate(prevProps, prevState) {
        const { report: newReport } = this.props;
        const { report: oldReport } = prevProps;
        if (!newReport.fetchingAgeCreditor && oldReport.fetchingAgeCreditor) {
            showHeaderProgress(this.props.navigation, false);
            if (!newReport.fetchAgeCreditorError) {
                this.setState({ ageCreditor: newReport.ageCreditor });
            }
        }
    }

    presetState = async () => {
        const ageCreditor = await getSavedData(AGE_CREDITOR_REPORT);
        if (ageCreditor !== null) {
            this.setState({ ageCreditor });
        }
    }

    fetchAgeCreditor = () => {
        const { reportActions } = this.props;
        showHeaderProgress(this.props.navigation, true);
        reportActions.fetchAgeCreditor(this.state.untilDate);
    }

    onUntilDateChange = date => {
        this.setState({ untilDate: date, }, () => {
            this.fetchAgeCreditor();
        })
    }

    onOutstandingClick = item => {
        if (get(item, 'age.outstanding', 0) !== 0) {
            this.props.navigation.push('CreditorBreakdownScreen', {
                untilDate: this.state.untilDate,
                creditor: item
            });
        }

    }

    renderAgeCreditorItem = (item, index) => {
        const count = this.props.report.ageCreditor.length;
        const isLast = count === index + 1;
        const { age } = item;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.listCard, { marginBottom: isLast ? 24 : 0 }]}>
            <View style={{ flexDirection: 'column' }}>
                {this.renderItemRow('Supplier', item.sname, '#efefef')}

                {this.renderClickableItemRow('O/S Amt', Number(-1 * age.outstanding).toFixed(2),
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
        return <View style={{ flexDirection: 'row', backgroundColor: background }}>
            <Text style={{
                flex: 1,
                fontSize: 15,
                textTransform: 'uppercase',
                padding: 12
            }}>{label}</Text>
            <TouchableOpacity onPress={onClick} style={{ padding: 12 }}>
                <Text style={{
                    flex: 1,
                    textAlign: 'right',
                    fontSize: 15,
                    color: colorAccent
                }}>{value}</Text>
            </TouchableOpacity>
        </View>
    }
    renderItemRow = (label, value, background = '#ffffff') => {
        return <View style={{ flexDirection: 'row', padding: 12, backgroundColor: background }}>
            <Text style={{ flex: 1, fontSize: 15, textTransform: 'uppercase' }}>{label}</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontSize: 15 }}>{value ? value : '-'}</Text>
        </View>
    }

    renderReturnList = () => {
        const { report } = this.props;
        const { ageCreditor } = this.state;
        if (report.fetchingAgeCreditor && !ageCreditor) {
            return <OnScreenSpinner />
        }
        if (report.fetchAgeCreditorError && !ageCreditor) {
            return <FullScreenError tryAgainClick={this.fetchAgeCreditor} />
        }
        return <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={ageCreditor}
            renderItem={({ item, index }) => this.renderAgeCreditorItem(item, index)}
        />
    }
    renderDate = () => {
        const disableDate = this.props.report.fetchingAgeCreditor;
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
            <Text style={{ marginTop: 6 }}>Choose the date for aged Creditor report</Text>
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
)(AgeCreditorScreen);