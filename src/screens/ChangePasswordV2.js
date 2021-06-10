import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppButton from '../components/AppButton';
import AppLogo from '../components/AppLogo';
import AppText from '../components/AppText';
import AppTextField from '../components/AppTextField';
import ProgressDialog from '../components/ProgressDialog';
import { focusField, getFieldValue } from '../helpers/TextFieldHelpers';
import { getApiErrorMsg, showError } from '../helpers/Utils';
import { appFontBold } from '../helpers/ViewHelper';
import Api from '../services/api';
class ChangePasswordV2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            updating: false,
            points: this.getAllPoints()
        }
    }
    codeRef = React.createRef()
    newPassRef = React.createRef()
    confPassRef = React.createRef()
    getAllPoints = () => {
        return [
            'Minimum 8 character',
            'At least one special character . * @ ! # % & ( ) ^ ~',
            'Can’t be the same as a previous password'
        ];
    }
    validateAndSubmitPass = () => {
        const body = {
            email: this.props.route.params.email,
            code: getFieldValue(this.codeRef),
            password_new: getFieldValue(this.newPassRef),
            conf_pass: getFieldValue(this.confPassRef)
        }
        if (isEmpty(body.code) || /[0-9]{6}/.test(body.code) == false) {
            showError('Enter Valid code sent.')
        }
        else if (isEmpty(body.password_new)) {
            showError('Enter new password.');
        }
        else if (body.password_new !== body.conf_pass) {
            showError('New password & confirm password should be same.')
        }
        else {
            const samePass = body.password_old === body.password_new;
            const validLength = body.password_new.length >= 8;
            const hasNumber = /\d/.test(body.password_new);
            const hasSymbol = /[.*@!#%&()^~]/.test(body.password_new);
            if (!samePass && validLength && hasNumber && hasSymbol) {
                delete body.conf_pass;
                this.forgotPassword(body)
            } else {
                showError('Invalid password entered.');
            }
        }
    }
    showPassChangeAlert = () => {
        Alert.alert('Alert', 'Password changed successfully', [
            {
                onPress: () => { this.props.navigation.goBack() },
                style: 'default',
                text: 'OK'
            }
        ], { cancelable: false })
    }
    forgotPassword = body => {
        Keyboard.dismiss()
        this.setState({ updating: true })
        Api.post('/user/forgotPassword', body)
            .then(response => {
                this.setState({ updating: false })
                setTimeout(() => this.showPassChangeAlert(), 500)
            })
            .catch(err => {
                console.log('Error Changing Password ', err);
                const message = getApiErrorMsg(err)
                this.setState({ updating: false })

                setTimeout(() => this.showPassChangeAlert(), 500)
                // setTimeout(() => {
                //     showError(message)
                // }, 500)
            })
    }
    renderPassRequirement = () => {
        return (
            <View style={{
                flexDirection: 'column',
                backgroundColor: '#fbfbfb',
                padding: 16,
                marginHorizontal: 16,
                marginTop: 12,
                borderRadius: 4
            }}>
                <AppText style={styles.reqTitle}>Passwork Requirements</AppText>
                <AppText style={styles.reqDesc}>to create a new password, you have to meet all of the following requirements.</AppText>
                {this.state.points.map(value => <AppText style={styles.point} key={value}>{value}</AppText>)}

            </View>
        )
    }

    render() {
        return (
            <KeyboardAwareScrollView>
                <View style={{ paddingHorizontal: 16 }}>
                    <AppLogo />
                    <AppTextField
                        label='Code'
                        keyboardType='numeric'
                        maxLength={6}
                        returnKeyType='next'
                        fieldRef={this.codeRef}
                        containerStyle={styles.fieldStyle} />
                    <AppTextField
                        label='New Password'
                        secureTextEntry={true}
                        returnKeyType='next'
                        fieldRef={this.newPassRef}
                        containerStyle={styles.fieldStyle}
                        onSubmitEditing={() => focusField(this.confPassRef)} />
                    <AppTextField
                        label='Confirm Password'
                        secureTextEntry={true}
                        returnKeyType='done'
                        fieldRef={this.confPassRef}
                        containerStyle={styles.fieldStyle}
                        onSubmitEditing={this.validateAndSubmitPass} />
                    <AppButton
                        title='Submit'
                        containerStyle={styles.btnStyle}
                        onPress={this.validateAndSubmitPass} />
                    {this.renderPassRequirement()}
                    <ProgressDialog visible={this.state.updating} />
                </View>
            </KeyboardAwareScrollView>
        )
    }
}
const styles = StyleSheet.create({
    reqTitle: {
        color: '#737373',
        fontSize: 20,
        textTransform: 'uppercase'
    },
    reqDesc: {
        marginTop: 6,
        color: '#202020',
        fontFamily: appFontBold,
        fontSize: 14,
        textTransform: 'uppercase',
        paddingBottom: 12
    },
    fieldStyle: {
        marginHorizontal: 12,
        marginTop: 16
    },
    btnStyle: {
        marginHorizontal: 12
    }
})
export default ChangePasswordV2;