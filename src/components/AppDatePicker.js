import React, { Component } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppTextField from './AppTextField';
import DateTimePicker from '@react-native-community/datetimepicker';
import timeHelper from '../helpers/TimeHelper';
import { setFieldValue } from '../helpers/TextFieldHelpers';
import { get } from 'lodash';
import { H_DATE_FORMAT } from '../constants/appConstant';
import moment from 'moment';

class AppDatePicker extends Component {



    onDateChange = (event, selectedDate) => {
        const { onChange, date, textFieldProps } = this.props;
        if (Platform.OS === 'android' && event.type !== 'set') {
            onChange(false, date);
        } else {
            const currentDate = moment(selectedDate) || this.getDate();
            onChange(false, timeHelper.format(currentDate, this.getReadFormat()));
            setFieldValue(textFieldProps.fieldRef,
                timeHelper.format(currentDate, this.getDisplayFormat()));
        }
    }

    getReadFormat = () => {
        return get(this.props, 'readFormat', H_DATE_FORMAT);
    }

    getDisplayFormat = () => {
        return get(this.props, 'displayFormat', H_DATE_FORMAT);
    }

    onPress = () => {
        const { onChange, date } = this.props;
        onChange(true, date);
    }

    getDate = () => {
        const { date } = this.props;
        const aDate = moment(date, this.getReadFormat());
        return aDate.isValid() ? aDate : moment();
    }

    render() {
        const { textFieldProps, pickerProps, showDialog, containerStyle } = this.props;
        const disable = get(this.props, 'disable', false);
        const date = this.getDate();
        const displayText = timeHelper.format(date, this.getDisplayFormat());
        return (
            <View style={containerStyle}>
                <TouchableOpacity
                    onPress={this.onPress}
                    disabled={disable}>
                    <AppTextField
                        keyboardType='default'
                        editable={false}
                        value={displayText}
                        {...textFieldProps} />
                </TouchableOpacity>
                {showDialog ? <DateTimePicker
                    value={date.toDate()}
                    mode={'date'}
                    onChange={this.onDateChange}
                    {...pickerProps}
                /> : null}
            </View>
        )
    }
}
const styles = StyleSheet.create({

})
export default AppDatePicker;