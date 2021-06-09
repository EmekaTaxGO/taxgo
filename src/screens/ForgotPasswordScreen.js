import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import AppLogo from '../components/AppLogo';
import { validateEmail, EMAIL_ERROR_MESSAGE, getApiErrorMsg, showError } from '../helpers/Utils';
import { getFieldValue, focusField } from '../helpers/TextFieldHelpers';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import Api from '../services/api';
import ProgressDialog from '../components/ProgressDialog';

class ForgotPasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailError: undefined,
            updating: false
        }
    }

    emailRef = React.createRef();

    componentDidMount() {

        setTimeout(() => {
            focusField(this.emailRef);
        }, 500);

    }

    resetState = () => {
        if (this.state.emailError !== undefined) {
            this.setState({ emailError: undefined });
        }
    }

    validateAndResetPass = () => {
        if (!validateEmail(getFieldValue(this.emailRef))) {
            this.setState({ emailError: EMAIL_ERROR_MESSAGE });
        } else {
            this.resetPass();
        }
    }

    resetPass = () => {
        Keyboard.dismiss();
        this.setState({ updating: true })
        const emailId = getFieldValue(this.emailRef)
        Api.post(`/user/resetPassword/${emailId}`)
            .then(response => {
                this.setState({ updating: false }, () => {
                    this.props.navigation.reset('ChangePasswordV2')
                })
            })
            .catch(err => {
                this.setState({ updating: false })
                setTimeout(() => {
                    this.props.navigation.replace('ChangePasswordV2', {
                        email: emailId
                    })
                }, 500)
                // const message = getApiErrorMsg(err)
                // this.setState({ updating: false })
                // setTimeout(() => showError(message), 400)
            })
    }
    render() {
        return <View style={{
            flex: 1,
            paddingHorizontal: 16
        }}>
            <AppLogo />
            <AppTextField
                label='Email'
                keyboardType='email-address'
                returnKeyType='done'
                error={this.state.emailError}
                fieldRef={this.emailRef}
                lineWidth={1}
                onChange={event => this.resetState()}
                onSubmitEditing={this.validateAndResetPass} />
            <AppButton
                title='Submit'
                onPress={this.validateAndResetPass} />
            <ProgressDialog visible={this.state.updating} />
        </View>
    }
};
const styles = StyleSheet.create({
    materialBtn: {
        padding: 26,
        marginTop: 15,
        fontSize: 50
    }
});
export default ForgotPasswordScreen;