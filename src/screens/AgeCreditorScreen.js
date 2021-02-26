import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, ScrollView, Picker, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { OutlinedTextField } from 'react-native-material-textfield';
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
import { showHeaderProgress } from '../helpers/ViewHelper';
import { AGE_CREDITOR_REPORT, getSavedData } from '../services/UserStorage';

class AgeCreditorScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            untilDate: new Date(),
            showUntilDateDialog: false,
            ageCreditor: undefined
        }
        this.presetState();
    }
    _untilDateRef = React.createRef();

    DATE_FORMAT = 'YYYY-MM-DD';

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
        const date = timeHelper.format(this.state.untilDate, this.DATE_FORMAT)
        showHeaderProgress(this.props.navigation, true);
        reportActions.fetchAgeCreditor(date);
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
            this.fetchAgeCreditor();
        })
    }

    onOutstandingClick = item => {
        this.props.navigation.push('CreditorBreakdownScreen', {
            untilDate: this.state.untilDate,
            creditor: item
        });
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

                {this.renderClickableItemRow('O/S Amt', -1 * age.outstanding,
                    () => this.onOutstandingClick(item))}

                {this.renderItemRow('30days', age.total30, '#efefef')}
                {this.renderItemRow('60days', age.total60)}
                {this.renderItemRow('90days', age.total90, '#efefef')}
                {this.renderItemRow('120days', age.total120)}
                {this.renderItemRow('Older', age.totalOLD, '#efefef')}
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
            <TouchableOpacity
                style={{ width: '100%', marginEnd: 6 }}
                onPress={() => this.setState({ showUntilDateDialog: true })}
                disabled={disableDate}>
                <OutlinedTextField
                    containerStyle={{ color: colorAccent }}
                    label='Until'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    baseColor={disableDate ? 'gray' : colorAccent}
                    value={timeHelper.format(this.state.fromDate, this.DATE_FORMAT)}
                    ref={this._untilDateRef}
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
)(AgeCreditorScreen);