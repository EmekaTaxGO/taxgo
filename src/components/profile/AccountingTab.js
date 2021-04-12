import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppDatePicker from '../AppDatePicker';
import AppTextField from '../AppTextField';
import MultiLineTextField from '../MultiLineTextField';
class AccountingTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: props.profile,
            showYrEndDialog: false
        }
    }

    yearEndRef = React.createRef();
    scrollView = React.createRef();

    componentDidMount() {
        console.log('Profile Info: ', JSON.stringify(this.state.profile, null, 2));
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

    render() {
        const { profile } = this.state;
        return <SafeAreaView style={{ flex: 1 }}>
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
                <MultiLineTextField
                    placeholder='Default Email Content'
                    style={styles.multiLineField}
                    value={profile.defaultmail}
                    onChangeText={text => this.onChangeMultiline('defaultmail', text)}
                    onFocus={event => {
                        // setTimeout(() => {
                        //     this.scrollView.scrollTo({ y: 10000, animated: true });
                        // }, 300);
                    }} />
                <MultiLineTextField
                    placeholder='Default Invoice Terms and Condition'
                    style={styles.multiLineField}
                    value={profile.defaultTerms}
                    onChangeText={text => this.onChangeMultiline('defaultTerms', text)}
                    onFocus={event => {
                        // setTimeout(() => {
                        //     this.scrollView.scrollTo({ y: 10000, animated: true });
                        // }, 300);
                    }} />
                <MultiLineTextField
                    placeholder='Default Invoice Note'
                    style={styles.multiLineField}
                    value={profile.cusNotes}
                    onChangeText={text => this.onChangeMultiline('cusNotes', text)}
                    onFocus={event => {
                        setTimeout(() => {
                            this.scrollView.scrollTo({ y: 10000, animated: true });
                        }, 300);
                    }} />
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
    }
})
export default AccountingTab;