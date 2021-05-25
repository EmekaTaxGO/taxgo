import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { appFont } from '../../helpers/ViewHelper';
import AppButton from '../AppButton';
import AppDatePicker from '../AppDatePicker';
import MultiLineTextField from '../MultiLineTextField';
import AppPicker2 from '../AppPicker2';
import { showSingleSelectAlert } from '../SingleSelectAlert';
import AppText from '../AppText';

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

    onItemChange = (key, idx) => {
        this.setState({ [key]: idx })
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
                <AppText style={styles.dropDownLabel}>Report Type</AppText>
                <AppPicker2
                    title={reportTypes[reportIdx].title}
                    text='Report Type'
                    items={reportTypes.map(item => item.title)}
                    containerStyle={styles.picker}
                    onChange={idx => this.onItemChange('reportIdx', idx)} />
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
        marginHorizontal: 16,
        marginTop: 4
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
    },
    dropDownLabel: {
        fontFamily: appFont,
        fontSize: 15,
        color: 'gray',
        marginTop: 18,
        marginStart: 16
    }
})
export default AccountingTab;