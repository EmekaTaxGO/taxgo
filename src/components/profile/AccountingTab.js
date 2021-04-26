import { Picker } from '@react-native-community/picker';
import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getFieldValue } from '../../helpers/TextFieldHelpers';
import { appFont, appFontBold } from '../../helpers/ViewHelper';
import AppButton from '../AppButton';
import AppDatePicker from '../AppDatePicker';
import AppPicker from '../AppPicker';
import AppTextField from '../AppTextField';
import MultiLineTextField from '../MultiLineTextField';
class AccountingTab extends Component {

    constructor(props) {
        super(props);
        const reportTypes = this.createReports();
        this.state = {
            profile: props.profile,
            showYrEndDialog: false,
            reportTypes: reportTypes,
            reportIdx: this.getReportTypeIdx(reportTypes, props.profile.reportType)
        }
    }

    yearEndRef = React.createRef();
    scrollView = React.createRef();
    invNote = React.createRef();
    termCondition = React.createRef();

    getReportTypeIdx = (reportTypes, reportType) => {
        for (let i = 0; i < reportTypes.length; i++) {
            const element = reportTypes[i];
            if (element.id === reportType) {
                return i;
            }
        }
        return 0;
    }
    createReports = () => {
        return [
            {
                id: 1,
                title: 'Cash Receipt'
            },
            {
                id: 2,
                title: 'Invoice Receipt'
            }
        ]
    }

    componentDidMount() {

    }

    onChangeYrEnd = (show, date) => {
        const { profile } = this.state;
        const newProfile = {
            ...profile,
            endYear: date
        };
        this.setState({ showYrEndDialog: show, profile: newProfile });
    }

    onChangeMultiline = (key, value) => {
        this.setState({
            profile: {
                ...this.state.profile,
                [key]: value
            }
        });
    }

    submitForm = () => {
        const { reportTypes, reportIdx, profile } = this.state
        const newProfile = {
            ...profile,
            reportType: reportTypes[reportIdx].id
        };
        const { onSubmit } = this.props;
        onSubmit(newProfile);
    }

    scrollTo = ref => {
        setTimeout(() => {
            ref.current.measure((fx, fy, width, height, px, py) => {
                this.scrollView.scrollTo({ y: fy - 20, animated: true });
            })
        }, 300);
    }
    render() {
        const { profile, reportTypes, reportIdx } = this.state;
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                innerRef={ref => {
                    this.scrollView = ref
                }}>
                <AppDatePicker
                    showDialog={this.state.showYrEndDialog}
                    date={profile.endYear}
                    containerStyle={styles.textField}
                    textFieldProps={{
                        label: 'ACCOUTING/FINANCIAL SETTINGS',
                        fieldRef: this.yearEndRef
                    }}
                    onChange={this.onChangeYrEnd}
                />
                <AppPicker
                    style={styles.picker}
                    selectedValue={reportTypes[reportIdx].title}
                    mode='dropdown'
                    onValueChange={(itemValue, itemIndex) => this.setState({ reportIdx: itemIndex })}>
                    {reportTypes.map((value, index) => <Picker.Item
                        label={value.title} value={value.title} key={`${index}`} />)}
                </AppPicker>
                <MultiLineTextField
                    label='Default Email Content'
                    containerStyle={styles.multiLineField}
                    labelStyle={styles.multilineLabel}
                    value={profile.defaultmail}
                    onChangeText={text => this.onChangeMultiline('defaultmail', text)}
                    onFocus={event => {

                    }} />
                <MultiLineTextField
                    fieldRef={this.termCondition}
                    label='Default Invoice Terms and Condition'
                    labelStyle={styles.multilineLabel}
                    containerStyle={styles.multiLineField}
                    value={profile.defaultTerms}
                    onChangeText={text => this.onChangeMultiline('defaultTerms', text)}
                    onFocus={event => {
                        this.scrollTo(this.termCondition);
                    }} />
                <MultiLineTextField
                    fieldRef={this.invNote}
                    label='Default Invoice Note'
                    labelStyle={styles.multilineLabel}
                    containerStyle={styles.multiLineField}
                    value={profile.cusNotes}
                    onChangeText={text => this.onChangeMultiline('cusNotes', text)}
                    onFocus={event => this.scrollTo(this.invNote)} />

                <AppButton
                    onPress={this.submitForm}
                    containerStyle={styles.btnStyle}
                    title='Update' />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    textField: {
        marginHorizontal: 16,
        marginTop: 20
    },
    btnStyle: {
        marginHorizontal: 16,
        marginTop: 30
    },
    picker: {
        marginHorizontal: 16
    },
    pickerLabel: {
        paddingHorizontal: 16,
        fontSize: 16,
        color: 'gray',
        paddingVertical: 4,
        marginTop: 12
    },
    multiLineField: {
        marginHorizontal: 16,
        marginTop: 20
    },
    multilineLabel: {
        color: 'gray'
    }
})
export default AccountingTab;