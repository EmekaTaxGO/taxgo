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

class AgeDebtorScreen extends Component {

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
        this.configHeader();
        this.fetchAgeDebtors();
    }

    configHeader = () => {
        const title = 'Aged debtors Report';
        this.props.navigation.setOptions({ title })
    }

    fetchAgeDebtors = () => {
        const { reportActions } = this.props;
        const date = timeHelper.format(this.state.untilDate, this.DATE_FORMAT)
        reportActions.fetchAgeDebtors(date);
    }

    presetState = () => {

    }

    onUntilDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.untilDate;
        this.setState({
            untilDate: currentDate,
            showUntilDateDialog: false
        }, () => {
            setFieldValue(this._untilDateRef, timeHelper.format(currentDate, this.DATE_FORMAT))
            this.fetchAgeDebtors();
        })
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
                {this.renderItemRow('30days', age.total30)}
                {this.renderItemRow('60days', age.total60, '#efefef')}
                {this.renderItemRow('90days', age.total90)}
                {this.renderItemRow('120days', age.total120, '#efefef')}
                {this.renderItemRow('Older', age.totalOLD)}
            </View>
        </CardView>
    }
    renderItemRow = (label, value, background = '#ffffff') => {
        return <View style={{ flexDirection: 'row', padding: 12, backgroundColor: background }}>
            <Text style={{ flex: 1, fontSize: 15, textTransform: 'uppercase' }}>{label}</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontSize: 15 }}>{value}</Text>
        </View>
    }

    renderReturnList = () => {
        const { report } = this.props;
        if (report.fetchingAgeDebtors) {
            return <OnScreenSpinner />
        }
        if (report.fetchAgeDebtorsError) {
            return <FullScreenError tryAgainClick={this.fetchAgeDebtors} />
        }
        if (report.ageDebtors.length === 0) {
            return <EmptyView message='No Age Debtors Found!' iconName='hail' />
        }
        return <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={report.ageDebtors}
            renderItem={({ item, index }) => this.renderAgeDebtorItem(item, index)}
        />
    }
    renderDate = () => {
        return <View style={{ paddingHorizontal: 16, marginTop: 24, flexDirection: 'column' }}>
            <TouchableOpacity
                style={{ width: '100%', marginEnd: 6 }}
                onPress={() => this.setState({ showUntilDateDialog: true })}>
                <OutlinedTextField
                    containerStyle={{ color: colorAccent }}
                    label='Until'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
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
            <Text>Choose the date for aged debtors report</Text>
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
)(AgeDebtorScreen);