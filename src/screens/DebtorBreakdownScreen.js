import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import * as reportActions from '../redux/actions/reportActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import CardView from 'react-native-cardview';
import { colorAccent } from '../theme/Color';
import EmptyView from '../components/EmptyView';
import AppDatePicker from '../components/AppDatePicker';

class DebtorBreakdownScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            untilDate: props.route.params.untilDate
        }
    }
    _untilDateRef = React.createRef();

    componentDidMount() {
        this.fetchDebtorBreakdown();
    }

    fetchDebtorBreakdown = () => {
        const { reportActions } = this.props;
        const { debtor } = this.props.route.params;
        reportActions.fetchAgedDebtorBreakdown(debtor.id, this.state.untilDate);
    }

    onUntilDateChange = date => {
        this.setState({ untilDate: date }, () => {
            this.fetchDebtorBreakdown();
        })
    }

    renderAgeDebtorItem = (item, index) => {
        const count = this.props.report.agedDebtorBreakdown.length;
        const isLast = count === index + 1;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={[styles.listCard, { marginBottom: isLast ? 24 : 0 }]}>
            <View style={{ flexDirection: 'column' }}>
                {this.renderItemRow('Date', item.sdate)}
                {this.renderItemRow('Reference', item.type, '#efefef')}
                {this.renderItemRow('Total', item.total)}
                {this.renderItemRow('Due Date', item.ldate, '#efefef')}
                {this.renderItemRow('O/S Amt', item.outtotal)}
                {this.renderItemRow('30Days', item.outamount3, '#efefef')}
                {this.renderItemRow('60Days', item.outamount6)}
                {this.renderItemRow('90Days', item.outamount9, '#efefef')}
                {this.renderItemRow('120Days', item.outamount12)}
                {this.renderItemRow('Older', item.outamountOLD, '#efefef')}
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
        if (report.fetchingAgedDebtorBreakdown) {
            return <OnScreenSpinner />
        }
        if (report.fetchAgedDebtorBreakdownError) {
            return <FullScreenError tryAgainClick={this.fetchDebtorBreakdown} />
        }
        if (report.agedDebtorBreakdown.length === 0) {
            return <EmptyView message='No Debtors Breakdown  Found!' iconName='hail' />
        }
        return <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={report.agedDebtorBreakdown}
            renderItem={({ item, index }) => this.renderAgeDebtorItem(item, index)}
        />
    }
    renderDate = () => {
        const disableDate = this.props.report.fetchingAgedDebtorBreakdown;
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
            <Text style={{ marginTop: 6 }}>Choose the date for aged debtors report</Text>
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
)(DebtorBreakdownScreen);