import React, { Component } from 'react';
import { View, SafeAreaView, KeyboardAvoidingView, Text, TouchableOpacity, FlatList, TouchableHighlight, Alert } from 'react-native';
import AppTab from '../components/AppTab';
import moment from 'moment';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import { colorAccent, errorColor } from '../theme/Color';
import { connect } from 'react-redux';
import * as bankActions from '../redux/actions/bankActions';
import { bindActionCreators } from 'redux';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import EmptyView from '../components/EmptyView';
import { H_DATE_FORMAT } from '../constants/appConstant';
import { getApiErrorMsg, showError, showSuccess, toNum } from '../helpers/Utils';
import { SwipeListView } from 'react-native-swipe-list-view';
import AppText from '../components/AppText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appFontBold } from '../helpers/ViewHelper';
import ProgressDialog from '../components/ProgressDialog';
import Api from '../services/api';
import Store from '../redux/Store';
import { get } from 'lodash';


class BankDetailScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 'activity',
            startDate: new Date(),
            showStartDateDialog: false,

            endDate: new Date(),
            showEndDateDialog: false,
            allChecked: false,
            activities: [],
            reconciles: [],
            updating: false
        }
    }

    DATE_FORMAT = 'YYYY-MM-DD';

    componentDidMount() {
        this.fetchBankInfo();
    }



    getDateString = (date) => {
        return moment(date).format(this.DATE_FORMAT);
    }

    startDateString = () => {
        return this.getDateString(this.state.startDate);
    }
    endDateString = () => {
        return this.getDateString(this.state.endDate);
    }
    getBankId = () => {
        return `${this.props.route.params.bank.id}`
    }

    fetchBankInfo = () => {
        this.fetchBankActivity();
        this.fetchBankReconcile();
    }
    fetchBankActivity = () => {
        const { bankActions } = this.props;
        bankActions.getBankActivity(this.getBankId(), this.startDateString(), this.endDateString());
    }

    fetchBankReconcile = () => {
        const { bankActions } = this.props;
        bankActions.getBankReconcile(this.getBankId(),
            this.startDateString(),
            this.endDateString());
    }

    UNSAFE_componentWillUpdate(newProps, newState) {
        const { bank: newBank } = newProps;
        const { bank: oldBank } = this.props;
        if (!newBank.fetchingBankActivity && oldBank.fetchingBankActivity
            && newBank.fetchBankActivityError === undefined) {
            this.setState({ activities: newBank.bankActivities });

        } else if (!newBank.fetchingBankReconcile && oldBank.fetchingBankReconcile
            && newBank.fetchBankReconcileError === undefined) {
            this.setState({ reconciles: newBank.bankReconciles });
        }
    }

    UNSAFE_componentWillMount() {
        const startDate = moment();
        startDate.set('date', 1);

        const endDate = moment();
        endDate.set('date', endDate.daysInMonth());

        this.setState({
            startDate: startDate.toDate(),
            endDate: endDate.toDate()
        });
    }

    selectTab = (tab) => {
        this.setState({ tab: tab })
    }

    renderTabs = () => {
        const { tab } = this.state;
        return <View style={{ flexDirection: 'row', width: '100%' }}>
            <AppTab
                title='Activity'
                selected={tab === 'activity'}
                onTabPress={() => this.selectTab('activity')} />
            <AppTab
                title='RECONCILE'
                selected={tab === 'reconcile'}
                onTabPress={() => this.selectTab('reconcile')} />
        </View>
    }
    onStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.startDate;
        this.setState({
            startDate: currentDate,
            showStartDateDialog: false
        }, () => {
            this.fetchBankInfo();
        });
    }
    onEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.endDate;
        this.setState({
            endDate: currentDate,
            showEndDateDialog: false
        }, () => {
            this.fetchBankInfo();
        });
    }

    renderActivityDate = () => {
        return <View style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            backgroundColor: '#f8f9fb'
        }}>
            {/* Start Date */}
            <View style={{
                flexDirection: 'column',
                flex: 1,
                paddingTop: 6,
                marginRight: 8
            }}>
                <Text>Start Date</Text>
                <TouchableOpacity onPress={() => this.setState({ showStartDateDialog: true })}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: 'lightgray',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 6,
                        marginTop: 6
                    }}>
                        <Text style={{
                            flex: 1,
                            fontSize: 14
                        }}>{moment(this.state.startDate).format(this.DATE_FORMAT)}</Text>
                        <AntDesignIcon name='calendar' color='white' size={30} />
                    </View>
                </TouchableOpacity>
                {this.state.showStartDateDialog ? <DateTimePicker
                    value={this.state.startDate}
                    mode={'datetime'}
                    display='default'
                    onChange={this.onStartDateChange}
                /> : null}
            </View>
            {/* End Date */}
            <View style={{
                flexDirection: 'column',
                flex: 1,
                paddingTop: 6,
                marginLeft: 8
            }}>
                <Text>End Date</Text>
                <TouchableOpacity onPress={() => this.setState({ showEndDateDialog: true })}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: 'lightgray',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 6,
                        marginTop: 6
                    }}>
                        <Text style={{
                            flex: 1,
                            fontSize: 14
                        }}>{moment(this.state.endDate).format(this.DATE_FORMAT)}</Text>
                        <AntDesignIcon name='calendar' color='white' size={30} />
                    </View>
                </TouchableOpacity>
                {this.state.showEndDateDialog ? <DateTimePicker
                    value={this.state.endDate}
                    mode={'datetime'}
                    display='default'
                    onChange={this.onEndDateChange}
                /> : null}
            </View>
        </View>

    }

    onAllCheckChanged = checked => {
        const newActivities = [];
        this.state.activities.forEach((value) => {
            newActivities.push({
                ...value,
                checked: checked
            });
        })
        this.setState({
            activities: newActivities,
            allChecked: checked
        });

    }
    renderActivity = () => {
        const { allChecked } = this.state;
        return <View style={{
            flexDirection: 'column',
            flex: 1
        }}>
            <View style={{
                backgroundColor: '#f8f9fb',
                paddingBottom: 12,
                flexDirection: 'column'
            }}>
                {this.renderActivityDate()}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 8
                }}>
                    {/* <CheckBox
                        style={{ color: colorAccent, position: 'relative' }}
                        value={allChecked}
                        tintColors={{ true: colorAccent, false: 'gray' }}
                        onValueChange={this.onAllCheckChanged} />
                    <Text>All</Text> */}

                </View>
                <Text style={{
                    fontSize: 16,
                    color: 'gray',
                    width: '100%',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 6
                }}>Bank Transactions</Text>

            </View>
            {this.renderActivityList()}
        </View>
    }

    onCheckChanged = (checked, index) => {
        const { activities } = this.state;
        const newActivity = {
            ...activities[index],
            checked: checked
        };

        const newActivities = [...activities];
        newActivities.splice(index, 1, newActivity);
        this.setState({ activities: newActivities });
    }

    renderActivityItem = (data) => {
        const { item } = data
        return <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: 'lightgray',
            borderBottomWidth: 1,
            paddingVertical: 12,
            backgroundColor: 'white'
        }}>
            {/* <CheckBox
                style={{ color: colorAccent, position: 'relative' }}
                value={item.checked}
                tintColors={{ true: colorAccent, false: 'gray' }}
                onValueChange={checked => this.onCheckChanged(checked, index)} /> */}
            <View style={{
                flexDirection: 'column',
                flex: 1,
                marginLeft: 8,
            }}>
                <Text style={{ fontSize: 14, color: 'black' }}>{item.customer}</Text>
                <Text style={{ fontSize: 14, color: 'gray' }}>{moment(item.date).format(H_DATE_FORMAT)}</Text>
                <Text style={{ fontSize: 14, color: 'gray' }}>{item.type}</Text>
            </View>
            <View style={{ flexDirection: 'column', paddingEnd: 16 }}>
                <Text style={{ fontSize: 14, color: 'green', textAlign: 'right' }}>Amount: {toNum(item.amount).toFixed(2)}</Text>
                <Text style={{ fontSize: 14, color: errorColor, marginTop: 6, textAlign: 'right' }}>Net: {toNum(item.net).toFixed(2)}</Text>
            </View>
        </View>
    }

    renderActivityList = () => {
        const { bank } = this.props;
        if (bank.fetchingBankActivity) {
            return <OnScreenSpinner />
        }
        if (bank.fetchBankActivityError) {
            return <FullScreenError tryAgainClick={this.fetchBankActivity} />
        }
        const { activities } = this.state;
        if (activities.length === 0) {
            return <EmptyView message='No Transaction found' iconName='hail' />
        }

        return <SwipeListView
            data={activities}
            keyExtractor={(item, index) => `${index}`}
            renderItem={this.renderActivityItem}
            renderHiddenItem={this.renderHiddenItem}
            leftOpenValue={70}
        />
    }

    proceedToDeleteTransaction = (txn) => {
        this.setState({ updating: true })
        const body = {
            userid: Store.getState().auth.authData.id,
            logintype: 'user',
            id: txn.id
        }
        Api.post('/bank/custPayDel', body)
            .then(response => {
                this.setState({ updating: false })
                setTimeout(() => {
                    showSuccess(get(response, 'data.message', 'Payment Deleted Successfully'))
                    this.fetchBankActivity()
                }, 500)
            })
            .catch(err => {
                console.log('Error Deleting Customer Pay: ', err);
                this.setState({ updating: false })
                setTimeout(() => {
                    showError(getApiErrorMsg(err))
                }, 500)
            })
    }

    onDeletePress = (item) => {
        Alert.alert('Are you sure', 'Do you really want to delete this Transaction?', [
            {
                style: 'cancel',
                text: 'NO',
                onPress: () => { }
            },
            {
                style: 'default',
                text: 'YES',
                onPress: () => { this.proceedToDeleteTransaction(item) }
            }
        ])
    }
    renderHiddenItem = (data) => {
        const { item } = data
        return (
            <TouchableHighlight onPress={() => this.onDeletePress(item)} underlayColor={errorColor}>
                <View style={{
                    flexDirection: 'column',
                    backgroundColor: errorColor,
                    width: 70,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <Icon name='delete' color='white' size={30} />
                    <AppText style={{ color: 'white', fontFamily: appFontBold }}>Delete</AppText>
                </View>
            </TouchableHighlight>
        )
    }

    renderReconcileItem = ({ item, index }) => {
        return <View style={{
            flexDirection: 'column',
            marginLeft: 16,
            paddingEnd: 16,
            borderBottomWidth: 1,
            borderBottomColor: 'lightgray',
            paddingVertical: 12
        }}>
            <Text style={{ fontSize: 14, color: 'black' }}>2021-09-07</Text>
            <Text style={{ fontSize: 14, color: 'gray', marginTop: 4 }}>Samraj Raj 25875</Text>
        </View>
    }
    renderReconcile = () => {
        const { bank } = this.props;
        if (bank.fetchingBankReconcile) {
            return <OnScreenSpinner />
        }
        if (bank.fetchBankReconcileError) {
            return <FullScreenError tryAgainClick={this.fetchBankReconcile} />
        }
        const { reconciles } = this.state;
        if (reconciles.length === 0) {
            return <EmptyView message='No Records found' iconName='hail' />
        }
        return <FlatList
            keyExtractor={(item, index) => `${index}`}
            data={['Vikas', 'Ashish', 'Pashvan']}
            renderItem={this.renderReconcileItem}
        />
    }

    render() {
        const { tab } = this.state;
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                {this.renderTabs()}
                {tab === 'activity' ? this.renderActivity() : null}
                {tab === 'reconcile' ? this.renderReconcile() : null}
            </KeyboardAvoidingView>
            <ProgressDialog visible={this.state.updating} />
        </SafeAreaView>
    }
}

export default connect(
    state => ({
        bank: state.bank
    }),
    dispatch => ({
        bankActions: bindActionCreators(bankActions, dispatch)
    })
)(BankDetailScreen);