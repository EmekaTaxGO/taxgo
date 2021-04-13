import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { appFont, appFontBold } from '../../helpers/ViewHelper';
import AppButton from '../AppButton';
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

    validateForm=()=>{
        
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
                    label='Default Email Content'
                    containerStyle={styles.multiLineField}
                    labelStyle={styles.multilineLabel}
                    value={profile.defaultmail}
                    onChangeText={text => this.onChangeMultiline('defaultmail', text)}
                    onFocus={event => {
                        // setTimeout(() => {
                        //     this.scrollView.scrollTo({ y: 10000, animated: true });
                        // }, 300);
                    }} />
                <MultiLineTextField
                    label='Default Invoice Terms and Condition'
                    labelStyle={styles.multilineLabel}
                    containerStyle={styles.multiLineField}
                    value={profile.defaultTerms}
                    onChangeText={text => this.onChangeMultiline('defaultTerms', text)}
                    onFocus={event => {
                        // setTimeout(() => {
                        //     this.scrollView.scrollTo({ y: 10000, animated: true });
                        // }, 300);
                    }} />
                <MultiLineTextField
                    label='Default Invoice Note'
                    labelStyle={styles.multilineLabel}
                    containerStyle={styles.multiLineField}
                    value={profile.cusNotes}
                    onChangeText={text => this.onChangeMultiline('cusNotes', text)}
                    onFocus={event => {
                        setTimeout(() => {
                            this.scrollView.scrollTo({ y: 10000, animated: true });
                        }, 300);
                    }} />

                <AppButton
                    onPress={this.validateForm}
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