import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../AppButton';
import AppDatePicker from '../AppDatePicker';
import AppTextField from '../AppTextField';
import ImagePickerView from '../ImagePickerView';
class GeneralTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dob: '08/12/1994',
            showDobDialog: false
        }
    }

    dobRef = React.createRef();
    componentDidMount() {

    }
    onChangeProfile = uri => {
        const { onChange, profile } = this.props;
        const newProfile = {
            ...profile,
            localUri: uri
        };
        onChange(newProfile);
    }

    onChangeText = (key, value) => {
        const { profile, onChange } = this.props;
        const newProfile = {
            ...profile,
            [key]: value
        };
        onChange(newProfile);
    }

    onChangeDob = (show, date) => {
        this.setState({
            showDobDialog: show,
            dob: date
        });
    }
    render() {
        const { onSubmit, profile } = this.props;
        return <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <ScrollView style={{ flex: 1 }}>
                <ImagePickerView
                    url={profile.localUri}
                    onChange={this.onChangeProfile}
                />
                <AppTextField
                    label='First Name'
                    containerStyle={styles.textField}
                    value={profile.firstname}
                    onChangeText={text => this.onChangeText('firstname', text)}
                />
                <AppTextField
                    label='Last Name'
                    containerStyle={styles.textField}
                    value={profile.lastname}
                    onChangeText={text => this.onChangeText('lastname', text)}
                />
                <AppTextField
                    label='Email Address'
                    containerStyle={styles.textField}
                    value={profile.email}
                    onChangeText={text => this.onChangeText('email', text)}
                />
                {/* <TouchableOpacity style={styles.textField}>
                    <AppTextField
                        label='Date Of Birth'
                        editable={false}
                    />
                </TouchableOpacity> */}
                <AppDatePicker
                    showDialog={this.state.showDobDialog}
                    date={this.state.dob}
                    containerStyle={styles.textField}
                    textFieldProps={{
                        label: 'Date Of Birth',
                        fieldRef: this.dobRef
                    }}
                    readFormat='DD/MM/YYYY'
                    displayFormat='DD MMM, YYYY HH:MM A'
                    pickerProps={{
                        mode: 'datetime',
                        display: 'default'
                    }}
                    onChange={this.onChangeDob}
                />
                <AppTextField
                    label='Phone number'
                    containerStyle={styles.textField}
                />
                <AppButton
                    onPress={onSubmit}
                    containerStyle={styles.btnStyle}
                    title='Update' />
            </ScrollView>
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    textField: {
        marginHorizontal: 16,
        marginTop: 16
    },
    btnStyle: {
        marginHorizontal: 16,
        marginTop: 30
    }
})
export default GeneralTab;