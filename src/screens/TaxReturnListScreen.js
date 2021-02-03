import React, { Component } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, ScrollView, Picker, TouchableOpacity, Text } from 'react-native';
import { OutlinedTextField } from 'react-native-material-textfield';
import timeHelper from '../helpers/TimeHelper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';

class TaxReturnListScreen extends Component {

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
        this.configDate()
    }
    componentDidMount() {

    }

    configDate = () => {
        const fromDate = new Date();
        const toDate = moment(fromDate).add('d', 2).toDate();
        this.setState({ fromDate, toDate })
    }

    onFromDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.fromDate;
        this.setState({
            fromDate: currentDate,
            showFromDateDialog: false
        }, () => {
            setFieldValue(this._fromDateRef, timeHelper.format(currentDate, this.DATE_FORMAT))
        })
    }

    onToDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.toDate;
        this.setState({
            toDate: currentDate,
            showToDateDialog: false
        }, () => {
            setFieldValue(this._toDateRef, timeHelper.format(currentDate, this.DATE_FORMAT))
        })
    }

    renderDateRange = () => {
        return <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <TouchableOpacity
                style={{ flex: 1, marginEnd: 6 }}
                onPress={() => this.setState({ showFromDateDialog: true })}>
                <OutlinedTextField
                    label='From'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    value={timeHelper.format(this.state.fromDate, this.DATE_FORMAT)}
                    ref={this._fromDateRef}
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
                onPress={() => this.setState({ showToDateDialog: true })}>
                <OutlinedTextField
                    label='To'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    value={timeHelper.format(this.state.toDate, this.DATE_FORMAT)}
                    ref={this._toDateRef}
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
    renderReturnList = () => {
        return <FlatList
        />
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
                            onValueChange={(itemValue, itemIndex) => this.setState({ periodIndex: itemIndex })}>
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
export default TaxReturnListScreen;